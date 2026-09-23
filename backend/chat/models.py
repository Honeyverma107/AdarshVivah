from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()


class BlockedUser(models.Model):
    blocker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blocked_users')
    blocked = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blocked_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('blocker', 'blocked')

    def __str__(self):
        return f"{self.blocker} blocked {self.blocked}"


class Connection(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('BLOCKED', 'Blocked'),
    ]

    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='connections_as_user1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='connections_as_user2')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user1', 'user2')

    def __str__(self):
        return f"Connection between {self.user1} and {self.user2} ({self.status})"

    @classmethod
    def can_interact(cls, user_a, user_b):
        if not user_a or not user_b or user_a.id == user_b.id:
            return False

        # Check explicit blocked table
        if BlockedUser.objects.filter(
            Q(blocker=user_a, blocked=user_b) | Q(blocker=user_b, blocked=user_a)
        ).exists():
            return False

        # Check Connection status
        conn = cls.objects.filter(
            Q(user1=user_a, user2=user_b) | Q(user1=user_b, user2=user_a)
        ).first()

        if conn:
            return conn.status == 'ACCEPTED'
        
        return False


class Interest(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('CANCELLED', 'Cancelled'),
    ]

    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_interests')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_interests')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Interest from {self.sender} -> {self.receiver} ({self.status})"


class Conversation(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Conversation {self.id}"

    @classmethod
    def get_or_create_conversation(cls, user_a, user_b):
        # Look for conversation where both user_a and user_b are participants
        conversations_a = ConversationParticipant.objects.filter(user=user_a).values_list('conversation_id', flat=True)
        shared = ConversationParticipant.objects.filter(conversation_id__in=conversations_a, user=user_b).first()

        if shared:
            return shared.conversation, False

        # Create new conversation
        conversation = cls.objects.create()
        ConversationParticipant.objects.create(conversation=conversation, user=user_a)
        ConversationParticipant.objects.create(conversation=conversation, user=user_b)

        # Auto create Connection if not exists
        conn, _ = Connection.objects.get_or_create(
            user1=user_a if user_a.id < user_b.id else user_b,
            user2=user_b if user_a.id < user_b.id else user_a,
            defaults={'status': 'ACCEPTED'}
        )
        if conn.status != 'ACCEPTED':
            conn.status = 'ACCEPTED'
            conn.save()

        return conversation, True


class ConversationParticipant(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_conversations')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('conversation', 'user')

    def __str__(self):
        return f"{self.user} in Conversation {self.conversation.id}"


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages', db_index=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Message {self.id} from {self.sender} in Conversation {self.conversation.id}"


class Call(models.Model):
    STATUS_CHOICES = [
        ('INITIATED', 'Initiated'),
        ('RINGING', 'Ringing'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('MISSED', 'Missed'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
        ('CANCELLED', 'Cancelled'),
    ]

    caller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='outgoing_calls')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='incoming_calls')
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='calls')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='INITIATED')
    started_at = models.DateTimeField(auto_now_add=True)
    answered_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    duration_seconds = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Call {self.id} ({self.caller} -> {self.receiver}): {self.status}"

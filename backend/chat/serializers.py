from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Conversation, Message, Call, Connection, Interest, ConversationParticipant

User = get_user_model()


class UserBasicSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'name', 'email')

    def get_name(self, obj):
        if obj.first_name and obj.first_name.strip():
            return obj.first_name.strip()
        return obj.email.split('@')[0].capitalize()


class InterestSerializer(serializers.ModelSerializer):
    sender = UserBasicSerializer(read_only=True)
    receiver = UserBasicSerializer(read_only=True)

    class Meta:
        model = Interest
        fields = ('id', 'sender', 'receiver', 'status', 'created_at', 'updated_at', 'responded_at')
        read_only_fields = ('id', 'sender', 'receiver', 'created_at', 'updated_at', 'responded_at')


class MessageSerializer(serializers.ModelSerializer):
    sender = UserBasicSerializer(read_only=True)
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)

    class Meta:
        model = Message
        fields = ('id', 'conversation_id', 'sender', 'sender_id', 'message', 'is_read', 'read_at', 'created_at')
        read_only_fields = ('id', 'conversation_id', 'sender', 'sender_id', 'is_read', 'read_at', 'created_at')


class ConversationSerializer(serializers.ModelSerializer):
    other_participant = serializers.SerializerMethodField()
    latest_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    can_call = serializers.SerializerMethodField()
    can_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = (
            'id', 
            'other_participant', 
            'latest_message', 
            'unread_count', 
            'can_call', 
            'can_message', 
            'created_at', 
            'updated_at'
        )

    def get_other_participant(self, obj):
        request_user = self.context.get('request_user')
        if not request_user:
            return None
        parts = [p for p in obj.participants.all() if p.user_id != request_user.id]
        if parts:
            return UserBasicSerializer(parts[0].user).data
        return None

    def get_latest_message(self, obj):
        messages = list(obj.messages.all())
        if messages:
            messages.sort(key=lambda m: m.created_at, reverse=True)
            return MessageSerializer(messages[0]).data
        return None

    def get_unread_count(self, obj):
        request_user = self.context.get('request_user')
        if not request_user:
            return 0
        return sum(1 for m in obj.messages.all() if not m.is_read and m.sender_id != request_user.id)

    def _can_interact_helper(self, obj):
        request_user = self.context.get('request_user')
        other = self.get_other_participant(obj)
        if not request_user or not other:
            return False
        other_user_id = other['id']

        blocked_user_ids = self.context.get('blocked_user_ids')
        if blocked_user_ids is not None and other_user_id in blocked_user_ids:
            return False

        accepted_user_ids = self.context.get('accepted_user_ids')
        if accepted_user_ids is not None:
            return other_user_id in accepted_user_ids

        other_user = User.objects.filter(id=other_user_id).first()
        return Connection.can_interact(request_user, other_user)

    def get_can_call(self, obj):
        return self._can_interact_helper(obj)

    def get_can_message(self, obj):
        return self._can_interact_helper(obj)


class CallSerializer(serializers.ModelSerializer):
    caller = UserBasicSerializer(read_only=True)
    receiver = UserBasicSerializer(read_only=True)
    other_user = serializers.SerializerMethodField()
    direction = serializers.SerializerMethodField()

    class Meta:
        model = Call
        fields = (
            'id', 
            'conversation_id', 
            'caller', 
            'receiver', 
            'other_user', 
            'direction', 
            'status', 
            'duration_seconds', 
            'started_at', 
            'answered_at', 
            'ended_at', 
            'created_at'
        )

    def get_other_user(self, obj):
        request_user = self.context.get('request_user')
        if not request_user:
            return None
        if obj.caller_id == request_user.id:
            return UserBasicSerializer(obj.receiver).data
        return UserBasicSerializer(obj.caller).data

    def get_direction(self, obj):
        request_user = self.context.get('request_user')
        if not request_user:
            return 'OUTGOING'
        return 'OUTGOING' if obj.caller_id == request_user.id else 'INCOMING'

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
        participant = obj.participants.exclude(user=request_user).first()
        if participant:
            return UserBasicSerializer(participant.user).data
        return None

    def get_latest_message(self, obj):
        latest = obj.messages.order_by('-created_at').first()
        if latest:
            return MessageSerializer(latest).data
        return None

    def get_unread_count(self, obj):
        request_user = self.context.get('request_user')
        if not request_user:
            return 0
        return obj.messages.filter(is_read=False).exclude(sender=request_user).count()

    def get_can_call(self, obj):
        request_user = self.context.get('request_user')
        other = self.get_other_participant(obj)
        if not request_user or not other:
            return False
        other_user = User.objects.filter(id=other['id']).first()
        return Connection.can_interact(request_user, other_user)

    def get_can_message(self, obj):
        request_user = self.context.get('request_user')
        other = self.get_other_participant(obj)
        if not request_user or not other:
            return False
        other_user = User.objects.filter(id=other['id']).first()
        return Connection.can_interact(request_user, other_user)


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

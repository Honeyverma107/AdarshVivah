from django.utils import timezone
from django.db.models import Q
from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .models import Conversation, ConversationParticipant, Message, Call, Connection, Interest, BlockedUser
from .serializers import (
    ConversationSerializer, 
    MessageSerializer, 
    CallSerializer, 
    UserBasicSerializer,
    InterestSerializer
)

User = get_user_model()


# ============================================================================
# INTEREST / INVITATION SYSTEM VIEWS
# ============================================================================

class CreateInterestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        raw_id = request.data.get('receiver_id') or request.data.get('target_user_id') or request.data.get('user_id') or request.data.get('profile_id')
        if not raw_id or str(raw_id).strip().lower() in ['undefined', 'null', '']:
            return Response({"detail": "A valid target user_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            target_id = int(raw_id)
        except (ValueError, TypeError):
            return Response({"detail": "A valid integer user_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        # First check if target_id corresponds directly to a Django User
        receiver = User.objects.filter(id=target_id).first()
        if not receiver:
            # Fallback: check if target_id is a Profile ID
            from profiles.models import Profile
            profile = Profile.objects.filter(id=target_id).first()
            if profile:
                receiver = profile.user

        if not receiver:
            return Response({"detail": "Target user profile not found."}, status=status.HTTP_404_NOT_FOUND)

        if receiver.id == request.user.id:
            return Response({"detail": "You cannot send an interest request to yourself."}, status=status.HTTP_400_BAD_REQUEST)

        # Check block restrictions
        if BlockedUser.objects.filter(
            Q(blocker=request.user, blocked=receiver) | Q(blocker=receiver, blocked=request.user)
        ).exists():
            return Response({"detail": "Action prohibited due to privacy settings or blocked status."}, status=status.HTTP_403_FORBIDDEN)

        # Check if already connected
        if Connection.can_interact(request.user, receiver):
            return Response({"detail": "You are already connected with this profile."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if pending request sent by current user
        existing_sent = Interest.objects.filter(sender=request.user, receiver=receiver, status='PENDING').first()
        if existing_sent:
            return Response({"detail": "An interest request is already pending."}, status=status.HTTP_409_CONFLICT)

        # Check if receiver had already sent a pending request to current user -> auto accept!
        existing_received = Interest.objects.filter(sender=receiver, receiver=request.user, status='PENDING').first()
        if existing_received:
            existing_received.status = 'ACCEPTED'
            existing_received.responded_at = timezone.now()
            existing_received.save()

            # Create connection & conversation
            conn, _ = Connection.objects.get_or_create(
                user1=request.user if request.user.id < receiver.id else receiver,
                user2=receiver if request.user.id < receiver.id else request.user
            )
            conn.status = 'ACCEPTED'
            conn.save()

            Conversation.get_or_create_conversation(request.user, receiver)

            serializer = InterestSerializer(existing_received)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Create new PENDING interest
        interest = Interest.objects.create(sender=request.user, receiver=receiver, status='PENDING')

        # Create/Update Connection status to PENDING
        conn, _ = Connection.objects.get_or_create(
            user1=request.user if request.user.id < receiver.id else receiver,
            user2=receiver if request.user.id < receiver.id else request.user
        )
        conn.status = 'PENDING'
        conn.save()

        serializer = InterestSerializer(interest)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SentInterestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        interests = Interest.objects.filter(sender=request.user).order_by('-created_at')
        serializer = InterestSerializer(interests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReceivedInterestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        interests = Interest.objects.filter(receiver=request.user).order_by('-created_at')
        serializer = InterestSerializer(interests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class InterestStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        target_id = request.query_params.get('user_id') or request.query_params.get('target_id') or request.query_params.get('profile_id')
        if not target_id or str(target_id).strip().lower() in ['undefined', 'null', '']:
            return Response({"detail": "A valid user_id parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            target_id = int(target_id)
        except (ValueError, TypeError):
            return Response({"detail": "A valid user_id parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        target_user = User.objects.filter(id=target_id).first()
        if not target_user:
            from profiles.models import Profile
            profile = Profile.objects.filter(id=target_id).first()
            if profile:
                target_user = profile.user

        if not target_user:
            return Response({"detail": "Target user profile not found."}, status=status.HTTP_404_NOT_FOUND)

        can_message = Connection.can_interact(request.user, target_user)
        can_call = Connection.can_interact(request.user, target_user)

        # Find interest
        interest = Interest.objects.filter(
            Q(sender=request.user, receiver=target_user) | Q(sender=target_user, receiver=request.user)
        ).order_by('-created_at').first()

        status_str = 'NONE'
        interest_id = None

        if interest:
            interest_id = interest.id
            if interest.status == 'ACCEPTED':
                status_str = 'ACCEPTED'
            elif interest.status == 'PENDING':
                if interest.sender_id == request.user.id:
                    status_str = 'PENDING_SENT'
                else:
                    status_str = 'PENDING_RECEIVED'
            elif interest.status == 'REJECTED':
                status_str = 'REJECTED'
            elif interest.status == 'CANCELLED':
                status_str = 'CANCELLED'

        # Check conversation ID if connected
        conversation_id = None
        if can_message:
            conv, _ = Conversation.get_or_create_conversation(request.user, target_user)
            conversation_id = conv.id

        return Response({
            "status": status_str,
            "interest_id": interest_id,
            "can_message": can_message,
            "can_call": can_call,
            "conversation_id": conversation_id
        }, status=status.HTTP_200_OK)


class AcceptInterestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, interest_id):
        interest = Interest.objects.filter(id=interest_id).first()
        if not interest:
            return Response({"detail": "Interest request not found."}, status=status.HTTP_404_NOT_FOUND)

        if interest.receiver_id != request.user.id:
            return Response({"detail": "Only the receiver can accept an interest request."}, status=status.HTTP_403_FORBIDDEN)

        interest.status = 'ACCEPTED'
        interest.responded_at = timezone.now()
        interest.save()

        # Update Connection status to ACCEPTED
        sender = interest.sender
        receiver = interest.receiver
        conn, _ = Connection.objects.get_or_create(
            user1=sender if sender.id < receiver.id else receiver,
            user2=receiver if sender.id < receiver.id else sender
        )
        conn.status = 'ACCEPTED'
        conn.save()

        # Create Conversation automatically
        conv, _ = Conversation.get_or_create_conversation(sender, receiver)

        serializer = InterestSerializer(interest)
        data = serializer.data
        data['conversation_id'] = conv.id
        return Response(data, status=status.HTTP_200_OK)


class RejectInterestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, interest_id):
        interest = Interest.objects.filter(id=interest_id).first()
        if not interest:
            return Response({"detail": "Interest request not found."}, status=status.HTTP_404_NOT_FOUND)

        if interest.receiver_id != request.user.id:
            return Response({"detail": "Only the receiver can decline an interest request."}, status=status.HTTP_403_FORBIDDEN)

        interest.status = 'REJECTED'
        interest.responded_at = timezone.now()
        interest.save()

        # Update Connection status
        sender = interest.sender
        receiver = interest.receiver
        conn, _ = Connection.objects.get_or_create(
            user1=sender if sender.id < receiver.id else receiver,
            user2=receiver if sender.id < receiver.id else sender
        )
        conn.status = 'REJECTED'
        conn.save()

        serializer = InterestSerializer(interest)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CancelInterestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, interest_id):
        interest = Interest.objects.filter(id=interest_id).first()
        if not interest:
            return Response({"detail": "Interest request not found."}, status=status.HTTP_404_NOT_FOUND)

        if interest.sender_id != request.user.id:
            return Response({"detail": "Only the sender can cancel a sent interest request."}, status=status.HTTP_403_FORBIDDEN)

        interest.status = 'CANCELLED'
        interest.save()

        serializer = InterestSerializer(interest)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ============================================================================
# CHAT & VOICE CALL VIEWS
# ============================================================================

class ConversationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        conversations = Conversation.objects.filter(
            participants__user=request.user
        ).distinct().order_by('-updated_at')

        serializer = ConversationSerializer(
            conversations, 
            many=True, 
            context={'request_user': request.user}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        target_user_id = request.data.get('user_id')
        if not target_user_id:
            return Response(
                {"detail": "Target user_id is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            target_user_id = int(target_user_id)
        except (ValueError, TypeError):
            return Response(
                {"detail": "A valid integer user_id is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if str(target_user_id) == str(request.user.id):
            return Response(
                {"detail": "You cannot start a conversation with yourself."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        target_user = User.objects.filter(id=target_user_id).first()
        if not target_user:
            return Response(
                {"detail": "Target user not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )

        if not Connection.can_interact(request.user, target_user):
            return Response(
                {"detail": "Communication with this profile is not allowed until interest is accepted."}, 
                status=status.HTTP_403_FORBIDDEN
            )

        conversation, created = Conversation.get_or_create_conversation(request.user, target_user)
        serializer = ConversationSerializer(conversation, context={'request_user': request.user})

        return Response(
            serializer.data, 
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )


class MessageListView(APIView):
    permission_classes = [IsAuthenticated]

    def _get_conversation(self, conversation_id, user):
        return Conversation.objects.filter(
            id=conversation_id, 
            participants__user=user
        ).first()

    def get(self, request, conversation_id):
        conversation = self._get_conversation(conversation_id, request.user)
        if not conversation:
            return Response(
                {"detail": "Conversation not found or access denied."}, 
                status=status.HTTP_403_FORBIDDEN
            )

        messages = conversation.messages.all().order_by('created_at')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, conversation_id):
        conversation = self._get_conversation(conversation_id, request.user)
        if not conversation:
            return Response(
                {"detail": "Conversation not found or access denied."}, 
                status=status.HTTP_403_FORBIDDEN
            )

        text = request.data.get('message', '').strip()
        if not text:
            return Response(
                {"detail": "Message content cannot be empty."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(text) > 3000:
            return Response(
                {"detail": "Message exceeds maximum allowed length of 3000 characters."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check permissions with other participant
        other = conversation.participants.exclude(user=request.user).first()
        if other and not Connection.can_interact(request.user, other.user):
            return Response(
                {"detail": "Communication with this user is blocked or restricted."}, 
                status=status.HTTP_403_FORBIDDEN
            )

        msg = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            message=text
        )

        conversation.updated_at = timezone.now()
        conversation.save(update_fields=['updated_at'])

        msg_data = MessageSerializer(msg).data

        # Broadcast via Channels WebSocket layer
        channel_layer = get_channel_layer()
        if channel_layer:
            async_to_sync(channel_layer.group_send)(
                f"chat_{conversation.id}",
                {
                    "type": "chat_message",
                    "message": msg_data
                }
            )

        return Response(msg_data, status=status.HTTP_201_CREATED)


class MarkReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, conversation_id):
        conversation = Conversation.objects.filter(
            id=conversation_id, 
            participants__user=request.user
        ).first()

        if not conversation:
            return Response(
                {"detail": "Conversation not found or access denied."}, 
                status=status.HTTP_403_FORBIDDEN
            )

        now = timezone.now()
        updated_count = conversation.messages.filter(
            is_read=False
        ).exclude(sender=request.user).update(
            is_read=True, 
            read_at=now
        )

        if updated_count > 0:
            channel_layer = get_channel_layer()
            if channel_layer:
                async_to_sync(channel_layer.group_send)(
                    f"chat_{conversation.id}",
                    {
                        "type": "read_receipt",
                        "reader_id": request.user.id,
                        "conversation_id": conversation.id,
                        "read_at": str(now)
                    }
                )

        return Response(
            {"message": "Messages marked as read.", "updated_count": updated_count}, 
            status=status.HTTP_200_OK
        )


class CallListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        calls = Call.objects.filter(
            Q(caller=request.user) | Q(receiver=request.user)
        ).select_related('caller', 'receiver', 'conversation').order_by('-created_at')[:50]

        serializer = CallSerializer(calls, many=True, context={'request_user': request.user})
        return Response(serializer.data, status=status.HTTP_200_OK)


class StartCallView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        conversation_id = request.data.get('conversation_id')
        receiver_id = request.data.get('receiver_id')

        if not conversation_id or not receiver_id:
            return Response(
                {"detail": "conversation_id and receiver_id are required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        conversation = Conversation.objects.filter(
            id=conversation_id, 
            participants__user=request.user
        ).first()

        if not conversation:
            return Response(
                {"detail": "Conversation not found or access denied."}, 
                status=status.HTTP_403_FORBIDDEN
            )

        receiver = User.objects.filter(id=receiver_id).first()
        if not receiver:
            return Response(
                {"detail": "Receiver not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )

        if not Connection.can_interact(request.user, receiver):
            return Response(
                {"detail": "Calling this user is restricted."}, 
                status=status.HTTP_403_FORBIDDEN
            )

        call = Call.objects.create(
            caller=request.user,
            receiver=receiver,
            conversation=conversation,
            status='INITIATED'
        )

        serializer = CallSerializer(call, context={'request_user': request.user})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UpdateCallStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, call_id):
        call = Call.objects.filter(
            id=call_id
        ).filter(Q(caller=request.user) | Q(receiver=request.user)).first()

        if not call:
            return Response(
                {"detail": "Call record not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )

        new_status = request.data.get('status')
        duration = request.data.get('duration_seconds', 0)

        valid_statuses = ['RINGING', 'ACCEPTED', 'REJECTED', 'MISSED', 'COMPLETED', 'FAILED', 'CANCELLED']
        if new_status not in valid_statuses:
            return Response(
                {"detail": f"Invalid status. Must be one of {valid_statuses}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        call.status = new_status
        now = timezone.now()

        if new_status == 'ACCEPTED' and not call.answered_at:
            call.answered_at = now
        elif new_status in ['COMPLETED', 'REJECTED', 'CANCELLED', 'MISSED', 'FAILED']:
            call.ended_at = now
            if duration:
                call.duration_seconds = int(duration)
            elif call.answered_at:
                call.duration_seconds = int((now - call.answered_at).total_seconds())

        call.save()

        serializer = CallSerializer(call, context={'request_user': request.user})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ContactsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Return registered active users other than request.user
        users = User.objects.exclude(id=request.user.id).filter(is_active=True).order_by('first_name', 'email')
        serializer = UserBasicSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

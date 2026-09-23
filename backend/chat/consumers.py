import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Conversation, ConversationParticipant

User = get_user_model()


@database_sync_to_async
def is_participant(user, conversation_id):
    if not user or not user.is_authenticated:
        return False
    return ConversationParticipant.objects.filter(
        conversation_id=conversation_id, 
        user=user
    ).exists()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.user = self.scope.get('user')

        if not self.user or not self.user.is_authenticated:
            await self.close(code=4001)
            return

        valid = await is_participant(self.user, self.conversation_id)
        if not valid:
            await self.close(code=4003)
            return

        self.room_group_name = f"chat_{self.conversation_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            return

        event_type = data.get('type')

        if event_type == 'typing_start':
            user_name = self.user.first_name if self.user.first_name else self.user.email.split('@')[0].capitalize()
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'typing_event',
                    'action': 'typing_start',
                    'user_id': self.user.id,
                    'user_name': user_name
                }
            )

        elif event_type == 'typing_stop':
            user_name = self.user.first_name if self.user.first_name else self.user.email.split('@')[0].capitalize()
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'typing_event',
                    'action': 'typing_stop',
                    'user_id': self.user.id,
                    'user_name': user_name
                }
            )

        elif event_type == 'read_receipt':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'read_receipt',
                    'reader_id': self.user.id,
                    'conversation_id': self.conversation_id
                }
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message']
        }))

    async def typing_event(self, event):
        await self.send(text_data=json.dumps({
            'type': 'typing_event',
            'action': event['action'],
            'user_id': event['user_id'],
            'user_name': event['user_name']
        }))

    async def read_receipt(self, event):
        await self.send(text_data=json.dumps({
            'type': 'read_receipt',
            'reader_id': event['reader_id'],
            'conversation_id': event['conversation_id']
        }))


class CallSignalingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.user = self.scope.get('user')

        if not self.user or not self.user.is_authenticated:
            await self.close(code=4001)
            return

        valid = await is_participant(self.user, self.conversation_id)
        if not valid:
            await self.close(code=4003)
            return

        self.room_group_name = f"call_{self.conversation_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            return

        # Broadcast signaling payload (sdp offer/answer, ice_candidate, call_initiated, call_accepted, call_rejected, call_ended)
        data['sender_id'] = self.user.id
        user_name = self.user.first_name if self.user.first_name else self.user.email.split('@')[0].capitalize()
        data['sender_name'] = user_name

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'signal_event',
                'payload': data
            }
        )

    async def signal_event(self, event):
        payload = event['payload']
        # Send signaling data down to consumer WebSocket if it didn't originate from self or if it's targeted
        await self.send(text_data=json.dumps(payload))

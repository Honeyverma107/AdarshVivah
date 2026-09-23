from django.contrib import admin
from .models import Connection, BlockedUser, Interest, Conversation, ConversationParticipant, Message, Call


@admin.register(Connection)
class ConnectionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user1', 'user2', 'status', 'created_at')
    search_fields = ('user1__email', 'user2__email')


@admin.register(BlockedUser)
class BlockedUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'blocker', 'blocked', 'created_at')
    search_fields = ('blocker__email', 'blocked__email')


@admin.register(Interest)
class InterestAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'receiver', 'status', 'created_at', 'responded_at')
    search_fields = ('sender__email', 'receiver__email')
    list_filter = ('status',)


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'created_at', 'updated_at')


@admin.register(ConversationParticipant)
class ConversationParticipantAdmin(admin.ModelAdmin):
    list_display = ('id', 'conversation', 'user', 'joined_at')
    search_fields = ('user__email',)


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'conversation', 'sender', 'is_read', 'created_at')
    search_fields = ('sender__email', 'message')
    list_filter = ('is_read',)


@admin.register(Call)
class CallAdmin(admin.ModelAdmin):
    list_display = ('id', 'caller', 'receiver', 'status', 'duration_seconds', 'created_at')
    search_fields = ('caller__email', 'receiver__email')
    list_filter = ('status',)

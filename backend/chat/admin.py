from django.contrib import admin
from .models import Connection, BlockedUser, Interest, Conversation, ConversationParticipant, Message, Call


class ConversationParticipantInline(admin.TabularInline):
    model = ConversationParticipant
    extra = 0


@admin.register(Connection)
class ConnectionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user1', 'user2', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user1__email', 'user2__email', 'user1__first_name', 'user2__first_name')
    ordering = ('-created_at',)


@admin.register(BlockedUser)
class BlockedUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'blocker', 'blocked', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('blocker__email', 'blocked__email')
    ordering = ('-created_at',)


@admin.register(Interest)
class InterestAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'receiver', 'status', 'created_at', 'responded_at')
    list_filter = ('status', 'created_at')
    search_fields = ('sender__email', 'receiver__email', 'sender__first_name', 'receiver__first_name')
    ordering = ('-created_at',)


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'created_at', 'updated_at')
    ordering = ('-updated_at',)
    inlines = [ConversationParticipantInline]


@admin.register(ConversationParticipant)
class ConversationParticipantAdmin(admin.ModelAdmin):
    list_display = ('id', 'conversation', 'user', 'joined_at')
    search_fields = ('user__email', 'user__first_name')
    ordering = ('-joined_at',)


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'conversation', 'sender', 'is_read', 'created_at')
    search_fields = ('sender__email', 'message')
    list_filter = ('is_read', 'created_at')
    ordering = ('-created_at',)


@admin.register(Call)
class CallAdmin(admin.ModelAdmin):
    list_display = ('id', 'caller', 'receiver', 'status', 'duration_seconds', 'created_at')
    search_fields = ('caller__email', 'receiver__email')
    list_filter = ('status', 'created_at')
    ordering = ('-created_at',)

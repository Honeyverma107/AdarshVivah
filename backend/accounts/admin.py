from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from profiles.models import Profile, SuccessStory, UserReport
from verification.models import IdentityVerification
from chat.models import Connection, Message

User = get_user_model()


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser', 'created_at')
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'created_at')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-created_at',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'created_at', 'updated_at')}),
    )
    readonly_fields = ('created_at', 'updated_at', 'last_login')

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'first_name', 'last_name', 'is_active', 'is_staff'),
        }),
    )

    actions = ['activate_users', 'deactivate_users']

    @admin.action(description='Activate selected users')
    def activate_users(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f"{updated} user(s) successfully activated.")

    @admin.action(description='Deactivate selected users')
    def deactivate_users(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f"{updated} user(s) successfully deactivated.")


# Custom Admin Dashboard Index
original_index = admin.site.index


def custom_admin_index(request, extra_context=None):
    if extra_context is None:
        extra_context = {}

    # Matrimonial users only (exclude platform staff/superuser/admin accounts)
    matrimonial_users = User.objects.filter(is_staff=False, is_superuser=False)

    extra_context['stats'] = {
        'total_users': matrimonial_users.count(),
        'active_users': matrimonial_users.filter(is_active=True).count(),
        'total_profiles': Profile.objects.count(),
        'verified_profiles': Profile.objects.filter(is_verified=True).count(),
        'pending_verifications': IdentityVerification.objects.filter(status='PENDING').count(),
        'pending_reports': UserReport.objects.filter(status='PENDING').count(),
        'pending_stories': SuccessStory.objects.filter(is_approved=False).count(),
        'total_connections': Connection.objects.filter(status='ACCEPTED').count(),
        'total_messages': Message.objects.count(),
    }

    extra_context['recent_users'] = matrimonial_users.order_by('-created_at')[:5]
    extra_context['recent_verifications'] = IdentityVerification.objects.select_related('user').order_by('-created_at')[:5]
    extra_context['recent_reports'] = UserReport.objects.select_related('reporter', 'reported_user').order_by('-created_at')[:5]
    extra_context['recent_stories'] = SuccessStory.objects.order_by('-created_at')[:5]

    return original_index(request, extra_context=extra_context)


admin.site.index = custom_admin_index

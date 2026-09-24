from django.contrib import admin
from django.utils import timezone
from .models import IdentityVerification, VerificationStatus


@admin.register(IdentityVerification)
class IdentityVerificationAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'status', 'verification_type', 'masked_aadhaar_display',
        'submitted_at', 'reviewed_at', 'reviewed_by', 'has_document'
    )
    list_filter = ('status', 'verification_type')
    search_fields = ('user__email', 'user__first_name', 'rejection_reason')
    readonly_fields = ('submitted_at', 'created_at', 'updated_at', 'masked_aadhaar_display')
    actions = ['approve_verifications', 'reject_verifications']

    def has_document(self, obj):
        return bool(obj.document)
    has_document.boolean = True
    has_document.short_description = 'Document Uploaded'

    def masked_aadhaar_display(self, obj):
        if obj.verification_type == 'AADHAAR':
            return obj.masked_aadhaar_number
        return '-'
    masked_aadhaar_display.short_description = 'Masked Aadhaar'

    def save_model(self, request, obj, form, change):
        if change and 'status' in form.changed_data:
            obj.reviewed_by = request.user
            obj.reviewed_at = timezone.now()
            profile = getattr(obj.user, 'profile', None)
            if profile:
                profile.is_verified = (obj.status == VerificationStatus.VERIFIED)
                profile.save()
        super().save_model(request, obj, form, change)

    @admin.action(description='Approve selected identity verifications')
    def approve_verifications(self, request, queryset):
        for verification in queryset:
            verification.status = VerificationStatus.VERIFIED
            verification.reviewed_at = timezone.now()
            verification.reviewed_by = request.user
            verification.save()

            profile = getattr(verification.user, 'profile', None)
            if profile:
                profile.is_verified = True
                profile.save()
        self.message_user(request, f"Successfully approved {queryset.count()} verification(s).")

    @admin.action(description='Reject selected identity verifications')
    def reject_verifications(self, request, queryset):
        for verification in queryset:
            verification.status = VerificationStatus.REJECTED
            if not verification.rejection_reason:
                verification.rejection_reason = 'Document information does not match profile or is unreadable.'
            verification.reviewed_at = timezone.now()
            verification.reviewed_by = request.user
            verification.save()

            profile = getattr(verification.user, 'profile', None)
            if profile:
                profile.is_verified = False
                profile.save()
        self.message_user(request, f"Successfully rejected {queryset.count()} verification(s).")

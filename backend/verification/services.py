import os
from django.utils import timezone
from .models import IdentityVerification, VerificationStatus


class VerificationService:
    @staticmethod
    def get_or_create_verification(user):
        verification, _ = IdentityVerification.objects.get_or_create(user=user)
        return verification

    @staticmethod
    def submit_document(user, document_file, verification_type='AADHAAR', aadhaar_number=''):
        verification = VerificationService.get_or_create_verification(user)
        
        if document_file:
            verification.document = document_file
        if verification_type:
            verification.verification_type = verification_type
        if aadhaar_number:
            verification.set_aadhaar_number(aadhaar_number)

        verification.status = VerificationStatus.PENDING
        verification.submitted_at = timezone.now()
        verification.reviewed_at = None
        verification.reviewed_by = None
        verification.rejection_reason = ''
        verification.save()

        return verification

    @staticmethod
    def approve_verification(verification, admin_user):
        verification.status = VerificationStatus.VERIFIED
        verification.reviewed_at = timezone.now()
        verification.reviewed_by = admin_user
        verification.rejection_reason = ''
        verification.save()

        # Update Profile is_verified flag
        profile = getattr(verification.user, 'profile', None)
        if profile:
            profile.is_verified = True
            profile.save()

        return verification

    @staticmethod
    def reject_verification(verification, admin_user, rejection_reason=''):
        verification.status = VerificationStatus.REJECTED
        verification.rejection_reason = rejection_reason or 'Uploaded document is unreadable or does not match profile details.'
        verification.reviewed_at = timezone.now()
        verification.reviewed_by = admin_user
        verification.save()

        # Update Profile is_verified flag
        profile = getattr(verification.user, 'profile', None)
        if profile:
            profile.is_verified = False
            profile.save()

        return verification

from .base import BaseKYCProvider


class DigiLockerKYCProvider(BaseKYCProvider):
    """
    KYC Provider integration layer for Government DigiLocker / Aadhaar identity verification.
    Requires production API credentials, client secrets, and UIDAI compliance onboarding.
    """
    def is_configured(self) -> bool:
        # Returns False until production API keys & client secrets are configured in settings
        return False

    def initiate_verification(self, user, consent_given: bool) -> dict:
        if not consent_given:
            return {
                "success": False,
                "status": "CONSENT_REQUIRED",
                "message": "User consent is required before initiating identity verification."
            }

        if not self.is_configured():
            return {
                "success": False,
                "status": "NOT_AVAILABLE",
                "message": "Identity verification is currently unavailable because the verification service has not been configured."
            }

        return {
            "success": False,
            "status": "PENDING",
            "message": "Verification request initiated."
        }

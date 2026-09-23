from abc import ABC, abstractmethod


class BaseKYCProvider(ABC):
    """
    Abstract Base Class for Identity/KYC Verification Providers (e.g. DigiLocker, Signzy, Karza).
    """

    @abstractmethod
    def is_configured(self) -> bool:
        """Returns True if provider credentials & API keys are configured."""
        pass

    @abstractmethod
    def initiate_verification(self, user, consent_given: bool) -> dict:
        """Initiates identity verification workflow with the provider."""
        pass

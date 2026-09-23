import base64
import hashlib
from cryptography.fernet import Fernet
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


def get_cipher():
    key = base64.urlsafe_b64encode(hashlib.sha256(settings.SECRET_KEY.encode('utf-8')).digest())
    return Fernet(key)


def encrypt_aadhaar(raw_number: str) -> str:
    if not raw_number:
        return ""
    clean_digits = ''.join(c for c in str(raw_number) if c.isdigit())
    if not clean_digits:
        return ""
    try:
        cipher = get_cipher()
        return cipher.encrypt(clean_digits.encode('utf-8')).decode('utf-8')
    except Exception:
        return clean_digits


def decrypt_aadhaar(enc_number: str) -> str:
    if not enc_number:
        return ""
    try:
        cipher = get_cipher()
        return cipher.decrypt(enc_number.encode('utf-8')).decode('utf-8')
    except Exception:
        return enc_number


class VerificationStatus(models.TextChoices):
    NOT_SUBMITTED = 'NOT_SUBMITTED', _('Not Submitted')
    PENDING = 'PENDING', _('Verification Pending')
    VERIFIED = 'VERIFIED', _('Verified')
    REJECTED = 'REJECTED', _('Rejected')


class VerificationType(models.TextChoices):
    AADHAAR = 'AADHAAR', _('Aadhaar Card')
    PAN = 'PAN', _('PAN Card')
    PASSPORT = 'PASSPORT', _('Passport')
    DRIVING_LICENCE = 'DRIVING_LICENCE', _('Driving Licence')
    VOTER_ID = 'VOTER_ID', _('Voter ID')


class IdentityVerification(models.Model):
    """
    Stores document verification request metadata for manual admin review.
    Aadhaar numbers are symmetrically encrypted with Django SECRET_KEY before saving.
    Public profile APIs strictly expose identity_verified: true/false and never expose raw/masked Aadhaar or notes.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='identity_verification'
    )
    document = models.FileField(upload_to='verifications/', null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.NOT_SUBMITTED
    )
    verification_type = models.CharField(
        max_length=30,
        choices=VerificationType.choices,
        default=VerificationType.AADHAAR
    )
    aadhaar_number = models.CharField(max_length=255, blank=True, default='')  # Ciphertext
    rejection_reason = models.TextField(blank=True, default='')
    submitted_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_verifications'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'identity_verifications'
        verbose_name = 'Identity Verification'
        verbose_name_plural = 'Identity Verifications'

    def set_aadhaar_number(self, raw_number: str):
        self.aadhaar_number = encrypt_aadhaar(raw_number)

    def get_decrypted_aadhaar(self) -> str:
        return decrypt_aadhaar(self.aadhaar_number)

    @property
    def masked_aadhaar_number(self) -> str:
        raw = self.get_decrypted_aadhaar()
        clean_num = ''.join(c for c in str(raw) if c.isdigit())
        if len(clean_num) >= 4:
            return f"XXXX-XXXX-{clean_num[-4:]}"
        return "XXXX-XXXX-XXXX"

    def __str__(self):
        return f"IdentityVerification({self.user.email}) - {self.status}"

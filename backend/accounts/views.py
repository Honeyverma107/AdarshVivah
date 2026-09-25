import os
import secrets
import hashlib
import traceback
from datetime import datetime, timedelta
from django.utils import timezone
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from .models import EmailOTP
from .serializers import (
    LoginSerializer, UserSerializer, RegisterSerializer,
    SendOTPSerializer, VerifyOTPSerializer, GoogleAuthSerializer
)

User = get_user_model()


class SendOTPView(APIView):
    """
    POST /api/auth/send-otp/
    Generate 6-digit OTP, store hashed, and send via email.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = SendOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']

        # Check 60-second resend cooldown
        last_otp = EmailOTP.objects.filter(email__iexact=email).order_by('-created_at').first()
        if last_otp and (timezone.now() - last_otp.created_at).total_seconds() < 60:
            remaining_cooldown = int(60 - (timezone.now() - last_otp.created_at).total_seconds())
            return Response({
                "detail": f"Please wait {remaining_cooldown} seconds before requesting another OTP code."
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)

        # Invalidate previous unused OTPs for this email
        EmailOTP.objects.filter(email__iexact=email, is_used=False).update(is_used=True)

        # Generate 6-digit numeric OTP
        raw_otp = f"{secrets.randbelow(900000) + 100000}"
        otp_hash = hashlib.sha256(raw_otp.encode('utf-8')).hexdigest()
        expires_at = timezone.now() + timedelta(minutes=5)

        # Store in database
        EmailOTP.objects.create(
            email=email,
            otp_hash=otp_hash,
            expires_at=expires_at,
            purpose=EmailOTP.OTPPurpose.LOGIN
        )

        # Check SMTP configuration
        smtp_user = getattr(settings, 'EMAIL_HOST_USER', '') or os.getenv('EMAIL_HOST_USER', '')
        smtp_host = getattr(settings, 'EMAIL_HOST', '') or os.getenv('EMAIL_HOST', '')

        if not smtp_user or not smtp_host or smtp_user == 'your_email@gmail.com':
            masked_user = (smtp_user[:2] + "*****" + smtp_user[smtp_user.find('@'):]) if '@' in smtp_user else (smtp_user[:2] + "*****" if smtp_user else "NOT SET")
            print(f"\n[DEVELOPMENT LOG] SendOTPView HTTP 503 - SMTP Configuration Missing or Placeholder:")
            print(f"  - EMAIL_HOST: '{smtp_host or 'NOT SET'}'")
            print(f"  - EMAIL_HOST_USER: '{masked_user}'")
            print(f"  - EMAIL_PORT: {getattr(settings, 'EMAIL_PORT', 587)}")
            print(f"  - EMAIL_USE_TLS: {getattr(settings, 'EMAIL_USE_TLS', True)}\n")
            return Response({
                "detail": "We couldn't send the verification code right now. Please try again shortly."
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        # Render HTML email template & send
        try:
            html_message = render_to_string('emails/otp_email.html', {
                'otp_code': raw_otp,
                'year': datetime.now().year,
            })
            send_mail(
                subject="Your AdarshVivah Login OTP",
                message=f"Your AdarshVivah verification code is valid for 5 minutes.",
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'AdarshVivah <noreply@adarshvivah.com>'),
                recipient_list=[email],
                html_message=html_message,
                fail_silently=False
            )
        except Exception as e:
            masked_user = (smtp_user[:2] + "*****" + smtp_user[smtp_user.find('@'):]) if '@' in smtp_user else (smtp_user[:2] + "*****" if smtp_user else "NOT SET")
            print(f"\n[DEVELOPMENT LOG] SendOTPView SMTP Exception Caught:")
            print(f"  - Exception Type: {type(e).__name__}")
            print(f"  - EMAIL_HOST: '{smtp_host}'")
            print(f"  - EMAIL_HOST_USER: '{masked_user}'")
            print(f"  - Traceback:\n{traceback.format_exc()}\n")
            return Response({
                "detail": "We couldn't send the verification code right now. Please try again shortly."
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        return Response({
            "message": "Verification OTP sent successfully to your email address."
        }, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    """
    POST /api/auth/verify-otp/
    Verify 6-digit OTP, authenticate or create normal USER account, return SimpleJWT tokens.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = VerifyOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        otp_input = serializer.validated_data['otp']

        otp_record = EmailOTP.objects.filter(
            email__iexact=email,
            is_used=False
        ).order_by('-created_at').first()

        if not otp_record:
            return Response({
                "detail": "No active verification code found for this email. Please request a new OTP."
            }, status=status.HTTP_400_BAD_REQUEST)

        if otp_record.expires_at < timezone.now():
            otp_record.is_used = True
            otp_record.save()
            return Response({
                "detail": "This verification code has expired. Please request a new OTP."
            }, status=status.HTTP_400_BAD_REQUEST)

        if otp_record.attempts >= 5:
            otp_record.is_used = True
            otp_record.save()
            return Response({
                "detail": "Maximum verification attempts exceeded. Please request a new OTP."
            }, status=status.HTTP_400_BAD_REQUEST)

        input_hash = hashlib.sha256(otp_input.encode('utf-8')).hexdigest()

        if input_hash != otp_record.otp_hash:
            otp_record.attempts += 1
            if otp_record.attempts >= 5:
                otp_record.is_used = True
                otp_record.save()
                return Response({
                    "detail": "Maximum verification attempts exceeded. Please request a new OTP."
                }, status=status.HTTP_400_BAD_REQUEST)
            otp_record.save()
            remaining = 5 - otp_record.attempts
            return Response({
                "detail": f"Invalid verification code. {remaining} attempt(s) remaining."
            }, status=status.HTTP_400_BAD_REQUEST)

        # Mark OTP as successfully used
        otp_record.is_used = True
        otp_record.used_at = timezone.now()
        otp_record.save()

        # Find or create user
        user = User.objects.filter(email__iexact=email).first()

        if not user:
            user = User.objects.create_user(
                email=email,
                first_name=email.split('@')[0],
                is_staff=False,
                is_superuser=False
            )

        if not user.is_active:
            return Response({
                "detail": "This account is disabled."
            }, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": user_data
        }, status=status.HTTP_200_OK)


class GoogleLoginView(APIView):
    """
    POST /api/auth/google/
    Verify Google OAuth credential server-side, authenticate/create normal USER, return SimpleJWT tokens.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = GoogleAuthSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        credential = serializer.validated_data['credential']
        google_client_id = getattr(settings, 'GOOGLE_CLIENT_ID', '') or os.getenv('GOOGLE_CLIENT_ID', '')

        try:
            id_info = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                audience=google_client_id if google_client_id else None
            )
        except Exception as e:
            return Response({
                "detail": f"Invalid or expired Google authentication token. ({str(e)})"
            }, status=status.HTTP_401_UNAUTHORIZED)

        email = id_info.get('email', '').strip().lower()
        email_verified = id_info.get('email_verified', False)

        if not email or not email_verified:
            return Response({
                "detail": "Unverified or invalid Google account email address."
            }, status=status.HTTP_400_BAD_REQUEST)

        name = id_info.get('name') or id_info.get('given_name') or email.split('@')[0]

        user = User.objects.filter(email__iexact=email).first()

        if not user:
            user = User.objects.create_user(
                email=email,
                first_name=name,
                is_staff=False,
                is_superuser=False
            )

        if not user.is_active:
            return Response({
                "detail": "This account is disabled."
            }, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": user_data
        }, status=status.HTTP_200_OK)


class RegisterView(APIView):
    """
    POST /api/auth/register/
    Register a new user account.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        user_data = UserSerializer(user).data

        return Response({
            "message": "Registration successful.",
            "user": user_data
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    POST /api/auth/login/
    Authenticate user via Email and Password and return JWT tokens.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email'].strip().lower()
        password = serializer.validated_data['password']

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.check_password(password):
            return Response(
                {"detail": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {"detail": "This account is inactive."},
                status=status.HTTP_403_FORBIDDEN
            )

        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": user_data
        }, status=status.HTTP_200_OK)


class MeView(APIView):
    """
    GET /api/auth/me/
    Return authenticated user profile. Requires valid JWT access token.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

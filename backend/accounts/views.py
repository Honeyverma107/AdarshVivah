from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .serializers import LoginSerializer, UserSerializer, RegisterSerializer

User = get_user_model()


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
            # Generic error message to prevent account enumeration
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

        # Generate SimpleJWT tokens
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

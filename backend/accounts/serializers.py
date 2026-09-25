from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for returning basic user details.
    """
    name = serializers.CharField(source='first_name', read_only=True)
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'role')
        read_only_fields = ('id', 'name', 'email', 'role')

    def get_role(self, obj):
        if obj.is_superuser or obj.is_staff:
            return "ADMIN"
        return "USER"


class LoginSerializer(serializers.Serializer):
    """
    Serializer for validating login requests.
    """
    email = serializers.EmailField(
        required=True,
        error_messages={
            'required': 'Email is required.',
            'blank': 'Email cannot be blank.',
            'invalid': 'Enter a valid email address.'
        }
    )
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'},
        error_messages={
            'required': 'Password is required.',
            'blank': 'Password cannot be blank.'
        }
    )


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for handling user registration.
    """
    name = serializers.CharField(
        required=True,
        max_length=150,
        error_messages={
            'required': 'Name is required.',
            'blank': 'Name cannot be blank.'
        }
    )
    email = serializers.EmailField(
        required=True,
        error_messages={
            'required': 'Email is required.',
            'blank': 'Email cannot be blank.',
            'invalid': 'Enter a valid email address.'
        }
    )
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'},
        error_messages={
            'required': 'Password is required.',
            'blank': 'Password cannot be blank.'
        }
    )
    confirm_password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'},
        error_messages={
            'required': 'Confirm password is required.',
            'blank': 'Confirm password cannot be blank.'
        }
    )

    class Meta:
        model = User
        fields = ('name', 'email', 'password', 'confirm_password')

    def validate_name(self, value):
        name = value.strip()
        if not name:
            raise serializers.ValidationError("Name cannot be blank.")
        return name

    def validate_email(self, value):
        email = value.strip().lower()
        if not email:
            raise serializers.ValidationError("Email cannot be blank.")
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("A user with this email address already exists.")
        return email

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')

        if password and confirm_password and password != confirm_password:
            raise serializers.ValidationError({
                "confirm_password": "Password and confirm_password do not match."
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        name = validated_data.pop('name')
        email = validated_data['email']
        password = validated_data['password']

        user = User.objects.create_user(
            email=email,
            password=password,
            first_name=name,
            is_staff=False,
            is_superuser=False
        )
        return user


class SendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField(
        required=True,
        error_messages={
            'required': 'Email address is required.',
            'blank': 'Email address cannot be blank.',
            'invalid': 'Enter a valid email address.'
        }
    )

    def validate_email(self, value):
        email = value.strip().lower()
        if not email:
            raise serializers.ValidationError("Email cannot be blank.")
        return email


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField(
        required=True,
        error_messages={
            'required': 'Email address is required.',
            'invalid': 'Enter a valid email address.'
        }
    )
    otp = serializers.CharField(
        required=True,
        max_length=6,
        min_length=6,
        error_messages={
            'required': 'OTP is required.',
            'blank': 'OTP cannot be blank.',
            'min_length': 'OTP must be 6 digits.',
            'max_length': 'OTP must be 6 digits.'
        }
    )

    def validate_email(self, value):
        return value.strip().lower()

    def validate_otp(self, value):
        otp = value.strip()
        if not otp.isdigit():
            raise serializers.ValidationError("OTP must contain digits only.")
        return otp


class GoogleAuthSerializer(serializers.Serializer):
    credential = serializers.CharField(
        required=True,
        error_messages={
            'required': 'Google credential token is required.',
            'blank': 'Google credential token cannot be blank.'
        }
    )


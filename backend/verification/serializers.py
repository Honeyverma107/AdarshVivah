from rest_framework import serializers
from .models import IdentityVerification


class IdentityVerificationSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.first_name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    verification_type_display = serializers.CharField(source='get_verification_type_display', read_only=True)
    document_type = serializers.CharField(source='verification_type', read_only=True)
    document_url = serializers.SerializerMethodField()
    document_name = serializers.SerializerMethodField()

    class Meta:
        model = IdentityVerification
        fields = (
            'id', 'user_name', 'user_email', 'status', 'verification_type',
            'document_type', 'verification_type_display', 'document_url', 'document_name',
            'rejection_reason', 'submitted_at', 'reviewed_at', 'created_at'
        )
        read_only_fields = fields

    def get_document_url(self, obj):
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated:
            return None
        # Security & Privacy Access Control: ONLY document owner or staff/admin can access uploaded document URL
        if request.user.id == obj.user.id or request.user.is_staff or request.user.is_superuser:
            if obj.document:
                return request.build_absolute_uri(obj.document.url)
        return None

    def get_document_name(self, obj):
        if obj.document:
            return obj.document.name.split('/')[-1]
        return ""

import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework import status

from .models import IdentityVerification, VerificationStatus
from .services import VerificationService
from .serializers import IdentityVerificationSerializer


class VerificationStatusView(APIView):
    """
    GET /api/verification/ or GET /api/verification/status/
    Returns authenticated user's real verification status and submission details.
    Uses request.user strictly.
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request, *args, **kwargs):
        verification = VerificationService.get_or_create_verification(request.user)
        serializer = IdentityVerificationSerializer(verification, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        submit_view = VerificationSubmitView()
        return submit_view.post(request, *args, **kwargs)


class VerificationSubmitView(APIView):
    """
    POST /api/verification/ or POST /api/verification/submit/
    Submits user government ID document (JPG, JPEG, PNG, PDF <= 10MB) for manual admin review.
    Sets status to PENDING.
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request, *args, **kwargs):
        verification_type = request.data.get('verification_type') or request.data.get('document_type') or 'AADHAAR'
        file = request.FILES.get('document') or request.FILES.get('document_file') or request.FILES.get('file')

        if not file:
            return Response(
                {'detail': 'Please select a valid document file (JPG, JPEG, PNG, or PDF) to upload.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # File size validation (10 MB max)
        if file.size > 10 * 1024 * 1024:
            return Response(
                {'detail': 'File size exceeds maximum limit of 10 MB.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # File format validation
        ext = os.path.splitext(file.name)[1].lower()
        valid_exts = ['.jpg', '.jpeg', '.png', '.pdf']
        if ext not in valid_exts:
            return Response(
                {'detail': 'Unsupported file format. Please upload a JPG, JPEG, PNG, or PDF document.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        aadhaar_num = str(request.data.get('aadhaar_number') or '').strip()

        verification = VerificationService.submit_document(
            user=request.user,
            document_file=file,
            verification_type=verification_type,
            aadhaar_number=aadhaar_num
        )
        serializer = IdentityVerificationSerializer(verification, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminVerificationListView(APIView):
    """
    GET /api/verification/admin/list/ or GET /api/admin/verifications/
    Lists all verification requests for Admin/Staff review.
    Enforces server-side IsAdminUser permission (returns HTTP 403 for normal users).
    """
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request, *args, **kwargs):
        qs = IdentityVerification.objects.exclude(status=VerificationStatus.NOT_SUBMITTED).order_by('-submitted_at')
        serializer = IdentityVerificationSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminVerificationDetailView(APIView):
    """
    GET /api/verification/admin/<pk>/ or GET /api/admin/verifications/<pk>/
    Fetch single verification request detail for Admin review.
    Enforces server-side IsAdminUser permission.
    """
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request, pk=None, *args, **kwargs):
        try:
            verification = IdentityVerification.objects.get(pk=pk)
        except IdentityVerification.DoesNotExist:
            return Response({'detail': 'Verification record not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = IdentityVerificationSerializer(verification, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminVerificationApproveView(APIView):
    """
    POST /api/verification/admin/<id>/approve/ or POST /api/admin/verifications/<id>/approve/
    Approve pending document verification.
    """
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, pk=None, *args, **kwargs):
        try:
            verification = IdentityVerification.objects.get(pk=pk)
        except IdentityVerification.DoesNotExist:
            return Response({'detail': 'Verification record not found.'}, status=status.HTTP_404_NOT_FOUND)

        VerificationService.approve_verification(verification, request.user)
        serializer = IdentityVerificationSerializer(verification, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminVerificationRejectView(APIView):
    """
    POST /api/verification/admin/<id>/reject/ or POST /api/admin/verifications/<id>/reject/
    Reject document verification with mandatory rejection reason.
    """
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, pk=None, *args, **kwargs):
        try:
            verification = IdentityVerification.objects.get(pk=pk)
        except IdentityVerification.DoesNotExist:
            return Response({'detail': 'Verification record not found.'}, status=status.HTTP_404_NOT_FOUND)

        reason = request.data.get('rejection_reason', '').strip()
        if not reason:
            return Response({'detail': 'A rejection reason must be provided.'}, status=status.HTTP_400_BAD_REQUEST)

        VerificationService.reject_verification(verification, request.user, reason)
        serializer = IdentityVerificationSerializer(verification, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

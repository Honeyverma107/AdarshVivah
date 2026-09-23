from django.urls import path
from .views import (
    VerificationStatusView,
    VerificationSubmitView,
    AdminVerificationListView,
    AdminVerificationDetailView,
    AdminVerificationApproveView,
    AdminVerificationRejectView
)

urlpatterns = [
    # User endpoints
    path('', VerificationStatusView.as_view(), name='verification-root'),
    path('status/', VerificationStatusView.as_view(), name='verification-status'),
    path('me/', VerificationStatusView.as_view(), name='verification-me'),
    path('submit/', VerificationSubmitView.as_view(), name='verification-submit'),
    
    # Verification Admin Portal endpoints
    path('admin/list/', AdminVerificationListView.as_view(), name='admin-verification-list'),
    path('admin/<int:pk>/', AdminVerificationDetailView.as_view(), name='admin-verification-detail'),
    path('admin/<int:pk>/approve/', AdminVerificationApproveView.as_view(), name='admin-verification-approve'),
    path('admin/<int:pk>/reject/', AdminVerificationRejectView.as_view(), name='admin-verification-reject'),
]

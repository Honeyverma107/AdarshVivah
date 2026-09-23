from django.urls import path
from .views import (
    AdminVerificationListView,
    AdminVerificationDetailView,
    AdminVerificationApproveView,
    AdminVerificationRejectView
)

urlpatterns = [
    path('', AdminVerificationListView.as_view(), name='api-admin-verifications-list'),
    path('<int:pk>/', AdminVerificationDetailView.as_view(), name='api-admin-verifications-detail'),
    path('<int:pk>/approve/', AdminVerificationApproveView.as_view(), name='api-admin-verifications-approve'),
    path('<int:pk>/reject/', AdminVerificationRejectView.as_view(), name='api-admin-verifications-reject'),
]

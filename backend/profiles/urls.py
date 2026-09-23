from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProfileViewSet, ProfilePhotoViewSet, ShortlistViewSet, SuccessStoryViewSet,
    DashboardStatsView, AdminStatsView, AdminUsersView
)

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet, basename='profile')
router.register(r'photos', ProfilePhotoViewSet, basename='photo')
router.register(r'shortlists', ShortlistViewSet, basename='shortlist')
router.register(r'success-stories', SuccessStoryViewSet, basename='success-story')

urlpatterns = [
    path('dashboard/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('admin/users/', AdminUsersView.as_view(), name='admin-users'),
    path('admin/users/<int:pk>/verify/', AdminUsersView.as_view(), name='admin-user-verify'),
    path('', include(router.urls)),
]

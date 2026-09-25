from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, MeView,
    SendOTPView, VerifyOTPView, GoogleLoginView
)

urlpatterns = [
    path('send-otp/', SendOTPView.as_view(), name='auth_send_otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='auth_verify_otp'),
    path('google/', GoogleLoginView.as_view(), name='auth_google'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('me/', MeView.as_view(), name='auth_me'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

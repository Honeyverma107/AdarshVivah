from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/chat/', include('chat.urls')),
    path('api/verification/', include('verification.urls')),
    path('api/admin/verifications/', include('verification.admin_urls')),
    path('api/', include('profiles.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Route the /auth/ URL to the users.urls module
    path('auth/', include('users.urls')),
    # Route the /api/v1/ URL to the users.api.v1.urls module
    path('api/v1/', include('users.api.v1.urls')),
]

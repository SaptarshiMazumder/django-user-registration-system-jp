from django.urls import path
from .api_views import UserRegistrationAPIView, PrefAPIView

urlpatterns = [
    path('prefs/', PrefAPIView.as_view(), name='prefs'),
    path('register/', UserRegistrationAPIView.as_view(), name='api_register'),
]

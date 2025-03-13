from django.urls import path
from .api_views import UserRegistrationAPIView

urlpatterns = [
    path('register/', UserRegistrationAPIView.as_view(), name='register'),
]

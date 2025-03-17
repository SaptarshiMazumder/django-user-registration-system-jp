from django.urls import path, include
from rest_framework import routers
from .views import PrefAPIView, UserRegistrationAPIView
router = routers.DefaultRouter()

urlpatterns = [
    path('prefs/', PrefAPIView.as_view(), name='prefs'),
    path('register/', UserRegistrationAPIView.as_view(), name='api_register'),
]

urlpatterns += router.urls

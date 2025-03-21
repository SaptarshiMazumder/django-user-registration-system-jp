from django.urls import path, include
from rest_framework import routers
from .views import PrefAPIView, UserRegistrationAPIView

router = routers.DefaultRouter()

urlpatterns = [
    # Route the /prefs/ URL to the PrefAPIView view for fetching prefectures from DRF API
    path('prefs/', PrefAPIView.as_view(), name='prefs'),
    # Route the /register/ URL to the UserRegistrationAPIView view
    path('register/', UserRegistrationAPIView.as_view(), name='api_register'),
]

# Add the router's URLs to the urlpatterns
urlpatterns += router.urls

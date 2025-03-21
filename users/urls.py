from django.urls import path
from . import views

# Define the URL patterns for form views
urlpatterns = [
    # Route the /register/ URL to the register view
    path('register/', views.register, name='register'),
    # Route the /success/ URL to the registration_success view
    path('success/', views.registration_success,
         name='registration_success'),
        #  Route the /prefs/ URL to the get_prefectures view
    path('prefectures/', views.get_prefectures, name='get_prefectures'),
]

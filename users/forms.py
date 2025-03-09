from django import forms
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
import re
from .models import User, Pref

class UserRegistrationForm(forms.ModelForm):

    password_confirm = forms.CharField(widget=forms.PasswordInput,
                                       label= 'Confirm Password')
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 
                  'password_confirm', 'tel', 'pref']
        
        def clean(self):
            cleaned_data = super().clean()
            password = cleaned_data.get('password')
            password_confirm = cleaned_data.get('password_confirm')
            if password and password_confirm and password != password_confirm:
                self.add_error('password_confirm', 'Passwords do not match')
            return cleaned_data
           
        
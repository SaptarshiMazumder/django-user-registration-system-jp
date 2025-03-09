# users/forms.py

from django import forms
from django.core.validators import MinLengthValidator, EmailValidator, RegexValidator
from django.core.exceptions import ValidationError
from .models import User, Pref

class UserRegistrationForm(forms.ModelForm):
    username = forms.CharField(
        label="Username",
        validators=[
            MinLengthValidator(3, "Username must be at least 3 characters long.")
        ]
    )
    email = forms.CharField(
        label="Email",
        validators=[
            EmailValidator("Enter a valid email address.")
        ]
    )
    password = forms.CharField(
        widget=forms.PasswordInput,
        label="Password",
        validators=[
            MinLengthValidator(8, "Password must be at least 8 characters long."),
            RegexValidator(r'[A-Z]', "Password must contain at least one uppercase letter."),
            RegexValidator(r'[a-z]', "Password must contain at least one lowercase letter."),
            RegexValidator(r'\d', "Password must contain at least one digit.")
        ]
    )
    password_confirm = forms.CharField(widget=forms.PasswordInput,
                                       label= 'Confirm Password')
    tel = forms.CharField(
        label="Telephone",
        required=False,
        validators=[
            RegexValidator(r'^\d*$', "Telephone number must contain digits only.")
        ]
    )
    pref = forms.ModelChoiceField(
        queryset=Pref.objects.all(),
        label="Prefecture",
        required=False
    ) 

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 
                  'password_confirm', 'tel', 'pref']
        
    def clean(self):
            cleaned_data = super().clean()
            password = cleaned_data.get('password')
            password_confirm = cleaned_data.get('password_confirm')
            if password and password_confirm and password != password_confirm:
                raise ValidationError('Passwords do not match')
            return cleaned_data

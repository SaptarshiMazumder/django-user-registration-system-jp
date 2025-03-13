from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Pref
from django.core.validators import MinLengthValidator, RegexValidator

User = get_user_model()

class PrefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pref
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(validators=[MinLengthValidator(3)])
    email = serializers.EmailField()
    password = serializers.CharField(validators=[MinLengthValidator(8, "Password must be at least 8 characters long."),
                                                RegexValidator(r'[A-Z]', "Password must contain at least one uppercase letter."),
                                                RegexValidator(r'[a-z]', "Password must contain at least one lowercase letter."),
                                                RegexValidator(r'\d', "Password must contain at least one digit.")
        ])
    password_confirm = serializers.CharField(write_only=True)
    tel = serializers.CharField(required=False, allow_blank=True, validators=[RegexValidator(r'^\d*$', "Telephone number must contain digits only.")])
    pref = serializers.PrimaryKeyRelatedField(queryset=Pref.objects.all(), required=False, allow_null=True, read_only=False)
    class Meta:
        model = User
        fields = ['username', 'email', 'password',
                  'password_confirm', 'tel', 'pref']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        return data

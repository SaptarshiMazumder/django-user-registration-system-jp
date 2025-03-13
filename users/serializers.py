from rest_framework import serializers
    # get the current active user model
from django.contrib.auth import get_user_model 
from django.core.validators import MinLengthValidator, RegexValidator, EmailValidator

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 
                  "password_confirm", "tel", "pref"]

        username = serializers.CharField(
            validators=[MinLengthValidator(3, "Username must be at least 3 characters long.")]
        )

        def validate(self, data):
            if data['password'] != data['password_confirm']:
                raise serializers.ValidationError("Passwords do not match.")
            return data
        
        def create(self, validated_data):
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password'],
                tel=validated_data['tel'],
                pref=validated_data['pref']
            )
            return user
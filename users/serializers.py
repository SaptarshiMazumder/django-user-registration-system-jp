from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.validators import MinLengthValidator, RegexValidator

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(validators=[MinLengthValidator(3)])
    email = serializers.EmailField()
    password = serializers.CharField(validators=[MinLengthValidator(8, "Password must be at least 8 characters long."),
                                                RegexValidator(r'[A-Z]', "Password must contain at least one uppercase letter."),
                                                RegexValidator(r'[a-z]', "Password must contain at least one lowercase letter."),
                                                RegexValidator(r'\d', "Password must contain at least one digit.")
        ])
    password_confirm = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 
                  'password_confirm', 'tel', 'pref']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
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

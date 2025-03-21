# Import the serializers module from rest_framework
from rest_framework import serializers
# Import the get_user_model function from django.contrib.auth
from django.contrib.auth import get_user_model
# Import the models module from the parent directory
from ... import models
# Import the MinLengthValidator and RegexValidator classes from django.core.validators
from django.core.validators import MinLengthValidator, RegexValidator

# Get the User model
User = get_user_model()

# Define the PrefSerializer class
class PrefSerializer(serializers.ModelSerializer):
    # Define the Meta class
    class Meta:
        # Set the model to the Pref model
        model = models.Pref
        # Set the fields to the id and name fields
        fields = ['id', 'name']

# Define the UserSerializer class
class UserSerializer(serializers.ModelSerializer):
    # Define the username field with validators and error messages
    username = serializers.CharField(validators=[MinLengthValidator(3)], error_messages={'required': 'ユーザー名は必須です。'})
    # Define the email field with error messages
    email = serializers.EmailField(error_messages={
                                        'required': 'メールアドレスは必須です。',
                                        'blank': 'メールアドレスは必須です。'
                                    })

    # Define the password field with validators and error messages
    password = serializers.CharField(validators=[MinLengthValidator(8, "Password must be at least 8 characters long."),
                                                RegexValidator(r'[A-Z]', "パスワードには少なくとも1つの大文字を含める必要があります。"),
                                                RegexValidator(r'[a-z]', "パスワードには少なくとも1つの小文字を含める必要があります。"),
                                                RegexValidator(r'\d', "パスワードには少なくとも1つの数字を含める必要があります。")
        ], error_messages={'required': 'パスワードは必須です。'})
    # Define the password_confirm field as write-only
    password_confirm = serializers.CharField(write_only=True)
    # Define the tel field with validators
    tel = serializers.CharField(required=False,
                                allow_blank=True,
                                validators=[RegexValidator(r'^\d*$', "電話番号は数字のみを含める必要があります。")])

    # Define the pref field as a PrimaryKeyRelatedField
    pref = serializers.PrimaryKeyRelatedField(queryset=models.Pref.objects.all(),
                                              required=False,
                                              allow_null=True,
                                              read_only=False)
    # Define the Meta class
    class Meta:
        # Set the model to the User model
        model = User
        # Set the fields to the specified fields
        fields = ['username', 'email', 'password',
                  'password_confirm', 'tel', 'pref']
        # Set extra keyword arguments for the password field
        extra_kwargs = {
            'password': {'write_only': True},
        }

    # Define the validate method to validate the data
    def validate(self, data):
        # Check if the password and password_confirm fields match
        if data['password'] != data['password_confirm']:
            # Raise a validation error if they don't match
            raise serializers.ValidationError({"password_confirm": "パスワードが一致しません。"})
        # Check if a user with the same username already exists
        if (User.objects.filter(username = data['username']).exists()):
            # Raise a validation error if a user with the same username already exists
            raise serializers.ValidationError({"username": "そのユーザー名のユーザーはすでに存在します。"})
        # Check if a user with the same email already exists
        if(User.objects.filter(email = data['email']).exists()):
            # Raise a validation error if a user with the same email already exists
            raise serializers.ValidationError({"email": "メールアドレスはすでに登録されています。"})
        # Return the validated data
        return data

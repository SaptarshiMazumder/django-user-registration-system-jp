from rest_framework import serializers
from django.contrib.auth import get_user_model
from ... import models
# Import = MinLengthValidator and RegexValidator for validation
from django.core.validators import MinLengthValidator, RegexValidator

# Get the User model currently active in this project
User = get_user_model()

# Define the PrefSerializer class to serialize the Pref model
class PrefSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Pref
        fields = ['id', 'name']

# Define the UserSerializer class to serialize the User model
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



    # Define the pref field as a PrimaryKeyRelatedField since it is a foreign key
    pref = serializers.PrimaryKeyRelatedField(queryset=models.Pref.objects.all(),
                                              required=False,
                                              allow_null=True,
                                              read_only=False)
    class Meta:
        model = User
        fields = ['username', 'email', 'password',
                  'password_confirm', 'tel', 'pref']
        # Set extra keyword arguments for the password field 
        # to make it write-only, since we don't want to display it
        extra_kwargs = {
            'password': {'write_only': True},
        }

    
    
    def validate(self, data):
        '''Define the validate method to validate the data after deserialization 
        and before saving it to the database'''
        errors = {}
        # Check if the password and password_confirm fields match
        if data['password'] != data['password_confirm']:
            errors["password_confirm"] = "パスワードが一致しません。"
        

        # Check if a user with the same username already exists
        if (User.objects.filter(username = data['username']).exists()):
            errors["username"] = "そのユーザー名のユーザーはすでに存在します。"
        
        
        # Check if a user with the same email already exists
        if(User.objects.filter(email = data['email']).exists()):
            errors["email"] = "このメールアドレスは既に登録されています。"
        
        # If there are any errors, raise a ValidationError with all the errors
        if errors:
            raise serializers.ValidationError(errors)
        # Return the validated data
        return data

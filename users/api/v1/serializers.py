from rest_framework import serializers
from django.contrib.auth import get_user_model
from ... import models
from django.core.validators import MinLengthValidator, RegexValidator

User = get_user_model()

class PrefSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Pref
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(validators=[MinLengthValidator(3)], error_messages={'required': 'ユーザー名は必須です。'})
    email = serializers.EmailField(error_messages={
                                        'required': 'メールアドレスは必須です。',
                                        'blank': 'メールアドレスは必須です。'
                                    })

    password = serializers.CharField(validators=[MinLengthValidator(8, "Password must be at least 8 characters long."),
                                                RegexValidator(r'[A-Z]', "パスワードには少なくとも1つの大文字を含める必要があります。"),
                                                RegexValidator(r'[a-z]', "パスワードには少なくとも1つの小文字を含める必要があります。"),
                                                RegexValidator(r'\d', "パスワードには少なくとも1つの数字を含める必要があります。")
        ], error_messages={'required': 'パスワードは必須です。'})
    password_confirm = serializers.CharField(write_only=True)
    tel = serializers.CharField(required=False,
                                allow_blank=True,
                                validators=[RegexValidator(r'^\d*$', "電話番号は数字のみを含める必要があります。")])

    pref = serializers.PrimaryKeyRelatedField(queryset=models.Pref.objects.all(),
                                              required=False,
                                              allow_null=True,
                                              read_only=False)
    class Meta:
        model = User
        fields = ['username', 'email', 'password',
                  'password_confirm', 'tel', 'pref']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "パスワードが一致しません。"})
        if (User.objects.filter(username = data['username']).exists()):
            raise serializers.ValidationError({"username": "そのユーザー名のユーザーはすでに存在します。"})
        if(User.objects.filter(email = data['email']).exists()):
            raise serializers.ValidationError({"email": "メールアドレスはすでに登録されています。"})
        return data

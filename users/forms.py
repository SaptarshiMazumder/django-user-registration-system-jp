# users/forms.py

from django import forms
from django.core.validators import MinLengthValidator, RegexValidator, EmailValidator
from django.core.exceptions import ValidationError
from .models import User, Pref

class UserRegistrationForm(forms.ModelForm):
    username = forms.CharField(
        label="ユーザー名",
        validators=[
            MinLengthValidator(3, "ユーザー名は3文字以上で入力してください。")
        ],
        error_messages={'required': 'ユーザー名は必須です。'}
    )
    email = forms.CharField(
        label="メールアドレス",
        validators=[
            EmailValidator("有効なメールアドレスを入力してください。")
        ],
        error_messages={'required': 'メールアドレスは必須です。'}
    )
    password = forms.CharField(
        widget=forms.PasswordInput,
        label="パスワード",
        validators=[
            MinLengthValidator(8, "パスワードは8文字以上で入力してください。"),
            RegexValidator(r'[A-Z]', "パスワードには大文字を1文字以上含めてください。"),
            RegexValidator(r'[a-z]', "パスワードには小文字を1文字以上含めてください。"),
            RegexValidator(r'\d', "パスワードには数字を1文字以上含めてください。")
        ],
        error_messages={'required': 'パスワードは必須です。'}
    )
    password_confirm = forms.CharField(widget=forms.PasswordInput,
                                       label= 'パスワード確認',
                                       error_messages={'required': 'パスワード確認は必須です。'})
    tel = forms.CharField(
        label="電話番号",
        required=False,
        validators=[
            RegexValidator(r'^\d*$', "電話番号は数字のみで入力してください。")
        ]
    )
    pref = forms.ModelChoiceField(
        queryset=Pref.objects.all(),
        label="都道府県",
        required=False
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password',
                  'password_confirm', 'tel', 'pref']

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get('email')
        password = cleaned_data.get('password')
        password_confirm = cleaned_data.get('password_confirm')

        if User.objects.filter(username=cleaned_data.get('username')).exists():
            self.add_error('username', 'そのユーザー名のユーザーはすでに存在します。')
        
        if User.objects.filter(email=email).exists():
            self.add_error('email', 'このメールアドレスは既に登録されています。')

        if password and password_confirm and password != password_confirm:
            self.add_error('password_confirm', 'パスワードが一致しません')


        return cleaned_data

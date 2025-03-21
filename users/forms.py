# users/forms.py

from django import forms
from django.core.validators import MinLengthValidator, RegexValidator, EmailValidator
from django.core.exceptions import ValidationError
from .models import User, Pref

class UserRegistrationForm(forms.ModelForm):
    """
    User registration form with validation for username, email, password, phone number, and prefecture.
    Ensures data integrity and provides meaningful error messages.
    """
    # Adding labels for in Japanese since we want to render in Japanese
    # on the front end

    # Username field with minimum length validation <3
    username = forms.CharField(
        label="ユーザー名",
        validators=[
            MinLengthValidator(3, "ユーザー名は3文字以上で入力してください。")
        ],
        error_messages={'required': 'ユーザー名は必須です。'}
    )

    # Email field with email validation (RFC)
    email = forms.CharField(
        label="メールアドレス",
        validators=[
            EmailValidator("有効なメールアドレスを入力してください。")
        ],
        error_messages={'required': 'メールアドレスは必須です。'}
    )

    # Password field with password validation (8+ chars, includes uppercase lowercase  number)
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
    
    # Phone number field with number validation
    tel = forms.CharField(
        label="電話番号",
        required=False,
        validators=[
            RegexValidator(r'^\d*$', "電話番号は数字のみで入力してください。")
        ]
    )

    # Prefectures field which returns all prefectures from Pref model
    pref = forms.ModelChoiceField(
        queryset=Pref.objects.all(),
        label="都道府県",
        required=False
    )

    class Meta:
        model = User
        # Fields to include in the form
        fields = ['username', 'email', 'password',
                  'password_confirm', 'tel', 'pref']

    def clean(self):
        '''
        Form validation to check that the given username and email don't
        already exist in the database. Also, checking that the given password and
        password confir fields match.

        Returns the cleaned data if the form is valid, otherwise raises a
        ValidationError.
        '''

        # Call the clean method of the parent class
        cleaned_data = super().clean()

        # Access the cleaned data for use
        email = cleaned_data.get('email')
        password = cleaned_data.get('password')
        password_confirm = cleaned_data.get('password_confirm')

        #  Check if a user with the same username already exists
        if User.objects.filter(username=cleaned_data.get('username')).exists():
            self.add_error('username', 'そのユーザー名のユーザーはすでに存在します。')
        
        # Check if a user with the same email already exists
        if User.objects.filter(email=email).exists():
            self.add_error('email', 'このメールアドレスは既に登録されています。')

        # Check if the password and password_confirm fields match
        if password and password_confirm and password != password_confirm:
            self.add_error('password_confirm', 'パスワードが一致しません')


        return cleaned_data

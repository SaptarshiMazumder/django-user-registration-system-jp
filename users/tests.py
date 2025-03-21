from django.test import TestCase
from django.urls import reverse
from .forms import UserRegistrationForm
from .models import User, Pref

class UserRegistrationFormTest(TestCase):
    '''
    Test class for the UserRegistrationAPIView.
    '''
    def setUp(self):
        self.pref = Pref.objects.create(name="Tokyo")

    # Test successful registration case
    def test_valid_form(self):
        # Data for successful registration
        form_data = {
            'username': 'naruto_uzumaki',
            'email': 'hokage.naruto@gmail.com',
            'password': 'Rasengan99',
            'password_confirm': 'Rasengan99',
            'tel': '1234567890',
            'pref': self.pref.id,
        }
        # Create a form instance with the data and check if it's valid
        form = UserRegistrationForm(data=form_data)
        # Assert that the form is valid
        self.assertTrue(form.is_valid())

    # Test invalid username case
    def test_invalid_username(self):
        # data with invalid username <3 
        form_data = {
            'username': 'l',
            'email': 'light.yagami@outlook.com',
            'password': 'DeathNote13',
            'password_confirm': 'DeathNote13',
            'tel': '5559876543',
            'pref': self.pref.id,
        }
        
        # Create a form instance with the data and check if it's valid
        form = UserRegistrationForm(data=form_data)
        # Assert that the form is not valid
        self.assertFalse(form.is_valid())
        self.assertIn('username', form.errors)

    # Test invalid email case
    def test_invalid_email(self):
        # Create a user with the same email as the form data
        User.objects.create_user(username='existing', email='duplicate@example.com', password='Password1')
        # data with invalid email
        form_data = {
            'username': 'lelouch_v2',
            'email': 'zero@geass',
            'password': 'CodeGeass01',
            'password_confirm': 'CodeGeass01',
            'tel': '1234567890',
            'pref': self.pref.id,
        }
        # Assert that the form is not valid
        form = UserRegistrationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('email', form.errors)

    # Test password mismatch case
    def test_password_mismatch(self):
        # data with mismatched passwords
        form_data = {
            'username': 'ichigo_k',
            'email': 'ichigo.soulreaper@yahoo.com',
            'password': 'Zangetsu22',
            'password_confirm': 'Bankai22',
            'tel': '1234567890',
            'pref': self.pref.id,
        }
        form = UserRegistrationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('password_confirm', form.errors)

    # Test short password case
    def test_short_password(self):
        # data with short password <8
        form_data = {
            'username': 'eren_yeager',
            'email': 'eren@aot.com',
            'password': 'Mik@s6',  # less than 8 characters
            'password_confirm': 'Mik@s6',
            'tel': '0987654321',
            'pref': self.pref.id,
        }
        # Assert that the form is not valid
        form = UserRegistrationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('password', form.errors)

# Test password no uppercase
    def test_password_missing_uppercase(self):
        # data with missing uppercase
        form_data = {
            'username': 'john',
            'email': 'john@wwe.com',
            'password': 'johncena#17',
            'password_confirm': 'johncena#17',
            'tel': '0987654321',
            'pref': self.pref.id,
        }
        form = UserRegistrationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('password', form.errors)

# Test password no lowercase
    def test_password_missing_lowercase(self):
        form_data = {
            'username': 'john',
            'email': 'john@wwe.com',
            'password': 'JOHNCENA#17',
            'password_confirm': 'JOHNCENA#17',
            'tel': '0987654321',
            'pref': self.pref.id,
        }
        form = UserRegistrationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('password', form.errors)

# Test password no digits
    def test_password_missing_digit(self):
        form_data = {
            'username': 'goku',
            'email': 'goku@dbz.com',
            'password': 'gokuSSJ',
            'password_confirm': 'gokuSSJ',
            'tel': '0987654321',
            'pref': self.pref.id,
        }
        form = UserRegistrationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('password', form.errors)

# Test non-numeric phone
    def test_non_numeric_phone(self):
        form_data = {
            'username': 'gohan',
            'email': 'gohen@dbz.com',
            'password': 'gohanSSJ2',
            'password_confirm': 'gohanSSJ2',
            'tel': '34564sds32534',
            'pref': self.pref.id,
        }
        form = UserRegistrationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('tel', form.errors)

    


class RegistrationViewTest(TestCase):
    def setUp(self):
        # Create a Pref object for the test
        # This object will be used in the RegistrationFormTest and RegistrationViewTest
        # It will be deleted after the test is finished

        self.pref = Pref.objects.create(name="Osaka")
    
    # Test that the registration page is accessible
    def test_get_registration_page(self):
        response = self.client.get(reverse('register'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "新しいアカウントを登録する")

    # Test successful registration
    def test_successful_registration(self):
        form_data = {
            'username': 'eren_yeager',
            'email': 'titan.slayer@aot.com',
            'password': 'FreedomWings44',
            'password_confirm': 'FreedomWings44',
            'tel': '0987654321',
            'pref': self.pref.id,
        }
        # Make a POST request to the register view in the urls.py file
        response = self.client.post(reverse('register'), data=form_data)
        # Check that the user is redirected to the registration success page
        
        self.assertRedirects(response, reverse('registration_success'))
        # Check that the user with the email exists
        self.assertTrue(User.objects.filter(email='titan.slayer@aot.com').exists())



    



    


from django.test import TestCase
from django.urls import reverse
from .forms import UserRegistrationForm
from .models import User, Pref

class UserRegistrationFormTest(TestCase):
    def setUp(self):
        self.pref = Pref.objects.create(name="Tokyo")

    def test_valid_form(self):
        form_data = {
            'username': 'naruto_uzumaki',
            'email': 'hokage.naruto@gmail.com',
            'password': 'Rasengan99',
            'password_confirm': 'Rasengan99',
            'tel': '1234567890',
            'pref': self.pref.id,
        }
        form = UserRegistrationForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_invalid_username(self):
        form_data = {
            'username': 'l',
            'email': 'light.yagami@outlook.com',
            'password': 'DeathNote13',
            'password_confirm': 'DeathNote13',
            'tel': '5559876543',
            'pref': self.pref.id,
        }
        form = UserRegistrationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('username', form.errors)

    def test_invalid_email(self):
        User.objects.create_user(username='existing', email='duplicate@example.com', password='Password1')
        form_data = {
            'username': 'lelouch_v2',
            'email': 'zero@geass',
            'password': 'CodeGeass01',
            'password_confirm': 'CodeGeass01',
            'tel': '1234567890',
            'pref': self.pref.id,
        }
        form = UserRegistrationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('email', form.errors)

    def test_password_mismatch(self):
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

class RegistrationViewTest(TestCase):
    def setUp(self):
        self.pref = Pref.objects.create(name="Osaka")
    
    def test_get_registration_page(self):
        response = self.client.get(reverse('register'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "新しいアカウントを登録する")

    def test_successful_registration(self):
        form_data = {
            'username': 'eren_yeager',
            'email': 'titan.slayer@aot.com',
            'password': 'FreedomWings44',
            'password_confirm': 'FreedomWings44',
            'tel': '0987654321',
            'pref': self.pref.id,
        }
        response = self.client.post(reverse('register'), data=form_data)
        self.assertRedirects(response, reverse('registration_success'))
        self.assertTrue(User.objects.filter(email='titan.slayer@aot.com').exists())

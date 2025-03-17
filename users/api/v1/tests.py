
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from ...models import Pref, User


class PrefAPIViewTest(APITestCase):

    def setUp(self):
        self.pref1 = Pref.objects.create(name="Tokyo")
        self.pref2 = Pref.objects.create(name="Osaka")

    def test_get_prefectures(self):
        url = reverse('get_prefectures')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        json_data = response.json()

        self.assertIn('prefectures', json_data)
        self.assertEqual(len(json_data['prefectures']), 2)


        pref_names = {pref['name'] for pref in json_data['prefectures']}
        self.assertSetEqual(pref_names, {"Tokyo", "Osaka"})

class UserRegistrationAPIViewTest(APITestCase):
    def setUp(self):
        self.pref = Pref.objects.create(name="Tokyo")
        self.api_register_url = reverse('api_register')

    def test_successful_registration(self):
        data = {

            'username': 'naruto_uzumaki',
            'email': 'hokage.naruto@gmail.com',
            'password': 'Rasengan99',
            'password_confirm': 'Rasengan99',
            'tel': '1234567890',
            'pref': self.pref.id,
        }

        response = self.client.post(self.api_register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], data['username'])
        self.assertEqual(response.data['email'], data['email'])
        self.assertTrue(User.objects.filter(email=data['email']).exists())

    def test_password_mismatch(self):
        data = {

            'username': 'ichigo_k',
            'email': 'ichigo.soulreaper@yahoo.com',
            'password': 'Zangetsu22',
            'password_confirm': 'Bankai22',
            'tel': '1234567890',
            'pref': self.pref.id,
        }
        response = self.client.post(self.api_register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertIn('password_confirm', response.data)

    def test_duplicate_email(self):
        User.objects.create_user(
            username='lelouch_v2',
            email='zero@geass.com',
            password='CodeGeass01'
        )

        data = {
            'username': 'lelouch_v2',
            'email': 'zero@geass.com',
            'password': 'CodeGeass01',
            'password_confirm': 'CodeGeass01',
            'tel': '1234567890',
            'pref': self.pref.id,
        }
        response = self.client.post(self.api_register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)


# from rest_framework.test import APITestCase
# from django.urls import reverse
# from .models import User, Pref

# class UserRegistrationAPITest(APITestCase):
#     def setUp(self):
#         self.pref = Pref.objects.create(name="Kyoto")
#         self.url = reverse('register')

#     def test_registration_success(self):
#         data = {
#             'username': 'abc',
#             'email': 'abc@gmail.com',
#             'password': 'Japan123',
#             'password_confirm': 'Japan123',
#             'tel': '1234567899',
#             'pref': self.pref.id,
#         }
#         response = self.client.post(self.url, data, format='json')
#         self.assertEqual(response.status_code, 201)
#         self.assertTrue(User.objects.filter(email='apiuser@example.com').exists())
    
#     def test_registration_invalid_email(self):
#         data = {
#             'username': 'xyz',
#             'email': 'xyz@gmail',
#             'password': 'Japan123',
#             'password_confirm': 'Japan123',
#             'tel': '5551234567',
#             'pref': self.pref.id,
#         }
#         response = self.client.post(self.url, data, format='json')
#         print(response.data)

#         self.assertEqual(response.status_code, 400)
#         self.assertIn('email', response.data)
    
#     def test_password_mismatch(self):
#         data = {
#             'username': 'pqr',
#             'email': 'pqr@gmail.com',
#             'password': 'Japan123',
#             'password_confirm': 'Japan',
#             'tel': '5551234567',
#             'pref': self.pref.id,
#         }
#         response = self.client.post(self.url, data, format='json')
#         self.assertEqual(response.status_code, 400)
#         self.assertIn('password_confirm', response.data)

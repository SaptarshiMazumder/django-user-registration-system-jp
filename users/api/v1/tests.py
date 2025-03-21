from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from ...models import Pref, User


# Test class for the PrefAPIView.
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
    '''
    Test class for the UserRegistrationAPIView.
    '''
    
    def setUp(self):
     
        self.pref = Pref.objects.create(name="Tokyo")
        # Get the URL for the api_register view defined in the urls.py file in users/api/v1/ directory
        self.api_register_url = reverse('api_register')

    # Test successful registration case
    def test_successful_registration(self):
       
    # Data for successful registration
        data = {
            'username': 'naruto_uzumaki',
            'email': 'hokage.naruto@gmail.com',
            'password': 'Rasengan99',
            'password_confirm': 'Rasengan99',
            'tel': '1234567890',
            'pref': self.pref.id,
        }

        # Make a POST request to the api_register_url with the data
        response = self.client.post(
            self.api_register_url,
            data,
            format='json',
            
        )

        # Check that the response status code is 201
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check that the response data contains the username and email
        self.assertEqual(response.data['username'], data['username'])
        self.assertEqual(response.data['email'], data['email'])

        # Check that the user with the email exists
        self.assertTrue(User.objects.filter(email=data['email']).exists())

    # Test case for password mismatch
    def test_password_mismatch(self):
       
    #    Data for password mismatch
        data = {
            'username': 'ichigo_k',
            'email': 'ichigo.soulreaper@yahoo.com',
            'password': 'Zangetsu22',
            'password_confirm': 'Bankai22',
            'tel': '1234567890',
            'pref': self.pref.id,
        }
        # Make a POST request to the api_register_url with the data
        response = self.client.post(
            self.api_register_url,
            data,
            format='json',
            HTTP_X_PASSWORD=data['password'],
            HTTP_X_PASSWORD_CONFIRM=data['password_confirm']
        )

        # Check that there is a validation error in the response
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password_confirm', response.data)

    # Test case for duplicate email
    def test_duplicate_email(self):
        
        # Create a user with the email 
        User.objects.create_user(
            username='lelouch_v1',
            email='zero@geass.com',
            password='CodeGeass01'
        )

        # Data for registration with duplicate email
        data = {
            'username': 'lelouch_v2',
            'email': 'zero@geass.com',
            'password': 'CodeGeass01',
            'password_confirm': 'CodeGeass01',
            'tel': '1234567890',
            'pref': self.pref.id,
        }

        # Make a POST request to the api_register_url with the data
        response = self.client.post(self.api_register_url, data, format='json')

        # Check that there is a validation error in the response
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)


# Test case for duplicate username
    def test_duplicate_username(self):
       
    #    Create a user with the username
        User.objects.create_user(
            username='naruto',
            email='naruto@gmail.com',
            password='Naruto001'
        )

        # Data for registration with duplicate username
        data = {
            'username': 'naruto',
            'email': 'naruto@gmail.com',
            'password': 'Naruto001',
            'password_confirm': 'Naruto001',
            'tel': '1234567890',
            'pref': self.pref.id,
        }

        # Make a POST request to the api_register_url with the data
        response = self.client.post(self.api_register_url, data, format='json')

        # Check that there is a validation error in the response
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)


# Test case for invalid email format
    def test_invalid_email_format(self):
       
    #    Data for registration with invalid email format
        data = {
            'username': 'naruto',
            'email': 'naruto@gmail',
            'password': 'Naruto001',
            'password_confirm': 'Naruto001',
            'tel': '1234567890',
            'pref': self.pref.id,
        }

        # Make a POST request to the api_register_url with the data
        response = self.client.post(self.api_register_url, data, format='json')
        # Check that there is a validation error in the response
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)


# Test case for short username <3 characters
    def test_short_username(self):
       
    # Data for registration with short username
        data = {
            'username': 'ab',
            'email': 'ab@gmail.com',
            'password': 'Abc12345',
            'password_confirm': 'Abc12345',
            'tel': '1234567890',
            'pref': self.pref.id,
        }

        # Make a POST request to the api_register_url with the data
        response = self.client.post(self.api_register_url, data, format='json')
        # Check that there is a validation error in the response
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Check that the response contains the username
        self.assertIn('username', response.data)


#   Test case for short password <8 characters
    def test_short_password(self):
        
        # Data for registration with short password
        data = {
            'username': 'goku',
            'email': 'goku@dbz.com',
            'password': 'dbz',
            'password_confirm': 'dbz',
            'tel': '1234567890',
            'pref': self.pref.id,
        }
        # Make a POST request to the api_register_url with the data
        response = self.client.post(self.api_register_url, data, format='json')
        #   Check that there is a validation error in the response
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)


# Test case for password missing uppercase character
    def test_password_missing_uppercase(self):
        
        # Data for registration with password missing uppercase character
        data = {
            'username': 'goku',
            'email': 'goku@dbz.com',
            'password': 'gokussj3',
            'password_confirm': 'gokussj3',
            'tel': '1234567890',
            'pref': self.pref.id,
        }

        # Make a POST request to the api_register_url with the data
        response = self.client.post(self.api_register_url, data, format='json')

        # Check that there is a validation error in the response
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)


# Test case for password missing lowercase character
    def test_password_missing_lowercase(self):
        
        data = {
            'username': 'goku',
            'email': 'goku@dbz.com',
            'password': 'GOKUSSJ3',
            'password_confirm': 'GOKUSSJ3',
            'tel': '1234567890',
            'pref': self.pref.id,
        }
        # Make a POST request to the api_register_url with the data
        response = self.client.post(self.api_register_url, data, format='json')
        # Check that there is a validation error in the response
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

# Test case for password missing digit
    def test_password_missing_digit(self):
        # Data for registration with password missing digit
        data = {
            'username': 'vegeta',
            'email': 'vegeta@dbz.com',
            'password': 'finalflash',
            'password_confirm': 'finalFlash',
            'tel': '1234567890',
            'pref': self.pref.id,
        }
        # Make a POST request to the api_register_url with the data
        response = self.client.post(self.api_register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

# Test case for non-numeric phone number
    def test_non_numeric_phone(self):
       
        data = {
            'username': 'gohan ',
            'email': 'gohan@dbz.com',
            'password': 'gohanSSJ2',
            'password_confirm': 'gohanSSJ2',
            'tel': '43fg234434',
            'pref': self.pref.id,
        }

        #   Make a POST request to the api_register_url with the data
        response = self.client.post(self.api_register_url, data, format='json')
        # Check that there is a validation error in the response
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('tel', response.data)




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
        response = self.client.post(
            self.api_register_url,
            data,
            format='json',
            HTTP_X_PASSWORD=data['password'],
            HTTP_X_PASSWORD_CONFIRM=data['password_confirm']
        )
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
        response = self.client.post(
            self.api_register_url,
            data,
            format='json',
            HTTP_X_PASSWORD=data['password'],
            HTTP_X_PASSWORD_CONFIRM=data['password_confirm']
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password_confirm', response.data)

    def test_duplicate_email(self):
        User.objects.create_user(
            username='lelouch_v1',
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

    def test_duplicate_username(self):
        User.objects.create_user(
            username='naruto',
            email='naruto@gmail.com',
            password='Naruto001'
        )
        data = {
            'username': 'naruto',
            'email': 'naruto@gmail.com',
            'password': 'Naruto001',
            'password_confirm': 'Naruto001',
            'tel': '1234567890',
            'pref': self.pref.id,
        }
        response = self.client.post(self.api_register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_invalid_email_format(self):
        data = {
            'username': 'naruto',
            'email': 'naruto@gmail',
            'password': 'Naruto001',
            'password_confirm': 'Naruto001',
            'tel': '1234567890',
            'pref': self.pref.id,
        }
        response = self.client.post(self.api_register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_short_username(self):
        data = {
            'username': 'ab',
            'email': 'ab@gmail.com',
            'password': 'Abc12345',
            'password_confirm': 'Abc12345',
            'tel': '1234567890',
            'pref': self.pref.id,
        }
        response = self.client.post(self.api_register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_short_password(self):
        data = {
            'username': 'goku',
            'email': 'goku@dbz.com',
            'password': 'dbz',
            'password_confirm': 'dbz',
            'tel': '1234567890',
            'pref': self.pref.id,
        }
        response = self.client.post(self.api_register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_password_missing_uppercase(self):
        data = {
            'username': 'goku',
            'email': 'goku@dbz.com',
            'password': 'gokussj3',
            'password_confirm': 'gokussj3',
            'tel': '1234567890',
            'pref': self.pref.id,
        }
        response = self.client.post(self.api_register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_password_missing_lowercase(self):
        data = {
            'username': 'goku',
            'email': 'goku@dbz.com',
            'password': 'GOKUSSJ3',
            'password_confirm': 'GOKUSSJ3',
            'tel': '1234567890',
            'pref': self.pref.id,
        }
        response = self.client.post(self.api_register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_password_missing_digit(self):
        data = {
            'username': 'vegeta',
            'email': 'vegeta@dbz.com',
            'password': 'finalflash',
            'password_confirm': 'finalFlash',
            'tel': '1234567890',
            'pref': self.pref.id,
        }
        response = self.client.post(self.api_register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_non_numeric_phone(self):
        data = {
            'username': 'gohan ',
            'email': 'gohan@dbz.com',
            'password': 'gohanSSJ2',
            'password_confirm': 'gohanSSJ2',
            'tel': '43fg234434',
            'pref': self.pref.id,
        }
        response = self.client.post(self.api_register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('tel', response.data)

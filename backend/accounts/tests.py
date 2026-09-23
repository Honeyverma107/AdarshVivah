from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class AuthenticationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.email = "testuser@example.com"
        self.password = "SecurePass123!"
        self.user = User.objects.create_user(email=self.email, password=self.password)

        self.inactive_user = User.objects.create_user(
            email="inactiveuser@example.com", 
            password=self.password,
            is_active=False
        )

    def test_login_missing_email(self):
        response = self.client.post('/api/auth/login/', {'password': self.password}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_missing_password(self):
        response = self.client.post('/api/auth/login/', {'email': self.email}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_invalid_email(self):
        response = self.client.post('/api/auth/login/', {'email': 'nonexistent@example.com', 'password': self.password}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data.get('detail'), 'Invalid email or password.')

    def test_login_invalid_password(self):
        response = self.client.post('/api/auth/login/', {'email': self.email, 'password': 'WrongPassword'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data.get('detail'), 'Invalid email or password.')

    def test_login_inactive_account(self):
        response = self.client.post('/api/auth/login/', {'email': self.inactive_user.email, 'password': self.password}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data.get('detail'), 'This account is inactive.')

    def test_valid_login(self):
        response = self.client.post('/api/auth/login/', {'email': self.email, 'password': self.password}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], self.email)
        self.assertNotIn('password', response.data['user'])

    def test_protected_me_endpoint_with_valid_token(self):
        login_res = self.client.post('/api/auth/login/', {'email': self.email, 'password': self.password}, format='json')
        token = login_res.data['access']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        res = self.client.get('/api/auth/me/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['email'], self.email)

    def test_protected_me_endpoint_without_token(self):
        self.client.credentials() # reset headers
        res = self.client.get('/api/auth/me/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_refresh(self):
        login_res = self.client.post('/api/auth/login/', {'email': self.email, 'password': self.password}, format='json')
        refresh_token = login_res.data['refresh']

        res = self.client.post('/api/auth/token/refresh/', {'refresh': refresh_token}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('access', res.data)

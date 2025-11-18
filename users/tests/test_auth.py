from django.urls import reverse
from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.test import APITestCase


User = get_user_model()

class AuthTests(APITestCase):

    def test_user_registration(self):
        data = {
            "username": "john",
            "email": "jane@example.com",
            "password": "StrongPass123!",
            "password2": "StrongPass123!",
            "role": "member"
        }
        url = reverse('user-register')
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.first().email, "jane@example.com")

    def test_user_login(self):
        user = User.objects.create_user(
            username="john",
            email="jane@example.com",
            password="StrongPass123!"
        )

        data = {
            "username": "john",
            "password": "StrongPass123!"
        }
        url = reverse('token-obtain-pair')
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_password_change(self):
        user = User.objects.create_user(
            username="john",
            password="OldPass123!"
        )

        self.client.force_authenticate(user=user)

        url = reverse("password-change")
        data = {
            "old_password": "OldPass123!",
            "new_password": "NewPass222!",
            "new_password2": "NewPass222!"
        }

        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_can_access_user_list(self):
        admin = User.objects.create_user(
            username="admin",
            password="AdminPass123!",
            role="admin"
        )

        self.client.force_authenticate(user=admin)

        url = reverse('user-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

    def test_member_cannot_access_user_list(self):
        member = User.objects.create_user(
            username="member",
            password="Pass123!",
            role="member"
        )

        self.client.force_authenticate(user=member)

        url = reverse('user-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 403)


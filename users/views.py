from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import (CustomTokenObtainPairSerializer,
                          UserRegistrationSerializer)
from .permissions import IsAdmin, IsManager, IsMember, IsAdminOrManager

User = get_user_model()


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserRegistrationSerializer

    def get_object(self):
        return self.request.user


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAdmin]
    authentication_classes = [JWTAuthentication] 
    serializer_class = UserRegistrationSerializer
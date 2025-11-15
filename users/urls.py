from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import CustomTokenObtainPairView, UserProfileView, UserRegistrationView, UserListView

urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="user-register"),
    path("login/", CustomTokenObtainPairView.as_view(), name="token-obtain-pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path("all/", UserListView.as_view(), name="user-list"),
]

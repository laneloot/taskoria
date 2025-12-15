from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from django.utils.encoding import smart_str, force_bytes, smart_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .utils import email_verification_token

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ("username", "password", "password2", "email", "role", "avatar", "bio")
        # extra_kwargs = {
        #     'email': {'required': True},
        #     'role': {'required': False},
        #     'avatar': {'required': False},
        #     'bio': {'required': False},
        # }

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        user = User.objects.create_user(**validated_data)
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["username"] = user.username
        token["role"] = user.role
        return token

    def validate(self, attrs):
        """
        Allow both username and email based logins by translating the provided
        identifier into the username SimpleJWT expects before delegating to
        the default validator.
        """
        identifier = attrs.get(self.username_field)
        if identifier and "@" in identifier:
            try:
                user = User.objects.get(email__iexact=identifier)
            except User.DoesNotExist:
                user = None

            if user:
                attrs[self.username_field] = getattr(user, self.username_field)

        data = super().validate(attrs)

        # Add extra responses here
        data["username"] = self.user.username
        data["email"] = self.user.email
        data["role"] = self.user.role
        return data

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["new_password2"]:
            raise serializers.ValidationError(
                {"new_password": "New password fields didn't match."}
            )
        return attrs

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, attrs):
        email = attrs['email']
        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError("User with this email does not exist.")
        return attrs

class SetNewPasswordSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField()

    def validate(self, attrs):
        try:
            uid = smart_str(urlsafe_base64_decode(attrs['uidb64']))
            user = User.objects.get(pk=uid)
        except:
            raise serializers.ValidationError("Invalid UID")

        if not PasswordResetTokenGenerator().check_token(user, attrs['token']):
            raise serializers.ValidationError("Invalid or expired token")

        validate_password(attrs["new_password"])
        attrs["user"] = user
        return attrs

    def save(self):
        user = self.validated_data["user"]
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user

class EmailVerificationSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()


class UserProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(allow_null=True, required=False)
    bio = serializers.CharField(allow_blank=True, required=False)

    class Meta:
        model = User
        fields = ("username", "email", "role", "avatar", "bio")
        read_only_fields = ("role",)

    def validate_email(self, value):
        request = self.context.get("request")
        user = getattr(request, "user", None) or self.instance
        if value and user:
            if User.objects.filter(email__iexact=value).exclude(pk=user.pk).exists():
                raise serializers.ValidationError("A user with this email already exists.")
        return value

    def to_representation(self, instance):
        data = super().to_representation(instance)
        avatar = data.get("avatar")
        request = self.context.get("request")
        if avatar and request:
            data["avatar"] = request.build_absolute_uri(avatar)
        return data

from .base import *

DEBUG = False
ALLOWED_HOSTS = ["yourdomain.com"]  # Change to your production domain

# PostgreSQL settings from env
DATABASES["default"].update(
    {
        "HOST": config("DB_HOST", default="db"),
        "USER": config("DB_USER"),
        "PASSWORD": config("DB_PASSWORD"),
        "NAME": config("DB_NAME"),
        "PORT": config("DB_PORT", default="5432"),
    }
)

# Security
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = True

# CORS
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = ["https://yourdomain.com"]

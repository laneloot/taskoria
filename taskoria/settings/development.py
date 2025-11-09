from .base import *

DEBUG = True
ALLOWED_HOSTS = ["*"]

# Optional: override DB if needed for local
DATABASES["default"].update({"HOST": config("DB_HOST", default="localhost")})

# Static files
STATICFILES_DIRS = [BASE_DIR / "static"]

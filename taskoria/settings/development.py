from .base import *

DEBUG = True
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

# Optional: override DB if needed for local
DATABASES["default"].update({"HOST": "localhost"})

# Static files
STATICFILES_DIRS = [BASE_DIR / "static"]

# flake8: noqa

from .dev import *

# Override settings here

DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ROOT_DIR / "db.sqlite3"}}

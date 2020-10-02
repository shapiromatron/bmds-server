# flake8: noqa

from .dev import *


INSTALLED_APPS = [app for app in INSTALLED_APPS if app != "debug_toolbar"]
MIDDLEWARE = [middleware for middleware in MIDDLEWARE if "debug_toolbar" not in middleware]

TEST_DB_FIXTURE = ROOT_DIR / "tests/data/db.yaml"
DATABASES["default"]["NAME"] = "bmds-online-test"

PASSWORD_HASHERS = ("django.contrib.auth.hashers.MD5PasswordHasher",)

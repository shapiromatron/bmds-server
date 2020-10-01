# flake8: noqa

from .dev import *


TEST_DB_FIXTURE = ROOT_DIR / "tests/data/db.yaml"


DATABASES = {
    "default": {"ENGINE": "django.db.backends.sqlite3", "NAME": str(ROOT_DIR / "db.test.sqlite3"),}
}

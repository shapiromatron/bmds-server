# flake8: noqa

import os
from datetime import datetime
from pathlib import Path
from subprocess import CalledProcessError

from ...common.git import Commit
from ..constants import SkinStyle

PROJECT_NAME = "bmds-server"
BASE_DIR = Path(__file__).parents[2].resolve()
ROOT_DIR = Path(__file__).parents[3].resolve()

# data paths
PUBLIC_DATA_ROOT = Path(os.environ.get("PUBLIC_DATA_ROOT", ROOT_DIR / "public"))
PRIVATE_DATA_ROOT = Path(os.environ.get("PRIVATE_DATA_ROOT", ROOT_DIR / "private"))
LOGS_PATH = Path(os.environ.get("LOGS_PATH", ROOT_DIR / "logs"))

# make sure these paths exist
PUBLIC_DATA_ROOT.mkdir(exist_ok=True, parents=False)
PRIVATE_DATA_ROOT.mkdir(exist_ok=True, parents=False)
LOGS_PATH.mkdir(exist_ok=True, parents=False)

SKIN = SkinStyle.Base

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # 3rd party apps
    "rest_framework",
    "rest_framework.authtoken",
    "webpack_loader",
    # Custom apps
    "bmds_server.common",
    "bmds_server.analysis",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "bmds_server.analysis.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [str(BASE_DIR / "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "bmds_server.main.context_processors.from_settings",
            ]
        },
    }
]

WSGI_APPLICATION = "bmds_server.main.wsgi.application"
SECRET_KEY = "io^^q^q1))7*r0u@6i+6kx&ek!yxyf6^5vix_6io6k4kdn@@5t"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DJANGO_DB_NAME", "bmds-online"),
        "USER": os.getenv("DJANGO_DB_USER", "bmds-online"),
        "PASSWORD": os.getenv("DJANGO_DB_PW", "password"),
        "HOST": os.getenv("DJANGO_DB_HOST", "localhost"),
        "PORT": os.getenv("DJANGO_DB_PORT", "5432"),
    }
}
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
LOGIN_URL = "admin:login"

# add randomness to url prefix to prevent easy access
ADMIN_URL_PREFIX = "8v99wgnw7"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_L10N = True
USE_TZ = True

EMAIL_SUBJECT_PREFIX = f"[{PROJECT_NAME}] "
DEFAULT_FROM_EMAIL = f"webmaster@{PROJECT_NAME}.com"

STATIC_URL = "/static/"
STATICFILES_DIRS = [str(BASE_DIR / "static")]

STATIC_ROOT = str(PUBLIC_DATA_ROOT / "static")
MEDIA_ROOT = str(PUBLIC_DATA_ROOT / "media")

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "filters": {"require_debug_false": {"()": "django.utils.log.RequireDebugFalse"}},
    "formatters": {"basic": {"format": "%(asctime)s %(name)-20s %(levelname)-8s %(message)s"}},
    "handlers": {
        "mail_admins": {
            "level": "ERROR",
            "filters": ["require_debug_false"],
            "class": "django.utils.log.AdminEmailHandler",
        },
        "console": {"level": "DEBUG", "class": "logging.StreamHandler", "formatter": "basic"},
        "file": {
            "level": "DEBUG",
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "basic",
            "filename": str(LOGS_PATH / "django.log"),
            "maxBytes": 10 * 1024 * 1024,  # 10 MB
            "backupCount": 10,
        },
        "null": {"class": "logging.NullHandler"},
    },
    "loggers": {
        "django.security.DisallowedHost": {"handlers": ["null"], "propagate": False},
        "django.request": {
            "handlers": ["console", "mail_admins"],
            "level": "ERROR",
            "propagate": True,
        },
        "": {"handlers": ["file"], "level": "DEBUG"},
    },
}

# Session and authentication
SESSION_ENGINE = "django.contrib.sessions.backends.cached_db"

# Celery
CELERYD_HIJACK_ROOT_LOGGER = False
CELERY_SEND_TASK_ERROR_EMAILS = True
CELERY_TASK_ACKS_LATE = True
CELERY_TASK_SOFT_TIME_LIMIT = 300
CELERY_TASK_TIME_LIMIT = 360
CELERY_TIMEZONE = TIME_ZONE
CELERY_WORKER_MAX_TASKS_PER_CHILD = 100
CELERY_WORKER_PREFETCH_MULTIPLIER = 1

# Cache settings
DISK_CACHE_NAME = "disk"
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "TIMEOUT": 60 * 10,  # 10 minutes (in seconds)
    },
    DISK_CACHE_NAME: {
        "BACKEND": "diskcache.DjangoCache",
        "LOCATION": f"{PRIVATE_DATA_ROOT}/diskcache/",
        "TIMEOUT": 60 * 60 * 24 * 7,  # 1 week
    },
}

REST_FRAMEWORK = {
    "DEFAULT_THROTTLE_CLASSES": (
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ),
    "DEFAULT_THROTTLE_RATES": {"anon": "120/minute", "user": "120/minute"},
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ),
}

WEBPACK_LOADER = {
    "DEFAULT": {
        "BUNDLE_DIR_NAME": "bundles/",
        "STATS_FILE": str(ROOT_DIR / "webpack-stats.json"),
        "POLL_INTERVAL": 0.1,
        "IGNORE": [".+/.map"],
    }
}

DAYS_TO_KEEP_ANALYSES = 180


# commit information
def get_git_commit() -> Commit:
    if GIT_COMMIT_FILE.exists():
        return Commit.parse_file(GIT_COMMIT_FILE)
    try:
        return Commit.current(str(ROOT_DIR))
    except (CalledProcessError, FileNotFoundError):
        return Commit(sha="<undefined>", dt=datetime.now())


GIT_COMMIT_FILE = ROOT_DIR / ".gitcommit"
COMMIT = get_git_commit()

# Google Tag Manager settings
GTM_ID = os.getenv("GTM_ID")

TEST_DB_FIXTURE = ROOT_DIR / "tests/data/db.yaml"
CONTACT_US_LINK = os.getenv("CONTACT_US_LINK", "")

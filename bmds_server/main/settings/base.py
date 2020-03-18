# flake8: noqa

import os
from pathlib import Path

from decouple import config

PROJECT_NAME = "bmds-server"
BASE_DIR = Path(__file__).parents[2].resolve()
ROOT_DIR = Path(__file__).parents[3].resolve()


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
    "bmds_server.jobrunner",
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

ROOT_URLCONF = "bmds_server.jobrunner.urls"

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
            ]
        },
    }
]

WSGI_APPLICATION = "bmds_server.main.wsgi.application"

DATABASES = {
    "default": {"ENGINE": "django.db.backends.sqlite3", "NAME": str(ROOT_DIR / "db.sqlite3"),}
}

LOGIN_URL = "admin:login"

# add randomness to url prefix to prevent easy access
ADMIN_URL_PREFIX = os.getenv("ADMIN_URL_PREFIX", "f09ea0b8-c3d5-4ff9-86c4-27f00e8f643d")

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

HTTP_PLATFORM_PORT = config("HTTP_PLATFORM_PORT", default=80, cast=int)
STATIC_URL = "/static/"
STATICFILES_DIRS = [str(BASE_DIR / "static")]

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
            "filename": str(ROOT_DIR / "django.log"),
            "maxBytes": 10 * 1024 * 1024,  # 10 MB
            "backupCount": 10,
        },
        "null": {"class": "logging.NullHandler"},
    },
    "loggers": {
        "django.security.DisallowedHost": {"handlers": ["null"], "propagate": False},
        "django.request": {"handlers": ["mail_admins"], "level": "ERROR", "propagate": True},
        "": {"handlers": ["file"], "level": "DEBUG"},
    },
}

CELERYD_HIJACK_ROOT_LOGGER = False
CELERY_ACCEPT_CONTENT = ["application/json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_SEND_TASK_ERROR_EMAILS = True
CELERY_TIMEZONE = TIME_ZONE


REST_FRAMEWORK = {
    "DEFAULT_THROTTLE_CLASSES": (
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ),
    "DEFAULT_THROTTLE_RATES": {"anon": "120/minute", "user": "120/minute"},
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.BasicAuthentication",
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

DAYS_TO_KEEP_JOBS = 7

ALLOW_BLOCKING_BMDS_REQUESTS = config("ALLOW_BLOCKING_BMDS_REQUESTS", default=False, cast=bool)

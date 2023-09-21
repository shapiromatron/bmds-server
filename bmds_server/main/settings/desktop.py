import os
from pathlib import Path

from ..constants import get_app_home
from .base import *  # noqa: F403

APP_HOME = get_app_home()
ALLOWED_HOSTS = ["*"]
IS_DESKTOP = True

PUBLIC_DATA_ROOT = APP_HOME / "public"
LOGS_PATH = APP_HOME / "logs"
STATIC_ROOT = PUBLIC_DATA_ROOT / "static"
MEDIA_ROOT = PUBLIC_DATA_ROOT / "media"

PUBLIC_DATA_ROOT.mkdir(exist_ok=True, parents=False)
LOGS_PATH.mkdir(exist_ok=True, parents=False)

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.getenv("bmds_db_path", APP_HOME / "db.sqlite3"),
        "STARTUP_OPTIONS": {"init_command": "PRAGMA journal_mode=wal;"},
    }
}

LOGGING = {
    "version": 1,
    "disable_existing_loggers": True,
    "filters": {"require_debug_false": {"()": "django.utils.log.RequireDebugFalse"}},
    "formatters": {"basic": {"format": "%(levelname)s %(asctime)s %(name)s %(message)s"}},
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
        "requests": {
            "level": "INFO",
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "basic",
            "filename": str(LOGS_PATH / "requests.log"),
            "maxBytes": 10 * 1024 * 1024,  # 10 MB
            "backupCount": 10,
        },
        "null": {"class": "logging.NullHandler"},
    },
    "loggers": {
        "": {"handlers": ["null"], "level": "INFO"},
        "django": {"handlers": ["null"], "propagate": False, "level": "INFO"},
        "django.request": {"handlers": ["console"], "level": "ERROR", "propagate": True},
        "bmds_server": {"handlers": ["console"], "propagate": False, "level": "INFO"},
        "bmds_server.request": {"handlers": ["console"], "propagate": False, "level": "INFO"},
    },
}

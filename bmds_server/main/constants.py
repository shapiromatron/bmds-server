from enum import Enum, IntEnum


class AuthProvider(str, Enum):
    django = "django"
    external = "external"


class SkinStyle(IntEnum):
    Base = 0
    EPA = 1

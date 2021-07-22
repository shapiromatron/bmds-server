from datetime import datetime


def to_timestamp(dt: datetime) -> str:
    return dt.strftime("%Y-%b-%d %H:%m %Z")

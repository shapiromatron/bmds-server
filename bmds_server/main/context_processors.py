from django.conf import settings

from .constants import SkinStyle


def from_settings(request):
    return dict(
        SKIN=settings.SKIN,
        SkinStyleEnum=SkinStyle,
        SERVER_ROLE=settings.SERVER_ROLE,
        SERVER_BANNER_COLOR=settings.SERVER_BANNER_COLOR,
        CONTACT_US_EMAIL=settings.CONTACT_US_LINK,
        commit=settings.COMMIT,
    )

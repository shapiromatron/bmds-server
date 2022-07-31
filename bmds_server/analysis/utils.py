from textwrap import dedent

from bmds.utils import get_latest_dll_version
from django.conf import settings
from django.utils.timezone import now


def get_citation() -> str:
    """
    Return a citation for the software.
    """
    year = now().strftime("%Y")
    accessed = now().strftime("%B %d, %Y")
    sha = settings.COMMIT.sha
    bmds_version = get_latest_dll_version()
    uri = settings.WEBSITE_URI
    return dedent(
        f"""\
        United States Environmental Protection Agency. ({year}). BMDS-Online (Build {sha}; Model
        Library Version {bmds_version}) [Web App]. Available from {uri}. Accessed {accessed}."""
    )

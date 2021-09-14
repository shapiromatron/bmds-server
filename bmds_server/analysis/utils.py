import random
import string
from textwrap import dedent

from django.conf import settings
from django.utils.timezone import now

_random_string_pool = string.ascii_lowercase + string.digits


def random_string(samples: str = _random_string_pool, length: int = 12) -> str:
    """
    Generate a random string on specific length.

    Args:
        samples (str, optional): Random characters to select from.
        length (int, optional): Size of generated string; defaults to 12.
    """
    return "".join(random.choices(_random_string_pool, k=length))


def get_citation(uri: str) -> str:
    """
    Return a citation for the software.
    """
    year = now().strftime("%Y")
    accessed = now().strftime("%B %d, %Y")
    sha = settings.COMMIT.sha
    bmds_version = "2021.09"
    return dedent(
        f"""\
        United States Environmental Protection Agency. ({year}). BMDS-Online (Build {sha}; Model
        Library Version {bmds_version}) [Web App]. Available from {uri}. Accessed {accessed}."""
    )

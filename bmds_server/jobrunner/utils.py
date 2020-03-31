import random
import string

_random_string_pool = string.ascii_lowercase + string.digits


def random_string(samples: str = _random_string_pool, length: int = 12) -> str:
    """
    Generate a random string on specific length.

    Args:
        samples (str, optional): Random characters to select from.
        length (int, optional): Size of generated string; defaults to 12.
    """
    return "".join(random.choices(_random_string_pool, k=length))

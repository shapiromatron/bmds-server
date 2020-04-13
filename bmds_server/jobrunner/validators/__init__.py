import json

import bmds
from django.core.exceptions import ValidationError

from .session import validate_session
from .datasets import validate_datasets
from .models import validate_models
from .options import validate_bmrs, validate_options


def validate_input(payload: str) -> None:
    """
    Validate input payload.

    Args:
        payload (str): a JSON str

    Raises:
        ValidationError: Raises validation error if any errors found
    """

    try:
        data = json.loads(payload)
    except json.decoder.JSONDecodeError:
        raise ValidationError("Invalid format - must be valid JSON.")

    # check session
    validate_session(data)
    bmds_version = data["bmds_version"]
    dataset_type = data["dataset_type"]

    # check dataset schema
    validate_datasets(dataset_type, data["datasets"])

    # check model schema
    validate_models(bmds_version, dataset_type, data.get("models"))

    if bmds_version in bmds.constants.BMDS_TWOS:
        validate_bmrs(dataset_type, data.get("bmr"))

    if bmds_version in bmds.constants.BMDS_THREES:
        validate_options(dataset_type, data.get("options"))


def validate_preferences(data) -> None:
    pass

import json
from typing import Dict

import bmds
from django.core.exceptions import ValidationError

from .datasets import validate_datasets
from .models import validate_models
from .options import validate_options
from .session import validate_session


def validate_input(data: Dict, partial: bool = False) -> None:
    """
    Validate input payload.

    Args:
        data (Dict): the data payload
        partial (bool): validate a partial input

    Raises:
        ValidationError: Raises validation error if any errors found
    """
    # check session
    validate_session(data, partial=partial)
    bmds_version = data["bmds_version"]
    dataset_type = data["dataset_type"]

    # check dataset schema
    datasets = data.get("datasets")
    if datasets or partial is False:
        validate_datasets(dataset_type, datasets)

    # check model schema
    models = data.get("models")
    if models or partial is False:
        validate_models(bmds_version, dataset_type, models)

    options = data.get("options")
    if options or (partial is False and bmds_version in bmds.constants.BMDS_THREES):
        validate_options(dataset_type, data.get("options"))


def validate_preferences(data) -> None:
    pass

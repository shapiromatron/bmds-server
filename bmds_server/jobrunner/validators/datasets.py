from typing import Any, Union

import bmds
import jsonschema
from bmds.datasets import (
    ContinuousDatasetSchema,
    ContinuousIndividualDatasetSchema,
    DichotomousDatasetSchema,
)
from django.core.exceptions import ValidationError
from pydantic import BaseModel, conlist


class DichotomousDatasets(BaseModel):
    datasets: conlist(DichotomousDatasetSchema, min_items=1, max_items=10)


class ContinuousDatasets(BaseModel):
    datasets: conlist(
        Union[ContinuousDatasetSchema, ContinuousIndividualDatasetSchema], min_items=1, max_items=10
    )


def validate_datasets(dataset_type: str, datasets: Any):
    if dataset_type in bmds.constants.CONTINUOUS_DTYPES:
        schema = ContinuousDatasets.schema()
    elif dataset_type in bmds.constants.DICHOTOMOUS_DTYPES:
        schema = DichotomousDatasets.schema()
    else:
        raise ValidationError(f"Unknown dataset type: {dataset_type}")

    try:
        jsonschema.validate({"datasets": datasets}, schema)
    except jsonschema.ValidationError as err:
        raise ValidationError(err.message)

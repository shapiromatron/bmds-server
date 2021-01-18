from enum import Enum
from typing import Any, Union

import bmds
from bmds.datasets import (
    ContinuousDatasetSchema,
    ContinuousIndividualDatasetSchema,
    DichotomousDatasetSchema,
)
from django.core.exceptions import ValidationError
from pydantic import BaseModel, conlist, root_validator

from ...common.validation import pydantic_validate


class AdverseDirection(str, Enum):
    AUTOMATIC = "automatic"
    UP = "up"
    DOWN = "down"


class DichotomousModelOptions(BaseModel):
    datasetId: int
    enabled: bool = True


class ContinuousModelOptions(BaseModel):
    datasetId: int
    enabled: bool = True
    adverse_direction: AdverseDirection = AdverseDirection.AUTOMATIC


class DatasetValidator(BaseModel):
    @root_validator
    def check_id_matches(cls, values):
        dataset_ids = [dataset.metadata.id for dataset in values["datasets"]]
        ds_option_ids = [opt.datasetId for opt in values["dataset_options"]]
        if len(set(dataset_ids)) != len(dataset_ids):
            raise ValueError("Dataset IDs are not unique")
        if set(dataset_ids) != set(ds_option_ids):
            raise ValueError("Dataset IDs are not the same as dataset option IDs")
        return values


class DichotomousDatasets(DatasetValidator):
    dataset_options: conlist(DichotomousModelOptions, min_items=1, max_items=10)
    datasets: conlist(DichotomousDatasetSchema, min_items=1, max_items=10)


class ContinuousDatasets(DatasetValidator):
    dataset_options: conlist(ContinuousModelOptions, min_items=1, max_items=10)
    datasets: conlist(
        Union[ContinuousDatasetSchema, ContinuousIndividualDatasetSchema], min_items=1, max_items=10
    )


def validate_datasets(dataset_type: str, datasets: Any, datasetOptions: Any):
    if dataset_type in bmds.constants.CONTINUOUS_DTYPES:
        schema = ContinuousDatasets
    elif dataset_type in bmds.constants.DICHOTOMOUS_DTYPES:
        schema = DichotomousDatasets
    else:
        raise ValidationError(f"Unknown dataset type: {dataset_type}")

    data = {"datasets": datasets, "dataset_options": datasetOptions}
    pydantic_validate(data, schema)

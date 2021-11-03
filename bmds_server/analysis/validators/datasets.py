from enum import IntEnum
from typing import Any, Union

import bmds
from bmds.datasets import (
    ContinuousDatasetSchema,
    ContinuousIndividualDatasetSchema,
    DichotomousDatasetSchema,
    NestedDichotomousDatasetSchema,
)
from django.core.exceptions import ValidationError
from pydantic import BaseModel, conlist, root_validator

from ...common.validation import pydantic_validate


class MaxDegree(IntEnum):
    N_MINUS_ONE = 0
    ONE = 1
    TWO = 2
    THREE = 3
    FOUR = 4
    FIVE = 5
    SIX = 6
    SEVEN = 7
    EIGHT = 8


class AdverseDirection(IntEnum):
    AUTOMATIC = -1
    UP = 1
    DOWN = 0


class DichotomousModelOptions(BaseModel):
    dataset_id: int
    enabled: bool = True
    degree: MaxDegree = MaxDegree.N_MINUS_ONE


class ContinuousModelOptions(BaseModel):
    dataset_id: int
    enabled: bool = True
    adverse_direction: AdverseDirection = AdverseDirection.AUTOMATIC
    degree: MaxDegree = MaxDegree.N_MINUS_ONE


class NestedDichotomousModelOptions(BaseModel):
    dataset_id: int
    enabled: bool = True


class DatasetValidator(BaseModel):
    @root_validator(skip_on_failure=True)
    def check_id_matches(cls, values):
        dataset_ids = [dataset.metadata.id for dataset in values["datasets"]]
        ds_option_ids = [opt.dataset_id for opt in values["dataset_options"]]
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


class NestedDichotomousDataset(DatasetValidator):
    dataset_options: conlist(NestedDichotomousModelOptions, min_items=1, max_items=10)
    datasets: conlist(NestedDichotomousDatasetSchema, min_items=1, max_items=10)


def validate_datasets(dataset_type: str, datasets: Any, datasetOptions: Any):
    if dataset_type in bmds.constants.CONTINUOUS_DTYPES:
        schema = ContinuousDatasets
    elif dataset_type in bmds.constants.DICHOTOMOUS_DTYPES:
        schema = DichotomousDatasets
    elif dataset_type == bmds.constants.NESTED_DICHOTOMOUS:
        schema = NestedDichotomousDataset
    else:
        raise ValidationError(f"Unknown dataset type: {dataset_type}")

    data = {"datasets": datasets, "dataset_options": datasetOptions}
    pydantic_validate(data, schema)

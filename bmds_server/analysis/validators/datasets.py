from enum import IntEnum
from typing import Annotated, Any, ClassVar, List

import bmds
from bmds.datasets import (
    ContinuousDatasetSchema,
    ContinuousIndividualDatasetSchema,
    DichotomousDatasetSchema,
    NestedDichotomousDatasetSchema,
)
from django.core.exceptions import ValidationError
from pydantic import BaseModel, Field, model_validator

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
    # @model_validator(skip_on_failure=True)
    @classmethod
    def check_id_matches(cls, values):
        dataset_ids = [dataset.metadata.id for dataset in values["datasets"]]
        ds_option_ids = [opt.dataset_id for opt in values["dataset_options"]]
        if len(set(dataset_ids)) != len(dataset_ids):
            raise ValueError("Dataset IDs are not unique")
        if set(dataset_ids) != set(ds_option_ids):
            raise ValueError("Dataset IDs are not the same as dataset option IDs")
        return values


class MaxDichotomousDatasetSchema(DichotomousDatasetSchema):
    MAX_N: ClassVar = 30


class MaxContinuousDatasetSchema(ContinuousDatasetSchema):
    MAX_N: ClassVar = 30


class MaxContinuousIndividualDatasetSchema(ContinuousIndividualDatasetSchema):
    MIN_N: ClassVar = 5
    MAX_N: ClassVar = 1000


class MaxNestedDichotomousDatasetSchema(NestedDichotomousDatasetSchema):
    MAX_N: ClassVar = 1000


class DichotomousDatasets(DatasetValidator):
    dataset_options: Annotated[list[DichotomousModelOptions], Field(min_length=1, max_length=10)]
    datasets: Annotated[list[MaxDichotomousDatasetSchema], Field(min_length=1, max_length=10)]


class ContinuousDatasets(DatasetValidator):
    dataset_options: Annotated[list[ContinuousModelOptions], Field(min_length=1, max_length=10)]
    datasets: Annotated[
        list[MaxContinuousDatasetSchema | MaxContinuousIndividualDatasetSchema],
        Field(
            min_length=1,
            max_length=10,
        ),
    ]


class NestedDichotomousDataset(DatasetValidator):
    dataset_options: Annotated[
        list[NestedDichotomousModelOptions], Field(min_length=1, max_length=10)
    ]
    datasets: Annotated[list[MaxNestedDichotomousDatasetSchema], Field(min_length=1, max_length=10)]


class MultiTumorDatasets(DatasetValidator):
    dataset_options: Annotated[list[DichotomousModelOptions], Field(min_length=2, max_length=10)]
    datasets: Annotated[list[DichotomousDatasetSchema], Field(min_length=2, max_length=10)]


def validate_datasets(dataset_type: str, datasets: Any, datasetOptions: Any):
    if dataset_type in bmds.constants.CONTINUOUS_DTYPES:
        schema = ContinuousDatasets
    elif dataset_type in bmds.constants.DICHOTOMOUS_DTYPES:
        schema = DichotomousDatasets
    elif dataset_type == bmds.constants.NESTED_DICHOTOMOUS:
        schema = NestedDichotomousDataset
    elif dataset_type == bmds.constants.MULTI_TUMOR:
        schema = MultiTumorDatasets
    else:
        raise ValidationError(f"Unknown dataset type: {dataset_type}")

    data = {"datasets": datasets, "dataset_options": datasetOptions}
    pydantic_validate(data, schema)

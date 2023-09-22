from typing import List, Any

import bmds
from bmds.bmds3.constants import DistType
from bmds.bmds3.types.continuous import ContinuousRiskType
from bmds.bmds3.types.dichotomous import DichotomousRiskType
from bmds.bmds3.types.nested_dichotomous import NestedDichotomousLSCType
from django.core.exceptions import ValidationError
from pydantic import Field, BaseModel

from ...common.validation import pydantic_validate
from typing_extensions import Annotated


class DichotomousOption(BaseModel):
    bmr_type: DichotomousRiskType
    bmr_value: float
    confidence_level: Annotated[float, Field(ge=0.5, le=1)]


class ContinuousOption(BaseModel):
    bmr_type: ContinuousRiskType
    bmr_value: float
    tail_probability: Annotated[float, Field(ge=0, le=1)]
    confidence_level: Annotated[float, Field(ge=0.5, le=1)]
    dist_type: DistType


class NestedDichotomousOption(BaseModel):
    bmr_type: DichotomousRiskType
    bmr_value: float
    confidence_level: Annotated[float, Field(ge=0.5, le=1)]
    litter_specific_covariate: NestedDichotomousLSCType
    bootstrap_iterations: int
    bootstrap_seed: int


class DichotomousOptions(BaseModel):
    options: Annotated[List[DichotomousOption], Field(min_length=1, max_length=10)]


class ContinuousOptions(BaseModel):
    options: Annotated[List[ContinuousOption], Field(min_length=1, max_length=10)]


class NestedDichotomousOptions(BaseModel):
    options: Annotated[List[NestedDichotomousOption], Field(min_length=1, max_length=3)]


def validate_options(dataset_type: str, data: Any):
    if dataset_type in bmds.constants.DICHOTOMOUS_DTYPES:
        schema = DichotomousOptions
    elif dataset_type in bmds.constants.CONTINUOUS_DTYPES:
        schema = ContinuousOptions
    elif dataset_type == bmds.constants.NESTED_DICHOTOMOUS:
        schema = NestedDichotomousOptions
    elif dataset_type == bmds.constants.MULTI_TUMOR:
        schema = DichotomousOptions
    else:
        ValidationError(f"Unknown `dataset_type`: {dataset_type}")

    pydantic_validate({"options": data}, schema)

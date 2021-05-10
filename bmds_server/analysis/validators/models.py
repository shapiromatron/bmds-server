from typing import Any, List, Set

import bmds
import numpy as np
from django.core.exceptions import ValidationError
from pydantic import BaseModel, confloat, root_validator, validator

from ...common.validation import pydantic_validate


class ModelTypeSchema(BaseModel):
    restricted: Set[str]
    unrestricted: Set[str]
    bayesian: Set[str]


DichotomousModelSchema = ModelTypeSchema(
    restricted=set(bmds.constants.D_MODELS_RESTRICTABLE),
    unrestricted=set(bmds.constants.D_MODELS),
    bayesian=set(bmds.constants.D_MODELS),
)


ContinuousModelSchema = ModelTypeSchema(
    restricted=set(bmds.constants.C_MODELS_RESTRICTABLE),
    unrestricted=set(bmds.constants.C_MODELS_UNRESTRICTABLE),
    bayesian=set(bmds.constants.C_MODELS),
)


class BayesianModelSchema(BaseModel):
    model: str
    prior_weight: confloat(ge=0, le=1)


class ModelListSchema(BaseModel):
    frequentist_restricted: List[str] = []
    frequentist_unrestricted: List[str] = []
    bayesian: List[BayesianModelSchema] = []
    model_schema: ModelTypeSchema

    @validator("bayesian")
    def bayesian_weights(cls, values):
        if len(values) > 0:
            weights = sum([value.prior_weight for value in values])
            if not np.isclose(weights, 1.0, atol=0.005):
                raise ValueError("Prior weight in bayesian does not sum to 1")

        return values

    @root_validator()
    def uniqueness(cls, values):
        schema = values.get("model_schema")
        for field, valid_models in [
            ("frequentist_restricted", schema.restricted),
            ("frequentist_unrestricted", schema.unrestricted),
        ]:
            models = values.get(field)
            if len(models) != len(set(models)):
                raise ValueError(f"Models in {field} are not unique")
            extras = list(set(models) - valid_models)
            if len(extras) > 0:
                raise ValueError(f"Invalid model(s) in {field}: {','.join(extras)}")

        for field, valid_models in [
            ("bayesian", schema.bayesian),
        ]:
            models = [model.model for model in values.get(field)]
            if len(models) != len(set(models)):
                raise ValueError(f"Models in {field} are not unique")
            extras = list(set(models) - valid_models)
            if len(extras) > 0:
                raise ValueError(f"Invalid model(s) in {field}: {','.join(extras)}")

        return values

    @root_validator()
    def at_least_one(cls, values):
        num_models = (
            len(values.get("frequentist_restricted"))
            + len(values.get("frequentist_unrestricted"))
            + len(values.get("bayesian"))
        )
        if num_models == 0:
            raise ValueError("At least one model must be selected")
        return values


class DichotomousModelListSchema(ModelListSchema):
    model_schema: ModelTypeSchema = DichotomousModelSchema


class ContinuousModelListSchema(ModelListSchema):
    model_schema: ModelTypeSchema = ContinuousModelSchema


schema_map = {
    bmds.constants.DICHOTOMOUS: DichotomousModelListSchema,
    bmds.constants.DICHOTOMOUS_CANCER: DichotomousModelListSchema,
    bmds.constants.CONTINUOUS: ContinuousModelListSchema,
    bmds.constants.CONTINUOUS_INDIVIDUAL: ContinuousModelListSchema,
}


def validate_models(dataset_type: str, data: Any):
    schema = schema_map.get(dataset_type)
    if schema is None:
        raise ValidationError(f"Unknown `dataset_type`: {dataset_type}")
    pydantic_validate(data, schema)

from typing import Any

import bmds
import numpy as np
from django.core.exceptions import ValidationError
from pydantic import BaseModel, confloat, root_validator, validator

from ...common.validation import pydantic_validate


class ModelTypeSchema(BaseModel):
    restricted: set[str]
    unrestricted: set[str]
    bayesian: set[str]


# TODO - refactor
_d_res = set(
    [
        *bmds.constants.D_MODELS_RESTRICTABLE,
        "Michaelis-Menten",
        "LogLogistic (Reduced)",
        "Multistage (Reduced)",
    ]
)
_d_unres = set(
    [*bmds.constants.D_MODELS, "Michaelis-Menten", "LogLogistic (Reduced)", "Multistage (Reduced)"]
)
_c_res = set(
    [
        *bmds.constants.C_MODELS_RESTRICTABLE,
        "Exponential 2",
        "Exponential 3",
        "Exponential 4",
        "Exponential 5",
        "Michaelis-Menten",
        "Polynomial (Reduced)",
    ]
)
_c_unres = set(
    [*bmds.constants.C_MODELS_UNRESTRICTABLE, "Michaelis-Menten", "Polynomial (Reduced)"]
)


DichotomousModelSchema = ModelTypeSchema(
    restricted=_d_res,
    unrestricted=_d_unres,
    bayesian=set(bmds.constants.D_MODELS),
)


ContinuousModelSchema = ModelTypeSchema(
    restricted=_c_res,
    unrestricted=_c_unres,
    bayesian=set(bmds.constants.C_MODELS),
)

NestedDichotomousModelSchema = ModelTypeSchema(
    restricted=set(bmds.constants.ND_MODELS),
    unrestricted=set(bmds.constants.ND_MODELS),
    bayesian=set(),
)

MultiTumorModelSchema = ModelTypeSchema(
    restricted=set(bmds.constants.MT_MODELS),
    unrestricted=set(),
    bayesian=set(),
)


class BayesianModelSchema(BaseModel):
    model: str
    prior_weight: confloat(ge=0, le=1)


class ModelListSchema(BaseModel):
    frequentist_restricted: list[str] = []
    frequentist_unrestricted: list[str] = []
    bayesian: list[BayesianModelSchema] = []
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


class NestedDichotomousModelListSchema(ModelListSchema):
    model_schema: ModelTypeSchema = NestedDichotomousModelSchema


class MultiTumorModelListSchema(ModelListSchema):
    model_schema: ModelTypeSchema = MultiTumorModelSchema


schema_map = {
    bmds.constants.DICHOTOMOUS: DichotomousModelListSchema,
    bmds.constants.DICHOTOMOUS_CANCER: DichotomousModelListSchema,
    bmds.constants.CONTINUOUS: ContinuousModelListSchema,
    bmds.constants.CONTINUOUS_INDIVIDUAL: ContinuousModelListSchema,
    bmds.constants.NESTED_DICHOTOMOUS: NestedDichotomousModelListSchema,
    bmds.constants.MULTI_TUMOR: MultiTumorModelListSchema,
}


def validate_models(dataset_type: str, data: Any):
    schema = schema_map.get(dataset_type)
    if schema is None:
        raise ValidationError(f"Unknown `dataset_type`: {dataset_type}")
    pydantic_validate(data, schema)

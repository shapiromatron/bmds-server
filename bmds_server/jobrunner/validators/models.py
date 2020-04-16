from copy import deepcopy
from typing import Any, Dict

import bmds
import jsonschema
import numpy as np
from django.core.exceptions import ValidationError

d_model_schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Dichotomous model validator",
    "description": "Validation of list of valid dichotomous models",
    "type": "array",
    "minItems": 1,
    "items": {
        "type": "object",
        "required": ["name"],
        "properties": {
            "name": {"description": "BMDS model name", "enum": bmds.constants.D_MODELS},
            "settings": {
                "description": "BMDS model-settings (model-type specific)",
                "type": "object",
            },
        },
    },
}

dc_model_schema = deepcopy(d_model_schema)
dc_model_schema["title"] = "Dichotomous-cancer model validator"
dc_model_schema["description"] = "Validation of list of valid dichotomous-cancer models"
dc_model_schema["items"]["properties"]["name"]["enum"] = bmds.constants.DC_MODELS


c_model_schema = deepcopy(d_model_schema)
c_model_schema["title"] = "Continuous-cancer model validator"
c_model_schema["description"] = "Validation of list of valid continuous-cancer models"
c_model_schema["items"]["properties"]["name"]["enum"] = bmds.constants.C_MODELS_BMDS2

bmds3_model_selection_schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        "frequentist_restricted": {
            "type": "array",
            "items": {"type": "string", "description": "model class"},
            "uniqueItems": True,
        },
        "frequentist_unrestricted": {
            "type": "array",
            "items": {"type": "string", "description": "model class"},
            "uniqueItems": True,
        },
        "bayesian": {
            "type": "array",
            "items": {"type": "string", "description": "model class"},
            "uniqueItems": True,
        },
        "bayesian_model_average": {
            "type": "array",
            "items": {
                "type": "object",
                "description": "model class and model prior weights",
                "required": ["model", "prior_weight"],
                "properties": {
                    "model": {"type": "string", "description": "model class"},
                    "prior_weight": {"type": "number", "minimum": 0, "maximum": 1},
                },
            },
            "uniqueItems": True,
        },
    },
}

# fmt: off
bmds3_d_model_selection_schema = deepcopy(bmds3_model_selection_schema)
bmds3_d_model_selection_schema["title"] = "Dichotomous model selection"
bmds3_d_model_selection_schema["description"] = "Model selection for dichotomous bmd analysis"
bmds3_d_model_selection_schema["properties"]["frequentist_restricted"]["items"]["enum"] = bmds.constants.D_MODELS_RESTRICTABLE  # noqa: E501
bmds3_d_model_selection_schema["properties"]["frequentist_unrestricted"]["items"]["enum"] = bmds.constants.D_MODELS  # noqa: E501
bmds3_d_model_selection_schema["properties"]["bayesian"]["items"]["enum"] = bmds.constants.D_MODELS  # noqa: E501
bmds3_d_model_selection_schema["properties"]["bayesian_model_average"]["items"]["properties"]["model"]["enum"] = bmds.constants.D_MODELS  # noqa: E501

bmds3_c_model_selection_schema = deepcopy(bmds3_model_selection_schema)
bmds3_c_model_selection_schema["title"] = "Continuous model selection"
bmds3_c_model_selection_schema["description"] = "Model selection for continuous bmd analysis"
bmds3_c_model_selection_schema["properties"]["frequentist_restricted"]["items"]["enum"] = bmds.constants.C_MODELS_RESTRICTABLE  # noqa: E501
bmds3_c_model_selection_schema["properties"]["frequentist_unrestricted"]["items"]["enum"] = bmds.constants.C_MODELS_UNRESTRICTABLE  # noqa: E501
bmds3_c_model_selection_schema["properties"]["bayesian"]["items"]["enum"] = bmds.constants.C_MODELS
bmds3_c_model_selection_schema["properties"]["bayesian_model_average"]["items"]["properties"]["model"]["enum"] = bmds.constants.C_MODELS  # noqa: E501
# fmt: on


def bmds3_extra_model_validation(data: Dict):
    # ensure at least one model is selected
    if (
        len(data.get("frequentist_restricted", []))
        + len(data.get("frequentist_unrestricted", []))
        + len(data.get("bayesian", []))
        + len(data.get("bayesian_model_average", []))
    ) == 0:
        raise ValidationError("At least one model must be selected")

    if len(data.get("bayesian_model_average", [])) > 0:

        # if any `bayesian_model_average` ensure models aren't repeated
        models = set([model["model"] for model in data["bayesian_model_average"]])
        prior_weight = sum([model["prior_weight"] for model in data["bayesian_model_average"]])
        if len(data.get("bayesian_model_average")) != len(models):
            raise ValidationError("Model names in bayesian model average not unique")

        # if any `bayesian_model_average` ensure weights sum to 1
        if not np.isclose(prior_weight, 1.0, atol=0.005):
            raise ValidationError("Prior weight in bayesian model average does not sum to 1")


def validate_models(bmds_version: str, dataset_type: str, data: Any):

    extra_validation = None
    if bmds_version in bmds.constants.BMDS_TWOS:
        # ok if None; will use defaults
        if data is None:
            return
        if dataset_type == bmds.constants.DICHOTOMOUS:
            schema = d_model_schema
        elif dataset_type == bmds.constants.DICHOTOMOUS_CANCER:
            schema = dc_model_schema
        elif dataset_type in bmds.constants.CONTINUOUS_DTYPES:
            schema = c_model_schema
        else:
            ValidationError(f"Unknown `dataset_type`: {dataset_type}")

    elif bmds_version in bmds.constants.BMDS_THREES:
        if data is None:
            raise ValidationError("Model specification is required")
        extra_validation = bmds3_extra_model_validation
        if dataset_type == bmds.constants.DICHOTOMOUS:
            schema = bmds3_d_model_selection_schema
        elif dataset_type == bmds.constants.DICHOTOMOUS_CANCER:
            raise NotImplementedError()
        elif dataset_type in bmds.constants.CONTINUOUS_DTYPES:
            schema = bmds3_c_model_selection_schema
        else:
            ValidationError(f"Unknown `dataset_type`: {dataset_type}")
    else:
        ValidationError(f"Unknown `bmds_version`: {bmds_version}")

    try:
        jsonschema.validate(data, schema)
    except jsonschema.ValidationError as err:
        raise ValidationError("Model error(s): " + err.message)

    if extra_validation:
        extra_validation(data)

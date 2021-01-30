from copy import deepcopy
from typing import Any

import bmds
import jsonschema
from django.core.exceptions import ValidationError

d_bmr_schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Dichotomous BMR validator",
    "description": "BMR specifications validator",
    "type": "object",
    "required": ["type", "value"],
    "properties": {
        "type": {
            "description": "BMR type",
            "enum": list(bmds.constants.BMR_CROSSWALK[bmds.constants.DICHOTOMOUS].keys()),
        },
        "value": {"description": "BMR value", "type": "number", "minimum": 0},
    },
}

dc_bmr_schema = deepcopy(d_bmr_schema)
dc_bmr_schema["title"] = "Dichotomous-cancer BMR validator"
dc_bmr_schema["properties"]["type"]["enum"] = list(
    bmds.constants.BMR_CROSSWALK[bmds.constants.DICHOTOMOUS_CANCER].keys()
)

c_bmr_schema = deepcopy(d_bmr_schema)
c_bmr_schema["title"] = "Continuous BMR validator"
c_bmr_schema["properties"]["type"]["enum"] = list(
    bmds.constants.BMR_CROSSWALK[bmds.constants.CONTINUOUS].keys()
)

bmds3_d_option_set_schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Dichotomous option sets",
    "description": "Option set for dichotomous models",
    "type": "array",
    "items": {
        "type": "object",
        "required": ["bmr_type", "bmr_value", "confidence_level", "background"],
        "properties": {
            "bmr_type": {
                "description": "BMR type",
                "enum": list(bmds.constants.BMR_CROSSWALK[bmds.constants.DICHOTOMOUS].keys()),
            },
            "bmr_value": {"description": "BMR value", "type": "number", "minimum": 0},
            "confidence_level": {
                "description": "Confidence level",
                "type": "number",
                "minimum": 0,
                "maximum": 1,
            },
            "background": {"description": "background", "enum": ["Estimated", "Zero"]},
        },
    },
    "minItems": 1,
}

bmds3_c_option_set_schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Continuous option sets",
    "description": "Option set for continuous models",
    "type": "array",
    "items": {
        "type": "object",
        "required": [
            "bmr_type",
            "bmr_value",
            "tail_probability",
            "confidence_level",
            "distribution",
            "variance",
            "background",
        ],
        "properties": {
            "bmr_type": {
                "description": "BMR type",
                "enum": list(bmds.constants.BMR_CROSSWALK[bmds.constants.CONTINUOUS].keys()),
            },
            "bmr_value": {"description": "BMRF", "type": "number", "minimum": 0},
            "tail_probability": {
                "description": "Tail probability",
                "type": "number",
                "minimum": 0,
                "maximum": 1,
            },
            "confidence_level": {
                "description": "Confidence level",
                "type": "number",
                "minimum": 0,
                "maximum": 1,
            },
            "distribution": {"description": "Distribution", "enum": ["Normal", "Log-normal"]},
            "variance": {
                "description": "Variance",
                "enum": ["Calculated", "Constant", "Non-constant"],
            },
            "background": {"description": "Background", "enum": ["Estimated", "Zero"]},
        },
    },
    "minItems": 1,
}


def validate_options(dataset_type: str, data: Any):
    if dataset_type == bmds.constants.DICHOTOMOUS:
        schema = bmds3_d_option_set_schema
    elif dataset_type == bmds.constants.DICHOTOMOUS_CANCER:
        raise NotImplementedError()
    elif dataset_type in bmds.constants.CONTINUOUS_DTYPES:
        schema = bmds3_c_option_set_schema
    else:
        ValidationError(f"Unknown `dataset_type`: {dataset_type}")

    try:
        jsonschema.validate(data, schema)
    except jsonschema.ValidationError as err:
        raise ValidationError(err.message)

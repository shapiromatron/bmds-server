from copy import deepcopy
from typing import Dict

import bmds
import jsonschema
from bmds.session import BMDS
from django.core.exceptions import ValidationError

latest_bmds = BMDS.latest_version()
base_schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "BMDS job overview",
    "description": "BMDS version, dataset and dataset type, model options, recommendation logic, etc.",  # noqa: E501
    "type": "object",
    "properties": {
        "id": {
            "description": "An (optional) unique identifier BMDS job",
            "type": ["integer", "string"],
        },
        "bmds_version": {
            "description": "Version of BMDS run analysis with",
            "enum": list(BMDS.versions.keys()),
        },
        "description": {"description": "Analysis description", "type": "string"},
        "dataset_type": {
            "description": "Type of data which should be executed (should be same for all datasets)",  # noqa: E501
            "enum": list(bmds.constants.DTYPES),
        },
        "datasets": {
            "description": "An array of datasets which will be executed",
            "minItems": 1,
            "type": "array",
        },
        "models": {"description": "An array of models which should be used"},
        "bmr": {"description": "A description of the BMR to use (BMDS 2 only)", "type": "object"},
        "options": {
            "description": "A description of options to use (BMDS 3 only)",
            "type": "object",
        },
        "immediate": {
            "description": "Should execution start immediately (and potentially block other requests)",  # noqa: E501
            "type": "boolean",
            "default": False,
        },
        "recommend": {
            "description": "Should best fitting model be recommended?",
            "type": "boolean",
            "default": True,
        },
    },
    "required": ["bmds_version", "dataset_type", "datasets"],
}


base2_schema = deepcopy(base_schema)
base2_schema["properties"]["models"]["type"] = "array"
base2_schema["properties"].pop("options")

base3_schema = deepcopy(base_schema)
base3_schema["properties"]["models"]["type"] = "object"
base3_schema["properties"].pop("bmr")
base3_schema["required"].extend(["models", "options"])


def validate_session(data: Dict):
    bmds_version = data.get("bmds_version")
    if bmds_version in bmds.constants.BMDS_TWOS:
        schema = base2_schema
    elif bmds_version in bmds.constants.BMDS_THREES:
        schema = base3_schema
    else:
        raise ValidationError("Invalid `bmds_version` specification.")

    try:
        jsonschema.validate(data, schema)
    except jsonschema.ValidationError as err:
        raise ValidationError(err.message)

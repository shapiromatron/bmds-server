from copy import deepcopy
from typing import Dict

import bmds
import jsonschema
from bmds.session import BMDS
from django.core.exceptions import ValidationError

latest_bmds = BMDS.latest_version()
base_schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "BMDS analysis overview",
    "description": "BMDS version, dataset and dataset type, model options, recommendation logic, etc.",  # noqa: E501
    "type": "object",
    "properties": {
        "id": {
            "description": "An (optional) unique identifier BMDS analysis",
            "type": ["integer", "string"],
        },
        "bmds_version": {
            "description": "Version of BMDS run analysis with",
            "enum": list(BMDS.get_versions()),
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
    },
    "required": ["bmds_version", "dataset_type"],
}

base3_schema_partial = deepcopy(base_schema)
base3_schema_partial["properties"]["models"]["type"] = "object"
base3_schema_partial["properties"]["optional"] = {
    "description": "A description of options to use (BMDS 3 only)",
    "type": "object",
}

base3_schema_complete = deepcopy(base3_schema_partial)
base3_schema_complete["required"].extend(["datasets", "models", "options"])


def validate_session(data: Dict, partial: bool = False):
    bmds_version = data.get("bmds_version")
    if bmds_version in bmds.constants.BMDS_TWOS:
        raise ValidationError(f"BMDS 2 not supported; got {bmds_version}")
    elif bmds_version in bmds.constants.BMDS_THREES:
        if partial:
            schema = base3_schema_partial
        else:
            schema = base3_schema_complete
    else:
        raise ValidationError(f"Invalid bmds_version; got {bmds_version}")

    try:
        jsonschema.validate(data, schema)
    except jsonschema.ValidationError as err:
        raise ValidationError(err.message)

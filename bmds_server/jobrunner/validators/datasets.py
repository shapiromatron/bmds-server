from typing import Any

import bmds
from django.core.exceptions import ValidationError
import jsonschema


continuous_dataset_schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Continuous datasets",
    "description": "Requirements for an array of continuous datasets",
    "type": "array",
    "items": {
        "type": "object",
        "required": ["doses", "ns", "means", "stdevs"],
        "properties": {
            "doses": {
                "description": "An array of doses (float), one for each dose-group",
                "type": "array",
                "minItems": 3,
                "items": {"type": "number", "minimum": 0},
            },
            "ns": {
                "description": "An array of Ns (int), one of each dose-group",
                "type": "array",
                "minItems": 3,
                "items": {"type": "integer", "minimum": 0, "exclusiveMinimum": True},
            },
            "means": {
                "description": "An array of response means (float), one for each dose-group",
                "type": "array",
                "minItems": 3,
                "items": {"type": "number"},
            },
            "stdevs": {
                "description": "An array of response standard-deviations (float), one for each dose-group",  # noqa: E501
                "type": "array",
                "minItems": 3,
                "items": {"type": "number"},
            },
            "column_names": {
                "type": "object",
                "properties": {
                    "dose": {
                        "type": "string",
                        "description": "Default dataset column name",
                        "default": "Dose",
                    },
                    "n": {
                        "type": "string",
                        "description": "Default dataset column name",
                        "default": "N",
                    },
                    "mean": {
                        "type": "string",
                        "description": "Default dataset column name",
                        "default": "Mean",
                    },
                    "stdev": {
                        "type": "string",
                        "description": "Default dataset column name",
                        "default": "Std. Dev.",
                    },
                },
            },
        },
    },
    "minItems": 1,
}

continuous_individual_dataset_schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Continuous individual datasets",
    "description": "Requirements for an array of continuous individual datasets",
    "type": "array",
    "items": {
        "type": "object",
        "required": ["doses", "responses"],
        "properties": {
            "doses": {
                "description": "An array of doses (float), one per assay/organism",
                "type": "array",
                "minItems": 3,
                "items": {"type": "number", "minimum": 0},
            },
            "responses": {
                "description": "An array of responses (float), one per assay/organism",
                "type": "array",
                "minItems": 3,
                "items": {"type": "number"},
            },
            "column_names": {
                "type": "object",
                "properties": {
                    "dose": {
                        "type": "string",
                        "description": "Default dataset column name",
                        "default": "Dose",
                    },
                    "response": {
                        "type": "string",
                        "description": "Default dataset column name",
                        "default": "Response",
                    },
                },
            },
        },
    },
    "minItems": 1,
}

dichotomous_dataset_schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Dichotomous datasets",
    "description": "Requirements for an array of dichotomous datasets",
    "type": "array",
    "items": {
        "type": "object",
        "required": ["doses", "ns", "incidences"],
        "properties": {
            "doses": {
                "description": "An array of doses (float), one for each dose-group",
                "type": "array",
                "minItems": 3,
                "items": {"type": "number", "minimum": 0},
            },
            "ns": {
                "description": "An array of total Ns (int), one for each dose-group",
                "type": "array",
                "minItems": 3,
                "items": {"type": "integer", "minimum": 0, "exclusiveMinimum": True},
            },
            "incidences": {
                "description": "An array of positive responses (int), one for each dose-group",
                "type": "array",
                "minItems": 3,
                "items": {"type": "integer", "minimum": 0},
            },
            "column_names": {
                "type": "object",
                "properties": {
                    "dose": {
                        "type": "string",
                        "description": "Default dataset column name",
                        "default": "Dose",
                    },
                    "n": {
                        "type": "string",
                        "description": "Default dataset column name",
                        "default": "N",
                    },
                    "incidence": {
                        "type": "string",
                        "description": "Default dataset column name",
                        "default": "Incidence",
                    },
                },
            },
        },
    },
    "minItems": 1,
}

# optional properties for all dataset types
optional_dataset_props = {
    "id": {
        "description": "An (optional) unique identifier for dataset",
        "type": ["integer", "string"],
    },
    "dataset_name": {
        "description": "An (optional) dataset name used as a title in reports",
        "type": "string",
    },
    "description": {"description": "Dataset description", "type": "string"},
    "include": {
        "type": "boolean",
        "default": True,
        "description": "Should this dataset be included in this modeling session?",
    },
    "xlabel": {"description": "An (optional) x-label for plots", "type": "string"},
    "ylabel": {"description": "An (optional) y-label for plots", "type": "string"},
    "dose_units": {"description": "(optional) dose units for reporting", "type": "string"},
    "response_units": {
        "description": "(optional) response units for reporting",
        "type": "string",
    },  # noqa: E501
}
continuous_dataset_schema["items"]["properties"].update(optional_dataset_props)
continuous_individual_dataset_schema["items"]["properties"].update(optional_dataset_props)
dichotomous_dataset_schema["items"]["properties"].update(optional_dataset_props)


def validate_datasets(dataset_type: str, datasets: Any):
    if dataset_type == bmds.constants.CONTINUOUS:
        schema = continuous_dataset_schema
    elif dataset_type == bmds.constants.CONTINUOUS_INDIVIDUAL:
        schema = continuous_individual_dataset_schema
    else:
        schema = dichotomous_dataset_schema

    try:
        jsonschema.validate(datasets, schema)
    except jsonschema.ValidationError as err:
        raise ValidationError(err.message)

from copy import deepcopy
import bmds
from bmds.session import BMDS

import json
import jsonschema

latest_bmds = BMDS.latest_version()
base_schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "BMDS job overview",
    "description": "BMDS version, dataset and dataset type, model options, recommendation logic, etc.",
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
        "dataset_type": {
            "description": "Type of data which should be executed (should be same for all datasets)",
            "enum": list(bmds.constants.DTYPES),
        },
        "datasets": {
            "description": "An array of datasets which will be executed",
            "minItems": 1,
            "type": "array",
        },
        "models": {
            "description": "An array of models which should be used",
            "type": "array",
        },
        "bmr": {"description": "A description of the BMR to use", "type": "object"},
        "immediate": {
            "description": "Should execution start immediately (and potentially block other requests)",
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
                "description": "An array of response standard-deviations (float), one for each dose-group",
                "type": "array",
                "minItems": 3,
                "items": {"type": "number"},
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
    "xlabel": {"description": "An (optional) x-label for plots", "type": "string"},
    "ylabel": {"description": "An (optional) y-label for plots", "type": "string"},
    "dose_units": {
        "description": "(optional) dose units for reporting",
        "type": "string",
    },
    "response_units": {
        "description": "(optional) response units for reporting",
        "type": "string",
    },
}
continuous_dataset_schema["items"]["properties"].update(optional_dataset_props)
continuous_individual_dataset_schema["items"]["properties"].update(
    optional_dataset_props
)
dichotomous_dataset_schema["items"]["properties"].update(optional_dataset_props)


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
            "name": {
                "description": "BMDS model name",
                "enum": list(
                    latest_bmds.model_options[bmds.constants.DICHOTOMOUS].keys()
                ),
            },
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
dc_model_schema["items"]["properties"]["name"]["enum"] = list(
    latest_bmds.model_options[bmds.constants.DICHOTOMOUS_CANCER].keys()
)


c_model_schema = deepcopy(d_model_schema)
c_model_schema["title"] = "Continuous-cancer model validator"
c_model_schema["description"] = "Validation of list of valid continuous-cancer models"
c_model_schema["items"]["properties"]["name"]["enum"] = list(
    latest_bmds.model_options[bmds.constants.CONTINUOUS].keys()
)


d_bmr_schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Dichotomous BMR validator",
    "description": "BMR specifications validator",
    "type": "object",
    "required": ["type", "value"],
    "properties": {
        "type": {
            "description": "BMR type",
            "enum": list(
                bmds.constants.BMR_CROSSWALK[bmds.constants.DICHOTOMOUS].keys()
            ),
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


def _validate_base(data):
    try:
        jsonschema.validate(data, base_schema)
    except jsonschema.ValidationError as err:
        raise ValueError(err.message)


def _validate_datasets(dataset_type, datasets):
    if dataset_type == bmds.constants.CONTINUOUS:
        schema = continuous_dataset_schema
    elif dataset_type == bmds.constants.CONTINUOUS_INDIVIDUAL:
        schema = continuous_individual_dataset_schema
    else:
        schema = dichotomous_dataset_schema

    try:
        jsonschema.validate(datasets, schema)
    except jsonschema.ValidationError as err:
        raise ValueError("Dataset error(s): " + err.message)


def _validate_models(dataset_type, models):
    if dataset_type == bmds.constants.DICHOTOMOUS:
        schema = d_model_schema
    elif dataset_type == bmds.constants.DICHOTOMOUS_CANCER:
        schema = dc_model_schema
    else:
        schema = c_model_schema

    try:
        jsonschema.validate(models, schema)
    except jsonschema.ValidationError as err:
        raise ValueError("Model error(s): " + err.message)


def _validate_bmr(dataset_type, bmr):
    if dataset_type == bmds.constants.DICHOTOMOUS:
        schema = d_bmr_schema
    elif dataset_type == bmds.constants.DICHOTOMOUS_CANCER:
        schema = dc_bmr_schema
    else:
        schema = c_bmr_schema

    try:
        jsonschema.validate(bmr, schema)
    except jsonschema.ValidationError as err:
        raise ValueError("BMR error(s): " + err.message)


def validate_input(data):
    # Return None if successful, else raise ValueError.
    # ensure data is valid JSON
    try:
        jsoned = json.loads(data)
    except json.decoder.JSONDecodeError:
        raise ValueError("Invalid format - must be valid JSON.")

    # check base job
    _validate_base(jsoned)

    # check dataset schema
    datasets = jsoned["datasets"]
    dataset_type = jsoned["dataset_type"]
    _validate_datasets(dataset_type, datasets)

    # check model schema
    models = jsoned.get("models")
    if models:
        _validate_models(dataset_type, models)

    # check bmr schema
    bmr = jsoned.get("bmr")
    if bmr:
        _validate_bmr(dataset_type, bmr)

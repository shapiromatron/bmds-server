import json
from copy import deepcopy
from typing import Any, Dict

import bmds
import jsonschema
import numpy as np
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
        "models": {"description": "An array of models which should be used", "type": "array"},
        "bmr": {"description": "A description of the BMR to use", "type": "object"},
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
                "enum": list(latest_bmds.model_options[bmds.constants.DICHOTOMOUS].keys()),
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

bmds3_model_selection_schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Dichotomous model selection",
    "description": "Model selection for dichotomous bmd analysis",
    "type": "object",
    "properties": {
        "frequentist_restricted": {
            "type": "array",
            "items": {
                "type": "string",
                "description": "model class",
                "enum": bmds.constants.D_MODELS_RESTRICTABLE,
            },
            "uniqueItems": True,
        },
        "frequentist_unrestricted": {
            "type": "array",
            "items": {
                "type": "string",
                "description": "model class",
                "enum": bmds.constants.D_MODELS,
            },
            "uniqueItems": True,
        },
        "bayesian": {
            "type": "array",
            "items": {
                "type": "string",
                "description": "model class",
                "enum": bmds.constants.D_MODELS,
            },
            "uniqueItems": True,
        },
        "bayesian_model_average": {
            "type": "array",
            "items": {
                "type": "object",
                "description": "model class and model prior weights",
                "required": ["model", "prior_weight"],
                "properties": {
                    "model": {"enum": bmds.constants.D_MODELS},
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


bmds3_d_option_set_schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Dichotomous option sets",
    "description": "Option set for dichotomous models",
    "type": "array",
    "items": {
        "type": "object",
        "required": ["type", "value", "confidence_level", "background"],
        "properties": {
            "type": {
                "description": "BMR type",
                "enum": list(bmds.constants.BMR_CROSSWALK[bmds.constants.DICHOTOMOUS].keys()),
            },
            "value": {"description": "BMR value", "type": "number", "minimum": 0},
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
        "required": ["type", "value", "tail_probability", "confidence_level"],
        "properties": {
            "type": {
                "description": "BMR type",
                "enum": list(bmds.constants.BMR_CROSSWALK[bmds.constants.CONTINUOUS].keys()),
            },
            "value": {"description": "BMRF", "type": "number", "minimum": 0},
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
            "polynomial_restriction": {
                "description": "Polynomial restriction",
                "enum": ["Use dataset adverse direction", "Non-negative", "Non-positive"],
            },
            "background": {"description": "Background", "enum": ["Estimated", "Zero"]},
        },
    },
    "minItems": 1,
}


def _validate_base(data):
    try:
        jsonschema.validate(data, base_schema)
    except jsonschema.ValidationError as err:
        raise ValidationError(err.message)


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
        raise ("Dataset error(s): " + err.message)


def _validate_models(bmds_version: str, dataset_type: str, data: Any):
    extra_validation = None
    if bmds_version in bmds.constants.BMDS_TWOS:
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
        raise ValidationError("BMR error(s): " + err.message)


def validate_input(data) -> None:
    # Return None if successful, else raise ValueError.
    # ensure data is valid JSON
    try:
        jsoned = json.loads(data)
    except json.decoder.JSONDecodeError:
        raise ValidationError("Invalid format - must be valid JSON.")

    # check base job
    _validate_base(jsoned)
    bmds_version = jsoned["bmds_version"]

    # check dataset schema
    datasets = jsoned["datasets"]
    dataset_type = jsoned["dataset_type"]
    _validate_datasets(dataset_type, datasets)

    # check model schema
    models = jsoned.get("models")
    if models:
        _validate_models(bmds_version, dataset_type, models)

    # check bmr schema
    bmr = jsoned.get("bmr")
    if bmr:
        _validate_bmr(dataset_type, bmr)


def validate_preferences(data) -> None:
    pass

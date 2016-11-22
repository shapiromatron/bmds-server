import bmds
import json
import jsonschema

base_schema = {
    'type': 'object',
    'properties': {
        'bmds_version': {
            'enum': list(bmds.VERSIONS.keys())
        },
        'dataset_type': {
            'enum': list(bmds.constants.DTYPES),
        },
        'datasets': {
            'minItems': 1,
            'type': 'array'
        }
    },
    'required': ['bmds_version', 'dataset_type', 'datasets']
}

continuous_dataset_schema = {
    'type': 'array',
    'items': {
        'type': 'object',
        'required': [
            'doses',
            'ns',
            'responses',
            'stdevs',
        ],
        'properties': {
            'doses': {
                'type': 'array',
                'minItems': 3,
                'items': {
                    'type': 'number',
                    'minimum': 0
                },
            },
            'ns': {
                'type': 'array',
                'minItems': 3,
                'items': {
                    'type': 'integer',
                    'minimum': 0,
                    'exclusiveMinimum': True,
                },
            },
            'responses': {
                'type': 'array',
                'minItems': 3,
                'items': {
                    'type': 'number',
                },
            },
            'stdevs': {
                'type': 'array',
                'minItems': 3,
                'items': {
                    'type': 'number',
                },
            },
        }
    },
    'minItems': 1,
}

dichotomous_dataset_schema = {
    'type': 'array',
    'items': {
        'type': 'object',
        'required': [
            'doses',
            'ns',
            'incidences'
        ],
        'properties': {
            'doses': {
                'type': 'array',
                'minItems': 3,
                'items': {
                    'type': 'number',
                    'minimum': 0
                },
            },
            'ns': {
                'type': 'array',
                'minItems': 3,
                'items': {
                    'type': 'integer',
                    'minimum': 0,
                    'exclusiveMinimum': True,
                },
            },
            'incidences': {
                'type': 'array',
                'minItems': 3,
                'items': {
                    'type': 'integer',
                    'minimum': 0,
                },
            },
        }
    },
    'minItems': 1,
}


def validate_input(data):
    # Return None if successful, else raise ValueError.
    # ensure data is valid JSON
    try:
        jsoned = json.loads(data)
    except json.decoder.JSONDecodeError:
        raise ValueError('Invalid format - must be valid JSON.')

    # first-level check
    try:
        jsonschema.validate(jsoned, base_schema)
    except jsonschema.ValidationError as err:
        raise ValueError(err.message)

    # check dataset schema
    try:
        datasets = jsoned.get('datasets', [])
        if jsoned['dataset_type'] == bmds.constants.CONTINUOUS:
            schema = continuous_dataset_schema
        else:
            schema = dichotomous_dataset_schema
        jsonschema.validate(datasets, schema)
    except jsonschema.ValidationError as err:
        raise ValueError('Dataset error(s): ' + err.message)

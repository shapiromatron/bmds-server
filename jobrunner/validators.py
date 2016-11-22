import bmds
import json
import jsonschema

base_schema = {
    'type': 'object',
    'properties': {
        'bmds_version': {
            'description': 'Version of BMDS run analysis with',
            'enum': list(bmds.VERSIONS.keys())
        },
        'dataset_type': {
            'description': 'Type of data which should be executed (should be same for all datasets)',
            'enum': list(bmds.constants.DTYPES),
        },
        'datasets': {
            'description': 'An array of datasets which will be executed',
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
                'description': 'An array of doses (float), one for each dose-group',
                'type': 'array',
                'minItems': 3,
                'items': {
                    'type': 'number',
                    'minimum': 0
                },
            },
            'ns': {
                'description': 'An array of Ns (int), one of each dose-group',
                'type': 'array',
                'minItems': 3,
                'items': {
                    'type': 'integer',
                    'minimum': 0,
                    'exclusiveMinimum': True,
                },
            },
            'responses': {
                'description': 'An array of response means (float), one for each dose-group',
                'type': 'array',
                'minItems': 3,
                'items': {
                    'type': 'number',
                },
            },
            'stdevs': {
                'description': 'An array of response standard-deviations (float), one for each dose-group',
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
                'description': 'An array of doses (float), one for each dose-group',
                'type': 'array',
                'minItems': 3,
                'items': {
                    'type': 'number',
                    'minimum': 0
                },
            },
            'ns': {
                'description': 'An array of total Ns (int), one for each dose-group',
                'type': 'array',
                'minItems': 3,
                'items': {
                    'type': 'integer',
                    'minimum': 0,
                    'exclusiveMinimum': True,
                },
            },
            'incidences': {
                'description': 'An array of positive responses (int), one for each dose-group',
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

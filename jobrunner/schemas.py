import bmds

base_schema = {
    'type': 'object',
    'properties': {
        'bmds_version': {
            'enum': list(bmds.VERSIONS.keys())
        },
        'dataset_type': {
            'enum': list(bmds.constants.DTYPES),
        },

    },
    'required': ['bmds_version', 'dataset_type']
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

from copy import deepcopy
import json
import jsonschema
import pytest

from jobrunner import validators


@pytest.fixture
def complete_continuous():
    return {
        'bmds_version': 'BMDS2601',
        'dataset_type': 'C',
        'datasets': [
            {
                'id': 123,
                'doses': [0, 10, 50, 150, 400],
                'ns': [111, 142, 143, 93, 42],
                'responses': [2.112, 0, 1.956, 1.587, 1.254],
                'stdevs': [0.235, 0, 0.231, 0.263, 0.159]
            }
        ]
    }


@pytest.fixture
def complete_dichotomous():
    return {
        'bmds_version': 'BMDS2601',
        'dataset_type': 'D',
        'datasets': [
            {
                'id': 123,
                'doses': [0, 1.96, 5.69, 29.75],
                'ns': [75, 49, 50, 49],
                'incidences': [5, 0, 3, 14]
            },
        ]
    }


def test_invalid_json():
    # invalid JSON
    with pytest.raises(ValueError):
        validators.validate_input("{")


def test_base_validator(complete_continuous):
    # check validity
    try:
        jsonschema.validate(complete_continuous, validators.base_schema)
    except jsonschema.exceptions.ValidationError:
        pytest.fail('Should be valid.')

    # missing required field check
    with pytest.raises(jsonschema.exceptions.ValidationError):
        data = deepcopy(complete_continuous)
        data.pop('bmds_version')
        jsonschema.validate(data, validators.base_schema)


def test_continuous_validator(complete_continuous):
    # check that continous validators work
    datasets = complete_continuous['datasets']
    # check validity
    try:
        jsonschema.validate(datasets, validators.continuous_dataset_schema)
    except jsonschema.exceptions.ValidationError:
        pytest.fail('Should be valid.')

    # missing required field check
    with pytest.raises(jsonschema.exceptions.ValidationError):
        data = deepcopy(datasets)
        data[0].pop('stdevs')
        jsonschema.validate(data, validators.continuous_dataset_schema)

    # n>0 check
    with pytest.raises(jsonschema.exceptions.ValidationError):
        data = deepcopy(datasets)
        data[0]['ns'][1] = 0
        jsonschema.validate(data, validators.dichotomous_dataset_schema)


def test_dichotomous_validator(complete_dichotomous):
    # check that dichotomous validators work
    datasets = complete_dichotomous['datasets']
    # check validity
    try:
        jsonschema.validate(datasets, validators.dichotomous_dataset_schema)
    except jsonschema.exceptions.ValidationError:
        pytest.fail('Should be valid.')

    # missing required field check
    with pytest.raises(jsonschema.exceptions.ValidationError):
        data = deepcopy(datasets)
        data[0].pop('ns')
        jsonschema.validate(data, validators.dichotomous_dataset_schema)

    # n>0 check
    with pytest.raises(jsonschema.exceptions.ValidationError):
        data = deepcopy(datasets)
        data[0]['ns'][1] = 0
        jsonschema.validate(data, validators.dichotomous_dataset_schema)


def test_dataset_ids(complete_continuous, complete_dichotomous):
    # Check that commonly used IDs can be used.
    sets = [
        (complete_continuous['datasets'], validators.continuous_dataset_schema),
        (complete_dichotomous['datasets'], validators.dichotomous_dataset_schema)
    ]
    for datasets, validator in sets:
        # check missing ID
        data = deepcopy(datasets)
        data[0].pop('id')
        jsonschema.validate(data, validator)

        # check string ID
        data = deepcopy(datasets)
        data[0]['id'] = 'string'
        jsonschema.validate(data, validator)

        # check int ID
        data = deepcopy(datasets)
        data[0]['id'] = 123  # int
        jsonschema.validate(data, validator)

        # check float id
        with pytest.raises(jsonschema.exceptions.ValidationError):
            data = deepcopy(datasets)
            data[0]['id'] = 123.1  # float
            jsonschema.validate(data, validator)

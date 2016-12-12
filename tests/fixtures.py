import pytest


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
                'means': [2.112, 2.095, 1.956, 1.587, 1.254],
                'stdevs': [0.235, 0.209, 0.231, 0.263, 0.159]
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

from pathlib import Path

import pytest
from django.core.management import call_command


@pytest.fixture(scope="session", autouse=True)
def test_db(django_db_setup, django_db_blocker):
    with django_db_blocker.unblock():
        call_command("load_test_db", interactive=False)


@pytest.fixture(scope="session")
def vcr_config():
    return {
        "filter_headers": [("authorization", "<omitted>")],
    }


@pytest.fixture(scope="module")
def vcr_cassette_dir(request):
    cassette_dir = Path(__file__).parent.absolute() / "cassettes" / request.module.__name__
    return str(cassette_dir)


@pytest.fixture
def bmds3_complete_continuous():
    return {
        "bmds_version": "BMDS330",
        "dataset_type": "C",
        "models": {"frequentist_restricted": ["Power"]},
        "datasets": [
            {
                "id": 123,
                "doses": [0, 10, 50, 150, 400],
                "ns": [111, 142, 143, 93, 42],
                "means": [2.112, 2.095, 1.956, 1.587, 1.254],
                "stdevs": [0.235, 0.209, 0.231, 0.263, 0.159],
            }
        ],
        "options": [
            {
                "bmr_type": "Std. Dev.",
                "bmr_value": 1.0,
                "tail_probability": 0.95,
                "confidence_level": 0.05,
                "distribution": "Normal",
                "variance": "Calculated",
                "polynomial_restriction": "Use dataset adverse direction",
                "background": "Estimated",
            }
        ],
    }


@pytest.fixture
def bmds3_complete_dichotomous():
    return {
        "bmds_version": "BMDS330",
        "dataset_type": "D",
        "models": {"frequentist_restricted": ["LogLogistic"]},
        "datasets": [
            {
                "id": 123,
                "doses": [0, 10, 50, 150, 400],
                "ns": [20, 20, 20, 20, 20],
                "incidences": [0, 0, 1, 4, 11],
            }
        ],
        "options": [
            {
                "bmr_type": "Extra",
                "bmr_value": 0.1,
                "confidence_level": 0.95,
                "background": "Estimated",
            }
        ],
    }

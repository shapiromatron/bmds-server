from pathlib import Path

import pytest
from bmds.bmds3.recommender import RecommenderSettings
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
                "dtype": "C",
                "metadata": {"id": 123},
                "doses": [0, 50, 100, 150, 200],
                "ns": [100, 100, 100, 100, 100],
                "means": [10, 20, 30, 40, 50],
                "stdevs": [3, 4, 5, 6, 7],
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
                "background": "Estimated",
            }
        ],
        "dataset_options": [{"dataset_id": 123, "enabled": True, "adverse_direction": "automatic"}],
        "recommender": RecommenderSettings.build_default().dict(),
    }


@pytest.fixture
def bmds3_complete_dichotomous():
    return {
        "bmds_version": "BMDS330",
        "dataset_type": "D",
        "models": {"frequentist_restricted": ["LogLogistic"]},
        "datasets": [
            {
                "dtype": "D",
                "metadata": {"id": 123},
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
        "dataset_options": [{"dataset_id": 123, "enabled": True}],
        "recommender": RecommenderSettings.build_default().dict(),
    }

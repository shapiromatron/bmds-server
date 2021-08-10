import json
import os
import time
from pathlib import Path

import helium
import pytest
from bmds.bmds3.recommender import RecommenderSettings
from django.conf import settings
from django.core.management import call_command
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

CI = os.environ.get("CI") == "true"
SHOW_BROWSER = bool(os.environ.get("SHOW_BROWSER", None))


@pytest.fixture(scope="session", autouse=True)
def test_db(django_db_setup, django_db_blocker):
    with django_db_blocker.unblock():
        call_command("load_test_db")


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
        "models": {
            "frequentist_restricted": ["Power"],
            "bayesian": [{"model": "Power", "prior_weight": 1}],
        },
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
                "bmr_type": 2,
                "bmr_value": 1.0,
                "tail_probability": 0.95,
                "confidence_level": 0.95,
                "dist_type": 1,
            }
        ],
        "dataset_options": [
            {"dataset_id": 123, "enabled": True, "degree": 0, "adverse_direction": -1}
        ],
        "recommender": RecommenderSettings.build_default().dict(),
    }


@pytest.fixture
def bmds3_complete_continuous_individual():
    # fmt: off
    return {
        "bmds_version": "BMDS330",
        "dataset_type": "C",
        "models": {
            "frequentist_restricted": ["Power"],
            "bayesian": [{"model": "Power", "prior_weight": 1}],
        },
        "datasets": [
            {
                "dtype": "CI",
                "metadata": {"id": 123},
                "doses": [
                    0, 0, 0, 0, 0, 0, 0, 0,
                    0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
                    1, 1, 1, 1, 1, 1,
                    10, 10, 10, 10, 10, 10,
                    100, 100, 100, 100, 100, 100,
                    300, 300, 300, 300, 300, 300,
                    500, 500, 500, 500, 500, 500,
                ],
                "responses": [
                    8.1079, 9.3063, 9.7431, 9.7814, 10.0517, 10.6132, 10.7509, 11.0567,
                    9.1556, 9.6821, 9.8256, 10.2095, 10.2222, 12.0382,
                    9.5661, 9.7059, 9.9905, 10.2716, 10.471, 11.0602,
                    8.8514, 10.0107, 10.0854, 10.5683, 11.1394, 11.4875,
                    9.5427, 9.7211, 9.8267, 10.0231, 10.1833, 10.8685,
                    10.368, 10.5176, 11.3168, 12.002, 12.1186, 12.6368,
                    9.9572, 10.1347, 10.7743, 11.0571, 11.1564, 12.0368,
                ],
            }
        ],
        "options": [
            {
                "bmr_type": 2,
                "bmr_value": 1.0,
                "tail_probability": 0.95,
                "confidence_level": 0.95,
                "dist_type": 1,
            }
        ],
        "dataset_options": [
            {"dataset_id": 123, "enabled": True, "degree": 0, "adverse_direction": -1}
        ],
        "recommender": RecommenderSettings.build_default().dict(),
    }
    # fmt: on


@pytest.fixture
def bmds3_complete_dichotomous():
    return {
        "bmds_version": "BMDS330",
        "dataset_type": "D",
        "models": {
            "frequentist_unrestricted": ["Logistic"],
            "bayesian": [{"model": "Logistic", "prior_weight": 1}],
        },
        "datasets": [
            {
                "dtype": "D",
                "metadata": {"id": 123},
                "doses": [0, 10, 50, 150, 400],
                "ns": [20, 20, 20, 20, 20],
                "incidences": [0, 0, 1, 4, 11],
            }
        ],
        "options": [{"bmr_type": 1, "bmr_value": 0.1, "confidence_level": 0.95}],
        "dataset_options": [{"dataset_id": 123, "enabled": True, "degree": 0}],
        "recommender": RecommenderSettings.build_default().dict(),
    }


def _wait_until_webpack_ready(max_wait_sec: int = 60):
    """Sleep until webpack is ready...
    Raises:
        EnvironmentError: If webpack fails to complete in designated time
    """
    stats = Path(settings.WEBPACK_LOADER["DEFAULT"]["STATS_FILE"])
    waited_for = 0
    while waited_for < max_wait_sec:
        if stats.exists() and json.loads(stats.read_text()).get("status") == "done":
            return
        time.sleep(1)
        waited_for += 1
    raise EnvironmentError("Timeout; webpack dev server not ready")


def _get_driver(browser: str, CI: bool):
    """
    Returns the web-driver depending on the specified environment
    Args:
        browser (str): "firefox" or "chrome"
        CI (bool): if we're in the CI environment
    Raises:
        ValueError: if configuration is invalid
    """
    command_executor = None
    if CI:
        host = os.environ["SELENIUM_HOST"]
        port = os.environ["SELENIUM_PORT"]
        command_executor = f"http://{host}:{port}/wd/hub"

    if browser == "firefox":
        options = webdriver.FirefoxOptions()
        if CI:
            options.headless = True
            return webdriver.Remote(
                command_executor=command_executor,
                desired_capabilities=DesiredCapabilities.FIREFOX,
                options=options,
            )
        else:
            return helium.start_firefox(options=options, headless=not SHOW_BROWSER)
    elif browser == "chrome":
        options = webdriver.ChromeOptions()
        # prevent navbar from collapsing
        options.add_argument("--window-size=1920,1080")
        if CI:
            options.add_experimental_option("excludeSwitches", ["enable-logging"])
            options.add_argument("--headless")
            return webdriver.Remote(
                command_executor=command_executor,
                desired_capabilities=DesiredCapabilities.CHROME,
                options=options,
            )
        else:
            return helium.start_chrome(options=options, headless=not SHOW_BROWSER)
    else:
        raise ValueError(f"Unknown config: {browser} / {CI}")


@pytest.fixture(scope="session")
def chrome_driver():
    driver = _get_driver("chrome", CI)
    _wait_until_webpack_ready()
    try:
        yield driver
    finally:
        driver.quit()


@pytest.fixture(scope="session")
def firefox_driver():
    driver = _get_driver("firefox", CI)
    # prevent navbar from collapsing
    driver.set_window_size(1920, 1080)
    _wait_until_webpack_ready()
    try:
        yield driver
    finally:
        driver.quit()


@pytest.fixture
def set_chrome_driver(request, chrome_driver):
    request.cls.driver = chrome_driver


@pytest.fixture
def set_firefox_driver(request, firefox_driver):
    request.cls.driver = firefox_driver

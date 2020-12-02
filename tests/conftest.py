import json
import os
import time
from pathlib import Path
import requests
from typing import NamedTuple

import helium
import pytest
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


def _wait_until_webpack_ready(max_wait_sec: int = 60):
    """Sleep until webpack is ready...
    Raises:
        EnvironmentError: If webpack fails to complete in designated time
    """
    stats = Path(settings.WEBPACK_LOADER["DEFAULT"]["STATS_FILE"])
    waited_for = 0
    while waited_for < max_wait_sec:
        if stats.exists() and json.loads(stats.read_text()).get("status") == "done":
            d = json.loads(stats.read_text())
            print(stats.read_text())
            print(requests.get(d["chunks"]["main"][0]["publicPath"]).text[:1000])
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


class Job(NamedTuple):
    uuid: str
    password: str

    @property
    def url(self) -> str:
        return f"/job/{self.uuid}/"

    @property
    def edit_url(self) -> str:
        return f"/job/{self.uuid}/{self.password}/"


class Keys:
    """
    Lookup to test specific objects in the text-fixture.
    """

    dichotomous = Job("4d666094-543b-476b-a003-31e508c14688", "password1")
    continuous = Job("54f8f207-5148-4535-b2a9-b4ba3c70f9bd", "password2")


@pytest.fixture
def set_db_keys(request):
    request.cls.db_keys = Keys

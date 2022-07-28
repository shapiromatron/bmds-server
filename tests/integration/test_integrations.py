import os

import pytest
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from django.test import TestCase

from .tests import continuous, dichotomous


# TODO remove when dll released
class RunBmds3:
    should_run = os.getenv("CI") is None
    skip_reason = "DLLs not present on CI"


SKIP_INTEGRATION = os.environ.get("INTEGRATION_TESTS") is None
BROWSER = os.environ.get("BROWSER", "firefox")  # default to firefox; seems more stable
CAN_EXECUTE = RunBmds3.should_run


@pytest.mark.skipif(SKIP_INTEGRATION, reason="integration test")
@pytest.mark.usefixtures("set_firefox_driver" if BROWSER == "firefox" else "set_chrome_driver")
class TestIntegration(StaticLiveServerTestCase, TestCase):
    """
    We use a single class that inherits from both StaticLiveServerTestCase and TestCase
    in order to supersede properties of StaticLiveServerTestCase that cause the database to be
    flushed after every test, while still being able to utilize a live server for HTTP requests.
    Further reading: https://code.djangoproject.com/ticket/23640#comment:3
    """

    host = os.environ.get("LIVESERVER_HOST", "localhost")
    port = int(os.environ.get("LIVESERVER_PORT", 0))

    def test_dichotomous(self):
        dichotomous.test_dichotomous(self.driver, self.live_server_url, can_execute=CAN_EXECUTE)

    def test_continuous_summary(self):
        continuous.test_continuous_summary(
            self.driver, self.live_server_url, can_execute=CAN_EXECUTE
        )

    def test_continuous_individual(self):
        continuous.test_continuous_individual(
            self.driver, self.live_server_url, can_execute=CAN_EXECUTE
        )

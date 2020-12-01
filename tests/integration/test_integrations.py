import os
import platform

import pytest
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from django.test import TestCase

from .tests import dichotomous

SKIP_INTEGRATION = os.environ.get("BMDS_INTEGRATION_TESTS") is None
BROWSER = os.environ.get("BROWSER", "firefox")  # default to firefox; seems more stable

# TODO remove this restriction
can_execute = platform.system() == "Darwin" and os.getenv("CI") is None


@pytest.mark.skipif(SKIP_INTEGRATION, reason="integration test")
@pytest.mark.usefixtures(
    "set_firefox_driver" if BROWSER == "firefox" else "set_chrome_driver", "set_db_keys"
)
class TestIntegration(StaticLiveServerTestCase, TestCase):
    """
    We use a single class that inherits from both StaticLiveServerTestCase and TestCase
    in order to supersede properties of StaticLiveServerTestCase that cause the database to be
    flushed after every test, while still being able to utilize a live server for HTTP requests.
    Further reading: https://code.djangoproject.com/ticket/23640#comment:3
    """

    host = os.environ.get("LIVESERVER_HOST", "localhost")
    port = int(os.environ.get("LIVESERVER_PORT", 0))

    # def test_continuous(self):
    #     continuous.test_continuous(self.driver, self.live_server_url)
    #     continuous.test_Sufficiently_Close_BMDL_4(self.driver, self.live_server_url)
    #     continuous.test_analysisName(self.driver, self.live_server_url)
    #     continuous.test_analysisDescription(self.driver, self.live_server_url)
    #     continuous.test_changeBMRType(self.driver, self.live_server_url)
    #     continuous.test_dataPath(self.driver, self.live_server_url)
    #     continuous.test_logicPath(self.driver, self.live_server_url)
    #     continuous.test_mainPath(self.driver, self.live_server_url)
    #     continuous.test_ouputPath(self.driver, self.live_server_url)

    def test_dichotomous(self):
        dichotomous.test_dichotomous(self.driver, self.live_server_url, can_execute)

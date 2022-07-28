from .common import PlaywrightTestCase


class TestContinuousIntegration(PlaywrightTestCase):
    def test_continuous(self):
        page = self.page

        page.goto(self.url("/"))

        # TODO - keep adding other expect checks

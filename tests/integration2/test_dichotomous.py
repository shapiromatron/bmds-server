from playwright.sync_api import expect

from .common import PlaywrightTestCase


class TestDichotomousIntegration(PlaywrightTestCase):
    def test_dichotomous(self):
        page = self.page

        # TODO - keep adding other expect checks

        page.goto(self.url("/"))
        with page.expect_navigation():
            page.locator("text=Create a new BMDS analysis").click()
        page.locator("text=Model TypeContinuousDichotomous >> select").select_option("C")
        page.locator("text=Model TypeContinuousDichotomous >> select").select_option("D")
        page.locator("#bayesian-Logistic").check()

        page.locator('a:has-text("Data")').click()
        page.locator("text=Create").click()
        page.locator("text=Load an example dataset").click()

        page.locator('a:has-text("Settings")').click()
        page.locator('input[type="text"]').click()
        page.locator('input[type="text"]').fill("test123")
        page.locator("textarea").click()
        page.locator("textarea").fill("description456")
        page.locator("text=Save Analysis").click()

        if self.can_execute:
            page.locator("text=Run Analysis").click()

        page.locator('a:has-text("Output")').click()
        page.locator("#freq-result-0").click()
        expect(page.locator("#info-table tbody tr")).to_have_count(3)
        page.locator("#close-modal").click()

        page.locator("#bayesian-result-0").click()
        expect(page.locator("#info-table tbody tr")).to_have_count(3)
        page.locator("#close-modal").click()

        # check model average renders
        page.locator("text=Model Average").click()
        expect(page.locator("#ma-result-summary tbody tr")).to_have_count(3)
        page.locator("#close-modal").click()

        # TODO - add best-fitting model

        page.locator('a:has-text("Logic")').click()
        expect(page.locator("#decision-logic tbody tr")).to_have_count(4)
        expect(page.locator("#rule-table tbody tr")).to_have_count(22)

from playwright.sync_api import expect

from .common import PlaywrightTestCase


class TestContinuousIntegration(PlaywrightTestCase):
    def test_continuous(self):
        page = self.page
        page.goto(self.url("/"))

        with page.expect_navigation():
            page.get_by_role("button", name="Create a new BMDS analysis").click()

        # set main input
        page.locator("#analysis_name").fill("abc")
        page.locator("#analysis_description").fill("def")
        page.locator("#analysis_model_type").select_option("C")

        # select models
        page.locator("#select_all_frequentist_restricted").click()

        # view data tab
        page.locator('a:has-text("Data")').click()
        page.locator('button:has-text("New")').click()
        page.locator("text=Load an example dataset").click()

        # save current settings
        page.locator('a:has-text("Settings")').click()
        page.locator("text=Save Analysis").click()

        if self.can_execute:
            # execute and wait until complete
            page.locator("text=Run Analysis").click()
            expect(page.locator("#controlPanel")).to_contain_text("Executing, please wait...")

            # view output summary tables
            page.locator('a:has-text("Output")').click()
            expect(page.locator("#frequentist-model-result tbody tr")).to_have_count(2)

            # display frequentist modal
            page.locator("#freq-result-0").click()
            # expect(page.locator("#info-table tbody tr")).to_have_count(3)
            page.locator("#close-modal").click()

            page.locator("#selection_model").select_option("0")
            page.locator("#selection_notes").fill("selected!")
            page.locator("#selection_submit").click()
            expect(page.locator(".toast")).to_contain_text("Model selection updated.")

        page.locator('a:has-text("Logic")').click()
        expect(page.locator("#decision-logic tbody tr")).to_have_count(4)
        expect(page.locator("#rule-table tbody tr")).to_have_count(20)

        # Read-only
        page.get_by_role("button", name="Share").click()
        with page.expect_popup() as page2_info:
            page.get_by_role("link", name="Open").first.click()
        page2 = page2_info.value
        page2.get_by_role("link", name="Settings").click()
        page2.get_by_role("link", name="Data").click()
        page2.get_by_role("link", name="Output").click()
        page2.get_by_role("link", name="Logic").click()

    def test_dichotomous(self):
        page = self.page
        page.goto(self.url("/"))

        with page.expect_navigation():
            page.get_by_role("button", name="Create a new BMDS analysis").click()

        # set main input
        page.locator("#analysis_name").fill("abc")
        page.locator("#analysis_description").fill("def")
        page.locator("#analysis_model_type").select_option("D")

        # select models
        page.locator("#select_all_frequentist_restricted").click(click_count=2)
        page.locator("#select_all_frequentist_unrestricted").click(click_count=2)
        page.locator("#frequentist_unrestricted-Logistic").check()
        page.locator("#bayesian-Logistic").check()

        # view data tab
        page.locator('a:has-text("Data")').click()
        page.locator('button:has-text("New")').click()
        page.locator("text=Load an example dataset").click()

        # save current settings
        page.locator('a:has-text("Settings")').click()
        page.locator("text=Save Analysis").click()

        if self.can_execute:
            # execute and wait until complete
            page.locator("text=Run Analysis").click()
            expect(page.locator("#controlPanel")).to_contain_text("Executing, please wait...")

            # view output summary tables
            page.locator('a:has-text("Output")').click()
            expect(page.locator("#frequentist-model-result tbody tr")).to_have_count(2)
            expect(page.locator("#bayesian-model-result tbody tr")).to_have_count(2)

            # display frequentist modal
            page.locator("#freq-result-0").click()
            # expect(page.locator("#info-table tbody tr")).to_have_count(3)
            page.locator("#close-modal").click()

            # display bayesian modal
            page.locator("#bayesian-result-0").click()
            # expect(page.locator("#info-table tbody tr")).to_have_count(3)
            page.locator("#close-modal").click()

            # display bayesian model average modal
            page.locator("td", has_text="Model Average").click()
            expect(page.locator("#ma-result-summary tbody tr")).to_have_count(3)
            page.locator("#close-modal").click()

            page.locator("#selection_model").select_option("0")
            page.locator("#selection_notes").fill("selected!")
            page.locator("#selection_submit").click()
            expect(page.locator(".toast")).to_contain_text("Model selection updated.")

        page.locator('a:has-text("Logic")').click()
        expect(page.locator("#decision-logic tbody tr")).to_have_count(4)
        expect(page.locator("#rule-table tbody tr")).to_have_count(18)

        # Read-only
        page.get_by_role("button", name="Share").click()
        with page.expect_popup() as page2_info:
            page.get_by_role("link", name="Open").first.click()
        page2 = page2_info.value
        page2.get_by_role("link", name="Settings").click()
        page2.get_by_role("link", name="Data").click()
        page2.get_by_role("link", name="Output").click()
        page2.get_by_role("link", name="Logic").click()

    def test_nested_dichotomous(self):
        page = self.page
        page.goto(self.url("/"))

        with page.expect_navigation():
            page.locator("text=Create a new BMDS analysis").click()

        # set main input
        page.locator("#analysis_name").fill("abc123")
        page.locator("#analysis_description").fill("def")
        page.locator("#analysis_model_type").select_option("ND")

        # view data tab, add 2 datasets
        page.locator('a:has-text("Data")').click()
        page.locator('button:has-text("New")').click()

        page.get_by_role("button", name="Load an example dataset").click()

        # 2nd dataset
        page.locator('button:has-text("New")').click()
        page.locator("text=Load an example dataset").click()

        # save current settings
        page.locator('a:has-text("Settings")').click()
        page.get_by_role("button", name="Save Analysis").click()

        if self.can_execute:
            # execute and wait until complete
            page.locator("text=Run Analysis").click()
            expect(page.locator("#controlPanel")).to_contain_text("Executing, please wait...")

            # view output summary tables
            page.locator('a:has-text("Output")').click()
            # num rows in results table
            expect(page.locator("#frequentist-model-result tbody tr")).to_have_count(5)

            # check each result
            page.get_by_role("link", name="Nested Logistic (lsc+ilc-)*").click()
            expect(page.get_by_role("dialog")).to_contain_text("Nested Logistic (lsc+ilc-)")
            page.locator("#close-modal").click()

            page.get_by_role("link", name="Nested Logistic (lsc-ilc-)").click()
            expect(page.get_by_role("dialog")).to_contain_text("Nested Logistic (lsc-ilc-)")
            page.locator("#close-modal").click()

            page.get_by_role("link", name="Nested Logistic (lsc+ilc+)").click()
            expect(page.get_by_role("dialog")).to_contain_text("Nested Logistic (lsc+ilc+)")
            page.locator("#close-modal").click()

            page.get_by_role("link", name="Nested Logistic (lsc-ilc+)").click()
            expect(page.get_by_role("dialog")).to_contain_text("Nested Logistic (lsc-ilc+)")
            page.locator("#close-modal").click()

        # Read-only
        page.get_by_role("button", name="Share").click()
        with page.expect_popup() as page2_info:
            page.get_by_role("link", name="Open").first.click()
        page2 = page2_info.value
        page2.get_by_role("link", name="Settings").click()
        page2.get_by_role("link", name="Data").click()
        page2.get_by_role("link", name="Output").click()
        page2.get_by_role("link", name="Logic").click()

    def test_multi_tumor(self):
        # TODO: verify MT output?
        page = self.page
        page.goto(self.url("/"))

        with page.expect_navigation():
            page.locator("text=Create a new BMDS analysis").click()

        # set main input
        page.locator("#analysis_name").fill("abc123")
        page.locator("#analysis_description").fill("def")
        page.locator("#analysis_model_type").select_option("MT")

        # view data tab, add 3 datasets
        page.locator('a:has-text("Data")').click()
        page.locator('button:has-text("New")').click()
        page.locator("text=Load an example dataset").click()

        # 2nd dataset
        page.locator('button:has-text("New")').click()
        page.locator("text=Load an example dataset").click()

        # 3rd dataset
        page.locator('button:has-text("New")').click()
        page.locator("text=Load an example dataset").click()

        # add 2 more option sets (3 total)
        page.locator('button:has-text("Add option set.")').click()
        page.locator('button:has-text("Add option set.")').click()

        # save current settings
        page.locator('a:has-text("Settings")').click()
        page.locator("text=Save Analysis").click()

        if self.can_execute:
            # execute and wait until complete
            page.locator("text=Run Analysis").click()
            expect(page.locator("#controlPanel")).to_contain_text("Executing, please wait...")

            # view output summary tables
            page.locator('a:has-text("Output")').click()

            # individual rows in the output summary table, the modal appears and it renders ok
            # as well as the model average row

        # Read-only
        page.get_by_role("button", name="Share").click()
        with page.expect_popup() as page2_info:
            page.get_by_role("link", name="Open").first.click()
        page2 = page2_info.value
        page2.get_by_role("link", name="Settings").click()
        page2.get_by_role("link", name="Data").click()
        page2.get_by_role("link", name="Output").click()
        page2.get_by_role("link", name="Logic").click()

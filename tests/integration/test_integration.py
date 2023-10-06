from playwright.sync_api import expect

from .common import PlaywrightTestCase


class TestContinuousIntegration(PlaywrightTestCase):
    def test_continuous(self):
        page = self.page

        page.goto(self.url("/"))
        page = self.page

        page.goto(self.url("/"))
        with page.expect_navigation():
            page.locator("text=Create a new BMDS analysis").click()

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
            expect(page.locator("#info-table tbody tr")).to_have_count(3)
            page.locator("#close-modal").click()

            page.locator("#selection_model").select_option("0")
            page.locator("#selection_notes").fill("selected!")
            page.locator("#selection_submit").click()
            expect(page.locator(".toast")).to_contain_text("Model selection updated.")

        page.locator('a:has-text("Logic")').click()
        expect(page.locator("#decision-logic tbody tr")).to_have_count(4)
        expect(page.locator("#rule-table tbody tr")).to_have_count(20)

        # TODO - add read-only views in BMDS 23.3

    def test_dichotomous(self):
        page = self.page

        page.goto(self.url("/"))
        with page.expect_navigation():
            page.locator("text=Create a new BMDS analysis").click()

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
            expect(page.locator("#info-table tbody tr")).to_have_count(3)
            page.locator("#close-modal").click()

            # display bayesian modal
            page.locator("#bayesian-result-0").click()
            expect(page.locator("#info-table tbody tr")).to_have_count(3)
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

        # TODO - add read-only views in BMDS 23.3

    def test_nested_dichotomous(self):
        # TODO: verify ND output
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
        page.locator("text=Load an example dataset").click()
        # adjust test data 50 ->150
        page.locator("#qalgylpqnppihwf").click()
        page.locator("#qalgylpqnppihwf").fill("150")
        page.locator("#cjnieclfjrdjiyk").click()
        page.locator("#cjnieclfjrdjiyk").fill("150")
        page.locator("#vytilrydxguqcdy").click()
        page.locator("#vytilrydxguqcdy").fill("150")
        # 2nd dataset
        page.locator('button:has-text("New")').click()
        page.locator("text=Load an example dataset").click()
        # adjust test data 50 ->150
        page.locator("#eosznjfkmdsvadh").click()
        page.locator("#eosznjfkmdsvadh").fill("150")
        page.getByText(
            "Dataset nameDeleteDose nameResponse nameDose unitsResponse unitsDoseLitter SizeI"
        ).click()
        page.locator("#nlrxprfuftqcwkx").click()
        page.locator("#nlrxprfuftqcwkx").fill("150")
        page.locator("#gafzqjnfdficibv").click()
        page.locator("#gafzqjnfdficibv").fill("150")

        # save current settings
        page.locator('a:has-text("Settings")').click()
        page.locator("text=Save Analysis").click()

        if self.can_execute:
            # execute and wait until complete
            page.locator("text=Run Analysis").click()
            expect(page.locator("#controlPanel")).to_contain_text("Executing, please wait...")

            # view output summary tables
            page.locator('a:has-text("Output")').click()

    def test_multi_tumor(self):
        # TODO: verify MT output
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

import pytest

from bmds_server.analysis.models import Analysis
from bmds_server.analysis.reporting.docx import build_docx
from bmds_server.analysis.reporting.excel import dataset_df, params_df, summary_df


@pytest.mark.django_db()
class TestBmds3Execution:
    def test_c(self, bmds3_complete_continuous):
        analysis = Analysis.objects.create(inputs=bmds3_complete_continuous)

        assert analysis.is_finished is False
        assert analysis.has_errors is False

        analysis.execute()

        assert analysis.is_finished is True
        assert analysis.has_errors is False
        assert analysis.outputs["outputs"][0]["dataset_index"] == 0
        assert analysis.outputs["outputs"][0]["option_index"] == 0
        assert len(analysis.outputs["outputs"]) == 1
        assert len(analysis.outputs["outputs"][0]["frequentist"]["models"]) == 1
        assert len(analysis.outputs["outputs"][0]["bayesian"]["models"]) == 1
        assert analysis.errors == []

        # test reporting (for completion)
        build_docx(analysis, "http://bmds-python.com")
        summary_df(analysis)
        dataset_df(analysis)
        params_df(analysis)

    def test_ci(self, bmds3_complete_continuous_individual):
        analysis = Analysis.objects.create(inputs=bmds3_complete_continuous_individual)

        assert analysis.is_finished is False
        assert analysis.has_errors is False

        analysis.execute()

        assert analysis.is_finished is True
        assert analysis.has_errors is False
        assert analysis.outputs["outputs"][0]["dataset_index"] == 0
        assert analysis.outputs["outputs"][0]["option_index"] == 0
        assert len(analysis.outputs["outputs"]) == 1
        assert len(analysis.outputs["outputs"][0]["frequentist"]["models"]) == 1
        assert len(analysis.outputs["outputs"][0]["bayesian"]["models"]) == 1
        assert analysis.errors == []

        # test reporting (for completion)
        build_docx(analysis, "http://bmds-python.com")
        summary_df(analysis)
        dataset_df(analysis)
        params_df(analysis)

    def test_d(self, bmds3_complete_dichotomous):
        analysis = Analysis.objects.create(inputs=bmds3_complete_dichotomous)

        assert analysis.is_finished is False
        assert analysis.has_errors is False

        analysis.execute()

        assert analysis.is_finished is True
        assert analysis.has_errors is False
        assert analysis.outputs["outputs"][0]["dataset_index"] == 0
        assert analysis.outputs["outputs"][0]["option_index"] == 0
        assert len(analysis.outputs["outputs"]) == 1
        assert len(analysis.outputs["outputs"][0]["frequentist"]["models"]) == 1
        assert len(analysis.outputs["outputs"][0]["bayesian"]["models"]) == 1
        assert analysis.errors == []

        # test reporting (for completion)
        build_docx(analysis, "http://bmds-python.com")
        summary_df(analysis)
        dataset_df(analysis)
        params_df(analysis)

    def test_nd(self, bmds_complete_nd):
        bmds_complete_nd["recommender"]["enabled"] = False  # TODO - remove after recommendation
        analysis = Analysis.objects.create(inputs=bmds_complete_nd)

        assert analysis.is_finished is False
        assert analysis.has_errors is False

        analysis.execute()

        assert analysis.is_finished is True
        assert analysis.has_errors is False
        assert analysis.outputs["outputs"][0]["dataset_index"] == 0
        assert analysis.outputs["outputs"][0]["option_index"] == 0
        assert len(analysis.outputs["outputs"]) == 1
        assert len(analysis.outputs["outputs"][0]["frequentist"]["models"]) == 4
        assert analysis.outputs["outputs"][0]["bayesian"] is None
        assert analysis.errors == []

        # test reporting (for completion)
        build_docx(analysis, "http://bmds-python.com")
        summary_df(analysis)
        # dataset_df(analysis) # TODO - add
        # params_df(analysis) # TODO - add

    def test_mt(self, bmds_complete_mt):
        analysis = Analysis.objects.create(inputs=bmds_complete_mt)

        assert analysis.is_finished is False
        assert analysis.has_errors is False

        analysis.execute()

        assert analysis.is_finished is True
        assert analysis.has_errors is False
        assert len(analysis.outputs["outputs"]) == 1
        assert len(analysis.outputs["outputs"][0]["frequentist"]["results"]["models"]) == 3
        assert len(analysis.outputs["outputs"][0]["frequentist"]["results"]["models"][0]) == 1
        assert len(analysis.outputs["outputs"][0]["frequentist"]["results"]["models"][1]) == 3
        assert analysis.outputs["outputs"][0]["bayesian"] is None
        assert analysis.errors == []

        # test reporting (for completion)
        # build_docx(analysis, "http://bmds-python.com") # TODO - add
        # summary_df(analysis) # TODO - add
        # dataset_df(analysis) # TODO - add
        # params_df(analysis) # TODO - add

import os
import platform

import pytest

from bmds_server.analysis.models import Analysis
from bmds_server.analysis.reporting.docx import build_docx
from bmds_server.analysis.reporting.excel import build_df

# TODO remove this restriction
should_run = platform.system() != "Windows" and os.getenv("CI") is None


@pytest.mark.django_db()
@pytest.mark.skipif(not should_run, reason="dlls only exist for Mac")
class TestBmds3Execution:
    def test_c(self, bmds3_complete_continuous):
        analysis = Analysis.objects.create(inputs=bmds3_complete_continuous)

        assert analysis.is_finished is False
        assert analysis.has_errors is False

        analysis.execute()

        assert analysis.is_finished is True
        assert analysis.has_errors is False
        assert analysis.outputs["outputs"][0]["metadata"]["dataset_index"] == 0
        assert analysis.outputs["outputs"][0]["metadata"]["option_index"] == 0
        assert len(analysis.outputs["outputs"]) == 1
        assert len(analysis.outputs["outputs"][0]["frequentist"]["models"]) == 1
        assert len(analysis.outputs["outputs"][0]["bayesian"]["models"]) == 1
        assert analysis.errors == []

        # test reporting (for completion)
        build_docx(analysis, "http://bmds-python.com")
        df = build_df(analysis)
        df.to_excel("~/Desktop/output_c.xlsx", index=False)

    def test_ci(self, bmds3_complete_continuous_individual):
        analysis = Analysis.objects.create(inputs=bmds3_complete_continuous_individual)

        assert analysis.is_finished is False
        assert analysis.has_errors is False

        analysis.execute()

        assert analysis.is_finished is True
        assert analysis.has_errors is False
        assert analysis.outputs["outputs"][0]["metadata"]["dataset_index"] == 0
        assert analysis.outputs["outputs"][0]["metadata"]["option_index"] == 0
        assert len(analysis.outputs["outputs"]) == 1
        assert len(analysis.outputs["outputs"][0]["frequentist"]["models"]) == 1
        assert len(analysis.outputs["outputs"][0]["bayesian"]["models"]) == 1
        assert analysis.errors == []

        # test reporting (for completion)
        build_docx(analysis, "http://bmds-python.com")
        df = build_df(analysis)
        df.to_excel("~/Desktop/output_ci.xlsx", index=False)

    def test_d(self, bmds3_complete_dichotomous):
        analysis = Analysis.objects.create(inputs=bmds3_complete_dichotomous)

        assert analysis.is_finished is False
        assert analysis.has_errors is False

        analysis.execute()

        assert analysis.is_finished is True
        assert analysis.has_errors is False
        assert analysis.outputs["outputs"][0]["metadata"]["dataset_index"] == 0
        assert analysis.outputs["outputs"][0]["metadata"]["option_index"] == 0
        assert len(analysis.outputs["outputs"]) == 1
        assert len(analysis.outputs["outputs"][0]["frequentist"]["models"]) == 1
        assert len(analysis.outputs["outputs"][0]["bayesian"]["models"]) == 1
        assert analysis.errors == []

        # test reporting (for completion)
        build_docx(analysis, "http://bmds-python.com")
        df = build_df(analysis)
        df.to_excel("~/Desktop/output_d.xlsx", index=False)

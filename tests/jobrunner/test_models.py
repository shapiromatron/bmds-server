import os
import platform

import pytest

from bmds_server.analysis.models import Analysis

# TODO remove this restriction
should_run = platform.system() != "Windows" and os.getenv("CI") is None


@pytest.mark.django_db()
@pytest.mark.skipif(not should_run, reason="dlls only exist for Mac")
class TestBmds3Execution:
    def test_bmds3_execution_c(self, bmds3_complete_continuous):
        analysis = Analysis.objects.create(inputs=bmds3_complete_continuous)

        assert analysis.is_finished is False
        assert analysis.has_errors is False

        analysis.execute()

        assert analysis.is_finished is True
        assert analysis.has_errors is False
        assert analysis.outputs["outputs"][0]["metadata"]["dataset_index"] == 0
        assert analysis.outputs["outputs"][0]["metadata"]["option_index"] == 0
        assert len(analysis.outputs["outputs"]) == 1
        assert len(analysis.outputs["outputs"][0]["models"]) == 1
        assert analysis.errors == []

    def test_bmds3_execution_d(self, bmds3_complete_dichotomous):
        analysis = Analysis.objects.create(inputs=bmds3_complete_dichotomous)

        assert analysis.is_finished is False
        assert analysis.has_errors is False

        analysis.execute()

        assert analysis.is_finished is True
        assert analysis.has_errors is False
        assert analysis.outputs["outputs"][0]["metadata"]["dataset_index"] == 0
        assert analysis.outputs["outputs"][0]["metadata"]["option_index"] == 0
        assert len(analysis.outputs["outputs"]) == 1
        assert len(analysis.outputs["outputs"][0]["models"]) == 1
        assert analysis.errors == []

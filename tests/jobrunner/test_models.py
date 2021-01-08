import os
import platform

import pytest

from bmds_server.jobrunner.models import Job

# TODO remove this restriction
should_run = platform.system() == "Darwin" and os.getenv("CI") is None


@pytest.mark.django_db()
@pytest.mark.skipif(not should_run, reason="dlls only exist for Mac")
class TestBmds3Execution:
    def test_bmds3_execution_c(self, bmds3_complete_continuous):
        job = Job.objects.create(inputs=bmds3_complete_continuous)

        assert job.is_finished is False
        assert job.has_errors is False

        job.execute()

        assert job.is_finished is True
        assert job.has_errors is False
        assert job.outputs["outputs"][0]["dataset_index"] == 0
        assert job.outputs["outputs"][0]["option_index"] == 0
        assert len(job.outputs["outputs"]) == 1
        assert len(job.outputs["outputs"][0]["models"]) == 1
        assert job.errors == []

    def test_bmds3_execution_d(self, bmds3_complete_dichotomous):
        job = Job.objects.create(inputs=bmds3_complete_dichotomous)

        assert job.is_finished is False
        assert job.has_errors is False

        job.execute()

        assert job.is_finished is True
        assert job.has_errors is False
        assert job.outputs["outputs"][0]["dataset_index"] == 0
        assert job.outputs["outputs"][0]["option_index"] == 0
        assert len(job.outputs["outputs"]) == 1
        assert len(job.outputs["outputs"][0]["models"]) == 1
        assert job.errors == []

import pytest


@pytest.mark.django_db()
class TestBmds3Execution:
    pass

    # def test_bmds3_execution_c(self, bmds3_complete_continuous):
    #     job = Job.objects.create(inputs=json.dumps(bmds3_complete_continuous))
    #     job.execute()
    #     assert len(job.outputs) > 0
    #     assert job.errors == "[]"

    # def test_bmds3_execution_d(self, bmds3_complete_dichotomous):
    #     job = Job.objects.create(inputs=json.dumps(bmds3_complete_dichotomous))
    #     job.execute()
    #     assert len(job.outputs) > 0
    #     assert job.errors == "[]"

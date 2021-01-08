from copy import deepcopy

from bmds_server.jobrunner.models import Job


class TestBmds3SessionBuild:
    def test_default_dichotomous(self, bmds3_complete_dichotomous):
        # assure a default dataset can be created
        data = deepcopy(bmds3_complete_dichotomous)
        session = Job.build_session(data, 0, 0)
        assert len(session.models) == 1

    def test_default_continuous(self, bmds3_complete_continuous):
        # assure a default dataset can be created
        data = deepcopy(bmds3_complete_continuous)
        session = Job.build_session(data, 0, 0)
        assert len(session.models) == 1

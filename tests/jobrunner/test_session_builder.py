from copy import deepcopy

from bmds_server.jobrunner.models import Job


class TestBmds2SessionBuild:
    def test_default(self, bmds2_complete_continuous):
        # assure a default dataset can be created
        data = deepcopy(bmds2_complete_continuous)
        session = Job.build_session(data, data["datasets"][0])
        assert len(session.models) == 10

    def test_model_overrides(self, bmds2_complete_continuous):
        # assure global overides are applied
        data = deepcopy(bmds2_complete_continuous)
        data["bmr"] = {"type": "Std. Dev.", "value": 0.123}
        session = Job.build_session(data, data["datasets"][0])
        for model in session.models:
            assert model.settings["bmr"] == 0.123

    def test_global_and_single_overrides(self, bmds2_complete_continuous):
        # assure global and then model-specific overrides are applied, in that order.
        data = deepcopy(bmds2_complete_continuous)
        data["bmr"] = {"type": "Std. Dev.", "value": 0.123}
        data["models"] = [{"name": "Linear", "settings": {"bmr": 0.456}}, {"name": "Linear"}]
        session = Job.build_session(data, data["datasets"][0])
        assert session.models[0].settings["bmr"] == 0.456
        for idx in range(1, len(session.models)):
            assert session.models[idx].settings["bmr"] == 0.123


class TestBmds3SessionBuild:
    def test_default_dichotomous(self, bmds3_complete_dichotomous):
        # assure a default dataset can be created
        data = deepcopy(bmds3_complete_dichotomous)
        session = Job.build_session(data, data["datasets"][0])
        assert len(session.models) == 1

    def test_default_continuous(self, bmds3_complete_continuous):
        # assure a default dataset can be created
        data = deepcopy(bmds3_complete_continuous)
        session = Job.build_session(data, data["datasets"][0])
        assert len(session.models) == 1

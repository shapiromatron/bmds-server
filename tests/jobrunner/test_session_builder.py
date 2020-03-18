from copy import deepcopy

from bmds_server.jobrunner.models import Job


def test_model_overrides(complete_continuous):
    # case #1: assure global overrides applied
    data = deepcopy(complete_continuous)
    data["bmr"] = {"type": "Std. Dev.", "value": 0.123}
    session = Job.build_session(data, data["datasets"][0])
    for model in session.models:
        assert model.overrides["bmr"] == 0.123

    # case #2: assure model overrides are applied after global overrides
    data = deepcopy(complete_continuous)
    data["bmr"] = {"type": "Std. Dev.", "value": 0.123}
    data["models"] = [{"name": "Linear", "settings": {"bmr": 0.456}}, {"name": "Linear"}]
    session = Job.build_session(data, data["datasets"][0])
    assert session.models[0].overrides["bmr"] == 0.456
    assert session.models[1].overrides["bmr"] == 0.123

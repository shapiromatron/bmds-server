import pytest
from bmds.bmds3.types.continuous import ContinuousRiskType
from bmds.bmds3.types.dichotomous import DichotomousRiskType

from bmds_server.jobrunner import transforms


class TestOptions:
    def test_bmds3_options_c(self, bmds3_complete_continuous):
        prior_class = "frequentist_unrestricted"
        options = {
            "bmr_type": 2,
            "bmr_value": 1.5,
            "tail_probability": 0.4,
            "confidence_level": 0.95,
            "dist_type": 1,
        }
        dataset_options = {"dataset_id": 123, "enabled": True, "degree": 0, "adverse_direction": -1}
        res = transforms.bmds3_c_model_options(prior_class, options, dataset_options)
        assert res.bmr_type is ContinuousRiskType.eStandardDev
        assert pytest.approx(res.bmr, 1.5)
        assert pytest.approx(res.alpha, 0.05)
        assert pytest.approx(res.tail_prob, 0.4)
        assert res.degree == 0
        assert res.is_increasing is None

    def test_bmds3_options_d(self, bmds3_complete_dichotomous):
        prior_class = "frequentist_unrestricted"
        options = {
            "bmr_type": 2,
            "bmr_value": 0.15,
            "confidence_level": 0.95,
        }
        dataset_options = {"dataset_id": 123, "enabled": True, "degree": 1}
        res = transforms.bmds3_d_model_options(prior_class, options, dataset_options)
        assert res.bmr_type is DichotomousRiskType.eAddedRisk
        assert pytest.approx(res.bmr, 0.15)
        assert pytest.approx(res.alpha, 0.05)
        assert res.degree == 1

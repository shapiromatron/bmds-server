import pytest
from bmds.bmds3.types.dichotomous import DichotomousRiskType

from bmds_server.jobrunner import transforms


class TestOptions:
    # def test_bmds3_options_c(self, bmds3_complete_continuous):
    #     options = {
    #         "bmr_type": "Std. Dev.",
    #         "bmr_value": 1.5,
    #         "tail_probability": 0.4,
    #         "confidence_level": 0.6,
    #         "distribution": "Normal",
    #         "variance": "Calculated",
    #         "polynomial_restriction": "Use dataset adverse direction",
    #         "background": "Estimated",
    #     }
    #     res = transforms.bmds3_c_model_options(options)
    #     assert res.bmr_type is ContinuousRiskType.eStandardDev  # noqa: E721
    #     assert pytest.approx(res.bmr, 1.5)
    #     assert pytest.approx(res.alpha, 0.6)
    #     assert pytest.approx(res.tailProb, 0.4)

    def test_bmds3_options_d(self, bmds3_complete_dichotomous):
        prior_class = "frequentist_unrestricted"
        options = {
            "bmr_type": "Added",
            "bmr_value": 0.15,
            "confidence_level": 0.95,
            "background": "Estimated",
        }
        res = transforms.bmds3_d_model_options(prior_class, options)
        assert res.bmr_type is DichotomousRiskType.eAddedRisk
        assert pytest.approx(res.bmr, 0.15)
        assert pytest.approx(res.alpha, 0.95)

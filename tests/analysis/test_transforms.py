import bmds
import pytest
from bmds.bmds3.types.continuous import ContinuousRiskType
from bmds.bmds3.types.dichotomous import DichotomousRiskType
from bmds.constants import M_Exponential, M_ExponentialM3, M_ExponentialM5

from bmds_server.analysis import transforms


class TestOptions:
    def test_bmds3_options_c(self, bmds3_complete_continuous):
        options = {
            "bmr_type": 2,
            "bmr_value": 1.5,
            "tail_probability": 0.4,
            "confidence_level": 0.95,
            "dist_type": 1,
        }
        dataset_options = {"dataset_id": 123, "enabled": True, "degree": 0, "adverse_direction": -1}
        res = transforms.build_model_settings(
            bmds.constants.CONTINUOUS,
            transforms.PriorEnum.frequentist_restricted,
            options,
            dataset_options,
        )
        assert res.bmr_type is ContinuousRiskType.StandardDeviation
        assert pytest.approx(res.bmr, 1.5)
        assert pytest.approx(res.alpha, 0.05)
        assert pytest.approx(res.tail_prob, 0.4)
        assert res.degree == 0
        assert res.is_increasing is None

    def test_bmds3_options_d(self, bmds3_complete_dichotomous):
        options = {
            "bmr_type": 0,
            "bmr_value": 0.15,
            "confidence_level": 0.95,
        }
        dataset_options = {"dataset_id": 123, "enabled": True, "degree": 1}
        res = transforms.build_model_settings(
            bmds.constants.DICHOTOMOUS,
            transforms.PriorEnum.frequentist_restricted,
            options,
            dataset_options,
        )
        assert res.bmr_type is DichotomousRiskType.AddedRisk
        assert pytest.approx(res.bmr, 0.15)
        assert pytest.approx(res.alpha, 0.05)
        assert res.degree == 1


def test_remap_exponential():
    assert transforms.remap_exponential([]) == []
    assert transforms.remap_exponential([M_Exponential]) == [M_ExponentialM3, M_ExponentialM5]
    expected = ["a", M_ExponentialM3, M_ExponentialM5, "b"]
    assert transforms.remap_exponential(["a", M_Exponential, "b"]) == expected

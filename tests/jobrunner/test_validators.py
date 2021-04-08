from typing import Any, Dict

import bmds
import pytest
from bmds.bmds3.recommender import RecommenderSettings
from django.core.exceptions import ValidationError

from bmds_server.analysis import validators


class TestInputValidation:
    def test_bmds3_partial(self):
        data: Dict[str, Any] = {
            "bmds_version": bmds.constants.BMDS330,
            "dataset_type": bmds.constants.CONTINUOUS,
        }

        # check minimal passes when partial
        assert validators.validate_input(data, partial=True) is None

        # but fails when complete
        with pytest.raises(ValidationError) as err:
            validators.validate_input(data)
        assert "'datasets' is a required property" in str(err)

        # add datasets, try again
        data["datasets"] = [
            {
                "dtype": "C",
                "metadata": {"id": 123},
                "doses": [0, 10, 50, 150, 400],
                "ns": [111, 142, 143, 93, 42],
                "means": [2.112, 2.095, 1.956, 1.587, 1.254],
                "stdevs": [0.235, 0.209, 0.231, 0.263, 0.159],
            }
        ]
        data["dataset_options"] = [
            {"dataset_id": 123, "enabled": True, "degree": 0, "adverse_direction": -1}
        ]
        assert validators.validate_input(data, partial=True) is None

        with pytest.raises(ValidationError) as err:
            validators.validate_input(data)
        assert "'models' is a required property" in str(err)

        # add models, try again
        data["models"] = {"frequentist_restricted": [bmds.constants.M_Power]}
        assert validators.validate_input(data, partial=True) is None

        with pytest.raises(ValidationError) as err:
            validators.validate_input(data)
        assert "'options' is a required property" in str(err)

        # add options, try again
        data["options"] = [
            {
                "bmr_type": 2,
                "bmr_value": 1.0,
                "tail_probability": 0.95,
                "confidence_level": 0.95,
                "dist_type": 1,
            }
        ]
        with pytest.raises(ValidationError) as err:
            validators.validate_input(data)
        assert "rules" in str(err) and "field required" in str(err)

        data["recommender"] = RecommenderSettings.build_default().dict()
        assert validators.validate_input(data, partial=True) is None
        assert validators.validate_input(data) is None


class TestModelValidation:
    def test_bmds3_dichotomous(self):
        dtype = bmds.constants.DICHOTOMOUS
        version = bmds.constants.BMDS330
        probit = bmds.constants.M_Probit
        logprobit = bmds.constants.M_LogProbit

        # test success
        assert (
            validators.validate_models(version, dtype, {"frequentist_restricted": [logprobit]},)
            is None
        )

        # assert wrong model type
        with pytest.raises(ValidationError) as err:
            validators.validate_models(
                version, dtype, {"frequentist_restricted": [bmds.constants.M_Power]},
            )
        assert "is not one of" in str(err)

        # assert duplicates model type
        with pytest.raises(ValidationError) as err:
            validators.validate_models(
                version, dtype, {"frequentist_restricted": [logprobit, logprobit]},
            )
        assert "has non-unique elements" in str(err)

        # assert empty
        with pytest.raises(ValidationError) as err:
            validators.validate_models(
                version, dtype, {"frequentist_restricted": []},
            )
        assert "At least one model must be selected" in str(err)

        # assert bayesian duplicates
        with pytest.raises(ValidationError) as err:
            validators.validate_models(
                version,
                dtype,
                {
                    "bayesian_model_average": [
                        {"model": probit, "prior_weight": 0.3},
                        {"model": logprobit, "prior_weight": 0.4},
                        {"model": logprobit, "prior_weight": 0.3},
                    ]
                },
            )
        assert "Model names in bayesian model average not unique" in str(err)

        # assert bayesian prior_weight sum
        with pytest.raises(ValidationError) as err:
            validators.validate_models(
                version,
                dtype,
                {
                    "bayesian_model_average": [
                        {"model": probit, "prior_weight": 0.5},
                        {"model": logprobit, "prior_weight": 0.49},
                    ]
                },
            )
        assert "Prior weight in bayesian model average does not sum to 1" in str(err)

    def test_bmds3_continuous(self):
        dtype = bmds.constants.CONTINUOUS
        version = bmds.constants.BMDS330
        power = bmds.constants.M_Power
        linear = bmds.constants.M_Linear

        # test success
        assert (
            validators.validate_models(version, dtype, {"frequentist_restricted": [power]},) is None
        )

        # assert wrong model type
        with pytest.raises(ValidationError) as err:
            validators.validate_models(
                version, dtype, {"frequentist_restricted": [bmds.constants.M_Probit]},
            )
        assert "is not one of" in str(err)

        # assert duplicates model type
        with pytest.raises(ValidationError) as err:
            validators.validate_models(
                version, dtype, {"frequentist_restricted": [power, power]},
            )
        assert "has non-unique elements" in str(err)

        # assert empty
        with pytest.raises(ValidationError) as err:
            validators.validate_models(
                version, dtype, {"frequentist_restricted": []},
            )
        assert "At least one model must be selected" in str(err)

        # assert bayesian duplicates
        with pytest.raises(ValidationError) as err:
            validators.validate_models(
                version,
                dtype,
                {
                    "bayesian_model_average": [
                        {"model": power, "prior_weight": 0.3},
                        {"model": linear, "prior_weight": 0.4},
                        {"model": linear, "prior_weight": 0.3},
                    ]
                },
            )
        assert "Model names in bayesian model average not unique" in str(err)

        # assert bayesian prior_weight sum
        with pytest.raises(ValidationError) as err:
            validators.validate_models(
                version,
                dtype,
                {
                    "bayesian_model_average": [
                        {"model": power, "prior_weight": 0.5},
                        {"model": linear, "prior_weight": 0.49},
                    ]
                },
            )
        assert "Prior weight in bayesian model average does not sum to 1" in str(err)


class TestOptionSetValidation:
    def test_dichotomous(self):
        # test success
        data = [dict(bmr_type=1, bmr_value=0.1, confidence_level=0.95)]
        assert validators.validate_options(bmds.constants.DICHOTOMOUS, data) is None

        # must have at least one option
        data = []
        with pytest.raises(ValidationError) as err:
            validators.validate_options(bmds.constants.DICHOTOMOUS, data)
        assert "ensure this value has at least 1 items" in str(err)

    def test_continuous(self):
        # test success
        data = [
            {
                "bmr_type": 2,
                "bmr_value": 1.0,
                "tail_probability": 0.95,
                "confidence_level": 0.95,
                "dist_type": 1,
            }
        ]
        assert validators.validate_options(bmds.constants.CONTINUOUS, data) is None

        # must have at least one option
        data = []
        with pytest.raises(ValidationError) as err:
            validators.validate_options(bmds.constants.CONTINUOUS, data)
        assert "ensure this value has at least 1 items" in str(err)

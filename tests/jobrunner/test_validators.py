import json
from copy import deepcopy

import bmds
import pytest
from django.core.exceptions import ValidationError

from bmds_server.jobrunner import validators


class TestInputValidation:
    def test_invalid_json(self):
        # invalid JSON
        with pytest.raises(ValidationError):
            validators.validate_input("{")

    def test_bmds2_model_override(self, bmds2_complete_continuous):
        # complete check
        c_models = [{"name": "Exponential-M2"}, {"name": "Exponential-M3"}]
        d_models = [{"name": "Logistic"}, {"name": "LogLogistic"}]
        data = deepcopy(bmds2_complete_continuous)

        data["models"] = c_models
        assert validators.validate_input(json.dumps(data)) is None

        data = deepcopy(bmds2_complete_continuous)
        data["models"] = d_models
        with pytest.raises(ValidationError) as err:
            validators.validate_input(json.dumps(data))
        assert "is not one of" in str(err)

        # should fail w/ bmds3
        data = deepcopy(bmds2_complete_continuous)
        data.update(bmds_version=bmds.constants.BMDS312, models=c_models)
        with pytest.raises(ValidationError) as err:
            validators.validate_input(json.dumps(data))

    def test_bmds2_bmr_override(self, bmds2_complete_continuous):
        # Check models can be specified
        c_bmr = {"type": "Std. Dev.", "value": 1.0}
        d_bmr = {"type": "Added", "value": 0.1}

        # complete check
        data = deepcopy(bmds2_complete_continuous)
        data["bmr"] = c_bmr
        assert validators.validate_input(json.dumps(data)) is None

        # wrong bmr specification
        data = deepcopy(bmds2_complete_continuous)
        data["bmr"] = d_bmr
        with pytest.raises(ValidationError) as err:
            validators.validate_input(json.dumps(data))
        assert "is not one of" in str(err)

        # should fail w/ bmds3
        data = deepcopy(bmds2_complete_continuous)
        data.update(
            bmds_version=bmds.constants.BMDS312,
            models={"frequentist_restricted": [bmds.constants.M_Hill]},
            bmr=c_bmr,
        )
        with pytest.raises(ValidationError) as err:
            validators.validate_input(json.dumps(data))

    def test_bmds3_partial(self):
        data = {
            "bmds_version": bmds.constants.BMDS312,
            "dataset_type": bmds.constants.CONTINUOUS,
        }

        # check minimal passes when partial
        assert validators.validate_input(json.dumps(data), partial=True) is None

        # but fails when complete
        with pytest.raises(ValidationError) as err:
            validators.validate_input(json.dumps(data))
        assert "'datasets' is a required property" in str(err)

        # add datasets, try again
        data["datasets"] = [
            {
                "id": 123,
                "doses": [0, 10, 50, 150, 400],
                "ns": [111, 142, 143, 93, 42],
                "means": [2.112, 2.095, 1.956, 1.587, 1.254],
                "stdevs": [0.235, 0.209, 0.231, 0.263, 0.159],
            }
        ]
        assert validators.validate_input(json.dumps(data), partial=True) is None

        with pytest.raises(ValidationError) as err:
            validators.validate_input(json.dumps(data))
        assert "'models' is a required property" in str(err)

        # add models, try again
        data["models"] = {"frequentist_restricted": [bmds.constants.M_Power]}
        assert validators.validate_input(json.dumps(data), partial=True) is None

        with pytest.raises(ValidationError) as err:
            validators.validate_input(json.dumps(data))
        assert "'options' is a required property" in str(err)

        # add options, try again
        data["options"] = [
            {
                "bmr_type": "Std. Dev.",
                "bmr_value": 1.0,
                "tail_probability": 0.95,
                "confidence_level": 0.05,
                "distribution": "Normal",
                "variance": "Calculated",
                "polynomial_restriction": "Use dataset adverse direction",
                "background": "Estimated",
            }
        ]
        assert validators.validate_input(json.dumps(data), partial=True) is None
        assert validators.validate_input(json.dumps(data)) is None


class TestSessionValidation:
    def test_base_validator(self, bmds2_complete_continuous):
        # check validity
        assert validators.validate_session(bmds2_complete_continuous) is None

        # missing required field check
        data = deepcopy(bmds2_complete_continuous)
        data.pop("bmds_version")
        with pytest.raises(ValidationError):
            validators.validate_session(data)


class TestDatasetValidation:
    def test_continuous_validator(self, bmds2_complete_continuous):
        dataset_type = bmds2_complete_continuous["dataset_type"]
        datasets = bmds2_complete_continuous["datasets"]

        # check validity
        assert validators.validate_datasets(dataset_type, datasets) is None

        # missing required field check
        data = deepcopy(datasets)
        data[0].pop("stdevs")
        with pytest.raises(ValidationError):
            validators.validate_datasets(dataset_type, data)

        # n > 0 check
        data = deepcopy(datasets)
        data[0]["ns"][1] = 0
        with pytest.raises(ValidationError):
            validators.validate_datasets(dataset_type, data)

    def test_continuous_individual_validator(self, bmds2_complete_continuous_individual):
        dataset_type = bmds2_complete_continuous_individual["dataset_type"]
        datasets = bmds2_complete_continuous_individual["datasets"]

        # check validity
        assert validators.validate_datasets(dataset_type, datasets) is None

        # missing required field check
        data = deepcopy(datasets)
        data[0].pop("responses")
        with pytest.raises(ValidationError):
            validators.validate_datasets(dataset_type, data)

        data = deepcopy(datasets)
        data[0].pop("doses")
        with pytest.raises(ValidationError):
            validators.validate_datasets(dataset_type, data)

    def test_dichotomous_validator(self, bmds2_complete_dichotomous):
        dataset_type = bmds2_complete_dichotomous["dataset_type"]
        datasets = bmds2_complete_dichotomous["datasets"]

        # check validity
        assert validators.validate_datasets(dataset_type, datasets) is None

        # missing required field check
        data = deepcopy(datasets)
        data[0].pop("ns")
        with pytest.raises(ValidationError):
            validators.validate_datasets(dataset_type, data)

        # n>0 check
        data = deepcopy(datasets)
        data[0]["ns"][1] = 0
        with pytest.raises(ValidationError):
            validators.validate_datasets(dataset_type, data)

    def test_dataset_ids(self, bmds2_complete_dichotomous):
        # Check that commonly used IDs can be used.

        dataset_type = bmds2_complete_dichotomous["dataset_type"]
        datasets = bmds2_complete_dichotomous["datasets"]

        # check missing ID
        data = deepcopy(datasets)
        data[0].pop("id")
        validators.validate_datasets(dataset_type, data)

        # check string ID
        data = deepcopy(datasets)
        data[0]["id"] = "string"
        validators.validate_datasets(dataset_type, data)

        # check int ID
        data = deepcopy(datasets)
        data[0]["id"] = 123  # int
        validators.validate_datasets(dataset_type, data)

        # check float id
        data = deepcopy(datasets)
        data[0]["id"] = 123.1  # float
        with pytest.raises(ValidationError):
            validators.validate_datasets(dataset_type, data)


class TestModelValidation:
    def test_bmds2(self):

        bmds_version = bmds.constants.BMDS270
        continuous_type = bmds.constants.CONTINUOUS
        dichotomous_type = bmds.constants.DICHOTOMOUS
        c_models = [{"name": "Exponential-M2"}, {"name": "Exponential-M3"}]
        d_models = [{"name": "Logistic"}, {"name": "LogLogistic"}]

        # continuous
        assert validators.validate_models(bmds_version, continuous_type, c_models) is None
        with pytest.raises(ValidationError) as err:
            validators.validate_models(bmds_version, continuous_type, d_models)
        assert "is not one of" in str(err)

        # dichotomous
        assert validators.validate_models(bmds_version, dichotomous_type, d_models) is None
        with pytest.raises(ValidationError) as err:
            validators.validate_models(bmds_version, dichotomous_type, c_models)
        assert "is not one of" in str(err)

    def test_bmds3_dichotomous(self):
        dtype = bmds.constants.DICHOTOMOUS
        version = bmds.constants.BMDS312
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
        version = bmds.constants.BMDS312
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


class TestBmrOptions:
    def test_bmds2(self):
        c_bmr = {"type": "Std. Dev.", "value": 1.0}
        d_bmr = {"type": "Added", "value": 0.1}

        # continuous
        assert validators.validate_bmrs(bmds.constants.CONTINUOUS, c_bmr) is None
        with pytest.raises(ValidationError) as err:
            validators.validate_bmrs(bmds.constants.CONTINUOUS, d_bmr)
        assert "'Added' is not one of" in str(err)

        # dichotomous
        assert validators.validate_bmrs(bmds.constants.DICHOTOMOUS, d_bmr) is None
        with pytest.raises(ValidationError) as err:
            validators.validate_bmrs(bmds.constants.DICHOTOMOUS, c_bmr)
        assert "'Std. Dev.' is not one of" in str(err)


class TestOptionSetValidation:
    def test_dichotomous(self):
        # test success
        data = [dict(bmr_type="Extra", bmr_value=0.1, confidence_level=0.05, background="Zero")]
        assert validators.validate_options(bmds.constants.DICHOTOMOUS, data) is None

        # must have at least one option
        data = []
        with pytest.raises(ValidationError) as err:
            validators.validate_options(bmds.constants.DICHOTOMOUS, data)
        assert "[] is too short" in str(err)

    def test_continuous(self):
        # test success
        data = [
            {
                "bmr_type": "Std. Dev.",
                "bmr_value": 1.0,
                "tail_probability": 0.95,
                "confidence_level": 0.05,
                "distribution": "Normal",
                "variance": "Calculated",
                "polynomial_restriction": "Use dataset adverse direction",
                "background": "Estimated",
            }
        ]
        assert validators.validate_options(bmds.constants.CONTINUOUS, data) is None

        # must have at least one option
        data = []
        with pytest.raises(ValidationError) as err:
            validators.validate_options(bmds.constants.CONTINUOUS, data)
        assert "[] is too short" in str(err)

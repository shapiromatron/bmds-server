import json
from copy import deepcopy

import bmds
import jsonschema
import pytest
from django.core.exceptions import ValidationError

from bmds_server.jobrunner import validators


def test_invalid_json():
    # invalid JSON
    with pytest.raises(ValidationError):
        validators.validate_input("{")


def test_base_validator(complete_continuous):
    # check validity
    try:
        jsonschema.validate(complete_continuous, validators.base_schema)
    except jsonschema.exceptions.ValidationError:
        pytest.fail("Should be valid.")

    # missing required field check
    data = deepcopy(complete_continuous)
    data.pop("bmds_version")
    with pytest.raises(jsonschema.exceptions.ValidationError):
        jsonschema.validate(data, validators.base_schema)


class TestDatasetValidation:
    def test_continuous_validator(self, complete_continuous):
        # check that continuous validators work
        datasets = complete_continuous["datasets"]
        # check validity
        try:
            jsonschema.validate(datasets, validators.continuous_dataset_schema)
        except jsonschema.exceptions.ValidationError:
            pytest.fail("Should be valid.")

        # missing required field check
        data = deepcopy(datasets)
        data[0].pop("stdevs")
        with pytest.raises(jsonschema.exceptions.ValidationError):
            jsonschema.validate(data, validators.continuous_dataset_schema)

        # n>0 check
        data = deepcopy(datasets)
        data[0]["ns"][1] = 0
        with pytest.raises(jsonschema.exceptions.ValidationError):
            jsonschema.validate(data, validators.continuous_dataset_schema)

    def test_continuous_individual_validator(self, complete_continuous_individual):
        # check that continuous individual validators work
        datasets = complete_continuous_individual["datasets"]
        # check validity
        try:
            jsonschema.validate(datasets, validators.continuous_individual_dataset_schema)
        except jsonschema.exceptions.ValidationError:
            pytest.fail("Should be valid.")

        # missing required field check
        data = deepcopy(datasets)
        data[0].pop("responses")
        with pytest.raises(jsonschema.exceptions.ValidationError):
            jsonschema.validate(data, validators.continuous_individual_dataset_schema)

        data = deepcopy(datasets)
        data[0].pop("doses")
        with pytest.raises(jsonschema.exceptions.ValidationError):
            jsonschema.validate(data, validators.continuous_individual_dataset_schema)

    def test_dichotomous_validator(self, complete_dichotomous):
        # check that dichotomous validators work
        datasets = complete_dichotomous["datasets"]
        # check validity
        try:
            jsonschema.validate(datasets, validators.dichotomous_dataset_schema)
        except jsonschema.exceptions.ValidationError:
            pytest.fail("Should be valid.")

        # missing required field check
        data = deepcopy(datasets)
        data[0].pop("ns")
        with pytest.raises(jsonschema.exceptions.ValidationError):
            jsonschema.validate(data, validators.dichotomous_dataset_schema)

        # n>0 check
        data = deepcopy(datasets)
        data[0]["ns"][1] = 0
        with pytest.raises(jsonschema.exceptions.ValidationError):
            jsonschema.validate(data, validators.dichotomous_dataset_schema)

    def test_dataset_ids(
        self, complete_continuous, complete_dichotomous, complete_continuous_individual
    ):
        # Check that commonly used IDs can be used.
        sets = [
            (complete_continuous["datasets"], validators.continuous_dataset_schema),
            (complete_dichotomous["datasets"], validators.dichotomous_dataset_schema),
            (
                complete_continuous_individual["datasets"],
                validators.continuous_individual_dataset_schema,
            ),
        ]
        for datasets, validator in sets:
            # check missing ID
            data = deepcopy(datasets)
            data[0].pop("id")
            jsonschema.validate(data, validator)

            # check string ID
            data = deepcopy(datasets)
            data[0]["id"] = "string"
            jsonschema.validate(data, validator)

            # check int ID
            data = deepcopy(datasets)
            data[0]["id"] = 123  # int
            jsonschema.validate(data, validator)

            # check float id
            data = deepcopy(datasets)
            data[0]["id"] = 123.1  # float
            with pytest.raises(jsonschema.exceptions.ValidationError):
                jsonschema.validate(data, validator)


class TestModelValidation:
    def test_bmds2(self, complete_continuous):
        # Check models can be specified
        cmodels = [{"name": "Exponential-M2"}, {"name": "Exponential-M3"}]

        dmodels = [{"name": "Logistic"}, {"name": "LogLogistic"}]

        # complete check
        data = deepcopy(complete_continuous)
        data["models"] = cmodels
        assert validators.validate_input(json.dumps(data)) is None

        data = deepcopy(complete_continuous)
        data["models"] = dmodels
        with pytest.raises(ValidationError):
            validators.validate_input(json.dumps(data))

        # continuous
        try:
            jsonschema.validate(cmodels, validators.c_model_schema)
        except jsonschema.exceptions.ValidationError:
            pytest.fail("Should be valid.")

        with pytest.raises(jsonschema.exceptions.ValidationError):
            jsonschema.validate(dmodels, validators.c_model_schema)

        # dichotomous
        try:
            jsonschema.validate(dmodels, validators.d_model_schema)
        except jsonschema.exceptions.ValidationError:
            pytest.fail("Should be valid.")

        with pytest.raises(jsonschema.exceptions.ValidationError):
            jsonschema.validate(cmodels, validators.d_model_schema)

    def test_bmds3_dichotomous(self, complete_dichotomous):
        dtype = bmds.constants.DICHOTOMOUS
        version = bmds.constants.BMDS312
        probit = bmds.constants.M_Probit
        logprobit = bmds.constants.M_LogProbit

        # test success
        assert (
            validators._validate_models(version, dtype, {"frequentist_restricted": [logprobit]},)
            is None
        )

        # assert wrong model type
        with pytest.raises(ValidationError) as err:
            validators._validate_models(
                version, dtype, {"frequentist_restricted": [bmds.constants.M_Power]},
            )
        assert "'Power' is not one of" in str(err)

        # assert duplicates model type
        with pytest.raises(ValidationError) as err:
            validators._validate_models(
                version, dtype, {"frequentist_restricted": [logprobit, logprobit]},
            )
        assert "has non-unique elements" in str(err)

        # assert empty
        with pytest.raises(ValidationError) as err:
            validators._validate_models(
                version, dtype, {"frequentist_restricted": []},
            )
        assert "At least one model must be selected" in str(err)

        # assert bayesian duplicates
        with pytest.raises(ValidationError) as err:
            validators._validate_models(
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
            validators._validate_models(
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

    def test_bmds3_continuous(self, complete_continuous):
        dtype = bmds.constants.CONTINUOUS
        version = bmds.constants.BMDS312
        power = bmds.constants.M_Power
        linear = bmds.constants.M_Linear

        # test success
        assert (
            validators._validate_models(version, dtype, {"frequentist_restricted": [power]},)
            is None
        )

        # assert wrong model type
        with pytest.raises(ValidationError) as err:
            validators._validate_models(
                version, dtype, {"frequentist_restricted": [bmds.constants.M_Probit]},
            )
        assert "'Probit' is not one of" in str(err)

        # assert duplicates model type
        with pytest.raises(ValidationError) as err:
            validators._validate_models(
                version, dtype, {"frequentist_restricted": [power, power]},
            )
        assert "has non-unique elements" in str(err)

        # assert empty
        with pytest.raises(ValidationError) as err:
            validators._validate_models(
                version, dtype, {"frequentist_restricted": []},
            )
        assert "At least one model must be selected" in str(err)

        # assert bayesian duplicates
        with pytest.raises(ValidationError) as err:
            validators._validate_models(
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
            validators._validate_models(
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
    def test_bmds2(self, complete_continuous):
        # Check models can be specified
        cbmr = {"type": "Std. Dev.", "value": 1.0}

        dbmr = {"type": "Added", "value": 0.1}

        # complete check
        data = deepcopy(complete_continuous)
        data["bmr"] = cbmr
        assert validators.validate_input(json.dumps(data)) is None

        data = deepcopy(complete_continuous)
        data["bmr"] = dbmr
        with pytest.raises(ValidationError):
            validators.validate_input(json.dumps(data))

        # continuous
        try:
            jsonschema.validate(cbmr, validators.c_bmr_schema)
        except jsonschema.exceptions.ValidationError:
            pytest.fail("Should be valid.")

        with pytest.raises(jsonschema.exceptions.ValidationError):
            jsonschema.validate(dbmr, validators.c_bmr_schema)

        # dichotomous
        try:
            jsonschema.validate(dbmr, validators.d_bmr_schema)
        except jsonschema.exceptions.ValidationError:
            pytest.fail("Should be valid.")

        with pytest.raises(jsonschema.exceptions.ValidationError):
            jsonschema.validate(cbmr, validators.d_bmr_schema)

    def test_bmds3(self):
        # not used in bmds3
        pass


class TestOptionSetValidation:
    pass

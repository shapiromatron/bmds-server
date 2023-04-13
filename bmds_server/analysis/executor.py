import itertools
from copy import deepcopy
from typing import NamedTuple, Optional, Self

import bmds
import numpy as np
from bmds.bmds3.constants import DistType
from bmds.bmds3.sessions import BmdsSession

from .schema import AnalysisSessionSchema
from .transforms import (
    PriorEnum,
    build_dataset,
    build_model_settings,
    remap_bayesian_exponential,
    remap_exponential,
)

# excluded continuous models if distribution type is lognormal
lognormal_enabled = {bmds.constants.M_ExponentialM3, bmds.constants.M_ExponentialM5}


def build_frequentist_session(dataset, inputs, options, dataset_options) -> Optional[BmdsSession]:
    restricted_models = inputs["models"].get(PriorEnum.frequentist_restricted, [])
    unrestricted_models = inputs["models"].get(PriorEnum.frequentist_unrestricted, [])

    # exit early if we have no frequentist models
    if len(restricted_models) + len(unrestricted_models) == 0:
        return None

    bmds_version = inputs["bmds_version"]
    dataset_type = inputs["dataset_type"]
    recommendation_settings = inputs.get("recommender", None)

    session = bmds.BMDS.version(bmds_version)(
        dataset=dataset, recommendation_settings=recommendation_settings
    )

    for prior_type, model_names in [
        (PriorEnum.frequentist_restricted, remap_exponential(restricted_models)),
        (PriorEnum.frequentist_unrestricted, remap_exponential(unrestricted_models)),
    ]:
        if options.get("dist_type") == DistType.log_normal:
            model_names = [model for model in model_names if model in lognormal_enabled]

        for model_name in model_names:
            model_options = build_model_settings(
                dataset_type,
                prior_type,
                options,
                dataset_options,
            )
            if model_name in bmds.constants.VARIABLE_POLYNOMIAL:
                min_degree = 2 if model_name in bmds.constants.M_Polynomial else 1
                max_degree = (
                    model_options.degree + 1
                    if model_options.degree > 0
                    else dataset.num_dose_groups
                )
                degrees = list(range(min_degree, max(min(max_degree, 9), 2)))
                for degree in degrees:
                    model_options = model_options.copy()
                    model_options.degree = degree
                    session.add_model(model_name, settings=model_options)
            else:
                if model_name == bmds.constants.M_Linear:
                    # a linear model must have a degree of 1
                    model_options.degree = 1
                session.add_model(model_name, settings=model_options)

    return session


def build_bayesian_session(
    dataset: bmds.datasets.DatasetType, inputs: dict, options: dict, dataset_options: dict
) -> Optional[BmdsSession]:
    models = inputs["models"].get(PriorEnum.bayesian, [])

    # filter lognormal
    if options.get("dist_type") == DistType.log_normal:
        models = deepcopy(list(filter(lambda d: d["model"] in lognormal_enabled, models)))

    # exit early if we have no bayesian models
    if len(models) == 0:
        return None

    bmds_version = inputs["bmds_version"]
    dataset_type = inputs["dataset_type"]
    session = bmds.BMDS.version(bmds_version)(dataset=dataset)
    models = remap_bayesian_exponential(models)
    prior_weights = list(map(lambda d: d["prior_weight"], models))
    for name in map(lambda d: d["model"], models):
        model_options = build_model_settings(
            dataset_type,
            PriorEnum.bayesian,
            options,
            dataset_options,
        )
        if name in bmds.constants.VARIABLE_POLYNOMIAL:
            model_options.degree = 2
        session.add_model(name, settings=model_options)

    session.set_ma_weights(prior_weights)

    return session


class AnalysisSession(NamedTuple):
    """
    This is the execution engine for running analysis in BMDS.

    All database state is decoupled from the execution engine, along with serialization and
    de-serialization methods.  Note that this is a custom BmdsSession implementation; the UI of
    the bmds software allows you to effectively run multiple "indpendent" sessions at once;
    for example, a frequentist model session with a bayesian model averaging session. This
    Session allows construction of these individual bmds sessions into a single analysis
    for presentation in the UI.
    """

    dataset_index: int
    option_index: int
    frequentist: Optional[BmdsSession]
    bayesian: Optional[BmdsSession]

    @classmethod
    def run(cls, inputs: dict, dataset_index: int, option_index: int) -> AnalysisSessionSchema:
        # TODO - replace in BMDS 3.4
        if inputs["dataset_type"] == bmds.constants.NESTED_DICHOTOMOUS:
            return _mock_nested_dichotomous(inputs, dataset_index, option_index)
        elif inputs["dataset_type"] == bmds.constants.MULTI_TUMOR:
            return _mock_multitumor(inputs, dataset_index, option_index)

        session = cls.create(inputs, dataset_index, option_index)
        session.execute()
        return session.to_schema()

    @classmethod
    def create(cls, inputs: dict, dataset_index: int, option_index: int) -> Self:
        dataset = build_dataset(inputs["datasets"][dataset_index])
        options = inputs["options"][option_index]
        dataset_options = inputs["dataset_options"][dataset_index]
        return cls(
            dataset_index=dataset_index,
            option_index=option_index,
            frequentist=build_frequentist_session(dataset, inputs, options, dataset_options),
            bayesian=build_bayesian_session(dataset, inputs, options, dataset_options),
        )

    @classmethod
    def deserialize(cls, data: dict) -> Self:
        obj = AnalysisSessionSchema.parse_obj(data)
        return cls(
            dataset_index=obj.dataset_index,
            option_index=obj.option_index,
            frequentist=BmdsSession.from_serialized(obj.frequentist) if obj.frequentist else None,
            bayesian=BmdsSession.from_serialized(obj.bayesian) if obj.bayesian else None,
        )

    def execute(self):
        if self.frequentist:
            self.frequentist.execute()
            if self.frequentist.recommendation_enabled:
                self.frequentist.recommend()

        if self.bayesian:
            if self.bayesian.dataset.dtype in bmds.constants.DICHOTOMOUS_DTYPES:
                self.bayesian.add_model_averaging()
            self.bayesian.execute()

    def to_schema(self) -> AnalysisSessionSchema:
        return AnalysisSessionSchema(
            dataset_index=self.dataset_index,
            option_index=self.option_index,
            frequentist=self.frequentist.to_dict() if self.frequentist else None,
            bayesian=self.bayesian.to_dict() if self.bayesian else None,
        )

    def to_dict(self) -> dict:
        return self.to_schema().dict()


def _mock_results(inputs: dict, dataset_index: int, option_index: int) -> dict:
    # TODO - replace in BMDS 3.4
    models = []
    for model_name in itertools.chain(inputs["models"]["frequentist_restricted"]):
        doses = np.array(inputs["datasets"][dataset_index]["doses"])
        median = np.percentile(doses, 50)
        models.append(
            {
                "name": model_name,
                "results": {
                    "bmd": median,
                    "bmdl": 0.9 * median,
                    "bmdu": 1.1 * median,
                    "plotting": {"dr_x": [0, 10, 20], "dr_y": [0, 0.5, 1]},
                },
                "settings": {},
                "model_class": {},
            }
        )

    return {
        "metadata": {"dataset_index": dataset_index, "option_index": option_index},
        "bayesian": None,
        "frequentist": {
            "models": models,
            "dataset": inputs["datasets"][dataset_index],
            "version": {},
            "selected": {"notes": "", "model_index": None},
            "recommender": None,
            "model_average": None,
        },
    }


def _mock_nested_dichotomous(inputs: dict, dataset_index: int, option_index: int) -> dict:
    # TODO - replace in BMDS 3.4
    return _mock_results(inputs, dataset_index, option_index)


def _mock_multitumor(inputs: dict, dataset_index: int, option_index: int) -> dict:
    # TODO - replace in BMDS 3.4
    results = _mock_results(inputs, dataset_index, option_index)
    results["frequentist"]["combined"] = deepcopy(results["frequentist"]["models"][0]["results"])
    return results

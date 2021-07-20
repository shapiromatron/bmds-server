from typing import Dict, NamedTuple, Optional

import bmds
from bmds.bmds3.constants import DistType
from bmds.bmds3.sessions import BmdsSession

from .transforms import PriorEnum, build_dataset, build_model_settings, remap_exponential

# excluded continuous models if distribution type is lognormal
lognormal_disabled = {bmds.constants.M_Linear, bmds.constants.M_Polynomial, bmds.constants.M_Power}


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
            model_names = [model for model in model_names if model not in lognormal_disabled]

        for model_name in model_names:
            model_options = build_model_settings(
                bmds_version, dataset_type, model_name, prior_type, options, dataset_options,
            )
            if model_name in bmds.constants.VARIABLE_POLYNOMIAL:
                min_degree = 2 if model_name in bmds.constants.M_Polynomial else 1
                max_degree = (
                    model_options.degree + 1
                    if model_options.degree > 0
                    else dataset.num_dose_groups
                )
                degrees = list(range(min_degree, max(min(max_degree, 5), 2)))
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
    dataset: bmds.datasets.DatasetType, inputs: Dict, options: Dict, dataset_options: Dict
) -> Optional[BmdsSession]:
    models = inputs["models"].get(PriorEnum.bayesian, [])

    # exit early if we have no bayesian models
    if len(models) == 0:
        return None

    bmds_version = inputs["bmds_version"]
    dataset_type = inputs["dataset_type"]
    model_names = [model["model"] for model in models]
    model_names = remap_exponential(model_names)
    session = bmds.BMDS.version(bmds_version)(dataset=dataset)

    if options.get("dist_type") == DistType.log_normal:
        model_names = [model for model in model_names if model not in lognormal_disabled]

    for model_name in model_names:
        model_options = build_model_settings(
            bmds_version, dataset_type, model_name, PriorEnum.bayesian, options, dataset_options,
        )
        if model_name in bmds.constants.VARIABLE_POLYNOMIAL:
            model_options.degree = 2
        session.add_model(model_name, settings=model_options)

    # TODO: set prior weights to bayesian model averaging

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
    def run(cls, inputs: Dict, dataset_index: int, option_index: int) -> Dict:
        session = cls.create(inputs, dataset_index, option_index)
        session.execute()
        return session.to_dict()

    @classmethod
    def create(cls, inputs: Dict, dataset_index: int, option_index: int) -> "AnalysisSession":
        dataset = build_dataset(inputs["dataset_type"], inputs["datasets"][dataset_index])
        options = inputs["options"][option_index]
        dataset_options = inputs["dataset_options"][dataset_index]
        return cls(
            dataset_index=dataset_index,
            option_index=option_index,
            frequentist=build_frequentist_session(dataset, inputs, options, dataset_options),
            bayesian=build_bayesian_session(dataset, inputs, options, dataset_options),
        )

    @classmethod
    def deserialize(cls, data: Dict) -> "AnalysisSession":
        freq = BmdsSession.from_serialized(data["frequentist"]) if data["frequentist"] else None
        bay = BmdsSession.from_serialized(data["bayesian"]) if data["bayesian"] else None
        return cls(
            dataset_index=data["metadata"]["dataset_index"],
            option_index=data["metadata"]["option_index"],
            frequentist=freq,
            bayesian=bay,
        )

    def execute(self) -> Dict:
        if self.frequentist:
            self.frequentist.execute()
            if self.frequentist.recommendation_enabled:
                self.frequentist.recommend()

        if self.bayesian:
            if self.bayesian.dataset.dtype in bmds.constants.DICHOTOMOUS_DTYPES:
                self.bayesian.add_model_averaging()
            self.bayesian.execute()

        return self.to_dict()

    def to_dict(self) -> Dict:
        return dict(
            metadata=dict(dataset_index=self.dataset_index, option_index=self.option_index),
            frequentist=self.frequentist.to_dict() if self.frequentist else None,
            bayesian=self.bayesian.to_dict() if self.bayesian else None,
        )

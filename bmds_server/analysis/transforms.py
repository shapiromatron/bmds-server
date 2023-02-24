from copy import deepcopy
from enum import StrEnum

import bmds
from bmds.bmds3.types.continuous import ContinuousModelSettings
from bmds.bmds3.types.dichotomous import DichotomousModelSettings
from bmds.bmds3.types.nested_dichotomous import NestedDichotomousModelSettings
from bmds.bmds3.types.priors import PriorClass
from bmds.constants import Dtype

from .validators.datasets import AdverseDirection


class PriorEnum(StrEnum):
    frequentist_restricted = "frequentist_restricted"
    frequentist_unrestricted = "frequentist_unrestricted"
    bayesian = "bayesian"


bmd3_prior_map = {
    PriorEnum.frequentist_restricted: PriorClass.frequentist_restricted,
    PriorEnum.frequentist_unrestricted: PriorClass.frequentist_unrestricted,
    PriorEnum.bayesian: PriorClass.bayesian,
}
is_increasing_map = {
    AdverseDirection.AUTOMATIC: None,
    AdverseDirection.UP: True,
    AdverseDirection.DOWN: False,
}


def build_model_settings(
    dataset_type: str,
    prior_class: str,
    options: dict,
    dataset_options: dict,
) -> DichotomousModelSettings | ContinuousModelSettings:
    prior_class = bmd3_prior_map[prior_class]
    if dataset_type in bmds.constants.DICHOTOMOUS_DTYPES:
        return DichotomousModelSettings(
            bmr=options["bmr_value"],
            alpha=1.0 - options["confidence_level"],
            bmr_type=options["bmr_type"],
            degree=dataset_options["degree"],
            priors=prior_class,
        )
    elif dataset_type in bmds.constants.CONTINUOUS_DTYPES:
        return ContinuousModelSettings(
            bmr=options["bmr_value"],
            alpha=1.0 - options["confidence_level"],
            tailProb=options["tail_probability"],
            bmr_type=options["bmr_type"],
            disttype=options["dist_type"],
            degree=dataset_options["degree"],
            is_increasing=is_increasing_map[dataset_options["adverse_direction"]],
            priors=prior_class,
        )
    elif dataset_type == bmds.constants.NESTED_DICHOTOMOUS:
        return NestedDichotomousModelSettings(
            bmr=options["bmr_value"],
            alpha=1.0 - options["confidence_level"],
            bmr_type=options["bmr_type"],
            litter_specific_covariate=options["litter_specific_covariate"],
            background=options["background"],
            bootstrap_iterations=options["bootstrap_iterations"],
            bootstrap_seed=options["bootstrap_seed"],
        )
    else:
        raise ValueError(f"Unknown dataset_type: {dataset_type}")


def build_dataset(dataset: dict[str, list[float]]) -> bmds.datasets.DatasetType:
    dataset_type = dataset["dtype"]
    if dataset_type == Dtype.CONTINUOUS:
        schema = bmds.datasets.ContinuousDatasetSchema
    elif dataset_type == Dtype.CONTINUOUS_INDIVIDUAL:
        schema = bmds.datasets.ContinuousIndividualDatasetSchema
    elif dataset_type == Dtype.DICHOTOMOUS:
        schema = bmds.datasets.DichotomousDatasetSchema
    elif dataset_type == Dtype.NESTED_DICHOTOMOUS:
        schema = bmds.datasets.NestedDichotomousDatasetSchema
    else:
        raise ValueError(f"Unknown dataset type: {dataset_type}")
    return schema.parse_obj(dataset).deserialize()


def remap_exponential(models: list[str]) -> list[str]:
    # recursively expand user-specified "exponential" model into M3 and M5
    if bmds.constants.M_Exponential in models:
        models = models.copy()  # return a copy so inputs are unchanged
        pos = models.index(bmds.constants.M_Exponential)
        models[pos : pos + 1] = (bmds.constants.M_ExponentialM3, bmds.constants.M_ExponentialM5)
    return models


def remap_bayesian_exponential(models: list[dict]) -> list[dict]:
    for i, model in enumerate(models):
        if model["model"] == bmds.constants.M_Exponential:
            models = deepcopy(models)
            weight = model["prior_weight"] / 2  # TODO - replace in BMDS 3.4
            models[i : i + 1] = (
                dict(model=bmds.constants.M_ExponentialM3, prior_weight=weight),
                dict(model=bmds.constants.M_ExponentialM5, prior_weight=weight),
            )
            break
    return models

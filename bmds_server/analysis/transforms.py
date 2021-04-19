from enum import Enum
from typing import Dict

from bmds.bmds3.types.continuous import ContinuousModelSettings
from bmds.bmds3.types.dichotomous import DichotomousModelSettings
from bmds.bmds3.types.priors import PriorClass

from .validators.datasets import AdverseDirection


class PriorEnum(str, Enum):
    frequentist_restricted = "frequentist_restricted"
    frequentist_unrestricted = "frequentist_unrestricted"
    bayesian = "bayesian"
    bayesian_model_average = "bayesian_model_average"


bmd3_prior_map = {
    PriorEnum.frequentist_restricted: PriorClass.frequentist_restricted,
    PriorEnum.frequentist_unrestricted: PriorClass.frequentist_unrestricted,
    PriorEnum.bayesian: PriorClass.bayesian,
    PriorEnum.bayesian_model_average: PriorClass.bayesian,
}
is_increasing_map = {
    AdverseDirection.AUTOMATIC: None,
    AdverseDirection.UP: True,
    AdverseDirection.DOWN: False,
}


def bmds3_d_model_options(
    prior_class: str, options: Dict, dataset_options: Dict
) -> DichotomousModelSettings:
    return DichotomousModelSettings(
        bmr=options["bmr_value"],
        alpha=1.0 - options["confidence_level"],
        bmr_type=options["bmr_type"],
        prior=bmd3_prior_map[prior_class],
        degree=dataset_options["degree"],
    )


def bmds3_c_model_options(
    prior_class: str, options: Dict, dataset_options: Dict
) -> ContinuousModelSettings:
    return ContinuousModelSettings(
        bmr=options["bmr_value"],
        alpha=1.0 - options["confidence_level"],
        tailProb=options["tail_probability"],
        bmr_type=options["bmr_type"],
        disttype=options["dist_type"],
        prior=bmd3_prior_map[prior_class],
        degree=dataset_options["degree"],
        is_increasing=is_increasing_map[dataset_options["adverse_direction"]],
    )

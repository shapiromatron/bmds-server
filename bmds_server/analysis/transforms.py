from enum import Enum
from typing import Dict, Union

import bmds
from bmds.bmds3.sessions import get_model
from bmds.bmds3.types.continuous import ContinuousModelSettings
from bmds.bmds3.types.dichotomous import DichotomousModelSettings
from bmds.bmds3.types.priors import PriorClass, get_continuous_prior, get_dichotomous_prior

from .validators.datasets import AdverseDirection


class PriorEnum(str, Enum):
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
    bmds_version: str,
    dataset_type: str,
    model_name: str,
    prior_class: str,
    options: Dict,
    dataset_options: Dict,
) -> Union[DichotomousModelSettings, ContinuousModelSettings]:
    model = get_model(bmds_version, dataset_type, model_name)
    prior_class = bmd3_prior_map[prior_class]
    if dataset_type in bmds.constants.DICHOTOMOUS_DTYPES:
        return DichotomousModelSettings(
            bmr=options["bmr_value"],
            alpha=1.0 - options["confidence_level"],
            bmr_type=options["bmr_type"],
            degree=dataset_options["degree"],
            priors=get_dichotomous_prior(model.bmd_model_class, prior_class),
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
            priors=get_continuous_prior(model.bmd_model_class, prior_class),
        )
    else:
        raise ValueError(f"Unknown dataset_type: {dataset_type}")

from typing import Dict

from bmds.bmds3.types.continuous import ContinuousModelSettings, ContinuousRiskType
from bmds.bmds3.types.dichotomous import DichotomousModelSettings, DichotomousRiskType
from bmds.bmds3.types.priors import PriorClass

bmds3_d_bmr_type_map = {
    "Extra": DichotomousRiskType.eAddedRisk,
    "Added": DichotomousRiskType.eAddedRisk,
}
bmds3_c_bmr_type_map = {
    "Abs. Dev.": ContinuousRiskType.eAbsoluteDev,
    "Std. Dev.": ContinuousRiskType.eStandardDev,
    "Rel. Dev.": ContinuousRiskType.eRelativeDev,
    "Point": ContinuousRiskType.ePointEstimate,
    "Extra": ContinuousRiskType.eExtra,  # TODO - check is this the right one?
}
bmd3_prior_map = {
    "frequentist_restricted": PriorClass.frequentist_restricted,
    "frequentist_unrestricted": PriorClass.frequentist_unrestricted,
    "bayesian": PriorClass.bayesian,
    "bayesian_model_average": PriorClass.bayesian,
}


def bmds3_d_model_options(prior_class: str, options: Dict) -> DichotomousModelSettings:
    return DichotomousModelSettings(
        bmr=options["bmr_value"],
        alpha=options["confidence_level"],
        bmr_type=bmds3_d_bmr_type_map[options["bmr_type"]],
        prior=bmd3_prior_map[prior_class],
    )


def bmds3_c_model_options(prior_class: str, options: Dict) -> ContinuousModelSettings:
    return ContinuousModelSettings(
        bmr=options["bmr_value"],
        alpha=options["confidence_level"],
        tailProb=options["tail_probability"],
        bmr_type=bmds3_c_bmr_type_map[options["bmr_type"]],
        prior=bmd3_prior_map[prior_class],
    )

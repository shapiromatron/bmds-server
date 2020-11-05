from typing import Dict

from bmds.bmds3.types.continuous import ContinuousModelSettings, ContinuousRiskType
from bmds.bmds3.types.dichotomous import DichotomousModelSettings, DichotomousRiskType

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


def bmds3_d_model_options(options: Dict) -> DichotomousModelSettings:
    return DichotomousModelSettings(
        bmr=options["bmr_value"],
        alpha=options["confidence_level"],
        bmr_type=bmds3_d_bmr_type_map[options["bmr_type"]],
    )


def bmds3_c_model_options(options: Dict) -> ContinuousModelSettings:
    return ContinuousModelSettings(
        bmr=options["bmr_value"],
        alpha=options["confidence_level"],
        tailProb=options["tail_probability"],
        bmr_type=bmds3_c_bmr_type_map[options["bmr_type"]],
    )

from typing import Dict

from bmds.bmds3 import types
from bmds.bmds3.types33 import (
    ContinuousModelSettings,
    DichotomousModelSettings,
    DichotomousRiskType,
)

bmds3_d_bmr_type_map = {
    "Extra": DichotomousRiskType.eExtraRisk,
    "Added": DichotomousRiskType.eAddedRisk,
}
bmds3_c_bmr_type_map = {
    "Abs. Dev.": types.BMRType_t.eAbsoluteDev,
    "Std. Dev.": types.BMRType_t.eStandardDev,
    "Rel. Dev.": types.BMRType_t.eRelativeDev,
    "Point": types.BMRType_t.ePointEstimate,
    "Extra": types.BMRType_t.eExtra,  # TODO - check is this the right one?
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

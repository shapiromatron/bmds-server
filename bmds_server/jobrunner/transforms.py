from typing import Dict

from bmds.bmds3 import types
from bmds.bmds3.models.continuous import ContinuousModelSettings
from bmds.bmds3.models.dichotomous import DichotomousModelSettings

bmds3_d_bmr_type_map = {"Extra": types.RiskType_t.eExtraRisk, "Added": types.RiskType_t.eAddedRisk}
bmds3_c_bmr_type_map = {
    "Abs. Dev.": types.BMRType_t.eAbsoluteDev,
    "Std. Dev.": types.BMRType_t.eStandardDev,
    "Rel. Dev.": types.BMRType_t.eRelativeDev,
    "Point": types.BMRType_t.ePointEstimate,
    "Extra": types.BMRType_t.eExtra,  # TODO - check is this the right one?
}


def bmds3_d_model_options(options: Dict) -> DichotomousModelSettings:
    return DichotomousModelSettings(
        bmrType=bmds3_d_bmr_type_map[options["bmr_type"]],
        bmr=options["bmr_value"],
        alpha=options["confidence_level"],
    )


def bmds3_c_model_options(options: Dict) -> ContinuousModelSettings:
    return ContinuousModelSettings(
        bmr=options["bmr_value"],
        alpha=options["confidence_level"],
        tailProb=options["tail_probability"],
        bmrType=bmds3_c_bmr_type_map[options["bmr_type"]],
    )

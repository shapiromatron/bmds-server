from __future__ import annotations

from typing import TYPE_CHECKING, Any

import pandas as pd
from bmds.bmds3.recommender.recommender import RecommenderResults
from bmds.bmds3.sessions import BmdsSession
from bmds.bmds3.types.continuous import ContinuousModelSettings, ContinuousResult
from bmds.bmds3.types.dichotomous import DichotomousModelSettings, DichotomousResult
from bmds.bmds3.types.ma import DichotomousModelAverageResult
from bmds.constants import CONTINUOUS_DTYPES, Dtype

if TYPE_CHECKING:
    from ..models import Analysis


def str_list(data: list) -> str:
    return ",".join([str(v) for v in data])


def add_dataset(d: dict, session) -> dict:
    dataset = session.frequentist.dataset if session.frequentist else session.bayesian
    d = dict(
        dataset_index=session.dataset_index,
        dataset_name=dataset.metadata.name,
        dataset_dose_name=dataset.metadata.dose_name,
        dataset_dose_units=dataset.metadata.dose_units,
        dataset_response_name=dataset.metadata.response_name,
        dataset_response_units=dataset.metadata.response_units,
    )
    if dataset.dtype == Dtype.CONTINUOUS_INDIVIDUAL:
        d.update(
            individual_doses=str_list(dataset.individual_doses),
            responses=str_list(dataset.responses),
        )
    if dataset.dtype == Dtype.DICHOTOMOUS:
        d.update(
            dataset_doses=str_list(dataset.doses),
            dataset_ns=str_list(dataset.ns),
            dataset_incidences=str_list(dataset.incidences),
        )
    if dataset.dtype in CONTINUOUS_DTYPES:
        d.update(
            dataset_doses=str_list(dataset.doses),
            dataset_ns=str_list(dataset.ns),
            dataset_stdevs=str_list(dataset.stdevs),
            dataset_means=str_list(dataset.means),
        )
    return d


def update_cont_settings(d: dict, settings: ContinuousModelSettings) -> None:
    d.update(
        is_increasing=settings.is_increasing,
        bmr=settings.bmr,
        bmr_type=settings.bmr_type.name,
        alpha=settings.alpha,
        tail_prop=settings.tail_prob,
        degree=settings.degree,
        dist_type=settings.disttype.name,
        prior_class=settings.priors.prior_class.name if settings.priors else None,
    )


def update_dich_settings(d: dict, settings: DichotomousModelSettings) -> None:
    d.update(
        bmr=settings.bmr,
        bmr_type=settings.bmr_type.name,
        alpha=settings.alpha,
        degree=settings.degree,
        prior_class=settings.priors.prior_class.name if settings.priors else None,
    )


def update_cont_results(d: dict, results: ContinuousResult) -> None:
    d.update(
        bmdl=results.bmdl,
        bmd=results.bmd,
        bmdu=results.bmdu,
        aic=results.fit.aic,
        loglikelihood=results.fit.loglikelihood,
        p_value1=results.tests.p_values[0],
        p_value2=results.tests.p_values[1],
        p_value3=results.tests.p_values[2],
        p_value4=results.tests.p_values[3],
        model_df=results.fit.model_df,
        total_df=results.fit.total_df,
        chi_squared=results.fit.chisq,
    )


def update_dich_results(d: dict, results: DichotomousResult) -> None:
    d.update(
        bmdl=results.bmdl,
        bmd=results.bmd,
        bmdu=results.bmdu,
        aic=results.fit.aic,
        loglikelihood=results.fit.loglikelihood,
        p_value=results.gof.p_value,
        model_df=results.fit.model_df,
        total_df=results.fit.total_df,
        chi_squared=results.fit.chisq,
    )


def update_cont_ma_results(d: dict, results) -> None:
    raise NotImplementedError("Not available in BMDS330")


def update_dich_ma_results(d: dict, results: DichotomousModelAverageResult) -> None:
    d.update(
        bmdl=results.bmdl, bmd=results.bmd, bmdu=results.bmdu,
    )


def add_session(
    models: list, dataset_index: int, option_index: int, analysis_type: str, session: BmdsSession
) -> None:
    if session.dataset.dtype in CONTINUOUS_DTYPES:
        update_settings = update_cont_settings
        update_results = update_cont_results
        update_ma_results = update_cont_ma_results
    elif session.dataset.dtype == Dtype.DICHOTOMOUS:
        update_settings = update_dich_settings
        update_results = update_dich_results
        update_ma_results = update_dich_ma_results
    else:
        raise ValueError(f"Unknown dtype {session.dataset.dtype}")

    for model_index, model in enumerate(session.models):
        d: dict[str, Any] = dict(
            dataset_index=dataset_index,
            option_index=option_index,
            analysis_type=analysis_type,
            model_index=model_index,
            model_name=model.name(),
        )
        update_settings(d, model.settings)
        update_results(d, model.results)
        if session.recommendation_enabled and session.recommender.results is not None:
            results: RecommenderResults = session.recommender.results
            d.update(
                recommended=(model_index == results.recommended_model_index),
                bin=results.model_bin[model_index].name,
                bin_a="\n".join(results.model_notes[model_index][0]),
                bin_b="\n".join(results.model_notes[model_index][1]),
                bin_c="\n".join(results.model_notes[model_index][2]),
            )
            is_selected = session.selected.model_index == model_index
            d.update(
                selected=is_selected,
                selected_notes=session.selected.notes if is_selected else None,
            )
        if session.model_average:
            d.update(
                model_prior=session.model_average.results.priors[model_index],
                model_posterior=session.model_average.results.posteriors[model_index],
            )
        models.append(d)

    if session.model_average:
        d = dict(
            dataset_index=dataset_index,
            option_index=option_index,
            analysis_type=analysis_type,
            model_index=100,
            model_name="Model average",
        )
        update_settings(d, session.model_average.settings)
        update_ma_results(d, session.model_average.results)
        models.append(d)


def build_df(analysis: Analysis) -> pd.DataFrame:
    dataset_data: dict[int, dict] = {}
    model_data = []

    for session in analysis.get_sessions():
        if session.dataset_index not in dataset_data:
            d = add_dataset(dataset_data, session)
            dataset_data[d["dataset_index"]] = d
        if session.frequentist:
            add_session(
                model_data,
                session.dataset_index,
                session.option_index,
                "frequentist",
                session.frequentist,
            )
        if session.bayesian:
            add_session(
                model_data,
                session.dataset_index,
                session.option_index,
                "bayesian",
                session.bayesian,
            )

    df1 = pd.DataFrame(dataset_data.values())
    df2 = pd.DataFrame(model_data)
    df3 = df1.merge(df2, on="dataset_index").fillna("-")
    return df3

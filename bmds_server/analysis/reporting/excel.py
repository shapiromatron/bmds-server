from __future__ import annotations

from typing import TYPE_CHECKING

import pandas as pd
from bmds.bmds3.recommender.recommender import RecommenderResults

if TYPE_CHECKING:
    from ..models import Analysis


def str_list(data: list) -> str:
    return ",".join([str(v) for v in data])


def add_dataset(d, session) -> dict:
    dataset = session.frequentist.dataset if session.frequentist else session.bayesian
    d = dict(
        dataset_index=session.dataset_index,
        dataset_name=dataset.metadata.name,
        dataset_dose_name=dataset.metadata.dose_name,
        dataset_dose_units=dataset.metadata.dose_units,
        dataset_response_name=dataset.metadata.response_name,
        dataset_response_units=dataset.metadata.response_units,
        dataset_doses=str_list(dataset.doses),
    )
    if hasattr(dataset, "incidences"):
        d.update(
            dataset_ns=str_list(dataset.ns), dataset_incidences=str_list(dataset.incidences),
        )
    if hasattr(dataset, "means"):
        d.update(
            dataset_ns=str_list(dataset.ns),
            dataset_stdevs=str_list(dataset.stdevs),
            dataset_means=str_list(dataset.means),
        )
    return d


def update_dich_settings(d, settings) -> None:
    d.update(
        bmr=settings.bmr,
        bmr_type=settings.bmr_type.name,
        alpha=settings.alpha,
        degree=settings.degree,
        prior_class=settings.priors.prior_class.name if settings.priors else None,
    )


def update_dich_results(d, results) -> None:
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


def update_dich_ma_results(d, results) -> None:
    d.update(
        bmdl=results.bmdl, bmd=results.bmd, bmdu=results.bmdu,
    )


def add_session(
    models: list, dataset_index: int, option_index: int, analysis_type: str, session
) -> None:
    for model_index, model in enumerate(session.models):
        d = dict(
            dataset_index=dataset_index,
            option_index=option_index,
            analysis_type=analysis_type,
            model_index=model_index,
            model_name=model.name(),
        )
        update_dich_settings(d, model.settings)
        update_dich_results(d, model.results)
        if session.recommendation_enabled and session.recommender.results is not None:
            results: RecommenderResults = session.recommender.results
            d.update(
                recommended=(model_index == results.recommended_model_index),
                bin=results.model_bin[model_index].name,
                bin_a="\n".join(results.model_notes[model_index][0]),
                bin_b="\n".join(results.model_notes[model_index][1]),
                bin_c="\n".join(results.model_notes[model_index][2]),
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
        update_dich_settings(d, session.model_average.settings)
        update_dich_ma_results(d, session.model_average.results)
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

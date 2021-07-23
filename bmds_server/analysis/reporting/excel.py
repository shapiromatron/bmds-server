from __future__ import annotations

from typing import TYPE_CHECKING, Any

import pandas as pd
from bmds.bmds3.sessions import BmdsSession

if TYPE_CHECKING:
    from ..models import Analysis


def add_session(
    models: list, dataset_index: int, option_index: int, analysis_type: str, session: BmdsSession
) -> None:
    # add a row for each model
    for model_index, model in enumerate(session.models):
        d: dict[str, Any] = dict(
            dataset_index=dataset_index,
            option_index=option_index,
            analysis_type=analysis_type,
            model_index=model_index,
            model_name=model.name(),
        )
        model.settings.update_record(d)
        model.results.update_record(d)

        if session.recommendation_enabled and session.recommender.results is not None:
            session.recommender.results.update_record(d, model_index)
            session.selected.update_record(d, model_index)

        if session.model_average:
            session.model_average.results.update_record_weights(d, model_index)

        models.append(d)

    # add model average row
    if session.model_average:
        d = dict(
            dataset_index=dataset_index,
            option_index=option_index,
            analysis_type=analysis_type,
            model_index=100,
            model_name="Model average",
        )
        session.model_average.settings.update_record(d)
        session.model_average.results.update_record(d)
        models.append(d)


def build_df(analysis: Analysis) -> pd.DataFrame:
    dataset_data: dict[int, dict] = {}
    model_data = []

    for session in analysis.get_sessions():
        if session.dataset_index not in dataset_data:
            dataset = session.frequentist.dataset if session.frequentist else session.bayesian
            d = dict(dataset_index=session.dataset_index)
            dataset.update_record(d)
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

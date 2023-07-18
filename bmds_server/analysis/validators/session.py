from typing import Any, Literal

import bmds
from django.conf import settings
from pydantic import BaseModel, conlist

from ...common.validation import pydantic_validate

_versions = Literal[bmds.constants.BMDS330]


class BaseSession(BaseModel):
    id: int | str | None
    bmds_version: _versions
    description: str = ""
    dataset_type: bmds.constants.ModelClass


class BaseSessionComplete(BaseSession):
    models: dict
    if settings.IS_DESKTOP:
        datasets: conlist(Any, min_items=1, max_items=100)
        options: conlist(Any, min_items=1, max_items=100)
    else:
        datasets: conlist(Any, min_items=1, max_items=10)
        options: conlist(Any, min_items=1, max_items=10)


def validate_session(data: dict, partial: bool = False):
    schema = BaseSession if partial else BaseSessionComplete
    pydantic_validate(data, schema)

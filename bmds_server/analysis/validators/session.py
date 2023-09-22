from typing import List, Any, Literal

import bmds
from pydantic import Field, BaseModel

from ...common.validation import pydantic_validate
from typing_extensions import Annotated

_versions = Literal[bmds.constants.BMDS330]


class BaseSession(BaseModel):
    id: int | str | None = None
    bmds_version: _versions
    description: str = ""
    dataset_type: bmds.constants.ModelClass


class BaseSessionComplete(BaseSession):
    datasets: Annotated[List[Any], Field(min_length=1, max_length=10)]
    models: dict
    options: Annotated[List[Any], Field(min_length=1, max_length=10)]


def validate_session(data: dict, partial: bool = False):
    schema = BaseSession if partial else BaseSessionComplete
    pydantic_validate(data, schema)

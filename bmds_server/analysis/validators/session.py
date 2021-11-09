from typing import Any, Dict, Optional, Union

import bmds
from pydantic import BaseModel, conlist
from pydantic.typing import Literal

from ...common.validation import pydantic_validate

_versions = Literal[bmds.constants.BMDS330]


class BaseSession(BaseModel):
    id: Optional[Union[int, str]]
    bmds_version: _versions
    description: str = ""
    dataset_type: bmds.constants.ModelClass


class BaseSessionComplete(BaseSession):
    datasets: conlist(Any, min_items=1, max_items=10)
    models: Dict
    options: conlist(Any, min_items=1, max_items=10)


def validate_session(data: Dict, partial: bool = False):
    schema = BaseSession if partial else BaseSessionComplete
    pydantic_validate(data, schema)

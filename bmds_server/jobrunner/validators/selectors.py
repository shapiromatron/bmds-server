from bmds.bmds3.selected import SelectedModelSchema
from pydantic import BaseModel


class JobSelectedSchema(BaseModel):
    # a session-specific selection dataset instance
    option_index: int
    dataset_index: int
    selected: SelectedModelSchema

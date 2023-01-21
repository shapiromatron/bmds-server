from typing import List, Optional

from bmds.bmds3.types.sessions import VersionSchema
from pydantic import BaseModel
from pydantic.schema import schema as pyschema
from rest_framework.schemas.openapi import SchemaGenerator

from .validators import AnalysisSelectedSchema


class EditKeySchema(BaseModel):
    editKey: str


class WrappedAnalysisSelectedSchema(BaseModel):
    editKey: str
    data: AnalysisSelectedSchema


class AnalysisSessionSchema(BaseModel):
    dataset_index: int
    option_index: int
    frequentist: Optional[dict]
    bayesian: Optional[dict]
    error: Optional[str]


class AnalysisOutput(BaseModel):
    analysis_id: str
    analysis_schema_version: str = "1.0"
    bmds_server_version: str
    bmds_python_version: Optional[VersionSchema]
    outputs: list[AnalysisSessionSchema]


class Poly3Input(BaseModel):
    dataset: str
    dose_units: str
    power: Optional[float] = 3
    duration: Optional[float] = 730


def add_schemas(schema: dict, models: List):
    additions = pyschema(models, ref_prefix="#/components/schemas/")
    for key, value in additions["definitions"].items():
        schema["components"]["schemas"][key] = value


def add_schema_to_path(schema: dict, path: str, verb: str, name: str):
    body = schema["paths"][path][verb]["requestBody"]
    for content_type in body["content"].values():
        content_type["schema"]["$ref"] = f"#/components/schemas/{name}"


class ApiSchemaGenerator(SchemaGenerator):
    def get_schema(self, *args, **kwargs):
        schema = super().get_schema(*args, **kwargs)
        add_schemas(schema, [EditKeySchema, WrappedAnalysisSelectedSchema])
        add_schema_to_path(schema, "/api/v1/analysis/{id}/execute/", "post", EditKeySchema.__name__)
        add_schema_to_path(
            schema, "/api/v1/analysis/{id}/execute-reset/", "post", EditKeySchema.__name__
        )
        add_schema_to_path(
            schema,
            "/api/v1/analysis/{id}/select-model/",
            "post",
            WrappedAnalysisSelectedSchema.__name__,
        )
        return schema

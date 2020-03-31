import json

from django.conf import settings
from rest_framework import serializers

from . import models, tasks, validators


class JobSerializer(serializers.ModelSerializer):
    is_finished = serializers.BooleanField(read_only=True)
    has_errors = serializers.BooleanField(read_only=True)
    api_url = serializers.URLField(source="get_api_url", read_only=True)
    input_url = serializers.URLField(source="get_input_url", read_only=True)
    output_url = serializers.URLField(source="get_output_url", read_only=True)
    excel_url = serializers.URLField(source="get_excel_url", read_only=True)

    class Meta:
        model = models.Job
        fields = (
            "id",
            "inputs",
            "errors",
            "outputs",
            "preferences",
            "is_finished",
            "has_errors",
            "api_url",
            "input_url",
            "output_url",
            "excel_url",
            "created",
            "started",
            "ended",
        )
        read_only_fields = (
            "id",
            "errors",
            "outputs",
            "is_finished",
            "has_errors",
            "api_url",
            "input_url",
            "output_url",
            "excel_url",
            "created",
            "started",
            "ended",
        )

    def to_representation(self, obj):
        obj = super(JobSerializer, self).to_representation(obj)
        # TODO - revisit this
        obj.pop("inputs")
        if obj["is_finished"] and obj["outputs"]:
            obj["outputs"] = json.loads(obj["outputs"])
        else:
            obj.pop("outputs")
        return obj

    def create(self, validated_data):
        instance = super().create(validated_data)

        id_ = str(instance.id)
        inputs = json.loads(instance.inputs)
        immediate = inputs.get("immediate", False)
        if settings.ALLOW_BLOCKING_BMDS_REQUESTS and immediate is True:
            instance.try_execute()
        else:
            tasks.try_execute.delay(id_)

        return instance

    def validate_inputs(self, value):
        try:
            validators.validate_input(value)
        except ValueError as err:
            raise serializers.ValidationError(err)
        return value

    def validate_preferences(self, value):
        try:
            validators.validate_preferences(value)
        except ValueError as err:
            raise serializers.ValidationError(err)
        return value

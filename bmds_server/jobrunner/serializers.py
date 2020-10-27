import json

from django.conf import settings
from rest_framework import serializers

from . import models, tasks, validators


class JobSerializer(serializers.ModelSerializer):
    is_executing = serializers.BooleanField(read_only=True)
    is_finished = serializers.BooleanField(read_only=True)
    has_errors = serializers.BooleanField(read_only=True)
    inputs_valid = serializers.BooleanField(read_only=True)
    outputs = serializers.DictField(source="get_outputs_json", read_only=True)
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
            "is_executing",
            "is_finished",
            "has_errors",
            "inputs_valid",
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
            "is_executing",
            "is_finished",
            "has_errors",
            "inputs_valid",
            "api_url",
            "input_url",
            "output_url",
            "excel_url",
            "created",
            "started",
            "ended",
        )

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

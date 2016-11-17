import json
from rest_framework import serializers

from . import models, validators


class JobSerializer(serializers.ModelSerializer):
    is_finished = serializers.BooleanField(read_only=True)
    input_url = serializers.URLField(source='get_input_url', read_only=True)
    output_url = serializers.URLField(source='get_output_url', read_only=True)

    class Meta:
        model = models.Job
        fields = (
            'id', 'inputs', 'outputs',
            'is_finished', 'input_url', 'output_url',
            'created', 'started', 'ended',
        )
        read_only_fields = (
            'id', 'outputs',
            'is_finished', 'input_url', 'output_url',
            'created', 'started', 'ended',
        )

    def to_representation(self, obj):
        obj = super(JobSerializer, self).to_representation(obj)
        obj.pop('inputs')
        if obj['is_finished']:
            obj['outputs'] = json.loads(obj['outputs'])
        return obj

    def validate_inputs(self, value):
        try:
            validators.validate_input(value)
        except ValueError as err:
            raise serializers.ValidationError(err)
        return value

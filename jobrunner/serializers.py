from rest_framework import serializers

from . import models, validators


class JobSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Job
        fields = '__all__'
        read_only_fields = (
            'outputs',
            'errors',
            'created',
            'started',
            'ended',
        )

    def validate_inputs(self, value):
        try:
            validators.validate_input(value)
        except ValueError as err:
            raise serializers.ValidationError(err)
        return value

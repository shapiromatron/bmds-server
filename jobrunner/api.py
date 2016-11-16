from rest_framework import mixins, viewsets

from . import serializers, models


class JobViewset(mixins.CreateModelMixin,
                 mixins.RetrieveModelMixin,
                 viewsets.GenericViewSet):

    def get_serializer_class(self):
        return serializers.JobSerializer

    def get_queryset(self):
        return models.Job.objects.all()

from rest_framework import mixins, status, viewsets
from rest_framework.decorators import detail_route
from rest_framework.response import Response
from rest_framework.renderers import BaseRenderer

from . import serializers, models


class TxtRenderer(BaseRenderer):

    media_type = 'text/plain'
    format = 'txt'

    def render(self, txt, accepted_media_type, renderer_context):
        return txt


class JobViewset(mixins.CreateModelMixin,
                 mixins.RetrieveModelMixin,
                 viewsets.GenericViewSet):

    def get_serializer_class(self):
        return serializers.JobSerializer

    @detail_route(methods=('get',), renderer_classes=(TxtRenderer,))
    def download_inputs(self, request, *args, **kwargs):
        instance = self.get_object()
        fn = u'{}-inputs.json'.format(instance.id)
        resp = Response(instance.inputs)
        resp['Content-Disposition'] = u'attachment; filename="{}"'.format(fn)
        return resp

    @detail_route(methods=('get',), renderer_classes=(TxtRenderer,))
    def download_outputs(self, request, *args, **kwargs):
        instance = self.get_object()

        if len(instance.outputs) == 0:
            content = 'Outputs processing; not ready yet.'
            return Response(content, status=status.HTTP_204_NO_CONTENT)

        fn = u'{}-outputs.json'.format(instance.id)
        resp = Response(instance.outputs)
        resp['Content-Disposition'] = u'attachment; filename="{}"'.format(fn)
        return resp

    def get_queryset(self):
        return models.Job.objects.all()

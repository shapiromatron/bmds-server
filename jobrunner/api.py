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


class XlsxRenderer(BaseRenderer):
    media_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    format = 'xlsx'

    def render(self, wb, media_type=None, renderer_context=None):
        return wb


class JobViewset(mixins.CreateModelMixin,
                 mixins.RetrieveModelMixin,
                 viewsets.GenericViewSet):

    def get_serializer_class(self):
        return serializers.JobSerializer

    def not_ready_yet(self):
        content = 'Outputs processing; not ready yet.'
        return Response(content, status=status.HTTP_204_NO_CONTENT)

    @detail_route(methods=('get',), renderer_classes=(TxtRenderer,))
    def inputs(self, request, *args, **kwargs):
        instance = self.get_object()
        fn = u'{}-inputs.json'.format(instance.id)
        resp = Response(instance.inputs)
        resp['Content-Disposition'] = u'attachment; filename="{}"'.format(fn)
        return resp

    @detail_route(methods=('get',), renderer_classes=(TxtRenderer,))
    def outputs(self, request, *args, **kwargs):
        instance = self.get_object()

        if not instance.is_finished:
            return self.not_ready_yet()

        fn = u'{}-outputs.json'.format(instance.id)
        resp = Response(instance.outputs)
        resp['Content-Disposition'] = u'attachment; filename="{}"'.format(fn)
        return resp

    @detail_route(methods=('get',), renderer_classes=(XlsxRenderer,))
    def excel(self, request, *args, **kwargs):
        instance = self.get_object()

        if not instance.is_finished:
            return self.not_ready_yet()

        fn, wb = instance.get_excel()
        resp = Response(wb)
        resp['Content-Disposition'] = u'attachment; filename="{}"'.format(fn)
        return resp

    def get_queryset(self):
        return models.Job.objects.all()

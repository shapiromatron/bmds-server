from rest_framework import mixins, status, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.renderers import BaseRenderer
from rest_framework.response import Response

from . import models, serializers, tasks


class TxtRenderer(BaseRenderer):

    media_type = "text/plain"
    format = "txt"

    def render(self, txt, accepted_media_type, renderer_context):
        return txt


class XlsxRenderer(BaseRenderer):
    media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    format = "xlsx"

    def render(self, wb, media_type=None, renderer_context=None):
        return wb


class JobViewset(mixins.CreateModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    def get_serializer_class(self):
        return serializers.JobSerializer

    def not_ready_yet(self):
        content = "Outputs processing; not ready yet."
        return Response(content, status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=("get",), renderer_classes=(TxtRenderer,))
    def inputs(self, request, *args, **kwargs):
        instance = self.get_object()
        fn = f"{instance.id}-inputs.json"
        resp = Response(instance.inputs)
        resp["Content-Disposition"] = 'attachment; filename="{}"'.format(fn)
        return resp

    @action(detail=True, methods=("get",), renderer_classes=(TxtRenderer,))
    def outputs(self, request, *args, **kwargs):
        instance = self.get_object()

        if not instance.is_finished:
            return self.not_ready_yet()

        fn = f"{instance.id}-outputs.json"
        resp = Response(instance.outputs)
        resp["Content-Disposition"] = f'attachment; filename="{fn}"'
        return resp

    @action(detail=True, methods=("get",), renderer_classes=(XlsxRenderer,))
    def excel(self, request, *args, **kwargs):
        instance = self.get_object()

        if not instance.is_finished:
            return self.not_ready_yet()

        fn, wb = instance.get_excel()
        resp = Response(wb)
        resp["Content-Disposition"] = 'attachment; filename="{}"'.format(fn)
        return resp

    def get_queryset(self):
        return models.Job.objects.all()


class DfileExecutorViewset(viewsets.ViewSet):

    permission_classes = (IsAdminUser,)
    authentication_classes = (TokenAuthentication,)

    def create(self, request):
        """
        Execute list of dfiles
        """
        payload = request.data.get("inputs", [])
        try:
            output = tasks.execute_dfile.delay(payload).get(timeout=120)
        except TimeoutError:
            output = {"timeout": True}
        return Response(output)

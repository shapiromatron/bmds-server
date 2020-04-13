from rest_framework import exceptions, mixins, status, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from . import models, serializers, renderers, tasks


class JobViewset(mixins.CreateModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    def get_serializer_class(self):
        return serializers.JobSerializer

    def not_ready_yet(self):
        content = "Outputs processing; not ready yet."
        return Response(content, status=status.HTTP_204_NO_CONTENT)

    @action(
        detail=True, methods=("patch",), url_path="patch-inputs",
    )
    def patch_inputs(self, request, *args, **kwargs):
        """
        Validate input and if successful, patch inputs on server side.
        """
        instance = self.get_object()

        # permission check
        if request.data.get("editKey") != instance.password:
            # todo: move to custom header?
            raise exceptions.PermissionDenied()

        # validation toggle; get validator for data
        validate_what = request.data.get("validateWhat")
        if validate_what is None:
            raise NotImplementedError()
        elif validate_what == "datasets":
            validated = "datasets"
        elif validate_what == "models":
            raise NotImplementedError()
        elif validate_what == "option_sets":
            raise NotImplementedError()
        else:
            raise exceptions.ValidationError("Unknown `validate_what` option.")

        save = bool(request.data.get("save", True))
        if save:
            instance.save()

        # todo: fix response
        response = {}
        response[validated] = True
        return Response(data=response)

    @action(detail=True, methods=("get",), renderer_classes=(renderers.TxtRenderer,))
    def inputs(self, request, *args, **kwargs):
        """
        Return inputs for selected job.
        """
        instance = self.get_object()
        fn = f"{instance.id}-inputs.json"
        resp = Response(instance.inputs)
        resp["Content-Disposition"] = f'attachment; filename="{fn}"'
        return resp

    @action(detail=True, methods=("get",), renderer_classes=(renderers.TxtRenderer,))
    def outputs(self, request, *args, **kwargs):
        """
        Return outputs for selected job
        """
        instance = self.get_object()

        if not instance.is_finished:
            return self.not_ready_yet()

        fn = f"{instance.id}-outputs.json"
        resp = Response(instance.outputs)
        resp["Content-Disposition"] = f'attachment; filename="{fn}"'
        return resp

    @action(detail=True, methods=("get",), renderer_classes=(renderers.XlsxRenderer,))
    def excel(self, request, *args, **kwargs):
        """
        Return Excel export of outputs for selected job
        """
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

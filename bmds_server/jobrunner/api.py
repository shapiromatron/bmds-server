import io
import random

from django.core.exceptions import ValidationError
from rest_framework import exceptions, mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from ..common.validation import pydantic_validate
from . import models, renderers, serializers, validators


class JobViewset(mixins.CreateModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = serializers.JobSerializer
    queryset = models.Job.objects.all()

    def not_ready_yet(self):
        content = "Outputs processing; not ready yet."
        return Response(content, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, url_path="default")
    def default(self, request, *args, **kwargs):
        data = models.Job().default_input()
        return Response(data)

    @action(
        detail=True, methods=("patch",), url_path="patch-inputs",
    )
    def patch_inputs(self, request, *args, **kwargs):
        """
        Validate input and if successful, patch inputs on server side.
        """
        instance = self.get_object()
        data = request.data.get("data")
        edit_key = request.data.get("editKey", "")
        partial = bool(request.data.get("partial", False))

        # permission check
        if edit_key != instance.password:
            raise exceptions.PermissionDenied()

        if not isinstance(data, dict):
            raise exceptions.ValidationError("A `data` object is required")

        try:
            validators.validate_input(data, partial=partial)
        except ValidationError as err:
            raise exceptions.ValidationError(err.message)

        instance.reset_execution()
        instance.inputs = data
        instance.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=("post",))
    def execute(self, request, *args, **kwargs):
        """
        Attempt to execute the model.
        """
        instance = self.get_object()

        # permissions check
        if instance.password != request.data.get("editKey", ""):
            raise exceptions.PermissionDenied()

        # preflight execution check
        if not instance.inputs_valid():
            return Response("Invalid inputs", status=400)
        elif instance.is_executing:
            return Response("Execution already started", status=400)

        # start job execution
        instance.reset_execution()
        instance.start_execute()

        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=("post",), url_path="select-model")
    def select_model(self, request, *args, **kwargs):
        instance = self.get_object()

        # permissions check
        if instance.password != request.data.get("editKey", ""):
            raise exceptions.PermissionDenied()

        # validate data
        data = request.data.get("data")
        if not isinstance(data, dict):
            raise exceptions.ValidationError("A `data` object is required")

        selection = pydantic_validate(data, validators.JobSelectedSchema)
        instance.update_selection(selection)

        # fetch from db and get the latest
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=("post",), url_path="execute-reset")
    def execute_reset(self, request, *args, **kwargs):
        """
        Attempt to execute the model.
        """
        instance = self.get_object()

        # permissions check
        if instance.password != request.data.get("editKey", ""):
            raise exceptions.PermissionDenied()

        # reset instance
        instance.reset_execution()
        instance.save()

        # fetch from db and get the latest
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, renderer_classes=(renderers.XlsxRenderer,))
    def excel(self, request, *args, **kwargs):
        """
        Return Excel export of outputs for selected job
        """
        # TODO - change from random number generator to a queue to checks diskcache
        if random.random() < 0.9:
            return Response(
                {
                    "status": "queued",
                    "message": "Export requested... please wait until results are complete.",
                },
                content_type="application/json",
            )

        instance = self.get_object()
        df = instance.to_excel()
        f = io.BytesIO()
        df.to_excel(f, index=False)
        data = renderers.BinaryFile(data=f, filename=instance.slug)
        return Response(data)

    @action(detail=True, renderer_classes=(renderers.DocxRenderer,))
    def word(self, request, *args, **kwargs):
        """
        Return Word report for the selected job
        """
        # TODO - change from random number generator to a queue to checks diskcache
        if random.random() < 0.9:
            return Response(
                {
                    "status": "queued",
                    "message": "Report requested... please wait until results are complete.",
                },
                content_type="application/json",
            )

        instance = self.get_object()
        document = instance.to_word()
        data = renderers.BinaryFile(data=document, filename=instance.slug)
        return Response(data)

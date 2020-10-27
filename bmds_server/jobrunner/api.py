import io
import json

import pandas as pd
from django.core.exceptions import ValidationError
from docx import Document
from rest_framework import exceptions, mixins, status, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from . import models, renderers, serializers, tasks, validators


class JobViewset(mixins.CreateModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = serializers.JobSerializer

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
        data = request.data.get("data")
        edit_key = request.data.get("editKey", "")
        partial = bool(request.data.get("partial", False))

        # permission check
        if edit_key != instance.password:
            raise exceptions.PermissionDenied()

        if not isinstance(data, dict):
            raise exceptions.ValidationError("A `data` object is required")

        input_data = json.dumps(data)

        try:
            validators.validate_input(input_data, partial=partial)
        except ValidationError as err:
            raise exceptions.ValidationError(err.message)

        instance.inputs = input_data
        instance.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

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
            return Response("Invalid inputs", status_code=400)
        elif instance.is_executing:
            return Response("Execution already started", status_code=400)

        # start job execution
        instance.start_execute()

        instance.refresh_from_db()

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

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

        # if not instance.is_finished:
        #     return self.not_ready_yet()
        # fn, wb = instance.get_excel()

        # TODO - set to temporary file for building UI - change later
        df = pd.DataFrame(data=dict(a=[1, 2, 3], b=[4, 5, 6]))
        f = io.BytesIO()
        df.to_excel(f, index=False)

        data = renderers.BinaryFile(data=f, filename=str(instance.id))
        return Response(data)

    @action(detail=True, methods=("get",), renderer_classes=(renderers.DocxRenderer,))
    def word(self, request, *args, **kwargs):
        """
        Return Word report for the selected job
        """
        instance = self.get_object()

        # if not instance.is_finished:
        #     return self.not_ready_yet()
        # fn, wb = instance.get_word()

        # TODO - set to temporary file for building UI - change later
        f = io.BytesIO()
        document = Document()
        document.add_heading("Hello world", 0)
        document.save(f)

        data = renderers.BinaryFile(data=f, filename=str(instance.id))
        return Response(data)

    def get_queryset(self):
        return models.Job.objects.all()

import io

from django.core.exceptions import ValidationError
from rest_framework import exceptions, mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from . import models, renderers, reports, serializers, validators


class JobViewset(mixins.CreateModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = serializers.JobSerializer
    queryset = models.Job.objects.all()

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

        try:
            validators.validate_input(data, partial=partial)
        except ValidationError as err:
            raise exceptions.ValidationError(err.message)

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
            return Response("Invalid inputs", status_code=400)
        elif instance.is_executing:
            return Response("Execution already started", status_code=400)

        # start job execution
        instance.start_execute()

        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=("get",), renderer_classes=(renderers.XlsxRenderer,))
    def excel(self, request, *args, **kwargs):
        """
        Return Excel export of outputs for selected job
        """
        instance = self.get_object()

        report_engine = reports.ExportEngine(instance)
        df = report_engine.create_export()
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

        report_engine = reports.ReportEngine(instance)
        document = report_engine.create_report()
        data = renderers.BinaryFile(data=document, filename=str(instance.id))
        return Response(data)

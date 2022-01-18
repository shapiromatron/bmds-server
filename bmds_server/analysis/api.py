from django.core.exceptions import ValidationError
from rest_framework import exceptions, mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from ..common import renderers
from ..common.task_cache import ReportStatus
from ..common.validation import pydantic_validate
from . import models, serializers, validators
from .reporting.cache import DocxReportCache, ExcelReportCache
from .reporting.docx import add_update_url


class AnalysisViewset(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = serializers.AnalysisSerializer
    queryset = models.Analysis.objects.all()

    def not_ready_yet(self):
        content = "Outputs processing; not ready yet."
        return Response(content, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, url_path="default")
    def default(self, request, *args, **kwargs):
        data = models.Analysis().default_input()
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

        # start analysis execution
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

        selection = pydantic_validate(data, validators.AnalysisSelectedSchema)
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
        Return Excel export of outputs for selected analysis
        """
        instance = self.get_object()
        response = ExcelReportCache(analysis=instance).request_content()
        if response.status is ReportStatus.COMPLETE:
            data = renderers.BinaryFile(data=response.content, filename=instance.slug)
            return Response(data)

        return Response(response.dict(), content_type="application/json")

    @action(detail=True, renderer_classes=(renderers.DocxRenderer,))
    def word(self, request, *args, **kwargs):
        """
        Return Word report for the selected analysis
        """
        instance: models.Analysis = self.get_object()
        uri = request.build_absolute_uri("/")[:-1]

        dataset_format_long = request.query_params.get("datasetFormatLong") == "true"
        verbose_model_outputs = request.query_params.get("verboseModelOutputs") == "true"
        bmd_cdf_table = request.query_params.get("bmdCdfTable") == "true"

        kwargs = {
            "dataset_format_long": dataset_format_long,
            "verbose_model_outputs": verbose_model_outputs,
            "bmd_cdf_table": bmd_cdf_table,
        }
        response = DocxReportCache(analysis=instance, uri=uri, **kwargs).request_content()
        if response.status is ReportStatus.COMPLETE:
            edit = instance.password == request.query_params.get("editKey", "")
            data = add_update_url(instance, response.content, uri) if edit else response.content
            return Response(renderers.BinaryFile(data=data, filename=instance.slug))
        return Response(response.dict(), content_type="application/json")

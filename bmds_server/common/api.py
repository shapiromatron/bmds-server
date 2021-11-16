from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .renderers import SvgRenderer
from .worker_health import worker_healthcheck


class HealthcheckViewset(viewsets.ViewSet):
    @action(detail=False)
    def web(self, request):
        return Response({"healthy": True})

    @action(detail=False)
    def worker(self, request):
        is_healthy = worker_healthcheck.healthy()
        status_code = status.HTTP_200_OK if is_healthy else status.HTTP_503_SERVICE_UNAVAILABLE
        return Response({"healthy": is_healthy}, status=status_code)

    @action(
        detail=False,
        url_path="worker-plot",
        renderer_classes=(SvgRenderer,),
        permission_classes=(permissions.IsAdminUser,),
    )
    def worker_plot(self, request):
        ax = worker_healthcheck.plot()
        return Response(ax)

    @action(detail=False, url_path="worker-stats", permission_classes=(permissions.IsAdminUser,))
    def worker_stats(self, request):
        return Response(worker_healthcheck.stats())

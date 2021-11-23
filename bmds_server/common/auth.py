from rest_framework import authentication, permissions


class SessionCsrfAuthentication(authentication.SessionAuthentication):
    """
    Custom Session auth where CSRF is enforced for anonymous requests.
    """

    def authenticate(self, request):
        # Get the session-based user from the underlying HttpRequest object
        user = getattr(request._request, "user", None)

        # enforce CSRF with user or any non-safe methods
        if user or request.method not in permissions.SAFE_METHODS:
            self.enforce_csrf(request)

        # Unauthenticated
        if not user or not user.is_active:
            return None

        # CSRF passed with authenticated user
        return (user, None)


class SafeOrAuthenticatedOrCsrfToken(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.method in permissions.SAFE_METHODS
            or (request.user and request.user.is_authenticated)
            or getattr(request, "csrf_processing_done", False) is True
        )

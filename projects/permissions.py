from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrManager(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.role in ["admin", "manager"]
        )


class IsProjectMember(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user in obj.members.all()

class IsAdminManagerOrReadOnlyForMembers(BasePermission):
    """
    Admin/Manager: full access
    Member: read-only on projects they belong to
    """

    def has_permission(self, request, view):
        # Must be authenticated for any project access
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Admin or Manager: full access
        if request.user.role in ["admin", "manager"]:
            return True

        # Members: read-only if they belong to project
        if request.method in SAFE_METHODS and request.user in obj.members.all():
            return True

        return False
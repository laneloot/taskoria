from rest_framework.permissions import BasePermission

class IsAdminOrManager(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.role in ["admin", "manager"]
        )


class IsProjectMember(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user in obj.members.all()

from rest_framework.permissions import BasePermission


class IsAuthorOrManager(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Admin/Manager can modify
        if request.user.role in ["admin", "manager"]:
            return True

        # Author can modify
        return obj.author == request.user

from rest_framework.permissions import BasePermission


class IsUploaderOrManager(BasePermission):
    """
    Admin/Manager can delete any file
    Only uploader can delete their own file
    """

    def has_object_permission(self, request, view, obj):
        if request.user.role in ["admin", "manager"]:
            return True
        return obj.uploaded_by == request.user

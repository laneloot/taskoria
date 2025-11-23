from rest_framework.permissions import BasePermission

class IsAssigneeOrManager(BasePermission):
    """
    Managers/Admins: full access
    Assignee: can read and update
    Others: no access
    """

    def has_object_permission(self, request, view, obj):
        # admin and manager have full control
        if request.user.role in ["admin", "manager"]:
            return True

        # task assignee has access
        return request.user == obj.assignee

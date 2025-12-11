from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from projects.models import Project
from .metrics.project_metrics import project_summary
from .metrics.user_metrics import user_summary


class ProjectSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"detail": "Project not found"}, status=404)

        data = project_summary(project)
        return Response(data)


class UserSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id=None):
        user = request.user if user_id is None else request.user.__class__.objects.get(id=user_id)
        data = user_summary(user)
        return Response(data)

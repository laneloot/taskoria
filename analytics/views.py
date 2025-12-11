from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from projects.models import Project
from .metrics.project_metrics import project_summary
from .metrics.user_metrics import user_summary

from analytics.metrics.distribution_metrics import (
    task_distribution_by_status,
    task_distribution_by_priority,
    task_distribution_by_assignee,
    task_distribution_by_project,
)
from projects.models import Project

from analytics.metrics.trend_metrics import (
    tasks_created_per_day,
    tasks_completed_per_day,
    burndown_data,
    weekly_productivity,
)



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

class TaskDistributionAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id=None):
        project = None
        if project_id:
            try:
                project = Project.objects.get(id=project_id)
            except Project.DoesNotExist:
                return Response({"detail": "Project not found"}, status=404)

        return Response({
            "status": task_distribution_by_status(project),
            "priority": task_distribution_by_priority(project),
            "assignee": task_distribution_by_assignee(project),
        })


class TaskDistributionByProjectAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "project": task_distribution_by_project()
        })

class TaskTrendsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id=None):
        project = None

        if project_id:
            from projects.models import Project
            try:
                project = Project.objects.get(id=project_id)
            except Project.DoesNotExist:
                return Response({"detail": "Project not found"}, status=404)

        return Response({
            "created_per_day": tasks_created_per_day(project),
            "completed_per_day": tasks_completed_per_day(project),
        })


class BurndownAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        from projects.models import Project
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"detail": "Project not found"}, status=404)

        return Response(burndown_data(project))


class WeeklyProductivityAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id=None):
        user = request.user
        if user_id:
            try:
                user = user.__class__.objects.get(id=user_id)
            except user.__class__.DoesNotExist:
                return Response({"detail": "User not found"}, status=404)

        return Response(weekly_productivity(user))

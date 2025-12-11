from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from analytics.permissions import IsAdminOrManager
from users.models import User

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


from analytics.cache import cached_analytics

class ProjectSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        from analytics.metrics.project_metrics import project_summary
        from projects.models import Project

        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"detail": "Project not found"}, status=404)

        key = f"project_summary_{project_id}"

        data = cached_analytics(key, lambda: project_summary(project), timeout=60)
        return Response(data)


class UserSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id=None):
        from analytics.metrics.user_metrics import user_summary

        user = request.user
        if user_id:
            User = request.user.__class__
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response({"detail": "User not found"}, status=404)

        key = f"user_summary_{user.id}"

        data = cached_analytics(key, lambda: user_summary(user), timeout=60)
        return Response(data)


class TaskDistributionAPIView(APIView):

    def get(self, request, project_id=None):
        from analytics.metrics.distribution_metrics import (
            task_distribution_by_status,
            task_distribution_by_priority,
            task_distribution_by_assignee,
        )

        project = None
        if project_id:
            from projects.models import Project
            try:
                project = Project.objects.get(id=project_id)
            except Project.DoesNotExist:
                return Response({"detail": "Project not found"}, status=404)

        key = f"task_distribution_{project_id or 'global'}"

        data = cached_analytics(
            key,
            lambda: {
                "status": task_distribution_by_status(project),
                "priority": task_distribution_by_priority(project),
                "assignee": task_distribution_by_assignee(project),
            },
            timeout=120,  # 2 min cache
        )

        return Response(data)


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

class TeamPerformanceAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def get(self, request):
        users = User.objects.filter(role="member")

        from analytics.metrics.user_metrics import user_summary
        from analytics.cache import cached_analytics

        def compute():
            return [user_summary(u) for u in users]

        data = cached_analytics("team_performance", compute, timeout=120)

        return Response(data)


class ProjectPortfolioAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def get(self, request):
        from projects.models import Project
        from analytics.metrics.project_metrics import project_summary
        from analytics.cache import cached_analytics

        def compute():
            return [project_summary(p) for p in Project.objects.all()]

        data = cached_analytics("project_portfolio", compute, timeout=120)

        return Response(data)


class OrganizationDistributionAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def get(self, request):
        from analytics.metrics.distribution_metrics import (
            task_distribution_by_status,
            task_distribution_by_priority,
            task_distribution_by_assignee,
        )
        from analytics.cache import cached_analytics

        def compute():
            return {
                "status": task_distribution_by_status(),
                "priority": task_distribution_by_priority(),
                "assignee": task_distribution_by_assignee(),
            }

        data = cached_analytics("org_distribution", compute, timeout=120)
        return Response(data)

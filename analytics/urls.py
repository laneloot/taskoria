from django.urls import path
from .views import (
    ProjectSummaryAPIView,
    UserSummaryAPIView,
    TaskDistributionAPIView,
    TaskDistributionByProjectAPIView,
    TaskTrendsAPIView,
    BurndownAPIView,
    WeeklyProductivityAPIView,
    TeamPerformanceAPIView,
    ProjectPortfolioAPIView,
    OrganizationDistributionAPIView,
)

urlpatterns = [
    path('project/<int:project_id>/summary/', ProjectSummaryAPIView.as_view()),
    path('user/summary/', UserSummaryAPIView.as_view()),
    path('user/<int:user_id>/summary/', UserSummaryAPIView.as_view()),
    path('tasks/distribution/', TaskDistributionAPIView.as_view()),
    path('project/<int:project_id>/tasks/distribution/', TaskDistributionAPIView.as_view()),
    path('tasks/distribution/by-project/', TaskDistributionByProjectAPIView.as_view()),
    path('tasks/trends/', TaskTrendsAPIView.as_view()),
    path('project/<int:project_id>/tasks/trends/', TaskTrendsAPIView.as_view()),
    path('project/<int:project_id>/burndown/', BurndownAPIView.as_view()),
    path('user/weekly-productivity/', WeeklyProductivityAPIView.as_view()),
    path('user/<int:user_id>/weekly-productivity/', WeeklyProductivityAPIView.as_view()),
    path('reports/team-performance/', TeamPerformanceAPIView.as_view()),
    path('reports/project-portfolio/', ProjectPortfolioAPIView.as_view()),
    path('reports/organization-distribution/', OrganizationDistributionAPIView.as_view()),
]

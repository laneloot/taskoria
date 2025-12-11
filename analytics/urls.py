from django.urls import path
from .views import ProjectSummaryAPIView, UserSummaryAPIView

urlpatterns = [
    path('project/<int:project_id>/summary/', ProjectSummaryAPIView.as_view()),
    path('user/summary/', UserSummaryAPIView.as_view()),        # current user
    path('user/<int:user_id>/summary/', UserSummaryAPIView.as_view()),
]

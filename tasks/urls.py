from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet
from .views_search import TaskSearchAPIView

router = DefaultRouter()
router.register('', TaskViewSet, basename='task')

urlpatterns = [
    path('search/', TaskSearchAPIView.as_view(), name='task-search'),
]

urlpatterns += router.urls
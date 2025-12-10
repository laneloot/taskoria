from rest_framework import generics
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated

from .models import Task
from .serializers import TaskSerializer
from .permissions import IsAssigneeOrManager

# class TaskUpdateView(generics.RetrieveUpdateAPIView):
#     queryset = Task.objects.all()
#     serializer_class = TaskSerializer
#     permission_classes = [IsAssigneeOrManager]

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsAssigneeOrManager]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    filterset_fields = [
        'project',
        'assignee',
        'priority',
        'status',
        'due_date',
    ]

    search_fields = [
        'title',
        'description',
        'assignee__username',
        'project__name',
    ]

    ordering_fields = [
        'created_at',
        'updated_at',
        'priority',
        'due_date',
        'started_at',
        'completed_at',
    ]
    ordering = ['-created_at']

    def get_queryset(self):
        return Task.objects.optimized().all()


    def perform_create(self, serializer):
        # automatically set created_by if needed later
        serializer.save()

    def perform_update(self, serializer):
        task = self.get_object()
        old_status = task.status
        updated_task = serializer.save()

        new_status = updated_task.status

        # Set start timestamp
        if old_status != "in_progress" and new_status == "in_progress":
            updated_task.started_at = timezone.now()

        # Set completed timestamp
        if old_status != "done" and new_status == "done":
            updated_task.completed_at = timezone.now()

        # If moved out of done, clear completion time
        if old_status == "done" and new_status != "done":
            updated_task.completed_at = None

        updated_task.save()

    @action(detail=False, methods=['get'])
    def my_tasks(self, request):
        tasks = Task.objects.filter(assignee=request.user)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def overdue(self, request):
        today = timezone.now().date()
        tasks = Task.objects.filter(
            due_date__lt=today,
            status__in=["todo", "in_progress", "blocked"]
        )
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_project(self, request):
        project_id = request.query_params.get("project_id")
        tasks = Task.objects.filter(project_id=project_id)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)
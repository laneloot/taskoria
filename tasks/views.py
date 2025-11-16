from rest_framework import generics
from .models import Task
from .serializers import TaskSerializer
from .permissions import IsAssigneeOrManager

class TaskUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAssigneeOrManager]

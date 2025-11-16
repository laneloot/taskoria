from rest_framework import generics
from .models import Project
from .serializers import ProjectSerializer
from .permissions import IsAdminOrManager

class ProjectCreateView(generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminOrManager]

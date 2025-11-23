from rest_framework import generics
from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import Project
from .serializers import ProjectSerializer
from .permissions import IsAdminOrManager, IsAdminManagerOrReadOnlyForMembers


class ProjectCreateView(generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminOrManager]


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminManagerOrReadOnlyForMembers]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'owner', 'members']
    search_fields = ['name', 'description']
    ordering_fields = ['start_date', 'end_date', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return Project.objects.none()

        # Admin / Manager see all projects
        if user.role in ["admin", "manager"]:
            return Project.objects.all()

        # Members: only projects they belong to
        return Project.objects.filter(members=user)

    def perform_create(self, serializer):
        serializer.save()

from rest_framework import viewsets, permissions
from .models import Comment
from .serializers import CommentSerializer
from .permissions import IsAuthorOrManager


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrManager]
    
    search_fields = [
        'message',
        'author__username',
    ]

    ordering_fields = [
        'created_at',
    ]

    def get_queryset(self):
        task_id = self.request.query_params.get("task")
        queryset = Comment.objects.all().order_by("-created_at")

        if task_id:
            queryset = queryset.filter(task_id=task_id)
        
        return (
            queryset
            .select_related('author', 'task', 'task__project')
            .all()
        )


    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

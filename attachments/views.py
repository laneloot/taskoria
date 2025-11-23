from rest_framework import viewsets, permissions
from .models import Attachment
from .serializers import AttachmentSerializer
from .permissions import IsUploaderOrManager


class AttachmentViewSet(viewsets.ModelViewSet):
    queryset = Attachment.objects.all().order_by('-uploaded_at')
    serializer_class = AttachmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsUploaderOrManager]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

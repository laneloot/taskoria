from django.db import models
from users.models import User
from tasks.models import Task


class Attachment(models.Model):
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name="attachments"
    )
    file = models.FileField(upload_to="attachments/")
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="uploaded_files"
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attachment by {self.uploaded_by.username} on {self.task.title}"

from django.db import models
from users.models import User
from projects.models import Project


class Task(models.Model):
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )

    STATUS_CHOICES = (
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
        ('blocked', 'Blocked'),
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='tasks',
    )
    assignee = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tasks'
    )
    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default='medium'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='todo'
    )
    due_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    # Optional: task dependencies (blockers)
    blocked_by = models.ManyToManyField(
        "self",
        symmetrical=False,
        blank=True,
        related_name='blocking'
    )


    def __str__(self):
        return self.title
    
    @property
    def is_overdue(self):
        from django.utils import timezone
        if self.due_date and self.status != 'done':
            return self.due_date < timezone.now().date()
        return False


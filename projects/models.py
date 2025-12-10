from django.db import models
from users.models import User
from django.core.cache import cache


class Project(models.Model):
    STATUS_CHOICES = (
        ('planning', 'Planning'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('archived', 'Archived'),
    )

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='owned_projects'
    )
    members = models.ManyToManyField(
        User,
        related_name='projects',
        blank=True
    )
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='planning'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    @property
    def progress_percentage(self):
        key = f"project_progress_{self.id}"
        cached = cache.get(key)
        if cached is not None:
            return cached

        total = self.tasks.count()
        if total == 0:
            cache.set(key, 0, 30)
            return 0

        done = self.tasks.filter(status="done").count()
        result = int(done * 100 / total)
        cache.set(key, result, 30)
        return result

    class Meta:
        indexes = [
            models.Index(fields=["name"]),
        ]

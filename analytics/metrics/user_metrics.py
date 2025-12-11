from django.utils import timezone
from tasks.models import Task


def user_summary(user):
    tasks = Task.objects.filter(assignee=user)

    total = tasks.count()
    done = tasks.filter(status="done").count()
    active = tasks.filter(status__in=["todo", "in_progress"]).count()

    overdue = tasks.filter(
        due_date__lt=timezone.now().date(),
        status__in=["todo", "in_progress"]
    ).count()

    completed_today = tasks.filter(
        status="done",
        completed_at__date=timezone.now().date()
    ).count()

    return {
        "user_id": user.id,
        "username": user.username,
        "total_tasks": total,
        "completed_tasks": done,
        "active_tasks": active,
        "overdue_tasks": overdue,
        "completed_today": completed_today,
    }

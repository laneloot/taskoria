from django.utils import timezone
from tasks.models import Task


def project_summary(project):
    tasks = project.tasks.all()

    total = tasks.count()
    done = tasks.filter(status="done").count()
    todo = tasks.filter(status="todo").count()
    in_progress = tasks.filter(status="in_progress").count()
    blocked = tasks.filter(status="blocked").count()

    overdue = tasks.filter(
        due_date__lt=timezone.now().date(),
        status__in=["todo", "in_progress", "blocked"]
    ).count()

    progress = project.progress_percentage  # already optimized earlier

    return {
        "project_id": project.id,
        "project_name": project.name,
        "total_tasks": total,
        "completed_tasks": done,
        "todo_tasks": todo,
        "in_progress_tasks": in_progress,
        "blocked_tasks": blocked,
        "overdue_tasks": overdue,
        "progress_percentage": progress,
    }

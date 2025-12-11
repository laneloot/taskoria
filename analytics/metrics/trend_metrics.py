from django.db.models.functions import TruncDate
from django.db.models import Count
from django.utils import timezone
from tasks.models import Task


def tasks_created_per_day(project=None):
    qs = Task.objects
    if project:
        qs = qs.filter(project=project)

    result = (
        qs.annotate(date=TruncDate("created_at"))
          .values("date")
          .annotate(count=Count("id"))
          .order_by("date")
    )

    return list(result)


def tasks_completed_per_day(project=None):
    qs = Task.objects.filter(status="done")
    if project:
        qs = qs.filter(project=project)

    result = (
        qs.annotate(date=TruncDate("completed_at"))
          .values("date")
          .annotate(count=Count("id"))
          .order_by("date")
    )

    return list(result)


def burndown_data(project):
    total = project.tasks.count()

    result = (
        project.tasks.annotate(date=TruncDate("completed_at"))
            .values("date")
            .annotate(done=Count("id"))
            .order_by("date")
    )

    cumulative_done = 0
    output = []

    for row in result:
        cumulative_done += row["done"]
        output.append({
            "date": row["date"],
            "remaining": total - cumulative_done
        })

    return output


def weekly_productivity(user):
    start_of_week = timezone.now().date() - timezone.timedelta(days=6)

    qs = Task.objects.filter(
        assignee=user,
        completed_at__date__gte=start_of_week
    )

    result = (
        qs.annotate(date=TruncDate("completed_at"))
          .values("date")
          .annotate(count=Count("id"))
          .order_by("date")
    )

    return list(result)
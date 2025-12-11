from collections import Counter
from tasks.models import Task


def task_distribution_by_status(project=None):
    queryset = Task.objects.all()
    if project:
        queryset = queryset.filter(project=project)

    data = Counter(queryset.values_list("status", flat=True))

    return dict(data)


def task_distribution_by_priority(project=None):
    queryset = Task.objects.all()
    if project:
        queryset = queryset.filter(project=project)

    data = Counter(queryset.values_list("priority", flat=True))

    return dict(data)


def task_distribution_by_assignee(project=None):
    queryset = Task.objects.all()
    if project:
        queryset = queryset.filter(project=project)

    data = Counter(queryset.values_list("assignee__username", flat=True))

    # Replace None keys with readable label
    return {k or "Unassigned": v for k, v in data.items()}


def task_distribution_by_project():
    queryset = Task.objects.values_list("project__name", flat=True)
    data = Counter(queryset)

    return dict(data)

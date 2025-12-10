from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings

from celery import shared_task
from django.utils import timezone
from django.contrib.auth import get_user_model
from tasks.models import Task

User = get_user_model()


@shared_task
def send_email_task(subject, message, to_email):
    if not to_email:
        return

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [to_email],
        fail_silently=True,
    )


@shared_task
def send_daily_overdue_reminders():
    today = timezone.now().date()
    users = User.objects.all()

    for user in users:
        overdue_tasks = Task.objects.filter(
            assignee=user,
            due_date__lt=today,
            status__in=['todo', 'in_progress', 'blocked']
        )

        if not overdue_tasks.exists() or not user.email:
            continue

        lines = [
            f"- {task.title} (Project: {task.project.name}, Due: {task.due_date})"
            for task in overdue_tasks
        ]
        tasks_list = "\n".join(lines)

        subject = "[Taskoria] Daily Overdue Task Summary"
        message = (
            f"Hi {user.username},\n\n"
            "Here are your overdue tasks:\n\n"
            f"{tasks_list}\n\n"
            "Please log in to Taskoria to update them.\n"
        )

        send_email_task.delay(subject, message, user.email)

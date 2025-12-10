from django.conf import settings
from .tasks import send_email_task


def send_task_assigned_email(task):
    if not task.assignee or not task.assignee.email:
        return

    subject = f"[Taskoria] New Task Assigned: {task.title}"
    message = (
        f"Hi {task.assignee.username},\n\n"
        f"You have been assigned a new task in project '{task.project.name}':\n"
        f"- Title: {task.title}\n"
        f"- Description: {task.description or 'No description'}\n"
        f"- Due date: {task.due_date or 'No due date'}\n\n"
        "Please log in to Taskoria to view more details.\n"
    )

    send_email_task.delay(subject, message, task.assignee.email)


def send_task_status_changed_email(task, old_status, new_status):
    if not task.assignee or not task.assignee.email:
        return

    subject = f"[Taskoria] Task Status Updated: {task.title}"
    message = (
        f"Hi {task.assignee.username},\n\n"
        f"The status of your task '{task.title}' in project '{task.project.name}' "
        f"has changed from '{old_status}' to '{new_status}'.\n\n"
        "Please log in to Taskoria to review the update.\n"
    )

    send_email_task.delay(subject, message, task.assignee.email)


def send_task_comment_email(comment):
    task = comment.task
    assignee = task.assignee

    if not assignee or not assignee.email:
        return

    subject = f"[Taskoria] New Comment on Task: {task.title}"
    message = (
        f"Hi {assignee.username},\n\n"
        f"{comment.author.username} commented on the task '{task.title}':\n\n"
        f"\"{comment.message}\"\n\n"
        "Please log in to Taskoria to reply or see more details.\n"
    )

    send_email_task.delay(subject, message, assignee.email)

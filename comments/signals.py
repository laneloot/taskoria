from django.db.models.signals import post_save
from django.dispatch import receiver
from notifications.services import create_notification


from .models import Comment
from notifications.email import send_task_comment_email


@receiver(post_save, sender=Comment)
def comment_created_handler(sender, instance, created, **kwargs):
    if created:
        send_task_comment_email(instance)

        # Notify assignee of the task
        task = instance.task
        assignee = task.assignee

        if assignee and assignee != instance.author:
            create_notification(
                user=assignee,
                title="New Comment",
                message=f"{instance.author.username} commented on '{task.title}'.",
                target_type="task",
                target_id=task.id,
            )


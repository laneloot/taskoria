from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Comment
from notifications.email import send_task_comment_email


@receiver(post_save, sender=Comment)
def comment_created_handler(sender, instance, created, **kwargs):
    if created:
        send_task_comment_email(instance)

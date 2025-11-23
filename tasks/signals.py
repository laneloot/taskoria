from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils import timezone

from .models import Task
from notifications.email import (
    send_task_assigned_email,
    send_task_status_changed_email,
)


@receiver(pre_save, sender=Task)
def store_old_task_values(sender, instance, **kwargs):
    if not instance.pk:
        # New task, no old values
        instance._old_assignee_id = None
        instance._old_status = None
    else:
        try:
            old = Task.objects.get(pk=instance.pk)
            instance._old_assignee_id = old.assignee_id
            instance._old_status = old.status
        except Task.DoesNotExist:
            instance._old_assignee_id = None
            instance._old_status = None


@receiver(post_save, sender=Task)
def handle_task_notifications(sender, instance, created, **kwargs):
    # New task created with assignee -> send assignment email
    if created and instance.assignee:
        send_task_assigned_email(instance)
        return

    # Existing task updated
    old_assignee_id = getattr(instance, "_old_assignee_id", None)
    old_status = getattr(instance, "_old_status", None)

    # Assignee changed
    if old_assignee_id != instance.assignee_id and instance.assignee:
        send_task_assigned_email(instance)

    # Status changed
    if old_status and old_status != instance.status:
        send_task_status_changed_email(instance, old_status, instance.status)

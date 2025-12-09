from .models import Notification


def create_notification(user, title, message, target_type=None, target_id=None):
    Notification.objects.create(
        user=user,
        title=title,
        message=message,
        target_type=target_type,
        target_id=target_id,
    )

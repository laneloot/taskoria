from django.db import models


class TaskQuerySet(models.QuerySet):
    def optimized(self):
        return (
            self.select_related("project", "assignee")
                .prefetch_related("attachments", "comments")
        )

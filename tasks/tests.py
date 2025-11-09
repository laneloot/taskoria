from django.test import TestCase

from tasks.models import Task


class TaskTestCase(TestCase):
    def test_task_creation(self):
        task = Task.objects.create(title="Test Task")
        self.assertEqual(task.title, "Test Task")

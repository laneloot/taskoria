from rest_framework import serializers
from .models import Task
from projects.models import Project
from users.models import User


class TaskSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all()
    )
    assignee = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        allow_null=True,
        required=False
    )
    project_name = serializers.CharField(source="project.name", read_only=True)
    assignee_username = serializers.CharField(source="assignee.username", read_only=True)

    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'project',
            'project_name',
            'assignee',
            'assignee_username',
            'priority',
            'status',
            'due_date',
            'created_at',
            'updated_at',
        ]

    def validate(self, data):
        # Ensure assignee is a member of the project
        if data.get("assignee") and data["assignee"] not in data["project"].members.all():
            raise serializers.ValidationError({
                "assignee": "This user is not a member of the project."
            })
        return data

    def create(self, validated_data):
        return Task.objects.create(**validated_data)

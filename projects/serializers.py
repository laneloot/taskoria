from rest_framework import serializers
from .models import Project
from users.models import User

class ProjectSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)
    members = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all()
    )
    tasks_count = serializers.IntegerField(source='tasks.count', read_only=True)
    completed_tasks_count = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id',
            'name',
            'description',
            'owner',
            'members',
            'start_date',
            'end_date',
            'status',
            'tasks_count',
            'completed_tasks_count',
            'progress',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ('owner',)

    def get_completed_tasks_count(self, obj):
        return obj.tasks.filter(status='done').count()

    def get_progress(self, obj):
        total = obj.tasks.count()
        if total == 0:
            return 0
        done = obj.tasks.filter(status='done').count()
        return int(done * 100 / total)

    def create(self, validated_data):
        members = validated_data.pop('members', [])
        request = self.context.get('request')
        project = Project.objects.create(
            owner=request.user,
            **validated_data
        )
        project.members.set(members)
        return project

    def update(self, instance, validated_data):
        members = validated_data.pop('members', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if members is not None:
            instance.members.set(members)

        instance.save()
        return instance

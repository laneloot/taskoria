from rest_framework import serializers
from .models import Attachment


class AttachmentSerializer(serializers.ModelSerializer):
    uploaded_by_username = serializers.CharField(source='uploaded_by.username', read_only=True)

    class Meta:
        model = Attachment
        fields = [
            'id',
            'task',
            'file',
            'uploaded_by',
            'uploaded_by_username',
            'uploaded_at',
        ]
        read_only_fields = ('uploaded_by',)

    def validate_file(self, file):
        max_size_mb = 10
        if file.size > max_size_mb * 1024 * 1024:
            raise serializers.ValidationError("File too large. Max size is 10MB.")

        allowed_extensions = ['pdf', 'png', 'jpg', 'jpeg', 'docx']
        ext = file.name.split('.')[-1].lower()

        if ext not in allowed_extensions:
            raise serializers.ValidationError("File type not allowed.")

        return file

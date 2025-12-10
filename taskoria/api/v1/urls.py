from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("users/", include("users.urls")),
    path("projects/", include("projects.urls")),
    path("tasks/", include("tasks.urls")),
    path("notifications/", include("notifications.urls")),
    path('comments/', include('comments.urls')),
    path('attachments/', include('attachments.urls')),
]

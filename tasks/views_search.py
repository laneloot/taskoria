from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer


class TaskSearchAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get("q")

        if not query:
            return Response([])
        
        print(query)

        search_vector = (
            SearchVector("title", weight="A") +
            SearchVector("description", weight="B") +
            SearchVector("assignee__username", weight="C") +
            SearchVector("project__name", weight="B")
        )

        search_query = SearchQuery(query)

        tasks = (
            Task.objects
            .annotate(rank=SearchRank(search_vector, search_query))
            .filter(rank__gte=0.001)
            .order_by("-rank")
        )

        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

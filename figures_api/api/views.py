from django.shortcuts import render

from rest_framework.generics import ListCreateAPIView, UpdateAPIView

from rest_framework.response import Response

from .models import Figure
from .serializers import FigureSerializer


class FigureListAPIView(ListCreateAPIView):
    queryset = Figure.objects.all()
    serializer_class = FigureSerializer

    def list(self, request):
        queryset = self.get_queryset()
        serializer = FigureSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def delete(self, request):
        self.queryset.delete()
        return Response({"deleted": "ok"})


class UpdateFigureAPIView(UpdateAPIView):
    queryset = Figure.objects.all()
    serializer_class = FigureSerializer
    lookup_field = 'id'


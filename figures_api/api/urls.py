from django.urls import path
from django.contrib import admin

from .views import FigureListAPIView, UpdateFigureAPIView

urlpatterns = [
    path('list', FigureListAPIView.as_view()),
    path('update/<int:id>/', UpdateFigureAPIView.as_view()),
]
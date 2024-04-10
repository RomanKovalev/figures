from django.urls import path

from django.views.decorators.csrf import csrf_exempt

from .views import FigureListAPIView, UpdateFigureAPIView

urlpatterns = [
    path('list', FigureListAPIView.as_view()),
    path('update/<int:id>/', UpdateFigureAPIView.as_view()),
]

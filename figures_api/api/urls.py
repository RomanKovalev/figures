from django.urls import path

from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from figures_api import schema

from .views import FigureListAPIView, UpdateFigureAPIView

urlpatterns = [
    path("graphql", csrf_exempt(GraphQLView.as_view(graphiql=True))),
]

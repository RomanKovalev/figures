# routing.py
from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path(r"ws/graphql", consumers.FiguresConsumer.as_asgi()),
]
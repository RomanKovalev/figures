import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.security.websocket import AllowedHostsOriginValidator
from channels.auth import AuthMiddlewareStack
import channels
import django
from .schema import MyGraphqlWsConsumer
from .routing import websocket_urlpatterns

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")

application = channels.routing.ProtocolTypeRouter({
    "websocket": channels.routing.URLRouter([
        django.urls.path("api/graphql", MyGraphqlWsConsumer.as_asgi()),
    ])
})

# application = ProtocolTypeRouter(
#     {
#         "http": get_asgi_application(),
#         "websocket": AllowedHostsOriginValidator(
#             AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
#         ),
#     }
# )

import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")

django_asgi_app = get_asgi_application()

from channels.security.websocket import AllowedHostsOriginValidator
from channels.auth import AuthMiddlewareStack
import channels
import django
from .schema import MyGraphqlWsConsumer


application = channels.routing.ProtocolTypeRouter({
    "websocket": AllowedHostsOriginValidator(
         AuthMiddlewareStack(channels.routing.URLRouter([
            django.urls.path("api/graphql", MyGraphqlWsConsumer.as_asgi()),
        ])
     ))
})

# application = ProtocolTypeRouter(
#     {
#         "http": get_asgi_application(),
#         "websocket": AllowedHostsOriginValidator(
#             AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
#         ),
#     }
# )

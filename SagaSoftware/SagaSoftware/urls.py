from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from rest_framework import routers
from tickets.views import TicketModelViewSet, createTicket


router = routers.SimpleRouter()

router.register(r'api/tickets/(?P<project_key>[\w-]+)', TicketModelViewSet, basename="tickets")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/create-ticket/<slug:project_key>/', createTicket, name="create-ticket"),
    path("accounts/", include("accounts.urls")),
    path("trackers/", include("tracker.urls")),
] + router.urls
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
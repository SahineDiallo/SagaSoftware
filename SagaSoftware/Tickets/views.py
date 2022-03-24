from django import views
from django.shortcuts import render
from rest_framework import viewsets
from .serializers import ReadTicketSerializer, WriteTicketSerializer, UserSerializer
from .models import Ticket
from tracker.models import Project
from accounts.utils import get_tickets_by_kwargs
# from rest_framework.pagination import LimitOffsetPagination


class TicketModelViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.select_related('assignee', 'accountable', 'created_by', 'milestone')
    # pagination_class = LimitOffsetPagination

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return ReadTicketSerializer
        return WriteTicketSerializer
    


    def list(self, request, **kwargs):
        print(self.request.user)
        key_from_url = url_end = (self.request.get_full_path()).split("/")[3]
        print("this is the key", self.request.get_full_path())
        project = Project.objects.get(key=key_from_url)
        print("this is the project", project)
        tickets = project.tickets.all()
        print(tickets, "this the ticket queryset")
        get_tickets_by_kwargs(**request.query_params)



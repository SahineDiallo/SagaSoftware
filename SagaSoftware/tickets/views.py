from django import views
from django.shortcuts import render
from rest_framework import viewsets
from .serializers import ReadTicketSerializer, WriteTicketSerializer, UserSerializer
from .models import Ticket



class TicketModelViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()

    def get_serializer_class(self):
        if self.action in ("list", "retreive"):
            return ReadTicketSerializer
        return WriteTicketSerializer



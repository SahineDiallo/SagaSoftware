from email.policy import HTTP
from django import views
from django.shortcuts import render
from rest_framework import viewsets, status
from .serializers import ReadTicketSerializer, WriteTicketSerializer, UserSerializer
from .models import Ticket
from tracker.models import Project
from accounts.utils import get_tickets_by_kwargs
from rest_framework.response import Response

# from rest_framework.pagination import LimitOffsetPagination


class TicketModelViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.select_related('assignee', 'accountable', 'created_by', 'milestone')
    # pagination_class = LimitOffsetPagination

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return ReadTicketSerializer
        return WriteTicketSerializer
    


    def list(self, request, **kwargs):
        user = self.request.user
        key_from_url = (self.request.get_full_path()).split("/")[3]
        project = Project.objects.get(key=key_from_url)
        try:
            tickets_dict = get_tickets_by_kwargs(user, project, **request.query_params)
            serializer = ReadTicketSerializer(tickets_dict['data'], many=True)
            result = dict()
            result['data'] = serializer.data
            result['draw'] = tickets_dict['draw']
            result['recordsTotal'] = tickets_dict['count']
            result['recordsFiltered'] = tickets_dict['count']
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(e, status=status.HTTP_404_NOT_FOUND)



from email.policy import HTTP
from django import views
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets, status
from .serializers import ReadTicketSerializer, WriteTicketSerializer, UserSerializer
from .models import Ticket
from tracker.models import Project
from accounts.utils import get_tickets_by_kwargs
from rest_framework.response import Response
from .forms import CreateTicketForm
from django.template.context_processors import csrf
from crispy_forms.utils import render_crispy_form
from django.template.loader import render_to_string

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



def createTicket(request, project_key):
    project = get_object_or_404(Project, key=project_key)
    form = CreateTicketForm(request.POST or None)
    result = {}
    if form.is_valid():
        form.save(commit=False)
        form.instance.project = project
        form.instance.created_by = request.user
        print('this is the key from the form itself',form.instance.key)
        print("this is the key from the project model", project.key_tracker)
        form.instance.key = project.key_tracker
        project.key_tracker += 1
        project.save()
        template = render_to_string("tracker/new_ticket.html", {'instance': form.instance}, request=request)
        form.save()
        result['template'] = template
        return JsonResponse(result)
    else:
        result["response"] = False
        result['not_valid'] = True
        context = csrf(request)
        formWithErrors = render_crispy_form(form, context=context)
        result["formErrors"] = formWithErrors
        result["error"] = "error"
    return JsonResponse(result)
    


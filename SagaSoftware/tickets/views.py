from email.policy import HTTP
from django import views
from django.http import JsonResponse
from django.shortcuts import render
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



def createTicket(request):
    form = CreateTicketForm(request.POST or None)
    result = {}
    if request.method == "POST":
        form = CreateTicketForm(request.POST, request=request)
        if form.is_valid():
            print("the form is valid")
            if form.has_changed():
                result["result"] = True
                result['not_valid'] = False
            return JsonResponse(result)

        else:
            print("the form is not valid")
            result["response"] = False
            result['not_valid'] = True
            context = csrf(request)
            formWithErrors = render_crispy_form(form, context=context)
            result["formErrors"] = formWithErrors
            return JsonResponse(result)
    # this view should only be called in a fetch or ajax request with post method
    return JsonResponse({'error': 'Something went wrong. PLease Try again'})



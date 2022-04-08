from email.policy import HTTP
from multiprocessing import context
from tracemalloc import get_object_traceback
from django import views
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets, status
from .serializers import ReadTicketSerializer, WriteTicketSerializer, UserSerializer
from .models import Ticket
from tracker.models import Project
from accounts.utils import (
    get_tickets_by_kwargs, get_type_class, 
    createTicketHistory, get_val_from_ordDict
)
from rest_framework.response import Response
from .forms import CreateTicketForm
from django.template.context_processors import csrf
from crispy_forms.utils import render_crispy_form
from django.template.loader import render_to_string
import json
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
    form = CreateTicketForm(request.POST or None, request=request)
    result = {}
    if form.is_valid():
        form.save(commit=False)
        form.instance.project = project
        form.instance.created_by = request.user
        form.instance.key = f'#.{project.key_tracker}'
        project.key_tracker += 1
        project.save()
        card_template = render_to_string('tracker/new_card.html', {'ticket': form.instance}, request=request)
        template = render_to_string("tracker/new_ticket.html", {'instance': form.instance}, request=request)
        form.save()
        result['card_template'] =card_template
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

def editTicket(request, project_key):
    result = dict()
    project = get_object_or_404(Project, key=project_key)
    key = '#' + request.GET.get('key')
    instance = Ticket.objects.get(key=key)
    type_class = get_type_class(instance.ticket_type)
    old_inst = ReadTicketSerializer(instance).data
    form = CreateTicketForm(request.POST or None, instance=instance, request=request)
    if request.method == "POST":
        if form.is_valid():
            if form.has_changed():
                result["form_changed"] = True
                field_name = form.changed_data[0]
                old_val = get_val_from_ordDict(field_name, old_inst)
                field_obj = Ticket._meta.get_field(field_name)
                field_value = field_obj.value_from_object(instance)
                result["fname"] = field_name
                if field_name == "ticket_type":
                    result['type_class'] = get_type_class(field_value)
                elif field_name == 'progress' and field_value == "":
                    form.instance.progress = 0
                elif field_name == "assignee" and form.instance.assignee != None:
                    result['background'] = form.instance.assignee.background
                    result['first_letters'] = form.instance.assignee.get_first_letters()
                elif field_name == "accountable" and form.instance.accountable != None:
                    result['background'] = form.instance.accountable.background
                    result['first_letters'] = form.instance.accountable.get_first_letters()
                result["fvalue"] = field_value #using the get attribute to get the old val of the inst
                form.save()
                new_inst = ReadTicketSerializer(form.instance).data
                new_val = get_val_from_ordDict(field_name, new_inst)
                tkt_hist = createTicketHistory(request, form.instance, field_name, old_val, new_val)
                hist_template = render_to_string( "tracker/ticket_history.html", { 'instance': tkt_hist,}, request=request)
                card_template = render_to_string('tracker/new_card.html', {'ticket':form.instance,}, request=request)
                result['not_valid'] = False
                new_t_cl = get_type_class(form.instance.ticket_type)
                tem_key = form.instance.key[2:]
                template = render_to_string(
                    "tracker/edited_ticket.html", {
                        'instance': form.instance,
                        'new_cl':new_t_cl, 'key': tem_key
                    }, request=request
                )
                result['template'] = template
                result['hist_template'] = hist_template
                result['card_template'] = card_template
                return JsonResponse(result)
            else:
                pass
        else:
            #print(form.errors.as_json())
            context = csrf(request)
            formWithErrors = render_crispy_form(form, context=context)
            return JsonResponse({'success': False})
    context = {
        'form': form, 'type_class': type_class, 
        'instance':instance, 'key': instance.key[2:],
    }
        
    template = render_to_string('tracker/edit_ticket.html', context, request=request)
    result['template'] = template
    result['success'] = True
    return JsonResponse(result)


def validateSubject(request):
    subject = request.GET.get('subject')
    result = subject.strip() != ''
    return JsonResponse({'success': result})
    


def validatePositiveInput(request):
    val = request.GET.get('value')
    name = request.GET.get('name')
    if val != '':
        result = int(val) >= 0 and val.isdigit()
        if name == 'progress' and int(val) > 100:
            result = False
        return JsonResponse({'success': result})
    return JsonResponse({'success': True})


def ticketFullDetailsPage(request, site_slug, project_key, ticket_key):
    ticket_key = "#." + ticket_key
    ticket = get_object_or_404(Ticket, key=ticket_key)
    type_class = get_type_class(ticket.ticket_type) 
    project = get_object_or_404(Project, key=project_key)
    form = CreateTicketForm(request.POST or None, instance=ticket, request=request)
    context = {
        'instance': ticket,"form": form, 'project': project,
        'type_class': type_class
    }
    return render(request, 'tracker/ticket_full_page.html', context)


def updateBoardStatus(request, site_slug, project_key, ticket_key):
    try:
        ticket = Ticket.objects.get(key='#.'+ticket_key)
        old_val = ticket.status
        new_status = request.GET.get('new_status')
        ticket.status = new_status
        ticket.save()
        new_val = ticket.status
        createTicketHistory(request, ticket, 'status', old_val, new_val)
        return JsonResponse({'success': True})
    except Ticket.DoesNotExist:
        return JsonResponse({'success': False})

def deleteTicket(request, site_slug, project_key, ticket_key):
    project = get_object_or_404(Project, key=project_key)
    try: 
        ticket = Ticket.objects.get(key='#.' + ticket_key)
        ticket.delete()
        return JsonResponse({'success': True})
    except Ticket.DoesNotExist:
        return JsonResponse({'success': False})




    


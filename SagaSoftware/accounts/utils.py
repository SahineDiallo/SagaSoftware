import random
import threading
import string
from .models import Invitation
from django.conf import settings
from django.core.mail import send_mail, EmailMessage
from tracker.models import Site, Project
from django.template.loader import get_template
from django.urls import reverse
from django.shortcuts import redirect, get_object_or_404
from django.contrib import messages
from tickets.models import Ticket, TicketHistory
from django.db.models import Q

colorPickerList = {
    "#2596be",
    "#32a852",
    "#067568",
    "#8c1207",
    "#020452",
    "#320845",
    "#343a40",
    "#b00443",
    "#fd5656",
    "#080817",
}
# this function will create a random 26 string


def generate_random_26_string():
    all_letters = "".join(
        string.digits + string.ascii_lowercase + string.ascii_uppercase)
    return "".join([random.choice(all_letters) for _ in range(26)])


def generate_unique_slug(instance, new_slug=None):
    klass = instance.__class__
    if new_slug != None:
        slug = new_slug
    else:
        slug = generate_random_26_string()
    if klass.objects.filter(slug=slug).exists():
        slug = generate_random_26_string()
        return generate_unique_slug(instance, new_slug=slug)
    return slug


class EmailThreading(threading.Thread):
    def __init__(self, email):
        self.email = email
        threading.Thread.__init__(self)

    def run(self):
        self.email.send(fail_silently=False)


def send_emailConfirmation_code(email_to, username, code):
    # this content need to be an html
    context_data = {'code': code, 'username': username}
    message_template = get_template(
        'accounts/email_code_confirmation.html').render(context_data)
    content = f"Hi {username},\n Thank you for signing up on our site.\n Your verification code is: {code}"
    subject = "Email Verification"
    from_email = settings.EMAIL_HOST_USER
    email = EmailMessage(
        subject, message_template, from_email, [email_to, ]
    )
    # this is what allows you to send the email as html and not a plain text(this is super important)
    email.content_subtype = 'html'
    EmailThreading(email).start()


def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


def get_first_and_last_name(string):
    first_name, last_name = "", ""
    _list = string.split(" ")
    if len(_list) > 2:
        first_name = _list[0]
        last_name = " ".join(_list[1:])
        return (first_name, last_name)
    elif len(_list) == 2:
        first_name, last_name = (_list[0], _list[1])
        return (first_name, last_name)
    else:
        first_name, last_name = (_list[0], "")
        return (first_name, last_name)


# this function is a decorator to check if the user is admin or project manager
# before letting him perform certain actions

def allowedToEnterProject(func_view):
    def wrapper_func(request, site_slug, project_key, *args, **kwargs):
        user = request.user
        site_slug = user.profile.site.slug
        project = get_object_or_404(Project, key=project_key)
        if project not in user.get_projects():
            messages.error(
                request, "Sorry! but you are not allowed to get into this project.")
            return redirect(
                reverse("dashbaord", kwargs={"site_slug": site_slug})
            )
        else:
            return func_view(request, site_slug, project_key, *args, **kwargs)
    return wrapper_func


def allowedToEditProject(func_view):
    def wrapper_func(request, site_slug, project_key, *args, **kwargs):
        user = request.user
        site_slug = user.profile.site.slug
        project = get_object_or_404(Project, key=project_key)
        if project.manager != user and not user.is_site_administrator:
            messages.error(
                request, "Sorry! but you are not allowed to make changes  in this project.")
            return redirect(
                reverse("edit_project_details", kwargs={
                        "site_slug": site_slug, 'project_key': project.key})
            )
        else:
            return func_view(request, site_slug, project_key, *args, **kwargs)
    return wrapper_func

def get_choice(_tuple, order):
    return _tuple[order][1]

ORDER_COLUMN_CHOICES = (
    ('0', 'key'),('1', 'subject'),
    ('2', 'ticket_type'), ('3', 'status'),
    ('4', 'priority'), ('5', 'assignee'),
    ('6', 'accountable'), ('7', 'progress'), ('8', 'milestone'),
    ('9', 'est'), ('10', 'start_date'),
    ('11', 'end_date'), ('12', 'created_by'),
    ('13', 'act_hours'), ('14', 'update_date'),
    ('15', 'created_date'),
)

def get_tickets_by_kwargs(user, project, **kwargs):
    queryset = Ticket.objects.filter(project=project)
    draw = int(kwargs.get('draw', None)[0])
    start = int(kwargs.get('start', None)[0])
    length = int(kwargs.get('length', None)[0])
    search_value = kwargs.get('search[value]', None)[0]
    order = kwargs.get('order[0][dir]', None)[0]
    order_column = int(kwargs.get('order[0][column]', None)[0])
    assignee = kwargs.get('assignee', None)
    status = kwargs.get('status', None)
    accountable = kwargs.get('accountable', None)
    _type = kwargs.get('type', None)
    if assignee != None:
        assignee = assignee[0]
        queryset = queryset.filter(assignee__full_name=assignee)
    if accountable != None:
        accountable = accountable[0]
        queryset = queryset.filter(accountable__full_name=accountable)
    if _type != None:
        _type = _type[0]
        if _type == "All":
            queryset = queryset
        else:        
            queryset = queryset.filter(ticket_type__icontains=_type)

    if status != None:
        status = status[0]
        if status == 'not_closed':
            queryset = queryset.exclude(status='Closed')
        else:
            queryset = queryset.filter(status=status)

    order_column = get_choice(ORDER_COLUMN_CHOICES, order_column)
    if order == 'des' or order == "desc":
        order_column = '-' + order_column

    if user.role != '1' and user.role != '2':
        queryset = queryset.filter(Q(assignee=user) | Q(accountable=user))

    if search_value:
        queryset = queryset.filter(
            Q(key__icontains=search_value)| 
            Q(subject__icontains=search_value)| 
            Q(ticket_type__icontains=search_value)| 
            Q(status__icontains=search_value)| 
            Q(priority__icontains=search_value)|
            Q(assignee__last_name__icontains=search_value)|
            Q(assignee__first_name__icontains=search_value)| 
            Q(accountable__first_name__icontains=search_value)| 
            Q(accountable__last_name__icontains=search_value)| 
            Q(milestone__name_milestone__icontains=search_value)| 
            Q(est_hours__icontains=search_value)| 
            Q(start_date__icontains=search_value)| 
            Q(end_date__icontains=search_value)| 
            Q(created_by__first_name__icontains=search_value)| 
            Q(created_by__last_name__icontains=search_value)|
            Q(act_hours__icontains=search_value)| 
            Q(updated_date__icontains=search_value)| 
            Q(created_date__icontains=search_value)
        )
    if status != 'Closed':
        data = queryset.exclude(status='Closed').order_by(order_column)[start:start+length]
    else:
        data = queryset.order_by(order_column)[start:start+length]
    count = queryset.count()
    result = {'data': data, 'count': count, 'draw': draw}
    return result


def get_type_class(type):
    if type == "TASK":
        return '_tsk'
    elif type == "REQUEST":
        return '_feat'
    elif type == "BUG":
        return "_bug"
    return '_other'


def createTicketHistory(request, ticket, f_name, old_val, new_val):
    hist_instance = TicketHistory.objects.create(
        author=request.user,
        ticket=ticket, field_name=f_name, old_value=old_val, 
        new_value=new_val, updated=ticket.updated_date
    )
    return hist_instance

def get_val_from_ordDict(f_name, ord_dict):
    if f_name == 'assignee' or f_name == 'accountable':
        return list(ord_dict[f_name].items())[0][1] #need to get the full_name
    return ord_dict[f_name]
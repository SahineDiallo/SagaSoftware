from urllib.parse import parse_qs
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from tracker.models import Milestone, Project
from django_quill.fields import QuillField


User = settings.AUTH_USER_MODEL

class TicketFiles(models.Model):
    file = models.FileField()

    def __str__(self):
        return self.id
class Ticket(models.Model):
    # we might create a model to handle the status to give the user the option to create his own
    class TicketStatus(models.TextChoices):
        OPEN = "Open", _("Open")
        TODO = "Todo", _("Todo")
        IN_PROGRESS = "In Progress", _("In Progress")
        RESOLVED = "Resolved", _("Resolved")
        CLOSED =  "Closed", _("Closed")

    class TicketPriority(models.TextChoices):
        NORMAL = "Normal", _("Normal")
        HIGH = "High", _("High")
        LOW = "Low", _("Low")
        IMMEDIATE = "Immediate", _("Immediate")


    class TicketType(models.TextChoices):
        BUG = 'BUG', _("bug")
        TASK = 'TASK', _("task")
        REQUEST = 'REQUEST', _('request')
        OTHER = 'OTHER', _("other")

    key          = models.CharField(max_length=100, default="PMS-1000", blank=True, null=True)
    project      = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tickets')
    subject      = models.CharField(max_length=255)
    ticket_type  = models.CharField(max_length=50, choices=TicketType.choices, default=TicketType.TASK)
    status       = models.CharField(max_length=50, choices=TicketStatus.choices, default=TicketStatus.OPEN)
    priority     = models.CharField(max_length=20, choices=TicketPriority.choices, default=TicketPriority.NORMAL)
    created_by   = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="created_tickets", blank=True, null=True)
    assignee     = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="tickets", blank=True, null=True)
    accountable  = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="accountable_tickets", blank=True, null=True)
    description  = models.TextField(default="some description", blank=True, null=True)
    est_hours    = models.PositiveSmallIntegerField(blank=True, null=True)
    act_hours    = models.PositiveSmallIntegerField(blank=True, null=True)
    progress     = models.PositiveSmallIntegerField(blank=True, null=True, default=0)
    milestone    = models.ForeignKey(Milestone, on_delete=models.SET_NULL, related_name="milestone", blank=True, null=True)
    start_date   = models.DateField(blank=True, null=True)
    end_date     = models.DateField(blank=True, null=True)
    files        = models.ManyToManyField(TicketFiles, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.ticket_type


    def get_ticket_status(self):
        if self.status == "Open":
            return "_open"
        elif self.status == "Todo":
            return "_todo"
        elif self.status == "In Progress":
            return "_in_prog"       
        elif self.status == "Resolved":
            return "_on_hold"
        return "_done"

    def get_ticket_priority(self):
        if self.priority == "Normal":
            return "_norm"
        elif self.priority == "High":
            return "_high"
        elif self.priority == "Low":
            return "_low"
        return "_imm"


    def get_ticket_priority_background(self):
        if self.priority == "Normal":
            return "#ff7423"
        elif self.priority == "High":
            return "#f9605b"
        elif self.priority == "Low":
            return "#82807f"
        return "#e60c05"
    
    def get_ticket_type(self):
        if self.ticket_type == "TASK":
            return '_tsk'
        elif self.ticket_type == "REQUEST":
            return '_feat'
        elif self.ticket_type == "BUG":
            return "_bug"
        return '_other'

    def partial_key(self):
        return self.key[2:]


class TicketHistory(models.Model):
    hist_type = (
         (1, 'update'),
         (2, 'new_ticket'),
    )
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name="histories")
    author = models.ForeignKey(User, on_delete=models.SET_NULL,null=True, blank=True, related_name="author")
    field_name = models.CharField(max_length=200)
    old_value = models.CharField(max_length=200)
    new_value = models.CharField(max_length=200)
    hist_type = models.CharField(max_length=20, choices=hist_type, default=1)
    updated = models.DateTimeField()
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.author} updated {self.ticket.key}'


class Comment(models.Model):
    body = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='comments')
    ticket = models.ForeignKey(Ticket, related_name='comments', on_delete=models.CASCADE)
    updated = models.DateTimeField(auto_now=True)
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author}'s comment"
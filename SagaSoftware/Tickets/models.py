from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from tracker.models import Milestone, Project



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
        CLOSED =  "Closed", _("Close")

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

    key          = models.CharField(max_length=100, default="PMS-1000")
    project      = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tickets')
    subject      = models.CharField(max_length=255)
    _type        = models.CharField(max_length=50, choices=TicketType.choices, default=TicketType.TASK)
    status       = models.CharField(max_length=50, choices=TicketStatus.choices, default=TicketStatus.TODO)
    priority     = models.CharField(max_length=20, choices=TicketPriority.choices, default=TicketPriority.NORMAL)
    created_by   = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="created_tickets", blank=True, null=True)
    assignee     = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="tickets", blank=True, null=True)
    accountable  = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="accountable_tickets", blank=True, null=True)
    description  = models.TextField(blank=True, null=True)
    est_hours    = models.IntegerField(blank=True, null=True)
    act_hours    = models.IntegerField(blank=True, null=True)
    progress     = models.IntegerField(blank=True, null=True, default=0)
    milestone    = models.ForeignKey(Milestone, on_delete=models.SET_NULL, related_name="milestone", blank=True, null=True)
    start_date   = models.DateField(blank=True, null=True)
    end_date     = models.DateField(blank=True, null=True)
    files        = models.ManyToManyField(TicketFiles, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self._type


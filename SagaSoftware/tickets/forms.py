from django import forms
from .models import Ticket
from crispy_forms.helper import FormHelper
from crispy_forms.bootstrap import AppendedText, PrependedText, FormActions
from django.forms.widgets import HiddenInput
from django_quill.forms import QuillFormField
from crispy_forms.layout import (
    Layout,
    Submit,
    Row,
    Column,
    Div,
    HTML,
    Field,
    Hidden,
    Button,
    ButtonHolder,
)

class CreateTicketForm(forms.ModelForm):
    # description = QuillFormField()
    class Meta:
        model = Ticket
        fields = (
            "_type", "subject", "description", "status",
            "priority", "assignee", "accountable", "start_date", 
            "est_hours", "act_hours", "progress", "milestone",
            "end_date"
        )

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request", None)
        super(CreateTicketForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_id = 'createTicketForm'
        instance = kwargs.get("instance", None)
        self.fields["est_hours"].label = "Estimated Hours"
        self.fields["act_hours"].label = "Actual Hours"
        self.fields["description"].label = ""
        self.fields["subject"].widget.attrs["placeholder"] = "Enter a subject for the task"
        self.fields["description"].widget.attrs["placeholder"] = "Task description"
        self.helper.layout = Layout(

            Field("_type"),
            Field("subject"),
            Field("description"),
            HTML(
                """  
                 <h4 class="mkr">People</h4>   
                """
            ),
            Field('assignee'),
            Field("accountable"),
            HTML(
                """  
                 <h4 class="mkr">Estimated and time</h4>   
                """
            ),
            Field('est_hours'),
            Field('act_hours'),
            HTML(
                """  
                 <h4 class="mkr">Details</h4>   
                """
            ),
            Field("priority"),
            Div(
                    HTML(
                    """  
                        <label>Dates</label>   
                    """
                ),
                Field('start_date'),
                    HTML(
                    """  
                    <span class="mx-2">To</span>   
                    """
                ),
                Field("end_date"), 
                css_class="d-flex align-items-center justify-content-between"
            ),
            
            Field("progress"),
            Field("milestone"),
    
        )
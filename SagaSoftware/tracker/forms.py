from django import forms
from .models import Site, Project, Milestone
from crispy_forms.helper import FormHelper
from crispy_forms.bootstrap import AppendedText, PrependedText, FormActions
from django.forms.widgets import HiddenInput
from django.conf import settings
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


class CreateSiteForm(forms.ModelForm):
    site_name = forms.CharField(
        max_length=60,
        widget=forms.TextInput(
            attrs={
                "class": "form-control",
                "placeholder": "Your site name",
            }
        ),
        label="Site name",
    )

    class Meta:
        model = Site
        fields = ("site_name",)


class CreateProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ("project_type", "name", "key",
                  "project_icon", "project_color", "Allow_Milestone", "project_theme",)

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request", None)
        super(CreateProjectForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_id = 'createProjectForm'
        self.fields["project_color"].widget = HiddenInput()
        self.fields["project_icon"].widget = HiddenInput()
        self.fields["project_theme"].widget = HiddenInput()

        self.fields["key"].help_text = "A key is unique and allows to identify a project\n. It is highly recommended to choosse a concise one."
        instance = kwargs.get("instance", None)
        if instance:
            self.helper.layout = Layout(
                HTML(
                    """
                        <div class="d-flex align-align-items-end mb-3">
                            <h4 class="mb-0">General</h4>
                            <span class="myLine"></span>
                        </div>
                    """
                ),
                Div(
                    HTML("""

                        <div class="col-md-6">
                            <input type="radio" name="project_type" id="project_management"  checked value="Project Management"> <label for="project_management">Project Management</label>
                        </div>
                        <div class="col-md-6">
                            <input type="radio" name="project_type" id="bug_tracker" value="Bug Tracker"> <label for="bug_tracker">Bug Tracker</label>
                        </div>
                        """
                         ),
                    css_class="row justify-content-between align-items-center mb-2 col-8", css_id="id_project_type", style="font-size: 15px;"
                ),
                Field("project_color"),
                Field("project_icon"),
                Field("project_theme"),
                Div(
                    Field("name"),
                    HTML(
                        """
                            <div class="col-md-4 mt-1 d-flex align-items-center">
                                <button class="ml-2 input-edit-icon"><i class="mdi mdi-36px mdi-check-circle-outline"></i></button>
                                <div class="spinner">
                                    <div class="bounce1"></div>
                                    <div class="bounce2"></div>
                                    <div class="bounce3"></div>
                                </div>
                            </div>
                         """
                    ),
                    css_class="col-md-11 d-flex align-items-center"
                ),
                Div(
                    Field("key"),
                    HTML(
                        """
                            <div class="col-md-4 mb-4 d-flex align-items-center">
                                <button class="ml-2 input-edit-icon"><i class="mdi mdi-36px mdi-check-circle-outline"></i></button>
                                <div class="spinner">
                                    <div class="bounce1"></div>
                                    <div class="bounce2"></div>
                                    <div class="bounce3"></div>
                                </div>
                            </div>
                         """
                    ),
                    css_class="col-md-11 d-flex align-items-center"
                ),
                Field("Allow_Milestone"),
                HTML(
                    """
                        <div class="d-flex align-align-items-end mb-3">
                            <h4 class="mb-0">Theme &amp Icon</h4>
                            <span class="myLine"></span>
                        </div>
                        <div class="d-flex align-items-center justify-content-between col-md-8">
                            <div class="d-flex align-items-center">
                                <span class="theme-choice selected" style="background: #006633;"></span>
                                <span class="position-relative ml-2 change-theme-btn">Change theme</span>
                            </div>
                            <div class="d-flex align-items-center">
                                
                                <span id="project-edit-current-icon" style="color: {{project_color}}"><i class="mdi mdi-48px {{project_icon}}"></i></span>
                                <span class="change-icon-btn ml-2">Change icon</span>
                                <div class="position-relative edit-project-icon-container-parent">
                                    <div class="position-absolute icon-container border d-flex align-items-center p-2"  style="z-index: 99;">
                                        <span class="text-muted" style="font-size: 12px;">Please click the close icon to save changes</span>
                                        <div class="row p-2 mb-2">
                                            <span ><i class="icon-choice mdi mdi-office mdi-18px col-sm-2"></i></span>
                                            <span ><i class="icon-choice mdi mdi-folder mdi-18px col-sm-2"></i></span>
                                            <span ><i class="icon-choice mdi mdi-chart-bubble mdi-18px  col-sm-2"></i></span>
                                            <span ><i class="icon-choice mdi mdi-chart-bar mdi-18px col-sm-2"></i></span>
                                            <span ><i class="icon-choice mdi mdi-binoculars mdi-18px col-sm-2"></i></span>
                                            <span ><i class="icon-choice mdi mdi-chart-scatterplot-hexbin mdi-18px col-sm-2"></i></span>
                                            <span ><i class="icon-choice mdi mdi-chemical-weapon mdi-18px col-sm-2"></i></span>
                                            <span ><i class="icon-choice mdi mdi-rocket mdi-18px col-sm-2"></i></span>
                                            <span ><i class="icon-choice mdi mdi-city mdi-18px col-sm-2"></i></span>
                                            <span ><i class="icon-choice mdi mdi-collage mdi-18px col-sm-2"></i></span>
                                            <span ><i class="icon-choice mdi mdi-film mdi-18px col-sm-2"></i></span>
                                            <span ><i class="icon-choice mdi mdi-jira mdi-18px col-sm-2"></i></span>
                                            <span ><i class="icon-choice mdi mdi-database-plus mdi-18px col-sm-2"></i></span>
                                            <span ><i class="icon-choice mdi mdi-domain mdi-18px col-sm-2"></i></span>
                                            <span ><i class="icon-choice mdi mdi-meteor mdi-18px col-sm-2"></i></span>
                                        </div>
                                        <div class="row p-2 col-md-5">
                                            <span class="color-choice" style="background: #000080;"></span>
                                            <span class="color-choice" style="background: #006633;"></span>
                                            <span class="color-choice" style="background: #008080;"></span>
                                            <span class="color-choice" style="background: #0F0F0F;"></span>
                                            <span class="color-choice" style="background: #e0844a;"></span>
                                            <span class="color-choice" style="background: #2F2F4F;"></span>
                                            <span class="color-choice" style="background: #330000;"></span>
                                            <span class="color-choice" style="background: #380474;"></span>
                                            <span class="color-choice" style="background: #35586C;"></span>
                                            <span class="color-choice" style="background: #458B00;"></span>
                                            <span class="color-choice" style="background: #543948;"></span>
                                            <span class="color-choice" style="background: #734A12;"></span>
                                        </div>

                                        <span class="close-icon-selection float-right position-absolute;"><i class="mdi mdi-close-box"></i></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="theme-container-parent">
                        <div class="position-absolute theme-container align-items-center pb-3">
                            <div class="card-header" style="background:#006633;" >
                                <span class="select-theme">Select a theme</span>
                                <button type="button" class="close close-change-theme-btn" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div class="row p-3 m-0 theme-choice-container">
                                <span class="theme-choice border" style="background: #ffffff;"></span>
                                <span class="theme-choice" style="background: #dd43d9;"></span>
                                <span class="theme-choice" style="background: #ccd030;"></span>
                                <span class="theme-choice" style="background: #000080;"></span>
                                <span class="theme-choice" style="background: #006633;"></span>
                                <span class="theme-choice" style="background: #008080;"></span>
                                <span class="theme-choice" style="background: #0F0F0F;"></span>
                                <span class="theme-choice" style="background: #e0844a;"></span>
                                <span class="theme-choice" style="background: #2F2F4F;"></span>
                                <span class="theme-choice" style="background: #330000;"></span>
                                <span class="theme-choice" style="background: #380474;"></span>
                                <span class="theme-choice" style="background: #35586C;"></span>
                                <span class="theme-choice" style="background: #458B00;"></span>
                                <span class="theme-choice" style="background: #543948;"></span>
                                <span class="theme-choice" style="background: #734A12;"></span>
                            </div>
                            <div class="select-theme mt-3">
                                <button type="button" class="btn btn-secondary">Cancel</button>
                                <button type="submit" class="btn btn-primary select-this-theme">Select this theme</button>
                            </div>
                        </div>
                        </div>
                    """
                ),
            )
        else:
            self.helper.layout = Layout(
                Div(
                    HTML("""

                        <div class="col-md-6">
                            <input type="radio" name="project_type" id="project_management"  checked value="Project Management"> <label for="radio1">Project Management</label>
                        </div>
                        <div class="col-md-6">
                            <input type="radio" name="project_type" id="bug_tracker" value="Bug Tracker"> <label for="radio2">Bug Tracker</label>
                        </div>
                        """
                         ),
                    css_class="row justify-content-between align-items-center mb-2", css_id="id_project_type", style="font-size: 15px;"
                ),
                Field("name"),
                Field("key"),
                Field("project_color"),
                Field("project_icon"),
                Row(
                    Column(Div(
                        HTML("""
                            <span class="position-relative change-icon-btn">change icon</span>
                            <div class="icon-container-parent">
                            <div class="position-absolute icon-container border d-flex align-items-center p-2"  style="z-index: 99;">
                                <div class="row p-2 mb-2">
                                    <span ><i class="icon-choice mdi mdi-office mdi-18px col-sm-2"></i></span>
                                    <span ><i class="icon-choice mdi mdi-folder mdi-18px col-sm-2"></i></span>
                                    <span ><i class="icon-choice mdi mdi-chart-bubble mdi-18px  col-sm-2"></i></span>
                                    <span ><i class="icon-choice mdi mdi-chart-bar mdi-18px col-sm-2"></i></span>
                                    <span ><i class="icon-choice mdi mdi-binoculars mdi-18px col-sm-2"></i></span>
                                    <span ><i class="icon-choice mdi mdi-chart-scatterplot-hexbin mdi-18px col-sm-2"></i></span>
                                    <span ><i class="icon-choice mdi mdi-chemical-weapon mdi-18px col-sm-2"></i></span>
                                    <span ><i class="icon-choice mdi mdi-rocket mdi-18px col-sm-2"></i></span>
                                    <span ><i class="icon-choice mdi mdi-city mdi-18px col-sm-2"></i></span>
                                    <span ><i class="icon-choice mdi mdi-collage mdi-18px col-sm-2"></i></span>
                                    <span ><i class="icon-choice mdi mdi-film mdi-18px col-sm-2"></i></span>
                                    <span ><i class="icon-choice mdi mdi-jira mdi-18px col-sm-2"></i></span>
                                    <span ><i class="icon-choice mdi mdi-database-plus mdi-18px col-sm-2"></i></span>
                                    <span ><i class="icon-choice mdi mdi-domain mdi-18px col-sm-2"></i></span>
                                    <span ><i class="icon-choice mdi mdi-meteor mdi-18px col-sm-2"></i></span>
                                </div>
                                <div class="row p-2 col-md-5">
                                    <span class="color-choice" style="background: #000080;"></span>
                                    <span class="color-choice" style="background: #006633;"></span>
                                    <span class="color-choice" style="background: #008080;"></span>
                                    <span class="color-choice" style="background: #0F0F0F;"></span>
                                    <span class="color-choice" style="background: #e0844a;"></span>
                                    <span class="color-choice" style="background: #2F2F4F;"></span>
                                    <span class="color-choice" style="background: #330000;"></span>
                                    <span class="color-choice" style="background: #380474;"></span>
                                    <span class="color-choice" style="background: #35586C;"></span>
                                    <span class="color-choice" style="background: #458B00;"></span>
                                    <span class="color-choice" style="background: #543948;"></span>
                                    <span class="color-choice" style="background: #734A12;"></span>
                                </div>


                                <span class="close-icon-selection float-right position-absolute;"><i class="mdi mdi-close-box"></i></span>
                            </div>
                            </div>
                            """)),
                        css_class="col-md-3"),
                    Column(Div(
                        HTML(
                            """ <span id="current-project-icon" style="color: #6493ff"><i class="mdi mdi-24px mdi-rocket"></i></span> """)),
                           css_class="col-md-9"
                           ),
                    css_class="align-items-center mb-3"
                ),

                Field("Allow_Milestone"),
                Div(
                    FormActions(
                        Submit("new project", "Create",
                               css_class="btn-block"),
                        css_class="flex-grow-1"
                    ),
                    css_class="modal-footer px-0"
                )
            )

    def clean_name(self):
        name = self.cleaned_data.get('name', None)
        site = self.request.user.profile.site
        qs = Project.objects.\
            filter(project_site=site, name__iexact=name).\
            exclude(pk=self.instance.id).exists()

        if qs:
            raise forms.ValidationError(
                "A project with name this already exists. Choose another one")
        return name


class MilestoneForm(forms.ModelForm):
    class Meta:
        model = Milestone
        fields = ("name_milestone", "start_date", "end_date", )

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request", None)
        super(MilestoneForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_id = 'milestoneForm'
        self.fields["name_milestone"].label = "Name"
        self.fields["name_milestone"].widget.attrs["placeholder"] = "Enter the name of the milestone"
        self.fields["start_date"].widget.attrs["placeholder"] = "Select a start date"
        self.fields["end_date"].widget.attrs["placeholder"] = "Select an end date"
        instance = kwargs.get("instance", None)
        submitBtn = Submit("Edit", "Edit Now", css_class="btn btn-primary btn-sm", style="margin-top:32px;") if instance else Submit(
            "Save", "Add", css_class="btn btn-primary btn-sm", style="margin-top:32px;")

        self.helper.layout = Layout(
            Row(
                Column('name_milestone', css_class="col-md-4"),
                Column('start_date', css_class="col-md-2"),
                Column('end_date', css_class="col-md-2"),
                Column(submitBtn,
                       css_class="col-md-2")
            )
        )

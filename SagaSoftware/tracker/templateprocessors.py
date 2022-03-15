from django.forms import modelformset_factory
from accounts.forms import InviteForm, inviteHelper
from accounts.models import Invitation
from .forms import CreateProjectForm
from tracker.models import Project
from django.shortcuts import get_object_or_404


def get_universalForms(request, *args, **kwargs):
    url_end = (request.get_full_path()).split("/")[-2]
    queryset = Invitation.objects.none()
    ProjectForm = CreateProjectForm(request.POST or None)
    current_project = get_object_or_404(Project, key=url_end)
    project_key = current_project.key
    dashboard_page = False
    site_slug = request.user.profile.site.slug
    if url_end == 'dashboard':
        dashboard_page = True
    helper = inviteHelper()
    formset_factory = modelformset_factory(
        Invitation, fields=('guest', 'role',), form=InviteForm, extra=3)
    formset = formset_factory(request.POST or None, queryset=queryset)
    formsDict = {"formset": formset, 'helper': helper,
                 'dashboard_page': dashboard_page,
                 'createProjectForm': ProjectForm,
                 "project_key": project_key,
                 'site_slug': site_slug,
                 }

    return formsDict

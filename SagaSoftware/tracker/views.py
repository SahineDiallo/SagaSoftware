from json import JSONEncoder
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views.generic import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
from .models import Site, Project, Milestone
from django.conf import settings
from accounts.models import Invitation
from accounts.forms import InviteForm, EditMemberRoleForm
from django.urls import reverse
from .forms import CreateSiteForm, CreateProjectForm, MilestoneForm
from django.forms import modelformset_factory
from django.contrib import messages
from accounts.utils import EmailThreading, allowedToEnterProject, allowedToEditProject
from django.template.loader import get_template
from django.core.mail import send_mail, EmailMessage
from django.template.context_processors import csrf
from crispy_forms.utils import render_crispy_form
from django.template.loader import render_to_string
from django.contrib.auth import get_user_model

User = get_user_model()


@login_required
def create_site(request):
    form = CreateSiteForm(request.POST or None)
    if form.is_valid():
        if request.user.is_site_administrator == False:
            request.user.is_site_administrator = True
            request.user.save()
            form.save(commit=False)
            form.instance.admin = request.user
            form.save()
            # assign the user's site or company
            request.user.profile.site = form.instance
            request.user.profile.save()
            return redirect(
                reverse("dashbaord", kwargs={"site_slug": form.instance.slug})
            )
        else:
            site = Site.objects.get(admin=request.user)
            messages.error(
                request,
                f"You are already the administrator of the site {site}. You cannot be the administrator of two sites!",
            )
    context = {
        "form": form,
    }
    return render(request, "tracker/create_site.html", context)


class DashbaordView(LoginRequiredMixin, View):
    def get(self, request, site_slug, *args, **kwargs):
        user = request.user
        # need to get the site and check ifthe user is in the people of course
        user_projects = user.get_projects()
        site_slug = user.profile.site.slug
        context = {'projects': user_projects, 'site_slug': site_slug}
        return render(request, 'tracker/dashboard.html', context)

    def post(self, request, site_slug, *args, **kwargs):
        formset = invitationFormset(request.POST)
        context = {}
        return render(request, 'tracker/dashboard.html', context)


def inviteMembers(request):
    queryset = Invitation.objects.none()
    formset_factory = modelformset_factory(
        Invitation, fields=('guest', 'role'), form=InviteForm, extra=3)
    formset = formset_factory(request.POST or None, queryset=queryset)
    domain = request.META['HTTP_HOST']
    context_data = {'domain': domain}
    if formset.is_valid():
        emails_list = []
        for form in formset:
            email = form.cleaned_data.get("guest", None)
            if email != None:
                emails_list.append(email)
                form.save(commit=False)
                form.instance.inviter = request.user
                form.save()
                url = f'{domain}/accounts/register/?invitation_refid={form.instance.slug}/'
                context_data['url'] = url
                if form.instance.role == '1':
                    role = 'Admin'
                elif form.instance.role == '2': 
                    role = 'Project Manager'
                else: 
                    role = 'Developer'
                context_data['role'] = role
                context_data['site'] = form.instance.inviter.profile.site.site_name
                context_data['inviter'] = form.instance.inviter.username
                context_data['project'] = "New Project"

                # let's send the emails to the differents users
                message_template = get_template(
                    'accounts/emailMessageTemplate.html').render(context_data)
                subject = f"Invitation from {form.instance.inviter.profile.site.site_name}"
                from_email = settings.EMAIL_HOST_USER
                email = EmailMessage(
                    subject, message_template, from_email, [email, ]
                )
                # this is what allows you to send the email as html and not a plain text(this is super important)
                email.content_subtype = 'html'
                EmailThreading(email).start()
        no_emails = True if all(i == emails_list[0] and i == "" for i in emails_list) else False
        return JsonResponse({"success": True, 'no_emails': no_emails,})
    form_data = {}
    context = csrf(request)
    formWithErrors = render_crispy_form(formset, context=context)
    form_data["formErrors"] = formWithErrors
    form_data["success"] = False
    return JsonResponse(form_data)


@login_required
def createProject(request, site_slug):
    form = CreateProjectForm(request.POST or None, request=request)
    site_slug = request.user.profile.site.slug
    form_data = {}
    if form.is_valid():
        form.save(commit=False)
        site = request.user.profile.site
        form.instance.project_site = site
        form.save()
        form_data = form.cleaned_data
        template = render_to_string("tracker/new_project.html", {'project': form.instance, 'site_slug': site_slug }, request=request)
        form_data["result"] = True
        form_data['template'] = template
        return JsonResponse(form_data)
    else:
        form_data["result"] = False
        context = csrf(request)
        formWithErrors = render_crispy_form(form, context=context)
        form_data["formErrors"] = formWithErrors
        form_data["error"] = "error"
    return JsonResponse(form_data)


class ProjectDetailView(LoginRequiredMixin, View):

    def get(self, request, site_slug, project_key, *args, **kwargs):
        user = request.user
        site_slug = user.profile.site.slug
        project = get_object_or_404(Project, key=project_key)
        form = CreateProjectForm(instance=project)
        milestone_form = MilestoneForm(request.POST or None)
        activeProjectBg = project.project_theme.split(' ')[0]
        navbarBg = project.project_theme.split(' ')[1]
        emails = project.members.all().values("email") #get the emials of the project members first
        all_emails = [i['email'] for i in emails]
        addable_members = User.objects.all().exclude(email__in = all_emails) #fllter the rest of the users 
        milestones = project.milestones.all()
        project_members = project.members.all()
        context = {
            'site_slug': site_slug, 'project': project,
            'form': form, 'project_icon': project.project_icon,
            'project_color': project.project_color,
            'activeProjectBg': activeProjectBg, 'proj_mem': project_members,
            'activeNav': navbarBg, 'members': addable_members,
            'mile_form': milestone_form, 'milestones': milestones}
        return render(request, 'tracker/project_details.html', context)

def add_members_to_project(request, site_slug, project_key):
    project = get_object_or_404(Project, key=project_key)
    if request.method == 'POST':
        data = request.POST.getlist('added_members')
        if data == []:
            return JsonResponse({'success':False})
        added_members = [User.objects.get(username=username) for username in data]
        project.members.add(*added_members) #add the members into the project
    return JsonResponse({'success': True})


def editUserRole(request, site_slug, project_key, user_id):
    project = get_object_or_404(Project, key=project_key)
    user = User.objects.get(pk=user_id)
    form = EditMemberRoleForm(request.POST or None, instance=user)
    if form.is_valid():
        form.save()
        return JsonResponse({"success": True})

    template = render_to_string(
            "tracker/getUserRoleForm.html", {'user': user, 'form':form}, request=request)
    return JsonResponse({'template': template})

@login_required
@allowedToEnterProject
@allowedToEditProject
def edit_project_name_and_key(request, site_slug, project_key):
    project = get_object_or_404(Project, key=project_key)
    result = {}
    if request.method == "POST":
        form = CreateProjectForm(
            request.POST, request=request, instance=project)
        if form.is_valid():
            if form.has_changed():
                result["result"] = True
                field_name = form.changed_data[0]
                print(field_name)
                field_obj = Project._meta.get_field(field_name)
                field_value = field_obj.value_from_object(project)
                result["name"] = field_name
                result["value"] = field_value
                form.save()
                result['not_valid'] = False
            return JsonResponse(result)

        else:
            result["response"] = False
            result['not_valid'] = True
            context = csrf(request)
            formWithErrors = render_crispy_form(form, context=context)
            result["formErrors"] = formWithErrors
            return JsonResponse(result)
    # this view should only be called in a fetch or ajax request with post method
    return JsonResponse({'error': 'Something went wrong. PLease Try again'})


def create_milestone(request, project_key, **kwargs):
    project = get_object_or_404(Project, key=project_key)
    form = MilestoneForm(request.POST or None)
    result = {}
    if form.is_valid():
        instance = form.save(commit=False)
        instance.project = project
        instance.created_by = request.user
        instance.save()
        template = render_to_string(
            "tracker/new_milestone.html", {'milestone': instance, })
        result['valid'] = True
        result['template'] = template
        print("the form is valid")
        return JsonResponse(result)
    result['valid'] = False
    context = csrf(request)
    formWithErrors = render_crispy_form(form, context=context)
    result["formErrors"] = formWithErrors
    return JsonResponse(result)


@login_required
def edit_milestone(request, mil_id):
    milestone = get_object_or_404(Milestone, id=mil_id)
    form = MilestoneForm(request.POST or None, instance=milestone)
    mil_id = milestone.id
    template = render_to_string(
        "tracker/edit_milestone.html", {'form': form, 'mil_id': mil_id, }, request=request)
    if request.method == "POST":
        if form.is_valid():
            print("the form is valid for editing the milestone")
            form.save()
            template = render_to_string(
                "tracker/edited_milestone.html", {'form': form, 'milestone': form.instance, }, request=request)
            return JsonResponse({'success': True, 'template': template})
        else:
            context = csrf(request)
            formWithErrors = render_crispy_form(form, context=context)
            return JsonResponse({'success': False, 'formErrors': formWithErrors, })
    print("response given")
    return JsonResponse({'template': template, 'success': True, 'mil_id': mil_id})


def project_home(request, site_slug, project_key):
    project = get_object_or_404(Project, key=project_key)
    
    context = {}
    return render(request, 'tracker/home.html', context)


def project_board(request, site_slug, project_key):
    project = get_object_or_404(Project, key=project_key)
    
    context = {}
    return render(request, 'tracker/board.html', context)


def project_backlog(request, site_slug, project_key):
    project = get_object_or_404(Project, key=project_key)
    
    context = {}
    return render(request, 'tracker/backlog.html', context)

def project_tickets(request, site_slug, project_key):
    project = get_object_or_404(Project, key=project_key)
    
    context = {}
    return render(request, 'tracker/tickets.html', context)


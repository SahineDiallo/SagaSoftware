from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib import messages
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from tracker.models import Site
from .forms import UserRegistrationForm, LoginForm, UserProfileForm
from .models import ConfirmationCode, Invitation
from .utils import (
    send_emailConfirmation_code, EmailThreading, 
    get_first_and_last_name, colorPickerList
)
from django.template.loader import get_template
import string
import random
from django.template.context_processors import csrf
from crispy_forms.utils import render_crispy_form
from django.conf.urls import handler404, handler500
from django.http import HttpResponse

User = get_user_model()


def Login(request):
    site_slug = ""
    if request.user.is_authenticated:
        pass
    form = LoginForm(request.POST or None)
    if form.is_valid():
        email = form.cleaned_data.get("email")
        password = form.cleaned_data.get("password")
        user = authenticate(email=email, password=password)
        site_slug = user.profile.site.slug if user.profile.site else ""
        # check if the user has been sent a code then he is a site creator
        if user.is_site_creator:
            # this means that this user is the admin who created the site
            if user.confirmation_code.is_confirmed:
                login(request, user)  # login the user before redirecting
                if site_slug != "":
                    if "next" in request.POST:
                        print("there is the next b")
                        return redirect(request.POST.get("next"))
                    return redirect(reverse("dashboard", kwargs={"site_slug": site_slug}))
                return redirect('site_creation')
            request.session['user_to_verify_id'] = user.id
            return redirect("email_confirmation")
        # means the user has been invited to join the company or organization, or site whatever...
        login(request, user)
        if "next" in request.POST:
            return redirect(request.POST.get("next"))
        return redirect(reverse("dashboard", kwargs={"site_slug": site_slug}))
    return render(request, "accounts/login.html", {"form": form})


def register(request):
    if request.user.is_authenticated:
        pass
    form = UserRegistrationForm(request.POST or None)
    invitation_slug = request.GET.get("invitation_refid", None)
    if form.is_valid():
        email = form.cleaned_data.get("email")
        password = form.cleaned_data.get("password1")
        username = form.cleaned_data.get("username")
        full_name = form.cleaned_data.get('full_name')
        instance = form.save(commit=False)
        instance.full_name = full_name
        first_name, last_name = get_first_and_last_name(full_name)
        instance.first_name = first_name
        instance.last_name = last_name
        #give the user a background color
        instance.background = random.choice(list(colorPickerList))
        instance.save()

        user = authenticate(email=email, password=password)
        if invitation_slug:  # check invitation and redirect dashboard
            try:
                #we need the remove the last character of the invitation slug which is a slash
                invitation = Invitation.objects.get(slug=invitation_slug[:-1])
                invitation.accepted = True
                instance.role = invitation.role
                instance.save()
                invitation.save()
                site = invitation.inviter.profile.site
                instance.profile.site = site
                instance.profile.save()
                # check if the instance role is admin and add the user to all the projects
                if instance.role == 'Admin': 
                    for p in site.projects.all():
                        p.members.add(instance)
                login(request, user)
                return redirect(
                    reverse("dashboard", kwargs={"site_slug": site.slug})
                )
            except Invitation.DoesNotExist:  # return an error to the user
                return HttpResponse(status=500)

        else:  # means we need to send an email confirmation
            user.role = 'Admin'
            code = "".join(random.choice(
                "".join(string.digits)) for _ in range(6))
            ConfirmationCode.objects.create(
                user=user, code=code)
            request.session['user_to_verify_id'] = user.id
            send_emailConfirmation_code(email, username, code)
            messages.info(
                request, "Just verify your email and you are ready to go!")
            return redirect("email_confirmation")
    return render(request, "accounts/register.html", {"form": form})


def email_confirmation(request):
    if request.method == "POST":
        user = None
        if 'user_to_verify_id' in request.session:
            user_id = request.session['user_to_verify_id']
            user = User.objects.get(pk=user_id)
            entered_code = request.POST.get("entered_Code")
            user_code = user.confirmation_code.code
            if user_code == entered_code:
                user.confirmation_code.is_confirmed = True
                user.confirmation_code.save()
                # delete the user _id from the session
                del request.session['user_to_verify_id']
                request.session.modified = True
                login(request, user)
                messages.success(
                    request, f"Successfully logged in as {user.username}")
                return redirect("site_creation")
            else:
                messages.error(
                    request, "OOPS! it's seems like the code entered is not correct...")
                return redirect('email_confirmation')
        else:
            print("You should tell the user something ")
    context = {}
    return render(request, 'accounts\email_confirmation.html', context)

def demoUsers(request):
    user_case = request.GET.get('user-case')
    if user_case == 'Developer':
        user = User.objects.get(email='demo-developer@demo.com')
    elif user_case == 'Manager':
        user = User.objects.get(email='projectmanager@demo.com')
    else:
        user = User.objects.get(email='demoAdmin@demo.com')

    login(request, user)
    return redirect(reverse("dashboard", kwargs={"site_slug": user.profile.site.slug}))


def Logout(request):
    logout(request)
    messages.success(request, "You have logged out successfully")
    return redirect('Userlogin')


def Profile(request,site_slug, user_id):
    user = get_object_or_404(User, pk=user_id)
    form = UserProfileForm(request.POST or None, instance=user)
    if request.method == "POST":
        if form.is_valid():
            form.instance.full_name = f"{form.instance.first_name} {form.instance.last_name}"
            form.save()
            return JsonResponse({'success': True}) 
        else:
            contexts = csrf(request)
            formWithErrors = render_crispy_form(form, context=contexts)
            return JsonResponse({'success': False, 'formErrors': formWithErrors, })
    
    context = {'form': form}
    return render(request, 'accounts/profile.html', context)
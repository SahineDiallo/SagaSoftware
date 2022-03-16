
from django.shortcuts import render, redirect
from django.contrib import messages
from django.urls import reverse
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from tracker.models import Site
from .forms import UserRegistrationForm, LoginForm
from .models import ConfirmationCode, Invitation
from .utils import send_emailConfirmation_code, EmailThreading, get_first_and_last_name
from django.template.loader import get_template
import string
import random

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
        # check if the user has been sent a code then he is an admin
        user_email_code = user.confirmation_code
        if user_email_code:
            # this means that this user is an admin
            if user_email_code.is_confirmed:
                login(request, user)  # login the user before redirecting
                site_slug = user.profile.site.slug if user.profile.site else ""
                if site_slug != "":
                    if "next" in request.POST:
                        return redirect(request.POST.get("next"))
                    return redirect(reverse("dashbaord", kwargs={"site_slug": site_slug}))
                return redirect('site_creation')
            request.session['user_to_verify_id'] = user.id
            return redirect("email_confirmation")
        site_slug = user.profile.site.slug if user.profile.site else ""
        # means the user has been invited to join the company or organization, or site whatever...
        if "next" in request.POST:
            return redirect(request.POST.get("next"))
        return redirect(reverse("dashbaord", kwargs={"site_slug": site_slug}))
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
        instance.save()

        user = authenticate(email=email, password=password)
        if invitation_slug != None:  # check invitationn and redirect dashboard
            try:
                invitation = Invitation.objects.get(slug=invitation_slug)
                invitation.accepted = True
                role = invitation.role
                print("this is the role from the invitation", role)
                if role == '1':
                    instance.is_site_administrator = True
                elif role == '2':
                    instance.is_project_manager = True
                else:
                    instance.is_developer = True

                instance.save()
                invitation.save()
                site = invitation.inviter.site
                instance.profile.site = site
                instance.save()
                login(request, user)
                # I neeed to loop ti see the site in which the user belongs
                return redirect(
                    reverse("dashbaord", kwargs={"site_slug": site.slug})
                )
            except:  # return an error to the user
                pass

        else:  # means we need to send an email confirmation
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



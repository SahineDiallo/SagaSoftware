from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib import messages
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from tracker.models import Site
from .forms import UserRegistrationForm, LoginForm, UserProfileForm
from .models import ConfirmationCode, Invitation
from .utils import send_emailConfirmation_code, EmailThreading, get_first_and_last_name
from django.template.loader import get_template
import string
import random
from django.template.context_processors import csrf
from crispy_forms.utils import render_crispy_form

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
        if user.confirmation_code.code:
            # this means that this user is an admin
            if user.confirmation_code.is_confirmed:
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
                #we need the remove the last character of the invitation slug which is a slash
                invitation = Invitation.objects.get(slug=invitation_slug[:-1])
                invitation.accepted = True
                instance.role = invitation.role

                instance.save()
                invitation.save()
                site = invitation.inviter.profile.site
                instance.profile.site = site
                instance.profile.save()
                login(request, user)
                print(request.user)
                # I neeed to loop ti see the site in which the user belongs
                return redirect(
                    reverse("dashbaord", kwargs={"site_slug": site.slug})
                )
            except Invitation.DoesNotExist:  # return an error to the user
                pass #we need to raise 403 with a message

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


def Logout(request):
    logout(request)
    return render(request, 'accounts/logout.html')


def Profile(request,site_slug, user_id):
    user = get_object_or_404(User, pk=user_id)
    form = UserProfileForm(request.POST or None, instance=user)
    if request.method == "POST":
        if form.is_valid():
            print("the form is valid")
            return JsonResponse({'success': True}) 
        else:
            contexts = csrf(request)
            formWithErrors = render_crispy_form(form, context=contexts)
            return JsonResponse({'success': False, 'formErrors': formWithErrors, })
    
    context = {'form': form}
    return render(request, 'accounts/profile.html', context)
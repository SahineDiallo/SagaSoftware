from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User, ConfirmationCode
from django.contrib.auth import authenticate, login
from .models import Invitation
from crispy_forms.helper import FormHelper
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


class CostumUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = UserCreationForm.Meta.fields + (
            "email",
            "full_name",

        )

    def clean_username(self):
        username = self.cleaned_data.get("username")
        if len(username) <= 7:
            raise forms.ValidationError(
                "Too Short! Username should contain more than 7 characters"
            )
        return username


class UserRegistrationForm(CostumUserCreationForm):
    username = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "class": "form-control",
                "placeholder": "Choose a username",
            }
        ),
        max_length=100,
        label="Username*",
    )
    full_name = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "class": "form-control",
                "placeholder": "Enter your full name",
            }
        ),
        max_length=100,
        label="Full Name*",
    )

    email = forms.EmailField(
        widget=forms.TextInput(
            attrs={
                "class": "form-control",
                "placeholder": "Enter your email",
            }
        ),
        max_length=100,
        label="Email*",
    )

    password1 = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control",
                "placeholder": "Choose a Password",
            }
        ),
        max_length=100,
        label="Password*",
    )

    password2 = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control",
                "placeholder": "Re-enter your Password",
            }
        ),
        max_length=100,
        label="Password Confirmation*",
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "full_name",
            "password1",
            "password2",
        ]


class LoginForm(forms.Form):
    email = forms.EmailField(
        widget=forms.TextInput(
            attrs={"class": "form-control", "placeholder": "Enter your email"}
        ),
        label="Email Address:",
    )

    password = forms.CharField(
        min_length=8,
        widget=forms.PasswordInput(
            attrs={"class": "form-control",
                   "placeholder": "Enter your password"}
        ),
        label="Password",
    )

    def clean(self, *args, **kwargs):
        email = self.cleaned_data.get("email")
        password = self.cleaned_data.get("password")
        if not email:
            raise forms.ValidationError("Please provide an email to login!")
        elif not password:
            raise forms.ValidationError("Please enter your password!")
        else:
            user = authenticate(username=email, password=password)
            if not user:
                raise forms.ValidationError(
                    "The given credentials aren't correct for a logging account! . Note that both fields may be case-sensitive. "
                )
        return super(LoginForm, self).clean(*args, **kwargs)


class InviteForm(forms.ModelForm):
    class Meta:
        model = Invitation
        fields = ('guest', 'role',)

    def __init__(self, *args, **kwargs):
        super(InviteForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_id = "InviteForm"
        self.helper.form_class = "someForm"
        self.fields["guest"].label = "Invitee Email"
        self.fields["guest"].widget.attrs["placeholder"] = "Enter invitee email"
        self.fields["role"].label = "Role"


class inviteHelper(FormHelper):
    def __init__(self, *args, **kwargs):
        super(inviteHelper, self).__init__(*args, **kwargs)
        self.form_id = "InviteForm"
        self.layout = Layout(
            Row(
                Column("guest", css_class="form-group col-lg-8 col-md-6 mb-0"),
                Column(
                    "role", css_class="form-group col-lg-4 col-md-6 mb-0"
                ),
                css_class="form-row",
            ),
        )
        # self.template = 'bootstrap4/table_inline_formset.html'

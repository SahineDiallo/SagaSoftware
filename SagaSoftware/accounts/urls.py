from django.urls import path
from .views import Login, register, email_confirmation


urlpatterns = [
    path("login/", Login, name="Userlogin"),
    path("register/", register, name="registration"),
    path("email_confirmation", email_confirmation, name="email_confirmation"),
]

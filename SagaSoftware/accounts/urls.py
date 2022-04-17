from django.urls import path
from .views import Login, register, email_confirmation, Logout, Profile, demoUsers


urlpatterns = [
    path("login/", Login, name="Userlogin"),
    path("logout/", Logout, name="Userlogout"),
    path('<slug:site_slug>/profile/<int:user_id>/', Profile, name="profile"),
    path("register/", register, name="registration"),
    path("email_confirmation", email_confirmation, name="email_confirmation"),
    path('demo', demoUsers, name="demo")
]

from random import choices
from django.db import models

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone
from tracker.models import Site, Project


class UserManager(BaseUserManager):
    # This will be called each time you create a new user
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError("Users must have an Email Address")
        if not username:
            raise ValueError("Users must provide a username")
        user = self.model(
            email=self.normalize_email(email),
            username=username,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    # And this will be called when creating a superuser
    def create_superuser(self, email, username, password=None):
        user = self.create_user(
            email=email,
            username=username,
            # You can also use user.set_password(password) as done above
            password=password,
        )
        user.is_admin = True
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user

    # def get_by_natural_key(self, username):
    #     return self.get(username=username)


class User(AbstractBaseUser):
    Admin, Project_manager, Developer = 'Admin', 'Project Manager', 'Developer'
    role_choices = (
        (Admin, 'Admin'),
        (Project_manager, 'Project Manager'),
        (Developer, 'Developer'),
    )
    email = models.EmailField(verbose_name="Email", unique=True)
    username = models.CharField(max_length=100, unique=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    full_name = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    role = models.CharField(max_length=100, choices=role_choices, default="Developer")
    background = models.CharField(max_length=30, default="#ffffff")
    last_login = models.DateTimeField(verbose_name="Last Login", auto_now=True)
    create_on = models.DateTimeField(
        verbose_name="Date Created", default=timezone.now)
    # So that we will be working primarily with email and not username
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    objects = UserManager()

    def __str__(self):
        return self.username

    def get_full_name(self):
        return (
            self.first_name + self.last_name
            if self.first_name and self.last_name
            else self.username
        )

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True

    def get_projects(self):
        if not self.role == "Admin":
            return self.projects.all()
        return self.profile.site.projects.all()

    def get_first_letters(self):
        l = self.full_name.split(" ")
        return l[0][0].upper() + l[-1][0].upper()



class Profile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="profile")
    profile_pic = models.ImageField(blank=True, null=True)
    profile_background = models.CharField(max_length=15, blank=True, null=True)
    site = models.ForeignKey(
        Site, on_delete=models.SET_NULL, null=True, related_name="members")

    def __str__(self):
        return f"{self.user.username}'s profile"


class Invitation(models.Model):
    Admin, Project_manager, Developer = 'Admin', 'Project Manager', 'Developer'
    role_choices = (
        (Admin, 'Admin'),
        (Project_manager, 'Project Manager'),
        (Developer, 'Developer'),
    )
    inviter = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="inviter")
    guest = models.EmailField(blank=True, verbose_name="Guest Email")
    date_invited = models.DateTimeField(default=timezone.now)
    role = models.CharField(max_length=30, choices=role_choices, default=Developer)
    accepted = models.BooleanField(default=False)
    slug = models.SlugField(max_length=200)

    def __str__(self):
        return f'{self.inviter.username} invited this email address {self.guest}'


class ConfirmationCode(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='confirmation_code', null=True)
    code = models.CharField(max_length=200, blank=True, null=True)
    is_confirmed = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.user.username} code'


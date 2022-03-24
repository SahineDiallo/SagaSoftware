from django.db import models


from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL


class Site(models.Model):
    site_name = models.CharField(
        max_length=100,
    )
    admin = models.ForeignKey(
        User, related_name="site", on_delete=models.SET_NULL, blank=True, null=True
    )
    slug = models.SlugField(max_length=20, blank=True, null=True)
    people = models.ManyToManyField(
        User, related_name="participants", blank=True)

    def __str__(self):
        return self.site_name


class projectManager(models.Manager):
    def get_by_natural_key(self, project_name):
        return self.get(project_name=project_name)


class Project(models.Model):
    # make the project type radion button is easier and cleaner
    typeChoices = (
        ("Project Management", "Project Management"),
        ("Bug Tracker", "Bug Tracker"),
    )
    manager = models.ForeignKey(
        User,
        related_name="managingProject",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    project_site = models.ForeignKey(
        Site, related_name="projects", on_delete=models.CASCADE, blank=True, null=True
    )
    members = models.ManyToManyField(User, related_name="projects")
    project_color = models.CharField(
        default="#6493ff", max_length=100, blank=True, null=True)
    project_icon = models.CharField(
        default="mdi-rocket", max_length=100, blank=True, null=True)
    project_theme = models.CharField(
        max_length=150, default="#ffffff #ffffff", blank=True, null=True)
    name = models.CharField(max_length=150)
    # active = models.BooleanField(default=False, blank=True, null=True)
    project_type = models.CharField(max_length=25, choices=typeChoices)
    due_date = models.DateTimeField(blank=True, null=True)
    slug = models.SlugField(max_length=30, blank=True)
    key = models.CharField(max_length=30, unique=True)
    project_description = models.TextField(blank=True, null=True)
    key_tracker = models.IntegerField(default=0, blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Milestone(models.Model):
    name_milestone = models.CharField(max_length=200)
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name='milestones')
    start_date = models.DateField()
    end_date = models.DateField()
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return self.name_milestone

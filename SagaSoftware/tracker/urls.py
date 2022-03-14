from django.urls import path
from . import views as tracker_views

urlpatterns = [
    path("create_site/", tracker_views.create_site, name="site_creation"),
    path("invite_members/", tracker_views.inviteMembers, name="invite_members"),
    path("edit-milestone/<int:mil_id>/",
         tracker_views.edit_milestone, name="edit_milestone"),
    path("<slug:project_key>/create-milestone/",
         tracker_views.create_milestone, name="create_milestone"),
    path("<slug:site_slug>/create_project/",
         tracker_views.createProject, name="create_project"),
    path("<slug:site_slug>/dashboard/",
         tracker_views.DashbaordView.as_view(), name="dashbaord"),
    path("<slug:site_slug>/projects/<slug:project_key>/settings/",
         tracker_views.ProjectDetailView.as_view(), name="project_details"),
    path("<slug:site_slug>/projects/edit/<slug:project_key>/",
         tracker_views.edit_project_name_and_key, name="edit_project_details"),
]

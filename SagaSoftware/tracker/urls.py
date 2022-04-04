from django.urls import path
from . import views as tracker_views
from tickets.views import ticketFullDetailsPage

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
     path("<slug:site_slug>/projects/settings/<slug:project_key>/",
          tracker_views.ProjectDetailView.as_view(), name="project_details"),
     path("<slug:site_slug>/projects/edit/<slug:project_key>/",
          tracker_views.edit_project_name_and_key, name="edit_project_details"),
     path("<slug:site_slug>/projects/user-role/<slug:project_key>/<int:user_id>/",
          tracker_views.editUserRole, name="edit_user_role"),
     path("<slug:site_slug>/projects/backlog/<slug:project_key>/",
          tracker_views.project_backlog, name="backlog"),
     path("<slug:site_slug>/projects/board/<slug:project_key>/",
          tracker_views.project_board, name="board"),
     path("<slug:site_slug>/projects/home/<slug:project_key>/",
          tracker_views.project_home, name="home"),
     path("<slug:site_slug>/projects/tickets/<slug:project_key>/",
          tracker_views.project_tickets, name="tickets"),
     path("<slug:site_slug>/projects/tickets/edit-ticket/<slug:ticket_key>/<slug:project_key>/",
          ticketFullDetailsPage, name="ticket-details-page"),
     path("<slug:site_slug>/projects/add-members/<slug:project_key>/",
          tracker_views.add_members_to_project, name="add_members"),
     
     path("<slug:site_slug>/projects/remove-member/<slug:project_key>/<int:user_id>/",
          tracker_views.removeMember, name="remove_member"),
     path("delete-milestone/<int:mil_id>/",
          tracker_views.delete_milestone, name="delete_milestone"),
]

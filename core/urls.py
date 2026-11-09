from django.urls import path

from . import views

urlpatterns = [
    path("", views.dashboard, name="dashboard"),
    path("tickets/", views.ticket_list, name="ticket_list"),
    path("tickets/create/", views.create_ticket, name="create_ticket"),
    path("tickets/<int:pk>/edit/", views.update_ticket, name="update_ticket"),
    path("tickets/<int:pk>/delete/", views.delete_ticket, name="delete_ticket"),
]

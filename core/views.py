from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render

from .forms import TicketForm, TicketUpdateForm
from .models import Category, Ticket


def health_check(request):
    return JsonResponse({
        "status": "healthy",
        "application": "ITSM Project"
    })


@login_required
def dashboard(request):
    context = {
        "total_tickets": Ticket.objects.count(),
        "open_tickets": Ticket.objects.filter(
            status=Ticket.Status.OPEN,
        ).count(),
        "in_progress_tickets": Ticket.objects.filter(
            status=Ticket.Status.IN_PROGRESS,
        ).count(),
        "resolved_tickets": Ticket.objects.filter(
            status__in=[Ticket.Status.RESOLVED, Ticket.Status.CLOSED],
        ).count(),
        "pending_tickets": Ticket.objects.filter(
            status=Ticket.Status.PENDING,
        ).count(),
        "total_categories": Category.objects.filter(is_active=True).count(),
        "recent_tickets": Ticket.objects.select_related(
            "category",
            "created_by",
        ).order_by("-created_at")[:8],
    }

    return render(request, "core/dashboard.html", context)


@login_required
def create_ticket(request):
    if request.method == "POST":
        form = TicketForm(request.POST)

        if form.is_valid():
            ticket = form.save(commit=False)
            ticket.created_by = request.user
            ticket.save()

            messages.success(
                request,
                f"Ticket {ticket} was created successfully."
            )

            return redirect("ticket_list")
    else:
        form = TicketForm()

    return render(request, "core/ticket_form.html", {
        "form": form,
    })


@login_required
def ticket_list(request):
    tickets = Ticket.objects.select_related(
        "category",
        "created_by",
    ).all()

    search_query = request.GET.get("q", "").strip()

    if search_query:
        tickets = tickets.filter(
            Q(title__icontains=search_query)
            | Q(description__icontains=search_query)
            | Q(category__name__icontains=search_query)
        )

    return render(request, "core/ticket_list.html", {
        "tickets": tickets,
        "search_query": search_query,
    })


@login_required
def update_ticket(request, pk):
    ticket = get_object_or_404(Ticket, pk=pk)

    if request.method == "POST":
        form = TicketUpdateForm(request.POST, instance=ticket)

        if form.is_valid():
            updated_ticket = form.save()

            messages.success(
                request,
                f"Ticket {updated_ticket} was updated successfully."
            )

            return redirect("ticket_list")
    else:
        form = TicketUpdateForm(instance=ticket)

    return render(request, "core/ticket_update.html", {
        "form": form,
        "ticket": ticket,
    })


@login_required
def delete_ticket(request, pk):
    ticket = get_object_or_404(Ticket, pk=pk)

    if request.method == "POST":
        ticket.delete()

        messages.success(
            request,
            "Ticket deleted successfully."
        )

        return redirect("ticket_list")

    return render(request, "core/ticket_confirm_delete.html", {
        "ticket": ticket,
    })

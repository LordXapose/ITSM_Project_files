from django import forms

from .models import Ticket


class TicketForm(forms.ModelForm):

    class Meta:
        model = Ticket
        fields = [
            "title",
            "description",
            "category",
            "priority",
        ]

        widgets = {
            "title": forms.TextInput(attrs={
                "class": "form-control",
                "placeholder": "Enter ticket title",
            }),
            "description": forms.Textarea(attrs={
                "class": "form-control",
                "rows": 5,
                "placeholder": "Describe the issue",
            }),
            "category": forms.Select(attrs={
                "class": "form-select",
            }),
            "priority": forms.Select(attrs={
                "class": "form-select",
            }),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["category"].queryset = (
            self.fields["category"].queryset.filter(is_active=True)
        )


class TicketUpdateForm(TicketForm):
    pass

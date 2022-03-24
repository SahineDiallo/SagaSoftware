from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Ticket

@receiver(post_save, sender=Ticket)
def set_project_key(sender, instance, **kwargs):
    project = instance.project
    instance.key = f"{project.key}-{project.key_project_int}"
    project.key_tracker_int += 1
    project.save()
    instance.save()

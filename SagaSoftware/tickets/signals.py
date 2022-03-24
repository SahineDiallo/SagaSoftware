from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Ticket

@receiver(post_save, sender=Ticket)
def set_project_key(sender, instance, **kwargs):
    project = instance.project
    new_key = f"{project.key}-{project.key_tracker}"
    print(f"{project.key}-{project.key_tracker}")
    project.key_tracker += 1
    project.save()
    print('this is the project', project.key_tracker)
    # this will prevent from calling the .save and avoid the infinit loop
    Ticket.objects.filter(id=instance.id).update(key=new_key)
    print(instance.key)

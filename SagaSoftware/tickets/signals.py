from django.db.models.signals import pre_save
from django.dispatch import receiver
from tracker.models import Project

@receiver(pre_save, sender=Project)
def set_project_key(sender, instance, created, **kwargs):
    if created:
        Klass = instance.__class__
        print(Klass.key_tracker_int)
        instance.key = f"{Klass.key}-{Klass.key_tracker_int}"
        Klass.key_tracker_int += 1
        instance.save()
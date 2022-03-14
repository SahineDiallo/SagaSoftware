from django.db.models.signals import post_save, post_delete
from .utils import generate_random_26_string, generate_unique_slug
from django.dispatch import receiver
import random
from .models import User, Invitation, Profile, ConfirmationCode
from .utils import colorPickerList
import string


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(
            user=instance, profile_background=random.choice(
                list(colorPickerList))
        )


@receiver(post_save, sender=Invitation)
def create_unique_invitation_slug(sender, instance, created, **kwargs):
    if created:
        new_slug = generate_unique_slug(instance)
        instance.slug = new_slug
        instance.save()

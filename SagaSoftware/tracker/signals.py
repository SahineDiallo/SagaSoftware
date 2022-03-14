from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Site
import random
import string
from django.utils.text import slugify
User = get_user_model()


# Generating a random string of len 5 for the slug that already exists
def random_str_generator(size=5, chars=string.ascii_lowercase + string.digits):
    return "".join(random.choice(chars) for _ in range(size))


def uniqueSlugGenerator(instance, new_slug=None):
    klass = instance.__class__
    if new_slug is not None:
        slug = new_slug
    else:
        slug = slugify(instance.site_name)
    qs = klass.objects.filter(slug=slug).exists()
    if qs:
        new_slug = f"{slug}-{random_str_generator()}"
        return uniqueSlugGenerator(instance, new_slug=new_slug)
    return slug


@receiver(post_save, sender=Site)
def siteUniqueSlug(sender, instance, created, **kwargs):
    if created:
        new_slug = uniqueSlugGenerator(instance)
        instance.slug = new_slug
        instance.save()

from django.utils import timesince
from datetime import timedelta
import datetime
from django import template
from pytz import timezone

register = template.Library()
from django.template.defaultfilters import stringfilter

@register.filter
@stringfilter
def upto(value, delimiter=None):
    return value.split(delimiter)[0]
upto.is_safe = True
from dataclasses import fields
from .models import Ticket
from accounts.models import User 
from rest_framework import serializers
from django.conf import settings

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "username", "first_name", "last_name", #later we will add the background
            "email",
        )


class ReadTicketSerializer(serializers.ModelSerializer):
    # this serializer will be used for reading data only
    assignee = UserSerializer()
    accountable = UserSerializer()
    created_by = UserSerializer()

    created_date = serializers.DateTimeField(format=settings.DATETIME_FORMAT)
    updated_date = serializers.DateTimeField(format=settings.DATETIME_FORMAT)
    start_date = serializers.DateField(format=settings.DATETIME_FORMAT)
    end_date = serializers.DateField(format=settings.DATETIME_FORMAT)
    class Meta:
        model = Ticket
        fields = (
            "key", "subject", "_type", "description",
            "status", "priority", "assignee", "accountable", "created_by", 
            "est_hours", "act_hours", "milestone", "start_date", "end_date",
            "created_date", "updated_date",
        )
        read_only_fields = fields


class WriteTicketSerializer(serializers.ModelSerializer):
    accountable = serializers.SlugRelatedField(slug_field="username", queryset=User.objects.all())
    assignee = serializers.SlugRelatedField(slug_field="username", queryset=User.objects.all())
    created_by = serializers.SlugRelatedField(slug_field="username", queryset=User.objects.all())

    class Meta:
        model = Ticket
        fields = (
            "key", "subject", "_type", "description",
            "status", "priority", "assignee", "accountable", "created_by", 
            "est_hours", "act_hours", "milestone", "start_date", "end_date",
            "created_date", "updated_date",
        )
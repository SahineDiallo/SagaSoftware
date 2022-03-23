from dataclasses import fields
from .models import Ticket
from accounts.models import User 
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "username", "first_name", "last_name", #later we will add the background
            "email",
        )


class ReadTicketSerializer(serializers.ModelSerializer):
    # this serializer will be used for reading data only
    class Meta:
        model = Ticket
        fields = (
            "id",
            "type", "subject", "description",
            "status", "priority", "assignee", "accountable", "created_by", 
            "est_hours", "act_hours", "milestone", "start_date", "end_date",
            "created_date", "updated_date",
        )
        read_only_fields = fields


class WriteTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        model = Ticket
        fields = (
            "type", "subject", "description",
            "status", "priority", "assignee", "accountable", "created_by", 
            "est_hours", "act_hours", "milestone", "start_date", "end_date",
            "created_date", "updated_date",
        )
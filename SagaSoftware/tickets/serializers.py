from dataclasses import fields
from .models import Ticket
from accounts.models import User 
from rest_framework import serializers
from django.conf import settings

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("full_name", "email", 'background', )


class ReadTicketSerializer(serializers.ModelSerializer):
    # DT_RowId = serializers.SerializerMethodField('key')

    # def get_key(self, ticket):
    #     return ReadTicketSerializer(Ticket.objects.get(pk=ticket.key)).data
    # this serializer will be used for reading data only
    assignee = UserSerializer()
    accountable = UserSerializer()
    created_by = UserSerializer()
    class Meta:
        model = Ticket
        fields = (
            "key", "subject", "_type", "description",
            "status", "priority", "assignee", "accountable", "created_by", 
            "est_hours", "act_hours", "milestone",'progress', "start_date", "end_date",
            "created_date", "updated_date"
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
            "est_hours", "act_hours", "milestone", "progress", "start_date", "end_date",
            "created_date", "updated_date",
        )
# Generated by Django 4.0.3 on 2022-03-29 16:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0011_rename__type_ticket_ticket_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ticket',
            name='description',
            field=models.TextField(default=' '),
            preserve_default=False,
        ),
    ]
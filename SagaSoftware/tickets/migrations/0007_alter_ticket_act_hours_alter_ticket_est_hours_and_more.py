# Generated by Django 4.0.3 on 2022-03-27 10:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0006_ticket_progress'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ticket',
            name='act_hours',
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='ticket',
            name='est_hours',
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='ticket',
            name='progress',
            field=models.PositiveSmallIntegerField(blank=True, default=0, null=True),
        ),
    ]

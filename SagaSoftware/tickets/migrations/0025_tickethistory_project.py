# Generated by Django 4.0.3 on 2022-04-10 16:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0003_project_key_tracker'),
        ('tickets', '0024_remove_tickethistory_updated_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='tickethistory',
            name='project',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='ticket_histories', to='tracker.project'),
        ),
    ]

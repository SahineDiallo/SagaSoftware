# Generated by Django 4.0.3 on 2022-03-24 19:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0002_remove_project_allow_milestone'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='key_tracker',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]

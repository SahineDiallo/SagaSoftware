# Generated by Django 4.0.3 on 2022-04-15 12:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_site_creator',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('Admin', 'Admin'), ('Project Manager', 'Project Manager'), ('Developer', 'Developer')], default='Developer', max_length=100),
        ),
    ]

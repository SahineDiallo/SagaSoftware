# Generated by Django 4.0.3 on 2022-03-15 18:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invitation',
            name='role',
            field=models.CharField(choices=[(1, 'Admin'), (2, 'project Manager'), (3, 'Developer')], default=3, max_length=30),
        ),
    ]

# Generated by Django 4.0.3 on 2022-03-27 15:58

from django.db import migrations, models



class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0007_alter_ticket_act_hours_alter_ticket_est_hours_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ticket',
            name='description',
            field=models.TextField(default='test'),
            preserve_default=False,
        ),
    ]

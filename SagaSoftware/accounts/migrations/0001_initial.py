# Generated by Django 4.0.3 on 2022-04-14 15:20

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('email', models.EmailField(max_length=254, unique=True, verbose_name='Email')),
                ('username', models.CharField(max_length=100, unique=True)),
                ('last_name', models.CharField(blank=True, max_length=100, null=True)),
                ('first_name', models.CharField(blank=True, max_length=100, null=True)),
                ('full_name', models.CharField(blank=True, max_length=100, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_admin', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
                ('role', models.CharField(choices=[('Admin', 'Admin'), ('Project Manager', 'project Manager'), ('Developer', 'Developer')], default='3', max_length=100)),
                ('background', models.CharField(default='#ffffff', max_length=30)),
                ('last_login', models.DateTimeField(auto_now=True, verbose_name='Last Login')),
                ('create_on', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Date Created')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ConfirmationCode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(blank=True, max_length=200, null=True)),
                ('is_confirmed', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Invitation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('guest', models.EmailField(blank=True, max_length=254, verbose_name='Guest Email')),
                ('date_invited', models.DateTimeField(default=django.utils.timezone.now)),
                ('role', models.CharField(choices=[('Admin', 'Admin'), ('Project Manager', 'Project Manager'), ('Developer', 'Developer')], default='Developer', max_length=30)),
                ('accepted', models.BooleanField(default=False)),
                ('slug', models.SlugField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profile_pic', models.ImageField(blank=True, null=True, upload_to='')),
                ('profile_background', models.CharField(blank=True, max_length=15, null=True)),
            ],
        ),
    ]

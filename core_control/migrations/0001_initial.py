# Generated by Django 5.1 on 2024-08-24 10:37

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('_id', models.CharField(db_index=True, default='', max_length=100, null=True, unique=True)),
                ('profile_url', models.ImageField(blank=True, db_index=True, null=True, upload_to='profile/images')),
                ('first_name', models.CharField(db_index=True, max_length=100)),
                ('last_name', models.CharField(db_index=True, max_length=100)),
                ('username', models.CharField(blank=True, db_index=True, max_length=300, null=True)),
                ('date_of_bith', models.DateField(db_index=True, null=True)),
                ('email', models.EmailField(db_index=True, max_length=254, unique=True)),
                ('phone_no', models.CharField(db_index=True, max_length=20)),
                ('city', models.CharField(db_index=True, max_length=100)),
                ('date_joined', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('last_login', models.DateTimeField(db_index=True, default=None, null=True)),
                ('is_blocked', models.BooleanField(db_index=True, default=False, null=True)),
                ('is_verified', models.BooleanField(db_index=True, default=False)),
                ('is_staff', models.BooleanField(db_index=True, default=False)),
                ('is_active', models.BooleanField(db_index=True, default=True)),
                ('user_type', models.CharField(choices=[('Patient', 'Patient'), ('Doctor', 'Doctor')], db_index=True, default='', max_length=20, null=True)),
                ('password', models.CharField(db_index=True, default=None, max_length=200)),
                ('groups', models.ManyToManyField(blank=True, related_name='user_groups', to='auth.group')),
                ('user_permissions', models.ManyToManyField(blank=True, related_name='user_permissions', to='auth.permission')),
                ('users_messaging_container', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]

# Generated by Django 5.0.4 on 2024-05-17 10:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_auto_20240517_1221'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='contador',
            name='num_serie',
        ),
    ]

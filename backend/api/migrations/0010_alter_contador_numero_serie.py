# Generated by Django 5.0.4 on 2024-05-17 10:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_contador_numero_serie_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contador',
            name='numero_serie',
            field=models.CharField(default='', max_length=50, null=True, unique=True),
        ),
    ]

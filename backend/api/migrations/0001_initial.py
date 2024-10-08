# Generated by Django 5.0.3 on 2024-03-28 10:15

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Contador',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ip', models.CharField(max_length=50)),
                ('puerto', models.IntegerField()),
                ('protocolo', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Cierre',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateField(default=django.utils.timezone.now)),
                ('medida_inicial', models.DecimalField(decimal_places=2, max_digits=10)),
                ('medida_final', models.DecimalField(decimal_places=2, max_digits=10)),
                ('contador', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.contador')),
            ],
        ),
        migrations.CreateModel(
            name='MedidaHoraria',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_hora', models.DateTimeField(default=django.utils.timezone.now)),
                ('medida', models.DecimalField(decimal_places=2, max_digits=10)),
                ('contador', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.contador')),
            ],
        ),
        migrations.CreateModel(
            name='MedidaInstantanea',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_hora', models.DateTimeField(default=django.utils.timezone.now)),
                ('medida', models.DecimalField(decimal_places=2, max_digits=10)),
                ('contador', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.contador')),
            ],
        ),
    ]

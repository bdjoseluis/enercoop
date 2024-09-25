from django.db import models
from django.utils import timezone

class Programacion(models.Model):
    nombre = models.CharField(max_length=100)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    periodo = models.CharField(max_length=50)
    accion = models.CharField(max_length=100)
    automatico = models.BooleanField(default=True)

    # Relación muchos a muchos con Contador
    contadores = models.ManyToManyField('Contador', blank=True, related_name='programacion_contadores')

    def __str__(self):
        return self.nombre

class Contador(models.Model):
    ip = models.CharField(max_length=50)
    num_serie = models.CharField(max_length=50, default='')
    puerto = models.IntegerField()
    protocolo = models.CharField(max_length=50)
    direccion_enlace = models.CharField(max_length=50, null=True)
    punto_medida = models.CharField(max_length=50, null=True)
    clave_lectura = models.CharField(max_length=50, null=True)

    # Relación muchos a muchos con Programacion
    programaciones = models.ManyToManyField('Programacion', blank=True, related_name='contador_programaciones')

    def __str__(self):
        return f"{self.pk} - {self.ip}"

class InformacionContador(models.Model):
    ip_contador = models.CharField(max_length=50, null=True) 
    numeros_serie = models.CharField(max_length=50, default='')
    fecha = models.DateField(default=timezone.now)
    hora = models.IntegerField(default=0)
    aexp = models.FloatField(default=0)
    aimp = models.FloatField(default=0)
    q1 = models.FloatField(default=0)
    q2 = models.FloatField(default=0)
    q3 = models.FloatField(default=0)
    q4 = models.FloatField(default=0)

    def __str__(self):
        return f"Información del contador con IP {self.ip_contador} - Fecha: {self.fecha} Hora: {self.hora}"

class ConfiguracionTiempo(models.Model):
    intervalo_horas = models.IntegerField(default=24)

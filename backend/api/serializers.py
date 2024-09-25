from rest_framework import serializers
from .models import Contador, InformacionContador, Programacion

class ContadorSerializer(serializers.ModelSerializer):
    programaciones = serializers.PrimaryKeyRelatedField(
        queryset=Programacion.objects.all(),
        many=True,
        allow_null=True,
        required=False,
    )

    class Meta:
        model = Contador
        fields = ('id', 'ip', 'num_serie', 'puerto', 'protocolo', 'direccion_enlace', 'punto_medida', 'clave_lectura', 'programaciones')  # Añadir 'num_serie'

class CreateContadorSerializer(serializers.ModelSerializer):
    # Cambia el campo programacion a una relación muchos a muchos
    programaciones = serializers.PrimaryKeyRelatedField(
        queryset=Programacion.objects.all(),
        many=True,
        allow_null=True,
        required=False,
    )

    class Meta:
        model = Contador
        fields = ('ip', 'num_serie', 'puerto', 'protocolo', 'direccion_enlace', 'punto_medida', 'clave_lectura', 'programaciones')  # Añadir 'num_serie'

        
class CreateProgramacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Programacion
        fields = ('nombre', 'fecha_inicio', 'fecha_fin', 'periodo', 'accion', 'automatico')


class ProgramacionSerializer(serializers.ModelSerializer):
    contadores = serializers.PrimaryKeyRelatedField(
        queryset=Contador.objects.all(),
        many=True,
        allow_null=True,
        required=False,
    )

    class Meta:
        model = Programacion
        fields = (
            'id', 'nombre', 'fecha_inicio', 'fecha_fin', 'periodo', 'accion', 'automatico', 'contadores'
        )


class InformacionContadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = InformacionContador
        fields = [
            'id',
            'ip_contador',
            'numeros_serie',
            'fecha',
            'hora',
            'aexp',
            'aimp',
            'q1',
            'q2',
            'q3',
            'q4',
        ]


class UpdateContadorSerializer(serializers.ModelSerializer):
    programaciones = serializers.PrimaryKeyRelatedField(
        queryset=Programacion.objects.all(),
        many=True,
        allow_null=True,
        required=False,
    )

    class Meta:
        model = Contador
        fields = ('ip', 'num_serie', 'puerto', 'protocolo', 'direccion_enlace', 'punto_medida', 'clave_lectura', 'programaciones')  # Añadir 'num_serie'

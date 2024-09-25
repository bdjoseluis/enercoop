import os
import subprocess
import threading
import time
from django.conf import settings
from rest_framework import status, viewsets, permissions
from rest_framework.response import Response
from .models import Contador, Programacion, InformacionContador
from .serializers import ContadorSerializer, CreateContadorSerializer, UpdateContadorSerializer, InformacionContadorSerializer, ProgramacionSerializer
import logging
from rest_framework.decorators import action


logger = logging.getLogger(__name__)

class ContadorViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Contador.objects.all()
    serializer_class = ContadorSerializer

    def list(self, request):
        queryset = self.queryset
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        logger.info('Iniciando creación de contador')
        serializer = CreateContadorSerializer(data=request.data)
        if serializer.is_valid():
            contador = serializer.save()

            # Verifica si hay un ID de programación y lo asigna
            programacion_id = request.data.get('programacion_id')
            if programacion_id:
                try:
                    programacion = Programacion.objects.get(pk=programacion_id)
                    contador.programacion = programacion
                    contador.save()
                    logger.info('Programación asignada al contador')
                except Programacion.DoesNotExist:
                    logger.error('Programación con ID %s no existe', programacion_id)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error('Error al crear contador: %s', serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put'])
    def desasignar_programacion(self, request, pk=None):
        try:
            contador = self.queryset.get(pk=pk)
            contador.programacion = None  # Desasignar la programación del contador
            contador.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Contador.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    def desasignar_contador(self, request, pk=None):
        try:
            contador = self.queryset.get(pk=pk)
            contador.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Contador.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)   
    def retrieve(self, request, pk=None):
        # Obtener un contador específico
        try:
            contador = self.queryset.get(pk=pk)
            serializer = ContadorSerializer(contador)
            return Response(serializer.data)
        except Contador.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        try:
            contador = self.queryset.get(pk=pk)
            serializer = UpdateContadorSerializer(contador, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Contador.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, pk=None):
        try:
            contador = self.queryset.get(pk=pk)
            contador.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Contador.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class ProgramacionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Programacion.objects.all()
    serializer_class = ProgramacionSerializer

    def create(self, request, *args, **kwargs):
        logger.info('Iniciando creación de programación')
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            programacion = serializer.save()
            logger.info('Programación creada exitosamente')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error(f'Error al crear programación: {serializer.errors}')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def _ejecutar_script(self, programacion):
            logger.info('Ejecutando script para la programación %s', programacion.nombre)
            script_path = os.path.join(os.path.dirname(__file__), 'scriptPrueba.py')
            command = ['python', script_path, programacion.nombre]
            process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            stdout, stderr = process.communicate()
            if process.returncode == 0:
                logger.info('Script ejecutado exitosamente')
            else:
                logger.error('Error al ejecutar el script: %s', stderr.decode())

            # Esperar hasta que se cumpla el próximo periodo
            time.sleep(int(programacion.periodo) * 60)



    def retrieve(self, request, pk=None):
        try:
            programacion = self.queryset.get(pk=pk)
            serializer = self.serializer_class(programacion)
            return Response(serializer.data)
        except Programacion.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    

    def update(self, request, *args, **kwargs):
        logger.info('Actualizando programación')
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info('Programación actualizada exitosamente')
            return Response(serializer.data)
        logger.error('Error al actualizar programación: %s', serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        logger.info('Eliminando programación')
        instance = self.get_object()
        instance.delete()
        logger.info('Programación eliminada exitosamente')
        return Response(status=status.HTTP_204_NO_CONTENT)


class InformacionContadorViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]  # Define los permisos según tus necesidades
    queryset = InformacionContador.objects.all()
    serializer_class = InformacionContadorSerializer

    def list(self, request):
        queryset = self.queryset
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    def retrieve_by_serial_number(self, request, serial_number=None):
        if serial_number is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            informacion_contador_queryset = InformacionContador.objects.filter(numeros_serie=serial_number)
            serializer = self.serializer_class(informacion_contador_queryset, many=True)
            return Response(serializer.data)
        except InformacionContador.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

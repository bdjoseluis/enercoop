from django.urls import path, include
from .views import *
from rest_framework.permissions import AllowAny
from rest_framework.routers import DefaultRouter
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status



router = DefaultRouter()
router.register('contador', ContadorViewset, basename='contador')
router.register('programacion', ProgramacionViewSet, basename='programacion')
router.register('informacion-contador', InformacionContadorViewSet, basename='informacion-contador')

urlpatterns = [
    *router.urls,
    path('informacion-contador/<str:serial_number>/', InformacionContadorViewSet.as_view({'get': 'retrieve_by_serial_number'}), name='informacion-contador-detail'),

]

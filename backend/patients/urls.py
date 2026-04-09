from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PacienteViewSet, EncuestaViewSet

router = DefaultRouter()
# Registrar la ruta base para pacientes, los endpoints serán /api/pacientes/
router.register(r'pacientes', PacienteViewSet, basename='paciente')
router.register(r'encuestas', EncuestaViewSet, basename='encuesta')

urlpatterns = [
    path('', include(router.urls)),
]

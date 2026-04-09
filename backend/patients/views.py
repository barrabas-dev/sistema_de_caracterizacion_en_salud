from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Paciente
from surveys.models import Encuesta
from .serializers import PacienteSerializer, EncuestaSerializer

class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
    permission_classes = [IsAuthenticated] # Requiere el JWT

    # Guarda automáticamente al usuario que hizo la petición
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

class EncuestaViewSet(viewsets.ModelViewSet):
    queryset = Encuesta.objects.all()
    serializer_class = EncuestaSerializer
    permission_classes = [IsAuthenticated]

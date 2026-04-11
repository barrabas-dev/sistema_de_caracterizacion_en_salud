from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Paciente
from surveys.models import Encuesta, PlanCuidado
from surveys.services import MotorPAE
from .serializers import PacienteSerializer, EncuestaSerializer, PlanCuidadoSerializer

class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

class EncuestaViewSet(viewsets.ModelViewSet):
    # Usamos select_related para optimizar las consultas a la DB
    queryset = Encuesta.objects.select_related('paciente', 'plan_cuidado').all()
    serializer_class = EncuestaSerializer
    permission_classes = [IsAuthenticated]

    # Endpoint personalizado: POST /api/encuestas/{id}/generar-plan/
    @action(detail=True, methods=['post'], url_path='generar-plan')
    def generar_plan(self, request, pk=None):
        try:
            plan = MotorPAE.generar_plan_desde_encuesta(encuesta_id=pk)
            return Response({
                "mensaje": "Plan de Cuidado generado exitosamente.",
                "plan_id": plan.id
            }, status=status.HTTP_200_OK)
            
        except Encuesta.DoesNotExist:
            return Response({"error": "La encuesta no existe."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

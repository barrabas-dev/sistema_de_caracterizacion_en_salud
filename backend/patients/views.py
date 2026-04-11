from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Paciente
from surveys.models import Encuesta, PlanCuidado
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

    # Endpoint personalizado: POST /api/encuestas/{id}/generar_plan/
    @action(detail=True, methods=['post'])
    def generar_plan(self, request, pk=None):
        encuesta = self.get_object()

        # 1. Regla de Integridad: Verificar que no exista ya un plan
        if hasattr(encuesta, 'plan_cuidado'):
            return Response(
                {"detail": "Esta encuesta ya tiene un plan de cuidado asociado."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Generar el Plan Placeholder con los nuevos campos de tu modelo
        plan = PlanCuidado.objects.create(
            encuesta=encuesta,
            situaciones="[Análisis pendiente basado en RIAS...]",
            prioridad="[Priorización pendiente...]",
            intervenciones="[Intervenciones pendientes...]",
            actividades="[Actividades pendientes...]"
        )

        return Response(
            {
                "detail": "Plan de cuidado generado exitosamente (Modo Placeholder).", 
                "plan_id": plan.id
            },
            status=status.HTTP_201_CREATED
        )

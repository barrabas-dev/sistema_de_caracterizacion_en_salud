from rest_framework import serializers
from .models import Paciente
from surveys.models import Encuesta, PlanCuidado

class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = '__all__'
        read_only_fields = ('creado_por', 'fecha_registro')

class PlanCuidadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanCuidado
        fields = '__all__'

class EncuestaSerializer(serializers.ModelSerializer):
    # Datos del paciente extendidos para el documento
    paciente_nombre = serializers.CharField(source='paciente.nombre', read_only=True)
    paciente_documento = serializers.CharField(source='paciente.numero_id', read_only=True)
    paciente_edad = serializers.IntegerField(source='paciente.edad', read_only=True)
    paciente_sexo = serializers.CharField(source='paciente.sexo', read_only=True)
    paciente_eps = serializers.CharField(source='paciente.eps', read_only=True)
    
    tiene_plan = serializers.SerializerMethodField()
    
    # ¡NUEVO!: Anidamos el plan de cuidado completo dentro de la encuesta
    plan_detalle = PlanCuidadoSerializer(source='plan_cuidado', read_only=True)

    class Meta:
        model = Encuesta
        fields = '__all__'

    def get_tiene_plan(self, obj):
        return hasattr(obj, 'plan_cuidado')
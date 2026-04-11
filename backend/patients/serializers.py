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
    # Traemos datos del paciente para no tener que hacer doble consulta en React
    paciente_nombre = serializers.CharField(source='paciente.nombre', read_only=True)
    paciente_documento = serializers.CharField(source='paciente.numero_id', read_only=True)
    
    # Campo booleano calculado: ¿Esta encuesta ya tiene un plan generado?
    tiene_plan = serializers.SerializerMethodField()

    class Meta:
        model = Encuesta
        fields = '__all__'

    def get_tiene_plan(self, obj):
        # Retorna True si existe la relación OneToOne inversa
        return hasattr(obj, 'plan_cuidado')
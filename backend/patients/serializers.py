from rest_framework import serializers
from .models import Paciente
from surveys.models import Encuesta

class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = '__all__'
        read_only_fields = ('creado_por', 'fecha_registro') # Evita que DRF pida este dato al Frontend

class EncuestaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Encuesta
        fields = '__all__'
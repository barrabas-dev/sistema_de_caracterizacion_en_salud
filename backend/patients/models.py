from django.db import models
from django.conf import settings

class Paciente(models.Model):
    # Opciones para selectores en el Frontend
    TIPO_ID_CHOICES = [
        ('CC', 'Cédula de Ciudadanía'),
        ('TI', 'Tarjeta de Identidad'),
        ('RC', 'Registro Civil'),
        ('CE', 'Cédula de Extranjería'),
    ]
    
    SEXO_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
    ]

    # Campos según tu esquema
    nombre = models.CharField(max_length=200)
    tipo_id = models.CharField(max_length=2, choices=TIPO_ID_CHOICES, default='CC')
    numero_id = models.CharField(max_length=20, unique=True) # UNIQUE evita duplicados
    sexo = models.CharField(max_length=1, choices=SEXO_CHOICES)
    edad = models.PositiveIntegerField()
    
    # AUDITORÍA: Se incluye blank=True, null=True por si la EPS es desconocida o no obligatoria al inicio.
    eps = models.CharField(max_length=100, blank=True, null=True)
    
    # Campos opcionales (pueden quedar vacíos)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)

    # Relación y Auditoría
    # related_name='pacientes_registrados' es semánticamente correcto (ej. usuario.pacientes_registrados.all())
    creado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='pacientes_registrados')
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} - {self.numero_id}"

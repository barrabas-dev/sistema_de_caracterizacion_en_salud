from django.db import models
from django.utils import timezone  # [AUDITORÍA] Importación necesaria para el default de la fecha

# Create your models here.

class Encuesta(models.Model):
    """
    Modelo Encuesta:
    Representa el formulario o recolección de datos clínicos de un paciente específico.
    """
    
    # -------------------------------------------------------------------------
    # RELACIÓN PRINCIPAL
    # -------------------------------------------------------------------------
    # [AUDITORÍA - COHERENCIA RELACIONAL]: 
    # Se cambió OneToOneField a ForeignKey. Un paciente normalmente puede tener 
    # MÚLTIPLES encuestas a lo largo del tiempo (ej. controles anuales).
    # [AUDITORÍA - REVERSE RELATIONS]: 
    # Se modificó related_name a 'encuestas' (plural) -> paciente.encuestas.all()
    paciente = models.ForeignKey(
        'patients.Paciente', 
        on_delete=models.CASCADE, 
        related_name='encuestas',
        verbose_name="Paciente Encuestado"
    )
    
    # [SOLUCIÓN DE MIGRACIÓN]:
    # Se reemplaza auto_now_add=True por default=timezone.now
    # Explicación: Para filas antiguas, DB necesita un valor inicial. auto_now_add solo 
    # sirve para "nuevos" registros.
    fecha_recoleccion = models.DateField(default=timezone.now, verbose_name="Fecha de Encuesta")

    # -------------------------------------------------------------------------
    # DATOS FÍSICOS GENERALES
    # -------------------------------------------------------------------------
    # [AUDITORÍA - CAMPOS OPCIONALES]: 
    # Se agrega blank=True, null=True. Si no se logran tomar datos físicos, 
    # el formulario no debe fallar al guardar.
    peso_kg = models.DecimalField(max_digits=5, decimal_places=2, verbose_name="Peso en kg", blank=True, null=True)
    talla_cm = models.PositiveIntegerField(verbose_name="Talla en cm", blank=True, null=True)
    tension_arterial = models.CharField(max_length=15, verbose_name="Tensión Arterial", blank=True, null=True)

    # -------------------------------------------------------------------------
    # MÓDULO DE VALORACIÓN Y TAMIZAJES (RIAS)
    # -------------------------------------------------------------------------
    citologia_adn_vph = models.BooleanField(default=False, verbose_name="¿Realización de Citología - ADN VPH?")
    mamografia_ecm = models.BooleanField(default=False, verbose_name="¿Realización Mamografía - ECM?", help_text="Incluye mamografía y autoexamen de mama.")
    tamizaje_ca_colon = models.BooleanField(default=False, verbose_name="¿Realización Tamizaje CA de Colon?")
    tamizaje_ca_prostata = models.BooleanField(default=False, verbose_name="¿Realización Tamizaje CA de Próstata?")
    desparasitacion_antihelmintica = models.BooleanField(default=False, verbose_name="¿Desparasitación Antihelmíntica al día?")
    planificacion_familiar = models.BooleanField(default=False, verbose_name="¿Utiliza algún método de Planificación Familiar?")
    tamizaje_anemia = models.BooleanField(default=False, verbose_name="¿Tamizaje para Anemia?")
    tamizaje_riesgo_cardiovascular = models.BooleanField(default=False, verbose_name="¿Tamizaje de Riesgo Cardiovascular?", help_text="Incluye laboratorios y exámenes pertinentes.")
    vacunacion = models.BooleanField(default=False, verbose_name="¿Esquema de Vacunación completo (RIAS)?")
    valoracion_odontologia = models.BooleanField(default=False, verbose_name="¿Valoración Odontología al día?")
    consulta_control_rias = models.BooleanField(default=False, verbose_name="¿Consulta de Control (RIAS)?", help_text="Valoración según curso de vida, Resolución 3280.")
    laboratorios_rias = models.BooleanField(default=False, verbose_name="¿Toma de Laboratorios según RIA?")
    tamizaje_its = models.BooleanField(default=False, verbose_name="¿Tamizaje para ITS?")

    class Meta:
        verbose_name = "Encuesta de Salud"
        verbose_name_plural = "Encuestas de Salud"
        ordering = ['-fecha_recoleccion']  # [AUDITORÍA]: Orden predeterminado (más recientes primero)

    def __str__(self):
        # [AUDITORÍA]: Defensivo. Protege de errores si la encuesta no tiene un paciente asociado (poco probable pero buena práctica)
        nombre = self.paciente.nombre if self.paciente else "Sin paciente"
        return f"Encuesta de {nombre} - {self.fecha_recoleccion}"

class PlanCuidado(models.Model):
    """
    Modelo PlanCuidado:
    Almacena los resultados consolidados tras evaluar la 'Encuesta' del paciente frente 
    a las reglas médicas.
    """
    
    # -------------------------------------------------------------------------
    # RELACIÓN 1 A 1
    # -------------------------------------------------------------------------
    # [AUDITORÍA - REVERSE RELATIONS]: 
    # Aquí OneToOneField SÍ aplica (1 Encuesta arroja 1 único PlanCuidado).
    # Se renombra related_name='plan_resultado' a 'plan_cuidado' (más semántico). 
    # Uso: mi_encuesta.plan_cuidado
    encuesta = models.OneToOneField(
        'Encuesta', 
        on_delete=models.CASCADE, 
        related_name='plan_cuidado'
    )
    
    # -------------------------------------------------------------------------
    # TEXT FIELDS PARA CONCATENACIÓN (RESULTADOS DE REGLAS MÉDICAS)
    # -------------------------------------------------------------------------
    # [AUDITORÍA - TIPOS Y OPCIONALIDAD]: 
    # El uso de TextField es perfecto aquí.
    # Se añade blank=True, null=True porque el plan puede generarse vacío 
    # o de manera progresiva.
    situaciones = models.TextField(verbose_name="Situaciones Encontradas", blank=True, null=True)
    prioridad = models.TextField(verbose_name="Prioridad para la Salud", blank=True, null=True)
    intervenciones = models.TextField(verbose_name="Acciones e Intervenciones", blank=True, null=True)
    actividades = models.TextField(verbose_name="Actividades para el Logro", blank=True, null=True)
    
    fecha_generacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Plan de Cuidado"
        verbose_name_plural = "Planes de Cuidado"

    def __str__(self):
        # [AUDITORÍA]: Defensivo para evitar excepciones en el admin panel si no hay datos.
        nombre = self.encuesta.paciente.nombre if self.encuesta and self.encuesta.paciente else "Sin Encuesta"
        return f"Plan para {nombre}"

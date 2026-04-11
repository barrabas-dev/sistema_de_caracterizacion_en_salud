# services.py
from django.db import transaction
from .models import Encuesta, PlanCuidado

class MotorPAE:
    @staticmethod
    def obtener_matriz_reglas():
        """
        Matriz de conocimiento clínico basada en RIAS y Resolución 3280.
        Mapea los campos de la base de datos con las acciones de enfermería.
        """
        return [
            {
                "campo_encuesta": "citologia_adn_vph",
                "sexo_aplica": "F", 
                "situacion": "- Ausencia de tamizaje cervical mediante citología.",
                "prioridad": "- Prioridad alta en la detección temprana de cáncer cervical para reducir mortalidad y morbilidad mediante tamizajes oportunos. Fundamental para prevención primaria y seguimiento adecuado.",
                "intervencion": "- Acompañamiento y educación para la prevención, detección oportuna y manejo adecuado del cáncer de cuello uterino.",
                "actividades": "- Educación a la población sobre la importancia del tamizaje cervical.\n- Organización y coordinación de jornadas de citología.\n- Seguimiento de resultados y control periódico."
            },
            {
                "campo_encuesta": "mamografia_ecm",
                "sexo_aplica": "F",
                "situacion": "- Ausencia de mamografía ni autoexamen de mama.",
                "prioridad": "- Prioridad en la detección temprana del cáncer de mama, que es una de las principales causas de muerte femenina. Promueve la prevención y atención integral con educación y seguimiento.",
                "intervencion": "- Orientación y apoyo para la detección temprana, el autocuidado y el afrontamiento del cáncer de mama.",
                "actividades": "- Promoción del autoexamen mamario y su correcta realización.\n- Educación en factores de riesgo y signos de alerta.\n- Seguimiento y acompañamiento en casos sospechosos."
            },
            {
                "campo_encuesta": "tamizaje_ca_colon",
                "sexo_aplica": "AMBOS",
                "situacion": "- Ausencia de tamizaje para cáncer de colon.",
                "prioridad": "- Prioriza la detección precoz del cáncer colorrectal, mejorando el pronóstico y reduciendo complicaciones severas mediante controles oportunos.",
                "intervencion": "- Educación y seguimiento para la prevención, detección temprana y manejo integral del cáncer de colon.",
                "actividades": "- Información y sensibilización sobre tamizaje para cáncer de colon.\n- Coordinación de pruebas como sangre oculta en heces.\n- Remisión a consulta médica para evaluación.\n- Seguimiento de resultados y orientación."
            },
            {
                "campo_encuesta": "tamizaje_ca_prostata",
                "sexo_aplica": "M",
                "situacion": "- Ausencia de tamizaje para cáncer de próstata.",
                "prioridad": "- Importante para la detección temprana de cáncer prostático, permitiendo intervenciones oportunas y mejor calidad de vida en la población masculina adulta.",
                "intervencion": "- Información y acompañamiento para la detección oportuna, control y afrontamiento del cáncer de próstata.",
                "actividades": "- Educación a hombres sobre importancia del tamizaje.\n- Organización de tamizajes (antígeno prostático).\n- Remisión a consulta urológica según resultados.\n- Acompañamiento en seguimiento."
            },
            {
                "campo_encuesta": "desparasitacion_antihelmintica",
                "sexo_aplica": "AMBOS",
                "situacion": "- Ausencia de desparasitación antihelmíntica.",
                "prioridad": "- Prioridad para prevenir infecciones parasitarias que afectan la nutrición y desarrollo, especialmente en poblaciones vulnerables, mejorando la salud integral.",
                "intervencion": "- Prevenir y controlar las parasitosis intestinales en la población, especialmente en niños y grupos vulnerables.",
                "actividades": "- Educación en medidas de higiene y prevención.\n- Coordinación de campañas de desparasitación.\n- Administración supervisada del tratamiento antiparasitario.\n- Seguimiento de cumplimiento y control."
            },
            {
                "campo_encuesta": "planificacion_familiar",
                "sexo_aplica": "AMBOS",
                "situacion": "- No utiliza ningún método de planificación familiar, desconocimiento de algunos métodos.",
                "prioridad": "- Prioridad en la educación y provisión de métodos de planificación para prevenir embarazos no deseados, mejorar salud reproductiva y calidad de vida.",
                "intervencion": "- Información clara y acompañamiento para elegir un método anticonceptivo acorde a sus necesidades y proyecto de vida.",
                "actividades": "- Asesoría personalizada sobre métodos de planificación familiar.\n- Educación en sexualidad y prevención.\n- Remisión a consulta especializada si es necesario.\n- Seguimiento del uso y adherencia."
            },
            {
                "campo_encuesta": "tamizaje_anemia",
                "sexo_aplica": "AMBOS",
                "situacion": "- Ausencia de tamizaje para anemia.",
                "prioridad": "- Fundamental para detectar anemia precozmente, especialmente en grupos vulnerables, prevenir complicaciones y garantizar atención nutricional y médica integral.",
                "intervencion": "- Prevenir y controlar la anemia por deficiencia de hierro en la población objeto según RIA.",
                "actividades": "- Promoción de hábitos alimenticios saludables ricos en hierro.\n- Coordinación de pruebas hemoglobínicas o hematológicas.\n- Remisión para tratamiento y control.\n- Educación sobre signos de anemia."
            },
            {
                "campo_encuesta": "tamizaje_riesgo_cardiovascular",
                "sexo_aplica": "AMBOS",
                "situacion": "- Ausencia de laboratorios y exámenes para determinar el riesgo cardiovascular.",
                "prioridad": "- Prioriza la identificación temprana de factores de riesgo cardiovascular para implementar estrategias preventivas y evitar eventos cardiovasculares graves.",
                "intervencion": "- Orientación y control periódico para prevenir, identificar y reducir los factores de riesgo cardiovascular.",
                "actividades": "- Educación sobre hábitos saludables (dieta, ejercicio, control de peso).\n- Coordinación de medición de presión arterial, glucosa, lípidos.\n- Remisión para evaluación médica y seguimiento.\n- Acompañamiento en control de factores modificables."
            },
            {
                "campo_encuesta": "vacunacion",
                "sexo_aplica": "AMBOS",
                "situacion": "- Esquema de vacunación incompleto según RIAS.",
                "prioridad": "- Prioridad alta para la prevención de enfermedades inmunoprevenibles, proteger la salud pública y evitar brotes mediante cobertura adecuada de vacunación.",
                "intervencion": "- Completar o actualizar su esquema de vacunación para prevenir enfermedades y proteger su salud y la de la comunidad.",
                "actividades": "- Verificación y actualización del esquema de vacunación.\n- Organización de campañas y jornadas de vacunación.\n- Educación sobre beneficios y mitos de vacunas.\n- Registro y seguimiento de vacunación."
            },
            {
                "campo_encuesta": "valoracion_odontologia",
                "sexo_aplica": "AMBOS",
                "situacion": "- Ausencia de valoración odontológica periódica según esquema RIAS.",
                "prioridad": "- Prioridad en la prevención y detección de enfermedades bucales que afectan la salud general, facilitando atención integral y promoción de hábitos saludables.",
                "intervencion": "- Orientación y seguimiento para mantener una salud oral óptima, mediante hábitos de higiene adecuados y prevención de enfermedades bucales.",
                "actividades": "- Promoción de higiene oral y hábitos saludables.\n- Coordinación de valoraciones odontológicas periódicas.\n- Remisión para atención odontológica según necesidad.\n- Educación en prevención de caries y enfermedades periodontales."
            },
            {
                "campo_encuesta": "consulta_control_rias",
                "sexo_aplica": "AMBOS",
                "situacion": "- Ausencia de consulta para valoración según curso de vida, resolución 3280.",
                "prioridad": "- Prioriza seguimiento integral y continuo de la salud acorde a etapas de la vida para prevenir y detectar oportunamente condiciones que afectan calidad de vida.",
                "intervencion": "- Consultas de control según resolución 3280 RIAS, acercando los servicios de salud a la comunidad.",
                "actividades": "- Organización y recordatorio de consultas periódicas.\n- Evaluación de riesgos y promoción de salud según edad.\n- Educación personalizada y acompañamiento familiar.\n- Remisión oportuna a especialistas."
            },
            {
                "campo_encuesta": "laboratorios_rias",
                "sexo_aplica": "AMBOS",
                "situacion": "- Ausencia de laboratorios según curso de vida, resolución 3280.",
                "prioridad": "- Importante para identificar alteraciones metabólicas o enfermedades crónicas en etapas específicas, garantizando atención integral y oportuna.",
                "intervencion": "- Jornadas comunitarias para la toma de muestras de laboratorio.",
                "actividades": "- Coordinación de toma de muestras y pruebas de laboratorio.\n- Educación sobre importancia de exámenes preventivos.\n- Seguimiento de resultados y remisión médica.\n- Apoyo en adherencia a tratamientos si se requiere."
            },
            {
                "campo_encuesta": "tamizaje_its",
                "sexo_aplica": "AMBOS",
                "situacion": "- Ausencia de laboratorios para ITS, resolución 3280.",
                "prioridad": "- Prioridad en la detección y tratamiento precoz de infecciones de transmisión sexual para reducir transmisión, complicaciones y promover salud sexual responsable.",
                "intervencion": "- Jornadas comunitarias para la toma de muestras de laboratorio.",
                "actividades": "- Educación en prevención y transmisión de ITS.\n- Remisión a IPS para toma de muestras.\n- Acompañamiento en resultados y remisión a tratamiento.\n- Promoción de prácticas sexuales seguras."
            }
        ]

    @staticmethod
    def generar_plan_desde_encuesta(encuesta_id):
        # 1. Obtener la encuesta con los datos del paciente (select_related optimiza la consulta a la BD)
        encuesta = Encuesta.objects.select_related('paciente').get(id=encuesta_id)
        sexo_paciente = encuesta.paciente.sexo
        
        # 2. Inicializar los contenedores de texto
        textos = {
            "situaciones": [],
            "prioridad": [],
            "intervenciones": [],
            "actividades": []
        }

        # 3. Iterar sobre las reglas de la matriz
        reglas = MotorPAE.obtener_matriz_reglas()
        
        for regla in reglas:
            # Verificar si la regla aplica para el sexo del paciente
            if regla["sexo_aplica"] != "AMBOS" and regla["sexo_aplica"] != sexo_paciente:
                continue # Saltamos esta regla si no coincide el sexo

            # Usamos getattr para leer el valor del booleano en el modelo dinámicamente
            valor_campo = getattr(encuesta, regla["campo_encuesta"])

            # La lógica dicta que si es False (Ausencia), se dispara la alerta
            if not valor_campo:
                textos["situaciones"].append(regla["situacion"])
                textos["prioridad"].append(regla["prioridad"])
                textos["intervenciones"].append(regla["intervencion"])
                textos["actividades"].append(regla["actividades"])

        # 4. Concatenar todo con saltos de línea dobles para que se vea bien en el Frontend
        situaciones_final = "\n\n".join(textos["situaciones"]) if textos["situaciones"] else "No se reportan alteraciones según la valoración actual."
        prioridad_final = "\n\n".join(textos["prioridad"]) if textos["prioridad"] else "Mantenimiento de la salud."
        intervenciones_final = "\n\n".join(textos["intervenciones"]) if textos["intervenciones"] else "Continuar con hábitos de vida saludables."
        actividades_final = "\n\n".join(textos["actividades"]) if textos["actividades"] else "Control de rutina según esquema."

        # 5. Guardar en la Base de Datos usando una transacción segura
        with transaction.atomic():
            plan, created = PlanCuidado.objects.update_or_create(
                encuesta=encuesta,
                defaults={
                    'situaciones': situaciones_final,
                    'prioridad': prioridad_final,
                    'intervenciones': intervenciones_final,
                    'actividades': actividades_final
                }
            )
            
        return plan
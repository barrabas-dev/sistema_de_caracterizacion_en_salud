## 🏗️ Arquitectura y Stack Tecnológico
El proyecto está construido bajo una arquitectura cliente-servidor robusta y completamente desacoplada.

### Backend (API RESTful)
* **Framework:** Python con Django y Django Rest Framework (DRF).
* **Base de Datos:** MySQL (conector por defecto de Django `bd_sistema_de_carectizacion_en_salud`) bajo un enfoque relacional.
* **Seguridad:** JSON Web Tokens (JWT) mediante `rest_framework_simplejwt`.

### Frontend (SPA)
* **Core:** React (v19.2) empaquetado con Vite.
* **Estilos y Diseño:** Tailwind CSS (v4) para un diseño utilitario y responsivo.
* **Enrutamiento:** React Router DOM con protección de rutas privadas.
* **Gestión de Estado e Interfaz:** Zustand para el estado global, Lucide React para iconografía consistente, y Axios para peticiones HTTP asíncronas con interceptores.

---

## 💾 Modelos de Datos y Persistencia
La estructura relacional se fundamenta en tres pilares diseñados para escalabilidad y auditoría clínica:

* **Usuarios (`UsuarioCustom`):** Extiende el modelo abstracto de Django. Implementa roles (Administrador / Enfermero) y añade el campo `registro_profesional`, esencial para la trazabilidad de acciones clínicas.
* **Pacientes (`Paciente`):** Entidad troncal. Almacena datos demográficos, de identificación y EPS. Incluye trazabilidad de autoría (`creado_por`) vinculada al usuario operativo para efectos de auditoría.
* **Sistema PAE Avanzado (Encuestas y Planes):**
  * **`Encuesta`:** Vinculada al paciente vía *Foreign Key* (permite múltiples evaluaciones anuales). Registra métricas físicas (peso, talla) y valoraciones booleanas del marco RIAS (Rutas Integrales de Atención en Salud) como citologías, tamizajes y vacunación.
  * **`PlanCuidado`:** Relación *OneToOne* estricta con `Encuesta`. Almacena en campos de texto masivo los resultados lógicos y matemáticos procesados por el motor de reglas (situaciones, prioridades, intervenciones y actividades).

---

## 🔀 Flujo de la Aplicación y Endpoints REST
**Flujo de Seguridad:** El usuario inicia sesión y el frontend almacena los tokens JWT en el estado. Mediante interceptores de Axios, estos se envían de forma transparente en los *headers* de cada petición. A nivel de UI, el componente `<ProtectedRoute />` impide el montaje de vistas privadas sin un token activo y válido.

### Endpoints Principales
* `POST /api/token/` - Generación e intercambio de credenciales por JWT.
* `POST /api/token/refresh/` - Refresco silencioso del token para evitar desconexiones de usuario.
* `GET / POST /api/pacientes/` - (Expuesto vía DefaultRouter) Gestión del padrón de pacientes.
* `GET / POST /api/encuestas/` - Registro de evaluaciones físicas y tamizajes.

Las vistas del frontend (`/dashboard`, `/pacientes/nuevo`, `/encuestas/nueva`, `/planes/documento/:id`) operan consumiendo y actualizando estos recursos asíncronamente vía payloads JSON, sin recarga de página.

---

## 📊 Estado Actual del Proyecto (Roadmap)

### 🟢 Módulos Completados
* Configuración base e integración del stack (Vite + Tailwind CSS).
* Sistema completo de Autenticación JWT, sesión global (Zustand) y ruteo privado.
* Esquema estructural de la base de datos MySQL (Relaciones `OneToOne` y `ForeignKey` documentadas y optimizadas).
* *Dashboard* de instrumentos principal e interfaces dinámicas de captura (Formularios de paciente y encuestas).

### 🟡 En Desarrollo / Fase de Pruebas
* **MotorPAE (Generador Lógico):** Desarrollo del algoritmo central en el backend para procesar reglas RIAS a partir del modelo `Encuesta` y popular automáticamente el `PlanCuidado`.
* **Vista de Documentos A4 (`PlanDocumento`):** Componente indexado diseñado para visualización, impresión y exportación del plan médico final. Actualmente en proceso de estilización CSS *print-friendly* y poblamiento de datos.

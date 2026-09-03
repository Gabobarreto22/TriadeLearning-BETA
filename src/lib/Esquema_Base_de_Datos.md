# Esquema de Base de Datos — TRIADE Learning Platform

## Resumen General

Plataforma de aprendizaje con dos roles: **empleados** (toman cursos y exámenes) y **administradores** (gestionan cursos, personal y configuración).

---

## Tablas Principales

### profiles
Tabla de usuarios. Cada usuario tiene un rol (empleado o administrador) y un cargo asignado.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | PK, referencia a auth.users |
| full_name | text | Nombre completo |
| email | text | Correo electrónico |
| role | text | `employee` o `admin` |
| job_role_id | uuid | FK → job_roles.id |
| avatar_url | text | URL del avatar |
| hire_date | date | Fecha de contratación |
| current_role_since | date | Fecha desde la que tiene el cargo actual |
| is_active | boolean | Si el usuario está activo |
| created_at | timestamptz | Fecha de creación |
| updated_at | timestamptz | Última actualización |

### departments
Departamentos de la empresa.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | PK |
| name | text | Nombre único |
| code | text | Código único |
| description | text | Descripción |
| manager_id | uuid | FK → profiles.id (gerente) |
| parent_department_id | uuid | FK → departments.id (auto-referencia) |
| is_active | boolean | Si el departamento está activo |
| created_at | timestamptz | Fecha de creación |
| updated_at | timestamptz | Última actualización |

### job_roles
Cargos/puestos de trabajo.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | PK |
| name | text | Nombre único |
| code | text | Código único |
| description | text | Descripción |
| department_id | uuid | FK → departments.id |
| salary_grade | text | Grado salarial |
| is_active | boolean | Si el cargo está activo |
| created_at | timestamptz | Fecha de creación |
| updated_at | timestamptz | Última actualización |

### user_job_roles_history
Historial de cargos de cada usuario.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK → profiles.id |
| job_role_id | uuid | FK → job_roles.id |
| start_date | date | Fecha de inicio en el cargo |
| end_date | date | Fecha de fin (null si es actual) |
| is_current | boolean | Si es el cargo actual |
| reason | text | Razón del cambio |
| created_by | uuid | FK → profiles.id (quien registró el cambio) |
| created_at | timestamptz | Fecha de registro |

---

## Cursos y Contenido

### courses
Cursos disponibles en la plataforma.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | PK |
| title | text | Título |
| code | text | Código único |
| description | text | Descripción |
| category | text | Categoría |
| duration | text | Duración (texto) |
| estimated_hours | int | Horas estimadas |
| image_url | text | URL de imagen |
| accent | text | Color de acento (gray-1 a gray-6) |
| icon_name | text | Nombre del ícono (lucide) |
| is_active | boolean | Si el curso está activo |
| is_mandatory_anywhere | boolean | Si es obligatorio en algún cargo |
| created_by | uuid | FK → profiles.id |
| created_at | timestamptz | Fecha de creación |
| updated_at | timestamptz | Última actualización |

### course_prerequisites
Prerrequisitos entre cursos.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | PK |
| course_id | uuid | FK → courses.id |
| prerequisite_course_id | uuid | FK → courses.id |
| is_mandatory | boolean | Si el prerrequisito es obligatorio |
| created_at | timestamptz | Fecha de creación |

### modules
Módulos de cada curso (texto, imagen, infografía, video, PDF, quiz).

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | PK |
| course_id | uuid | FK → courses.id |
| title | text | Título |
| type | text | `text`, `image`, `infographic`, `video`, `pdf`, `quiz` |
| duration | text | Duración (texto) |
| duration_minutes | int | Duración en minutos |
| body | text | Contenido |
| image_url | text | URL de imagen |
| infographic_data | jsonb | Datos de infografía |
| video_url | text | URL de video |
| video_duration_seconds | int | Duración del video en segundos |
| order_index | int | Orden |
| is_required | boolean | Si es obligatorio |
| is_free_preview | boolean | Si es vista previa gratuita |
| created_at | timestamptz | Fecha de creación |
| updated_at | timestamptz | Última actualización |

### resources
Recursos descargables asociados a módulos o cursos.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | PK |
| module_id | uuid | FK → modules.id (opcional) |
| course_id | uuid | FK → courses.id (opcional) |
| title | text | Título |
| description | text | Descripción |
| file_url | text | URL del archivo |
| file_type | text | Tipo de archivo |
| file_size_bytes | bigint | Tamaño en bytes |
| order_index | int | Orden |
| is_downloadable | boolean | Si se puede descargar |
| created_at | timestamptz | Fecha de creación |

### exam_questions
Preguntas de exámenes de cada curso.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | PK |
| course_id | uuid | FK → courses.id |
| module_id | uuid | FK → modules.id (opcional) |
| question | text | Pregunta |
| options | jsonb | Array de opciones |
| correct_answer | text | Respuesta correcta |
| explanation | text | Explicación |
| difficulty | text | `easy`, `medium`, `hard` |
| order_index | int | Orden |
| points | int | Puntos |
| created_at | timestamptz | Fecha de creación |
| updated_at | timestamptz | Última actualización |

---

## Asignaciones y Progreso

### course_assignments
Asignación de cursos a cargos.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | PK |
| course_id | uuid | FK → courses.id |
| job_role_id | uuid | FK → job_roles.id |
| is_mandatory | boolean | Si es obligatorio |
| order_index | int | Orden sugerido |
| completion_deadline_days | int | Días límite para completar |
| priority | text | `low`, `medium`, `high`, `critical` |
| created_by | uuid | FK → profiles.id |
| created_at | timestamptz | Fecha de creación |
| updated_at | timestamptz | Última actualización |

### user_course_requirements
Cursos asignados a usuarios específicos.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK → profiles.id |
| course_id | uuid | FK → courses.id |
| job_role_id | uuid | FK → job_roles.id |
| assigned_at | timestamptz | Fecha de asignación |
| assigned_by | uuid | FK → profiles.id |
| deadline | date | Fecha límite |
| status | text | `pending`, `in_progress`, `completed`, `overdue`, `exempted`, `cancelled` |
| is_mandatory | boolean | Si es obligatorio |
| priority | text | `low`, `medium`, `high`, `critical` |
| started_at | timestamptz | Fecha de inicio |
| completed_at | timestamptz | Fecha de finalización |
| progress_percent | int | Porcentaje de progreso (0-100) |
| last_accessed_at | timestamptz | Último acceso |
| created_at | timestamptz | Fecha de creación |
| updated_at | timestamptz | Última actualización |

### module_progress
Progreso de cada módulo por usuario.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK → profiles.id |
| module_id | uuid | FK → modules.id |
| user_course_requirement_id | uuid | FK → user_course_requirements.id |
| completed | boolean | Si está completado |
| completed_at | timestamptz | Fecha de finalización |
| time_spent_seconds | int | Tiempo dedicado |
| last_accessed_at | timestamptz | Último acceso |
| views_count | int | Número de vistas |
| created_at | timestamptz | Fecha de creación |
| updated_at | timestamptz | Última actualización |

### exam_attempts
Intentos de exámenes.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | PK |
| user_course_requirement_id | uuid | FK → user_course_requirements.id |
| attempt_number | int | Número de intento |
| score | int | Puntaje |
| total_questions | int | Total de preguntas |
| correct_answers | int | Respuestas correctas |
| wrong_answers | int | Respuestas incorrectas |
| passed | boolean | Si aprobó |
| answers | jsonb | Respuestas dadas |
| time_spent_seconds | int | Tiempo dedicado |
| started_at | timestamptz | Fecha de inicio |
| completed_at | timestamptz | Fecha de finalización |
| status | text | `in_progress`, `completed`, `abandoned` |
| created_at | timestamptz | Fecha de creación |

### learning_sessions
Sesiones de aprendizaje de cada usuario.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK → profiles.id |
| module_id | uuid | FK → modules.id |
| user_course_requirement_id | uuid | FK → user_course_requirements.id |
| start_time | timestamptz | Hora de inicio |
| end_time | timestamptz | Hora de fin |
| duration_seconds | int | Duración en segundos |
| device_type | text | Tipo de dispositivo |
| ip_address | text | Dirección IP |
| created_at | timestamptz | Fecha de creación |

---

## Certificaciones

### certificates
Certificados de finalización de cursos.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | PK |
| user_course_requirement_id | uuid | FK → user_course_requirements.id |
| certificate_number | text | Número único |
| issue_date | date | Fecha de emisión |
| expiry_date | date | Fecha de vencimiento |
| certificate_url | text | URL del certificado |
| validation_token | text | Token de validación único |
| metadata | jsonb | Metadatos |
| created_at | timestamptz | Fecha de creación |

### role_certifications
Certificaciones de cargo (conjunto de cursos completados para un cargo).

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK → profiles.id |
| job_role_id | uuid | FK → job_roles.id |
| certified_at | timestamptz | Fecha de certificación |
| expires_at | date | Fecha de vencimiento |
| certificate_url | text | URL del certificado |
| requirements_met | jsonb | Requisitos cumplidos |
| is_valid | boolean | Si la certificación es válida |
| created_at | timestamptz | Fecha de creación |
| updated_at | timestamptz | Última actualización |

---

## Engagement

### notifications
Notificaciones del sistema a usuarios.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK → profiles.id |
| type | text | `info`, `warning`, `success`, `error`, `reminder` |
| title | text | Título |
| message | text | Mensaje |
| link | text | Enlace |
| is_read | boolean | Si fue leída |
| read_at | timestamptz | Fecha de lectura |
| sent_at | timestamptz | Fecha de envío |
| expires_at | timestamptz | Fecha de expiración |
| metadata | jsonb | Metadatos |

### course_feedback
Feedback de usuarios sobre cursos.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | PK |
| user_course_requirement_id | uuid | FK → user_course_requirements.id |
| rating | int | Calificación (0-5) |
| feedback_text | text | Comentario |
| would_recommend | boolean | Si lo recomendaría |
| time_commitment_adequate | boolean | Si el tiempo fue adecuado |
| difficulty_level | text | `very_easy`, `easy`, `medium`, `hard`, `very_hard` |
| created_at | timestamptz | Fecha de creación |

### badges
Insignias disponibles.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | PK |
| name | text | Nombre |
| description | text | Descripción |
| icon_url | text | URL del ícono |
| points | int | Puntos |
| category | text | Categoría |
| criteria | jsonb | Criterios de obtención |
| created_at | timestamptz | Fecha de creación |

### user_badges
Insignias obtenidas por usuarios.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK → profiles.id |
| badge_id | uuid | FK → badges.id |
| earned_at | timestamptz | Fecha de obtención |
| metadata | jsonb | Metadatos |

---

## Sistema

### system_settings
Configuración del sistema.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | PK |
| key | text | Clave única |
| value | jsonb | Valor |
| description | text | Descripción |
| category | text | Categoría |
| is_public | boolean | Si es pública |
| updated_by | uuid | FK → profiles.id |
| updated_at | timestamptz | Última actualización |
| created_at | timestamptz | Fecha de creación |

### audit_logs
Registro de auditoría.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK → profiles.id |
| action | text | Acción realizada |
| entity_type | text | Tipo de entidad |
| entity_id | uuid | ID de la entidad |
| old_values | jsonb | Valores anteriores |
| new_values | jsonb | Valores nuevos |
| ip_address | text | Dirección IP |
| user_agent | text | User agent |
| created_at | timestamptz | Fecha de creación |

---

## Seguridad (RLS)

Todas las tablas tienen Row Level Security habilitado.

- **profiles**: lectura/escritura propia; admin lee/edita/crea/elimina todo.
- **courses/modules/exam_questions/assignments**: admin CRUD; empleado lee.
- **module_progress**: propio CRUD; admin lee todo.
- **exam_results**: propio insert/lectura; admin lee todo.
- **job_roles/departments**: admin CRUD; todos leen.
- **user_job_roles_history**: admin CRUD; usuario lee su historial.
- **notifications**: propio lectura/escritura; admin CRUD.
- **course_feedback**: propio insert; admin lee todo.
- **badges**: admin CRUD; todos leen.
- **user_badges**: propio lectura; admin CRUD.
- **system_settings**: admin CRUD; lectura pública si is_public.
- **audit_logs**: admin solo lectura.
- **certificates/role_certifications**: propio lectura; admin lee todo.

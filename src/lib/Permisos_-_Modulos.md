# Permisos y Módulos

---

## ADMINISTRADOR

### Dashboard

**Permiso:** Leer

- Ver estadísticas globales de la empresa
- Ver alertas del sistema
- Ver resumen de capacitación general

---

### Gestión de Personal

**Permiso:** CRUD

- Departamentos: Crear, editar, activar/desactivar
- Cargos: Crear, editar, activar/desactivar
- Empleados: Registrar, editar, activar/desactivar
- Cambio de cargo: Cambiar cargo de empleado con historial

---

### Historial de Cargos

**Permiso:** Leer

- Ver historial de todos los empleados
- Filtrar por empleado, fecha, razón

---

### Gestión de Cursos

**Permiso:** CRUD

- Crear, editar, activar/desactivar cursos
- Definir prerrequisitos entre cursos
- Ver estadísticas de cada curso

---

### Gestión de Módulos

**Permiso:** CRUD

- Crear módulos (texto, imagen, infografía, video, PDF, quiz)
- Editar y eliminar módulos
- Reordenar módulos del curso

---

### Gestión de Recursos

**Permiso:** CRUD

- Subir recursos (PDF, DOC, XLS, etc.)
- Asociar recursos a módulos o cursos
- Gestionar descargas

---

### Gestión de Exámenes

**Permiso:** CRUD

- Crear preguntas con opciones
- Definir respuesta correcta
- Configurar exámenes (intentos, tiempo, nota mínima)
- Ver resultados de exámenes

---

### Requisitos por Cargo

**Permiso:** CRUD

- Asignar cursos a cargos
- Definir obligatoriedad
- Establecer plazos y prioridades
- Definir orden sugerido

---

### Asignación Automática

**Permiso:** CRUD

- Asignar cursos automáticamente al cambiar cargo
- Ver cursos asignados a empleados

---

### Certificaciones

**Permiso:** Leer

- Ver certificados generados
- Gestionar certificaciones de cargo

---

### Feedback

**Permiso:** Leer

- Ver feedback de todos los cursos
- Ver calificaciones y comentarios
- Exportar datos de feedback

---

### Gamificación

**Permiso:** CRUD

- Crear y gestionar insignias
- Ver insignias obtenidas por empleados

---

### Notificaciones

**Permiso:** CRUD

- Configurar plantillas de correo
- Ver notificaciones del sistema
- Programar recordatorios automáticos

---

### Reportes

**Permiso:** Leer

- Reporte de cumplimiento por cargo
- Reporte de progreso individual
- Reporte de certificaciones
- Reporte de feedback
- Exportar a Excel, PDF, CSV

---

### Configuración

**Permiso:** CRUD

- Configurar parámetros del sistema
- Personalizar branding
- Configurar notificaciones
- Gestionar administradores

---

### Auditoría

**Permiso:** Leer

- Ver logs de auditoría
- Filtrar por usuario, fecha, acción
- Ver historial de cambios

---

## EMPLEADO

### Dashboard

**Permiso:** Leer

- Ver progreso personal general
- Ver cursos asignados, en progreso y completados
- Ver próximos vencimientos
- Ver notificaciones recientes
- Ver insignias obtenidas

---

### Mis Cursos

**Permiso:** Leer

- Ver todos los cursos asignados
- Filtrar por estado (pendiente, en progreso, completado)
- Ver fechas límite
- Continuar cursos

---

### Tomar Curso

**Permiso:** Leer/Escribir

- Visualizar módulos del curso
- Reproducir contenido (texto, imagen, infografía, video, PDF)
- Completar módulos
- Ver progreso en tiempo real
- Descargar recursos

---

### Módulo Texto

**Permiso:** Leer/Escribir

- Leer contenido en texto enriquecido
- Marcar como completado

---

### Módulo Imagen

**Permiso:** Leer/Escribir

- Ver imagen con descripción
- Marcar como completado

---

### Módulo Infografía

**Permiso:** Leer/Escribir

- Interactuar con infografía
- Explorar datos visuales
- Marcar como completado

---

### Módulo Video

**Permiso:** Leer/Escribir

- Reproducir video educativo
- Ver progreso del video
- Marcar como completado

---

### Módulo PDF

**Permiso:** Leer/Escribir

- Visualizar PDF
- Descargar PDF
- Marcar como completado

---

### Módulo Quiz

**Permiso:** Leer/Escribir

- Responder preguntas de autoevaluación
- Ver calificación inmediata
- Marcar como completado

---

### Examen Final

**Permiso:** Leer/Escribir

- Iniciar examen del curso completado
- Responder preguntas con tiempo límite
- Ver resultado inmediato
- Reintentar (si está permitido)

---

### Certificados

**Permiso:** Leer

- Ver certificados obtenidos
- Descargar certificados en PDF
- Verificar autenticidad de certificados
- Compartir enlace de verificación

---

### Certificación de Cargo

**Permiso:** Leer

- Ver progreso hacia certificación de cargo
- Ver cursos pendientes para certificarse

---

### Feedback

**Permiso:** Leer/Escribir

- Calificar cursos completados (1-5 estrellas)
- Dejar comentarios
- Evaluar dificultad y tiempo
- Recomendar cursos

---

### Notificaciones

**Permiso:** Leer

- Ver notificaciones personales
- Marcar como leídas
- Ver recordatorios de vencimientos

---

### Gamificación

**Permiso:** Leer

- Ver insignias obtenidas
- Ver puntos acumulados
- Ver próximas insignias disponibles
- Ver progreso hacia siguientes logros

---

### Mi Perfil

**Permiso:** Leer/Escribir

- Ver información personal
- Editar datos básicos
- Ver historial de cargos
- Ver estadísticas personales
- Cambiar contraseña

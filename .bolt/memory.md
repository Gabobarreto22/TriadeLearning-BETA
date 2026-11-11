# Project memory

## Product intent & audience

- Sistema interno de gestión de personal/capacitaciones (HR), en español.
- Módulos actuales: Notificaciones, Reportes (Configuración fue ocultado del UI).
- Seguimiento de cursos por empleado, incluyendo cursos realizados e intentos fallidos.

## Brand personality & voice

- Interfaz y mensajes en español.
- Tono profesional, conciso, orientado a uso interno administrativo.

## Visual design & UX direction

- Stack: Vite + React + JSX, Tailwind CSS, Lucide React para iconos.
- Alias `@/` → `src/` para imports.
- Estilos custom usan variables CSS existentes (p. ej. `--muted`, `--surface-2`); verificar nombres reales antes de usar.
- Componente de botones segmentados agregado a estilos globales.
- Layout: menú lateral + panel de inicio con accesos a módulos.

## Decisions, constraints & rationale

- **Notificaciones:** permite destinatario por "Persona" o "Cargo"; al elegir "Cargo" se envía a todas las personas con ese cargo y el formulario muestra el total de receptores.
- **Configuración:** se removió del menú lateral, del panel de inicio y de la documentación; la tabla en base de datos sigue existiendo pero ya no se expone en UI.
- **Reportes:** exportación a PDF vía diálogo de impresión del navegador ("Guardar como PDF"), sin dependencias adicionales. Incluye resumen + cursos e intentos fallidos del empleado seleccionado.
- **Build/type-check:** verificación de tipos (`tsc`) y build pasan correctamente tras los cambios.
- **Sin dependencias extra:** no instalar paquetes UI/iconos salvo necesidad justificada o petición explícita.

## Open questions & assumptions

- No se han verificado las pantallas en el navegador tras los últimos cambios.
- Se asume que la tabla de configuraciones puede reactivarse en UI en el futuro si se requiere.
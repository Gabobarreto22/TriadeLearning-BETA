import type { Language } from '@/lib/copy';

export type DocVisual =
  | 'stat-cards'
  | 'quick-links'
  | 'course-list'
  | 'feedback-list'
  | 'pass-rate'
  | 'completion-bar'
  | 'employee-form'
  | 'department-list'
  | 'role-assignment'
  | 'history-timeline'
  | 'requirements-table'
  | 'course-editor-tabs'
  | 'module-types'
  | 'exam-question-form'
  | 'assignment-form'
  | 'prerequisite-chain'
  | 'certificate-card'
  | 'role-cert-badge'
  | 'feedback-form'
  | 'rating-breakdown'
  | 'notification-types'
  | 'notification-form'
  | 'compliance-chart'
  | 'progress-table'
  | 'export-buttons'
  | 'settings-categories'
  | 'branding-preview'
  | 'audit-log-table'
  | 'action-types';

export type DocSection = {
  id: string;
  title: string;
  icon: string;
  summary: string;
  sections: { heading: string; body: string; example?: string; visual?: DocVisual }[];
};

export const docSections: DocSection[] = [
  {
    id: 'dashboard',
    title: 'Panel Principal (Dashboard)',
    icon: 'LayoutDashboard',
    summary: 'Vista general del sistema con estadísticas clave, accesos rápidos y actividad reciente.',
    sections: [
      {
        heading: '¿Qué muestra el Dashboard?',
        body: 'El Dashboard es la pantalla de inicio del panel de administración. Es tu centro de control: al entrar ves de un vistazo cómo está toda la organización en materia de formación. Se divide en tres zonas principales: (1) tarjetas de estadísticas en la parte superior con los totales más importantes, (2) accesos rápidos a cada módulo en el centro, y (3) dos paneles laterales con un resumen de cursos recientes y feedback reciente. Todo se calcula en tiempo real desde la base de datos, así que los números que ves siempre reflejan el estado actual.',
      },
      {
        heading: 'Tarjetas de estadísticas',
        body: 'En la parte superior del Dashboard verás 8 tarjetas de estadísticas. Cada tarjeta tiene un ícono, un número grande y una etiqueta. Estas son: Cursos totales (cantidad de cursos creados en el sistema), Usuarios totales (empleados y administradores registrados), Cargos totales (posiciones definidas), Certificados totales (certificados emitidos), Completación promedio (porcentaje global de módulos completados), Tasa de aprobación (porcentaje de exámenes aprobados), Insignias totales (insignias creadas) y Notificaciones totales (notificaciones enviadas). Los datos se calculan en tiempo real desde la base de datos.',
        visual: 'stat-cards',
        example: 'Si acabas de crear un curso nuevo llamado "Operación de Bombas", al volver al Dashboard verás que el número de "Cursos totales" aumentó en 1 automáticamente.',
      },
      {
        heading: 'Cómo se calcula la tasa de aprobación',
        body: 'La "Tasa de aprobación" se calcula dividiendo el número de exámenes aprobados entre el total de intentos realizados, y multiplicando por 100 para obtener el porcentaje. Este indicador te dice qué tan efectiva es la formación: una tasa muy baja puede indicar que los cursos son demasiado difíciles o que las preguntas no están bien redactadas.',
        visual: 'pass-rate',
        example: 'Si hay 10 exámenes registrados y 8 están aprobados, el cálculo es: 8 ÷ 10 × 100 = 80%. La tarjeta mostrará "80%".',
      },
      {
        heading: 'Cómo se calcula la completación promedio',
        body: 'El porcentaje de "Completación promedio" representa qué tan avanzada está toda la organización en sus cursos asignados. Se calcula promediando el porcentaje de progreso de cada asignación activa (excluyendo las canceladas y exentas). Cada asignación tiene un campo de progreso que refleja cuántos módulos del curso ha completado el empleado. Este número te da una idea general del avance de aprendizaje de toda la empresa.',
        visual: 'completion-bar',
        example: 'Si en toda la organización hay 200 módulos asignados y los empleados han completado 130, el cálculo es: 130 ÷ 200 × 100 = 65%. La tarjeta mostrará "65%".',
      },
      {
        heading: 'Accesos rápidos',
        body: 'Debajo de las estadísticas encontrarás una cuadrícula de botones grandes para ir directamente a cada módulo: Cursos, Personal, Certificaciones, Reportes, Notificaciones y Configuración. Cada botón muestra el ícono del módulo y su nombre. Al hacer clic en cualquiera, navegas directamente a esa sección sin tener que usar el menú lateral.',
        visual: 'quick-links',
        example: 'Si necesitas crear un usuario nuevo, en lugar de buscar en el menú lateral, puedes hacer clic en "Personal" desde los accesos rápidos y llegar directamente al módulo de gestión de personal.',
      },
      {
        heading: 'Panel de cursos recientes',
        body: 'En la parte inferior izquierda del Dashboard verás una tarjeta con el título "Cursos" que muestra hasta 4 cursos recientes. Cada curso se muestra con su ícono, su título, el número de módulos que contiene y cuántos cargos lo tienen asignado. Junto al título hay un botón "Ver todos" que te lleva al módulo completo de gestión de cursos. Si no hay cursos creados, verás el mensaje "No hay cursos creados".',
        visual: 'course-list',
        example: 'Ves "Seguridad Industrial Básica" con "5 módulos · 3 cargos asignados". Esto te dice de un vistazo que es un curso con contenido y ya está asignado a tres cargos diferentes.',
      },
      {
        heading: 'Panel de feedback reciente',
        body: 'En la parte inferior derecha del Dashboard verás una tarjeta con el título "Feedback" que muestra hasta 5 comentarios recientes de empleados sobre cursos completados. Cada entrada muestra las iniciales del empleado, su nombre, el curso que calificó y una calificación en estrellas (de 1 a 5). Junto al título hay un botón "Ver todos" que te lleva al módulo completo de feedback. Si no hay feedback, verás el mensaje "No hay feedback registrado".',
        visual: 'feedback-list',
        example: 'Ves que "Juan Pérez" calificó "Mantenimiento Preventivo" con 4 estrellas (★★★★). Esto te indica que el curso le pareció bueno pero con margen de mejora.',
      },
      {
        heading: 'Cómo usar el Dashboard en el día a día',
        body: 'El Dashboard es tu punto de partida cada vez que entras al sistema. Te recomendamos revisarlo al inicio de cada sesión para detectar situaciones que requieran acción: (1) Si la tasa de aprobación bajó, revisa si alguna pregunta de examen está mal redactada o si un curso es muy difícil. (2) Si la completación promedio es baja, considera enviar notificaciones recordatorias a los empleados. (3) Si hay feedback con pocas estrellas, lee los comentarios en el módulo de Feedback para identificar mejoras. (4) Usa los accesos rápidos para ir directamente al módulo donde necesitas trabajar.',
        example: 'Lunes por la mañana: entras al Dashboard y ves que la completación bajó de 70% a 55%. Haces clic en "Notificaciones" desde los accesos rápidos y envías un recordatorio a los empleados que tienen cursos pendientes.',
      },
    ],
  },
  {
    id: 'personnel',
    title: 'Gestión de Personal',
    icon: 'Users',
    summary: 'Administra empleados, administradores, departamentos, cargos, historial de cargos y requisitos por cargo.',
    sections: [
      {
        heading: 'Pestaña Empleados',
        body: 'Aquí ves y gestionas todos los empleados del sistema. Puedes crear nuevos usuarios con nombre, correo, contraseña, cargo y departamento. También puedes editar sus datos, cambiar su cargo (lo que genera un registro en el historial), activarlos o desactivarlos, y eliminarlos. La lista muestra el nombre, correo, cargo, departamento y estado (activo/inactivo) de cada empleado. Usa el buscador para encontrar rápidamente a una persona por su nombre o correo.',
        visual: 'employee-form',
        example: 'Para crear un empleado: haz clic en "Nuevo usuario", completa el formulario con nombre, correo y contraseña, selecciona su cargo y departamento, y guarda. El empleado podrá iniciar sesión inmediatamente.',
      },
      {
        heading: 'Pestaña Administradores',
        body: 'Los administradores tienen acceso completo al panel de administración. Puedes crear nuevos administradores con los mismos campos que un empleado, pero asignándoles el rol de administrador. Ten precaución: un administrador puede crear, editar y eliminar cursos, usuarios, cargos, insignias y configuraciones del sistema. Solo crea administradores para personas que realmente necesitan este acceso.',
        example: 'Creas un administrador para el jefe de capacitación, quien necesita gestionar cursos y personal. Le asignas el rol "Administrador" en lugar de "Empleado".',
      },
      {
        heading: 'Pestaña Departamentos',
        body: 'Los departamentos agrupan cargos y personas. Cada departamento tiene un nombre, un código corto y una descripción. Puedes crear, editar y eliminar departamentos. Los departamentos te ayudan a organizar la estructura de la organización y a filtrar empleados al momento de gestionar asignaciones o reportes.',
        visual: 'department-list',
        example: 'Departamento "Operaciones" con código "OPS" agrupa los cargos relacionados con mantenimiento y producción.',
      },
      {
        heading: 'Pestaña Cargos',
        body: 'Los cargos definen qué cursos debe completar cada empleado. Cada cargo tiene nombre y descripción. Al asignar cursos a un cargo, todos los empleados con ese cargo recibieron automáticamente las asignaciones. Esto significa que si cambias las asignaciones de un cargo, el cambio se refleja inmediatamente en todos los empleados que tienen ese cargo.',
        visual: 'role-assignment',
        example: 'El cargo "Técnico de Mantenimiento" tiene asignados los cursos de Seguridad Industrial (prioridad alta), Mantenimiento Preventivo (prioridad media) y Emergencias (prioridad crítica).',
      },
      {
        heading: 'Pestaña Historial de cargos',
        body: 'Muestra el historial de cambios de cargo de cada empleado: fecha de inicio, fecha de fin, cargo anterior y razón del cambio. Cada vez que cambias el cargo de un empleado desde la pestaña Empleados, se genera automáticamente un registro en el historial. Esto permite trazar la trayectoria de cada persona en la organización y mantener un registro auditable.',
        visual: 'history-timeline',
        example: 'Un empleado entró como "Aprendiz" el 01/03/2025, fue ascendido a "Operador Junior" el 15/06/2025, y luego a "Técnico de Mantenimiento" el 01/01/2026. El historial muestra las tres etapas con sus fechas y razones.',
      },
      {
        heading: 'Pestaña Requisitos por cargo',
        body: 'Muestra qué cursos están asignados a cada cargo y permite gestionar esas asignaciones: agregar cursos, quitarlos, definir prioridad (baja, media, alta, crítica), obligatoriedad (sí/no) y días límite de completación. Esta pestaña es el corazón del sistema de asignaciones: desde aquí controlas qué debe aprender cada cargo y con qué urgencia.',
        visual: 'requirements-table',
        example: 'Para el cargo "Técnico de Mantenimiento": Seguridad Industrial es obligatorio, prioridad alta, 30 días de plazo. Gas Lift Básico es opcional, prioridad baja, 90 días de plazo.',
      },
      {
        heading: 'Activar y desactivar empleados',
        body: 'Un empleado inactivo no puede iniciar sesión, pero sus datos y progreso se conservan. Esto es útil cuando alguien se va de la organización temporalmente (licencia, vacaciones extendidas) y vas a reactivarlo después. Si eliminas un empleado, sus datos se borran permanentemente, incluyendo su progreso, certificados e insignias. Usa la eliminación con precaución.',
        example: 'Un empleado pide licencia por 3 meses. En lugar de eliminarlo, lo desactivas. Cuando regrese, lo reactivas y todo su progreso sigue intacto.',
      },
      {
        heading: 'Buenas prácticas de gestión de personal',
        body: 'Recomendaciones: (1) Crea los departamentos antes de crear los cargos, y los cargos antes de crear los empleados. (2) Asigna cursos a los cargos, no a empleados individuales, para que el sistema escale automáticamente. (3) Usa la pestaña Requisitos por cargo para gestionar asignaciones masivas en lugar de asignar curso por curso. (4) Revisa el historial de cargos periódicamente para verificar que las trayectorias estén actualizadas.',
        example: 'Antes de incorporar 20 empleados nuevos, creas el departamento "Producción", luego el cargo "Operador", le asignas 3 cursos, y luego creas los 20 empleados con ese cargo. Los 20 reciben automáticamente los 3 cursos.',
      },
    ],
  },
  {
    id: 'courses',
    title: 'Gestión de Cursos',
    icon: 'BookOpen',
    summary: 'Crea y edita cursos con módulos, recursos, preguntas de examen, asignaciones a cargos y prerrequisitos.',
    sections: [
      {
        heading: 'Crear un curso',
        body: 'Haz clic en "Nuevo curso" para abrir el editor. Completa el título, descripción, categoría, duración, URL de imagen, ícono y color de acento. El color de acento se usa en el catálogo del empleado para identificar visualmente el curso. El ícono aparece en la tarjeta del curso y en la barra lateral del reproductor. El curso se guarda y luego puedes agregarle contenido en las pestañas del editor.',
        visual: 'course-editor-tabs',
        example: 'Curso "Seguridad Industrial Básica", categoría "Seguridad", duración "2 horas", ícono "shield", color de acento "blue".',
      },
      {
        heading: 'Pestaña Información',
        body: 'Aquí editas los datos básicos del curso: título, descripción, categoría, duración estimada, URL de la imagen de portada, ícono y color de acento. La imagen de portada se muestra en el catálogo del empleado. Si no pones una URL de imagen, el curso usa una imagen por defecto. La descripción aparece debajo del título en el catálogo.',
        example: 'Pones una imagen de un casco de seguridad como portada del curso "Seguridad Industrial Básica" para que los empleados lo identifiquen rápidamente.',
      },
      {
        heading: 'Pestaña Módulos (con recursos)',
        body: 'Cada curso puede tener múltiples módulos en orden secuencial. Los tipos de módulo disponibles son: texto (lectura), imagen/infografía, video (YouTube, Vimeo o archivo subido), PDF y presentación PowerPoint. Cada módulo tiene título, duración y contenido. Los recursos (archivos descargables como PDFs, presentaciones o enlaces) se agregan directamente dentro de cada módulo al que pertenecen, ya no existen como una pestaña separada. Los módulos se desbloquean secuencialmente: el empleado debe completar uno para acceder al siguiente.',
        visual: 'module-types',
        example: 'Un curso puede tener: 1) Módulo de texto "Introducción" con un PDF adjunto "Guía rápida", 2) Módulo de video "Demostración" con una presentación PowerPoint descargable, 3) Módulo PDF "Manual de procedimientos".',
      },
      {
        heading: 'Orden de los módulos',
        body: 'Los módulos se numeran automáticamente según el orden en que los creas. Puedes reordenarlos cambiando su posición en la lista. El orden es importante porque los módulos se desbloquean secuencialmente: el empleado debe completar el módulo 1 para acceder al módulo 2, y así sucesivamente. Asegúrate de que el orden tenga sentido pedagógico: primero lo básico, luego lo intermedio, y al final lo avanzado.',
        example: 'En un curso de Seguridad, el orden correcto sería: 1) Conceptos básicos (texto), 2) Uso de EPP (video), 3) Procedimientos (PDF), 4) Casos prácticos (infografía).',
      },
      {
        heading: 'Pestaña Exámenes',
        body: 'Crea preguntas de selección múltiple para evaluar el conocimiento. Cada pregunta tiene un enunciado, opciones (una por línea), el índice de la respuesta correcta, una explicación que se muestra después de responder, nivel de dificultad (fácil, media, difícil) y puntos. Las preguntas pueden estar asociadas al curso completo o a un módulo específico. Las preguntas de módulo se presentan al final de cada módulo; las del curso se presentan en la prueba de aprobación final.',
        visual: 'exam-question-form',
        example: 'Pregunta: "¿Qué significa EPP?" con 3 opciones, índice correcto 0, dificultad fácil, 10 puntos.',
      },
      {
        heading: '¿Cómo funciona el índice de la respuesta correcta?',
        body: 'El "Índice de respuesta correcta" indica cuál de las opciones que escribiste es la correcta. El conteo empieza en 0, no en 1. Esto significa que la primera opción que escribiste es la número 0, la segunda es la número 1, la tercera es la número 2, y así sucesivamente. Es importante recordar esto porque es fácil confundirse y poner 1 pensando en "la primera opción", cuando en realidad la primera opción es 0.',
        example: 'Escribes estas 3 opciones (una por línea):\n1) Equipo de Protección Personal\n2) Equipo de Prevención de Plagas\n3) Equipo de Prueba de Presión\n\nLa respuesta correcta es "Equipo de Protección Personal". Como es la primera opción, su índice es 0. Si la correcta fuera "Equipo de Prevención de Plagas" (la segunda), el índice sería 1. Si fuera la tercera, el índice sería 2.',
      },
      {
        heading: 'Pestaña Asignaciones',
        body: 'Asigna el curso a uno o varios cargos. Define si es obligatorio (el empleado debe completarlo sí o sí) u opcional, la prioridad (baja, media, alta, crítica) y los días límite para completación. Todos los empleados con ese cargo recibirán la asignación automáticamente en el momento que guardes. Si ya hay empleados con ese cargo, verán el curso aparecer en su catálogo inmediatamente.',
        visual: 'assignment-form',
        example: 'Asignar "Seguridad Industrial" al cargo "Técnico de Mantenimiento" como obligatorio, prioridad alta, 30 días de plazo.',
      },
      {
        heading: 'Pestaña Prerrequisitos',
        body: 'Define qué cursos deben completarse antes de poder acceder a este. Los prerrequisitos pueden ser obligatorios (el curso no se desbloquea hasta completarlos) u opcionales. Esto te permite crear rutas de aprendizaje estructuradas: el empleado no puede saltar a un curso avanzado sin antes haber aprobado los básicos. El sistema bloquea automáticamente el acceso al curso hasta que se cumplan los prerrequisitos obligatorios.',
        visual: 'prerequisite-chain',
        example: 'El curso "Gas Lift Avanzado" tiene como prerrequisito obligatorio "Mantenimiento Preventivo". Un empleado nuevo no puede abrir "Gas Lift Avanzado" hasta haber aprobado "Mantenimiento Preventivo".',
      },
    ],
  },
  {
    id: 'certifications',
    title: 'Certificaciones',
    icon: 'Award',
    summary: 'Visualiza certificados emitidos por completación de cursos y certificaciones de cargo de los empleados.',
    sections: [
      {
        heading: '¿Qué son los certificados de cursos?',
        body: 'Cuando un empleado completa un curso y aprueba el examen final con al menos 90%, se genera automáticamente un certificado con un número único, fecha de emisión y fecha de vencimiento. El certificado incluye el nombre del empleado, el título del curso completado, el número de certificado (formato TRIADE-XXX-AAAA-NNN) y las fechas. Aquí puedes ver todos los certificados emitidos, a quién pertenecen y qué curso completaron.',
        visual: 'certificate-card',
        example: 'Certificado TRIADE-SEG101-2026-001 emitido a "Empleado de Prueba" por completar "Seguridad Industrial Básica" el 15/09/2026.',
      },
      {
        heading: 'Número de certificado',
        body: 'Cada certificado tiene un número único generado automáticamente con el formato TRIADE-[código de curso]-[año]-[secuencia]. Este número es inmutable y sirve para verificar la autenticidad del certificado. Si necesitas verificar que un certificado presentado por un empleado es válido, puedes buscarlo por su número en esta sección.',
        example: 'Un empleado te presenta un certificado con el número TRIADE-SEG101-2026-001. Lo buscas en el sistema y confirmas que fue emitido el 15/09/2026.',
      },
      {
        heading: 'Certificaciones de cargo',
        body: 'Una certificación de cargo valida que un empleado ha completado todos los cursos requeridos para su posición. A diferencia del certificado de curso (que se emite por cada curso aprobado), la certificación de cargo se obtiene cuando el empleado completa TODOS los cursos asignados a su cargo. Muestra la fecha de certificación, la fecha de vencimiento y si está vigente (verde) o expirada (rojo).',
        visual: 'role-cert-badge',
        example: 'El cargo "Técnico de Mantenimiento" requiere 3 cursos. Juan Pérez completa los 3 y obtiene la certificación de cargo. María Gómez tiene 2 de 3, así que su certificación está expirada.',
      },
      {
        heading: 'Vigencia y vencimiento',
        body: 'Tanto los certificados de curso como las certificaciones de cargo tienen una fecha de vencimiento. Cuando un certificado está por vencer, el sistema envía automáticamente una notificación al empleado. Las certificaciones expiradas aparecen en rojo. Si un empleado cambia de cargo, sus certificaciones del cargo anterior pueden quedar obsoletas y necesitará completar los nuevos cursos requeridos.',
        example: 'La certificación de cargo de Carlos expira el 01/12/2026. En noviembre, el sistema le envía una notificación de vencimiento próximo para que se prepare.',
      },
      {
        heading: 'Cómo usar esta sección',
        body: 'Esta sección es de solo lectura: no puedes crear certificados manualmente, ya que se generan automáticamente cuando se cumple la condición (aprobar el examen final con 90%). Usa esta pantalla para: (1) verificar que los certificados se estén emitiendo correctamente, (2) buscar certificados por empleado o por número, (3) identificar empleados con certificaciones por vencer, y (4) exportar listados de certificados para auditorías.',
        example: 'Antes de una auditoría externa, exportas la lista de certificados de curso emitidos en el último trimestre para comprobar que el personal está capacitado.',
      },
    ],
  },
  {
    id: 'feedback',
    title: 'Feedback',
    icon: 'Star',
    summary: 'Revisa las calificaciones y comentarios que los empleados dejan sobre los cursos completados.',
    sections: [
      {
        heading: '¿Qué es el Feedback?',
        body: 'Después de aprobar la prueba de aprobación de un curso, los empleados pueden dejar una calificación de 1 a 5 estrellas, un comentario escrito, si recomendarían el curso (sí o no), si el tiempo fue adecuado (sí o no) y el nivel de dificultad percibido (muy fácil, fácil, medio, difícil, muy difícil). Toda esta información se centraliza aquí y te permite evaluar la calidad de tus cursos desde la perspectiva de quienes los tomaron.',
        visual: 'feedback-form',
        example: 'Un empleado califica "Mantenimiento Preventivo" con 4 estrellas, comenta "Muy útil", marca que lo recomendaría y que la dificultad fue media.',
      },
      {
        heading: 'Desglose de calificaciones',
        body: 'En la parte superior de la sección verás un desglose de cuántas calificaciones hay de cada nivel (5★, 4★, 3★, 2★, 1★) con barras visuales, y el promedio general. Este desglose te dice de un vistazo si tus cursos están siendo bien recibidos. Un promedio alto (4-5 estrellas) indica satisfacción; un promedio bajo (1-3 estrellas) indica que algo necesita mejorar.',
        visual: 'rating-breakdown',
        example: 'El curso "Seguridad Industrial" tiene 12 calificaciones de 5★, 5 de 4★, 2 de 3★, 1 de 2★ y 0 de 1★. Promedio: 4.4 estrellas. Curso bien evaluado.',
      },
      {
        heading: 'Cómo interpretar los comentarios',
        body: 'Los comentarios escritos son la fuente más valiosa de información cualitativa. Lee cada comentario con atención: los que dicen "muy útil" o "bien explicado" indican fortalezas del curso. Los que dicen "muy largo", "confuso" o "faltan ejemplos" indican áreas de mejora. Agrupa los comentarios por tema para identificar patrones: si varios empleados dicen que un módulo es confuso, es una señal clara de que ese módulo necesita reescribirse.',
        example: 'Tres empleados comentan que el módulo de "Procedimientos de emergencia" es confuso. Revisas el módulo y descubres que las instrucciones están en un orden incorrecto. Lo reorganizas y el feedback mejora.',
      },
      {
        heading: 'Indicadores de dificultad y tiempo',
        body: 'Además de las estrellas, el feedback incluye dos indicadores clave: (1) Dificultad percibida: si muchos marcan "muy difícil", el curso puede necesitar más material de apoyo o prerrequisitos. Si marcan "muy fácil", puede ser muy básico. (2) Tiempo adecuado: si marcan que el tiempo no fue adecuado, revisa la duración estimada del curso o la cantidad de módulos.',
        example: 'El 80% de los empleados marca que "Gas Lift Avanzado" es "muy difícil". Decides agregar un módulo de repaso de conceptos básicos al principio del curso.',
      },
      {
        heading: 'Cómo usar esta información',
        body: 'El feedback te permite identificar cursos que necesitan mejoras (calificaciones bajas), cursos muy difíciles (dificultad alta) o problemas de tiempo (tiempo inadecuado). La calificación promedio se muestra en la parte superior. Te recomendamos revisar el feedback semanalmente y priorizar las mejoras en los cursos con peor evaluación. También celebra los cursos con buena evaluación: comparte los resultados con los instructores o creadores de contenido.',
        example: 'Revisas el feedback semanal y notas que "Emergencias" bajó de 4.5 a 3.2 estrellas. Lees los comentarios y descubres que un video ya no carga. Lo reemplazas y el feedback recupera su nivel.',
      },
    ],
  },
  {
    id: 'notifications',
    title: 'Notificaciones',
    icon: 'Bell',
    summary: 'Envía notificaciones a empleados: recordatorios de cursos, avisos de vencimientos, felicitaciones por logros.',
    sections: [
      {
        heading: 'Tipos de notificación',
        body: 'El sistema maneja 5 tipos de notificación, cada uno con un ícono y color distinto para que el empleado identifique rápidamente su importancia: Información (azul, avisos generales), Advertencia (amarillo, alertas importantes), Éxito (verde, logros completados), Error (rojo, problemas detectados) y Recordatorio (morado, plazos pendientes). Elige el tipo adecuado para que el empleado priorice correctamente.',
        visual: 'notification-types',
        example: 'Usas "Recordatorio" para avisar de un curso pendiente, "Éxito" para felicitar por un certificado obtenido, "Advertencia" para un curso que vence pronto.',
      },
      {
        heading: 'Crear una notificación manual',
        body: 'Puedes crear notificaciones manuales para enviar a cualquier empleado. Define el tipo, el título, el mensaje y el destinatario. La notificación aparece en el panel del empleado inmediatamente. El título debe ser corto y claro (máximo 50 caracteres recomendado). El mensaje puede ser más extenso y debe incluir toda la información necesaria para que el empleado sepa qué hacer.',
        visual: 'notification-form',
        example: 'Notificación tipo "recordatorio" con título "Curso pendiente" y mensaje "Tienes 15 días para completar el curso de Emergencias".',
      },
      {
        heading: 'Notificaciones automáticas',
        body: 'El sistema genera notificaciones automáticamente cuando un empleado completa un curso, obtiene un certificado, gana una insignia, o cuando un curso está por vencer. Estas notificaciones no necesitan ser creadas manualmente. Las notificaciones automáticas aparecen en el panel del empleado de la misma forma que las manuales, pero con el tipo "Éxito" o "Recordatorio" según corresponda.',
        example: 'Un empleado aprueba el examen de "Seguridad Industrial" con 92%. El sistema le envía automáticamente una notificación de tipo "Éxito" con el título "¡Felicidades! Has aprobado".',
      },
      {
        heading: 'Gestión de notificaciones enviadas',
        body: 'En esta sección puedes ver todas las notificaciones enviadas, tanto manuales como automáticas. Para cada notificación se muestra el destinatario, el tipo, el título, el estado (leída o no leída) y la fecha de envío. Puedes eliminar notificaciones si fueron enviadas por error o si contienen información incorrecta. Esto elimina la notificación del panel del empleado.',
        example: 'Enviaste una notificación con un título equivocado. La buscas en la lista, la eliminas y creas una nueva con el título correcto.',
      },
      {
        heading: 'Buenas prácticas',
        body: 'No satures a los empleados con demasiadas notificaciones. Usa prioridades: (1) Recordatorios de vencimiento: envíalos 15 días antes del plazo. (2) Felicitaciones: envíalas inmediatamente después del logro. (3) Avisos generales: agrúpalos y envía uno por semana si es posible. Si un empleado recibe 10 notificaciones por día, dejará de leerlas. La moderación es clave para que las notificaciones sigan siendo efectivas.',
        example: 'En lugar de enviar 5 notificaciones individuales sobre cursos pendientes, esperas a fin de semana y envías una sola notificación de tipo "Recordatorio" por empleado, listando todos sus cursos pendientes.',
      },
    ],
  },
  {
    id: 'reports',
    title: 'Reportes',
    icon: 'BarChart3',
    summary: 'Estadísticas detalladas: cumplimiento por cargo, progreso individual, resultados de exámenes y feedback.',
    sections: [
      {
        heading: 'Reporte de cumplimiento por cargo',
        body: 'Muestra qué porcentaje de empleados en cada cargo han completado los cursos asignados. Cada cargo aparece con una barra de progreso que indica el nivel de cumplimiento. Útil para identificar cargos con bajo cumplimiento y tomar acciones, como enviar recordatorios o ajustar las asignaciones. Los colores indican el nivel: verde (alto cumplimiento), amarillo (medio), rojo (bajo).',
        visual: 'compliance-chart',
        example: 'Cargo "Técnico de Mantenimiento": 85% de cumplimiento (verde). Cargo "Aprendiz": 15% de cumplimiento (rojo). Decides enviar recordatorios a los aprendices.',
      },
      {
        heading: 'Reporte de progreso individual',
        body: 'Muestra el progreso de cada empleado en una tabla: nombre, curso asignado, porcentaje de avance (con barra visual), estado (pendiente, en progreso, completado, vencido) y último acceso. Puedes filtrar por cargo, departamento o estado. Este reporte te permite ver exactamente en qué punto está cada persona y quién necesita atención.',
        visual: 'progress-table',
        example: 'Ves que Juan Pérez está al 80% de "Seguridad Industrial" (en progreso), María Gómez completó "Mantenimiento Preventivo" (100%), y Carlos Ruiz no ha empezado "Emergencias" (pendiente).',
      },
      {
        heading: 'Reporte de exámenes',
        body: 'Estadísticas de todos los exámenes: total de intentos, tasa de aprobación, puntaje promedio, exámenes aprobados vs reprobados. Te permite ver qué tan difíciles son tus exámenes. Si la tasa de aprobación de un examen es muy baja, revisa las preguntas: puede que estén mal redactadas o que el contenido del curso no prepare adecuadamente a los empleados.',
        example: 'El examen de "Gas Lift Avanzado" tiene una tasa de aprobación de 40%. Revisas las preguntas y notas que 3 de ellas son ambiguas. Las reescribes y la tasa sube a 75%.',
      },
      {
        heading: 'Reporte de feedback',
        body: 'Consolida todas las calificaciones y comentarios de los empleados sobre los cursos completados. Muestra el promedio de estrellas por curso, cuántos lo recomendarían y la dificultad percibida. Este reporte complementa al módulo de Feedback pero con un enfoque más analítico: te permite comparar cursos entre sí.',
        example: 'Comparas dos cursos: "Seguridad Industrial" tiene 4.5 estrellas y "Emergencias" tiene 3.2. Decides revisar y mejorar el contenido de "Emergencias".',
      },
      {
        heading: 'Exportación de reportes',
        body: 'Los reportes pueden exportarse en formato Excel, PDF o CSV para compartir o archivar. La exportación genera un archivo con todos los datos visibles en el reporte. Excel es útil para análisis posterior (filtrar, ordenar, hacer gráficos). PDF es útil para presentaciones o auditorías. CSV es útil para importar a otros sistemas.',
        visual: 'export-buttons',
        example: 'Exportas el reporte de cumplimiento por cargo en PDF para presentarlo en la reunión mensual de gerencia. También lo exportas en Excel para que el equipo de RRHH lo analice.',
      },
      {
        heading: 'Cuándo revisar los reportes',
        body: 'Recomendamos revisar los reportes con una frecuencia regular: (1) Semanalmente: reporte de progreso individual para detectar empleados estancados. (2) Mensualmente: reporte de cumplimiento por cargo para identificar cargos con problemas. (3) Trimestralmente: reporte de exámenes y feedback para evaluar la calidad general de los cursos. Establece esta rutina para que los datos no se acumulen sin acción.',
        example: 'Cada viernes revisas el progreso individual. Detectas que 5 empleados llevan 2 semanas sin avanzar en ningún curso y les envías un recordatorio.',
      },
    ],
  },
  {
    id: 'settings',
    title: 'Configuración',
    icon: 'Settings',
    summary: 'Ajustes generales del sistema: branding, parámetros de evaluación, notificaciones automáticas y seguridad.',
    sections: [
      {
        heading: 'Categorías de configuración',
        body: 'El módulo de Configuración se divide en tres categorías: General (parámetros globales del sistema), Branding (personalización visual) y Seguridad (políticas de acceso). Cada categoría contiene una lista de ajustes que puedes editar. Los cambios se aplican inmediatamente a todo el sistema.',
        visual: 'settings-categories',
        example: 'Para cambiar el umbral de aprobación de exámenes, vas a la categoría "General" y editas el valor del parámetro correspondiente.',
      },
      {
        heading: 'Configuración general',
        body: 'Parámetros globales del sistema como el nombre de la organización, el umbral de aprobación de exámenes (por defecto 90%), y otros valores que afectan a todo el sistema. El umbral de aprobación es el porcentaje mínimo que un empleado debe obtener en un examen para aprobarlo. Si lo cambias, afecta a todos los exámenes futuros (los ya realizados no se ven afectados).',
        visual: 'branding-preview',
        example: 'Tu organización decide que el umbral de aprobación sea 80% en lugar de 90%. Lo cambias en Configuración General y a partir de ese momento, los empleados solo necesitan 80% para aprobar.',
      },
      {
        heading: 'Branding',
        body: 'Personaliza la apariencia del sistema: logos, colores y otros elementos visuales que se muestran a los empleados. Puedes cambiar el logo que aparece en la esquina superior izquierda y en la página de inicio de sesión. Un branding consistente refuerza la identidad de la organización y hace que la plataforma se sienta propia, no como una herramienta externa.',
        example: 'Subes el logo de tu empresa para que aparezca en la pantalla de inicio de sesión y en el panel de cada empleado, dando una sensación de plataforma corporativa.',
      },
      {
        heading: 'Seguridad',
        body: 'Configura políticas de contraseñas (longitud mínima, complejidad), expiración de sesiones y otros aspectos de seguridad del sistema. Una política de contraseñas robusta protege contra accesos no autorizados. La expiración de sesiones cierra automáticamente la sesión de un empleado que ha estado inactivo, evitando que alguien use su equipo sin permiso.',
        example: 'Configuras que las contraseñas deben tener mínimo 8 caracteres y que las sesiones expiren tras 30 minutos de inactividad.',
      },
      {
        heading: 'Ajustes públicos vs privados',
        body: 'Algunos ajustes son públicos (visibles para todos los empleados, como el nombre de la organización) y otros son privados (solo visibles para administradores, como las políticas de seguridad). Cada ajuste tiene un indicador "Público" que puedes activar o desactivar. Ten cuidado al hacer un ajuste privado público: si contiene información sensible, no debe ser visible para los empleados.',
        example: 'El "nombre de la organización" es un ajuste público (los empleados lo ven). La "política de contraseñas" es un ajuste privado (solo los administradores lo ven).',
      },
    ],
  },
  {
    id: 'audit',
    title: 'Auditoría',
    icon: 'History',
    summary: 'Registro de todas las acciones realizadas en el sistema: quién hizo qué, cuándo y qué cambios se produjeron.',
    sections: [
      {
        heading: '¿Qué se registra?',
        body: 'Cada vez que un administrador crea, edita o elimina un elemento (curso, usuario, cargo, asignación, insignia, etc.), se genera un registro de auditoría automático. El registro incluye: el usuario que realizó la acción, el tipo de acción (CREATE, UPDATE, DELETE), el tipo de entidad afectada (curso, usuario, cargo, etc.), los valores anteriores y nuevos (para que puedas ver qué cambió exactamente), la fecha y hora, y la dirección IP desde donde se realizó.',
        visual: 'audit-log-table',
        example: 'Registro: Usuario "Administrador del Sistema" creó el curso "Seguridad Industrial Básica" el 04/09/2026 desde la IP 192.168.1.1.',
      },
      {
        heading: 'Tipos de acciones registradas',
        body: 'El sistema registra tres tipos de acciones: CREATE (creación de un elemento nuevo, como un curso o un usuario), UPDATE (edición de un elemento existente, como cambiar el título de un curso o el cargo de un empleado) y DELETE (eliminación de un elemento). Cada acción tiene un color distinto en la tabla para que las identifiques rápidamente: verde para CREATE, amarillo para UPDATE y rojo para DELETE.',
        visual: 'action-types',
        example: 'Un administrador crea un curso (CREATE, verde), luego edita su descripción (UPDATE, amarillo), y finalmente lo elimina por error (DELETE, rojo). Los tres registros quedan en el log.',
      },
      {
        heading: '¿Para qué sirve?',
        body: 'El registro de auditoría permite mantener trazabilidad de todos los cambios en el sistema, cumplir con requisitos de compliance, investigar incidentes y verificar que los cambios fueron autorizados. Si algo sale mal (un curso fue eliminado, un usuario fue desactivado, una asignación fue modificada), el log te dice quién lo hizo, cuándo y qué valores cambiaron. Es tu herramienta de investigación principal.',
        example: 'Descubres que un curso fue eliminado. Revisas el log de auditoría y ves que "Admin Sistema" hizo un DELETE el 05/09 a las 14:30. Hablas con esa persona y descubres que fue un error.',
      },
      {
        heading: 'Cómo leer el log',
        body: 'El log se muestra en orden cronológico inverso (lo más reciente primero). Cada fila muestra el usuario, la acción, la entidad afectada y la fecha. Si necesitas más detalle, puedes expandir la fila para ver los valores anteriores y nuevos. Usa los filtros para buscar por tipo de acción, tipo de entidad, usuario o rango de fechas. Si buscas un cambio específico, filtra por fecha y por el tipo de entidad que crees que fue afectado.',
        example: 'Alguien cambió el cargo de un empleado sin avisar. Filtras el log por entidad "Perfil" o "Usuario" en la fecha del cambio y ves que el administrador X hizo un UPDATE al cargo del empleado Y.',
      },
      {
        heading: 'Retención del log',
        body: 'El log de auditoría se conserva indefinidamente. No hay un límite de tiempo: cada acción queda registrada para siempre. Esto es importante para auditorías externas o investigaciones que pueden surgir meses o años después. Si el log crece mucho, no te preocupes: el sistema está diseñado para manejar grandes volúmenes de registros sin afectar el rendimiento.',
        example: 'Seis meses después, una auditoría externa pide ver quién creó los cursos de seguridad. Buscas en el log por entidad "Curso" y fecha de creación, y obtienes la lista completa.',
      },
    ],
  },
  {
    id: 'documentation',
    title: 'Documentación',
    icon: 'FileText',
    summary: 'Esta página. Guía detallada de cada módulo y proceso del sistema con ejemplos.',
    sections: [
      {
        heading: 'Cómo usar esta documentación',
        body: 'Navega por las secciones usando el menú lateral izquierdo. Cada sección explica en detalle qué hace el módulo, cómo usarlo y incluye ejemplos prácticos. Si necesitas ayuda rápida dentro de cualquier módulo, busca el botón redondo con signo de interrogación (?) en la esquina superior derecha del título de la página.',
      },
      {
        heading: 'Botones de ayuda contextual',
        body: 'En cada módulo del panel de administración encontrarás un pequeño botón redondo con un signo de interrogación junto al título. Al pasar el cursor por encima, muestra una breve descripción del módulo. Al hacer clic, te lleva directamente a la sección de documentación correspondiente.',
      },
    ],
  },
];

export const docSectionsEN: DocSection[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: 'LayoutDashboard',
    summary: 'System overview with key statistics, quick access and recent activity.',
    sections: [
      {
        heading: 'What does the Dashboard show?',
        body: 'The Dashboard is the home screen of the admin panel. It is your control center: when you log in you see at a glance how the entire organization is doing in terms of training. It is divided into three main areas: (1) statistics cards at the top with the most important totals, (2) quick access to each module in the center, and (3) two side panels with a summary of recent courses and recent feedback. Everything is calculated in real time from the database, so the numbers you see always reflect the current state.',
      },
      {
        heading: 'Statistics cards',
        body: 'At the top of the Dashboard you will see 8 statistics cards. Each card has an icon, a large number and a label. They are: Total courses (number of courses created in the system), Total users (employees and admins registered), Total roles (positions defined), Total certificates (certificates issued), Average completion (global percentage of modules completed), Pass rate (percentage of exams passed), Total badges (badges created) and Total notifications (notifications sent). Data is calculated in real time from the database.',
        visual: 'stat-cards',
        example: 'If you just created a new course called "Pump Operation", when you return to the Dashboard you will see that the "Total courses" number increased by 1 automatically.',
      },
      {
        heading: 'How the pass rate is calculated',
        body: 'The "Pass rate" is calculated by dividing the number of passed exams by the total number of attempts, and multiplying by 100 to get the percentage. This indicator tells you how effective the training is: a very low rate may indicate that courses are too difficult or that questions are poorly written.',
        visual: 'pass-rate',
        example: 'If there are 10 registered exams and 8 are passed, the calculation is: 8 ÷ 10 × 100 = 80%. The card will show "80%".',
      },
      {
        heading: 'How average completion is calculated',
        body: 'The "Average completion" percentage represents how advanced the entire organization is in its assigned courses. It is calculated by averaging the progress percentage of each active assignment (excluding cancelled and exempted ones). Each assignment has a progress field that reflects how many modules of the course the employee has completed. This number gives you a general idea of the learning progress across the whole company.',
        visual: 'completion-bar',
        example: 'If across the organization there are 200 assigned modules and employees have completed 130, the calculation is: 130 ÷ 200 × 100 = 65%. The card will show "65%".',
      },
      {
        heading: 'Quick access',
        body: 'Below the statistics you will find a grid of large buttons to go directly to each module: Courses, Personnel, Certifications, Reports, Notifications and Settings. Each button shows the module icon and its name. Clicking any of them navigates you directly to that section without having to use the sidebar menu.',
        visual: 'quick-links',
        example: 'If you need to create a new user, instead of looking in the sidebar, you can click "Personnel" from the quick access and go directly to the personnel management module.',
      },
      {
        heading: 'Recent courses panel',
        body: 'In the lower left part of the Dashboard you will see a card titled "Courses" showing up to 4 recent courses. Each course is shown with its icon, its title, the number of modules it contains and how many roles have it assigned. Next to the title there is a "View all" button that takes you to the full course management module. If no courses exist, you will see the message "No courses created".',
        visual: 'course-list',
        example: 'You see "Basic Industrial Safety" with "5 modules · 3 assigned roles". This tells you at a glance that it is a course with content and is already assigned to three different roles.',
      },
      {
        heading: 'Recent feedback panel',
        body: 'In the lower right part of the Dashboard you will see a card titled "Feedback" showing up to 5 recent comments from employees about completed courses. Each entry shows the employee initials, their name, the course they rated and a star rating (1 to 5). Next to the title there is a "View all" button that takes you to the full feedback module. If there is no feedback, you will see the message "No feedback recorded".',
        visual: 'feedback-list',
        example: 'You see that "John Smith" rated "Preventive Maintenance" with 4 stars (★★★★). This indicates the course seemed good to them but with room for improvement.',
      },
      {
        heading: 'Using the Dashboard day to day',
        body: 'The Dashboard is your starting point every time you enter the system. We recommend reviewing it at the start of each session to detect situations that require action: (1) If the pass rate dropped, check if an exam question is poorly written or if a course is too difficult. (2) If average completion is low, consider sending reminder notifications to employees. (3) If there is feedback with few stars, read the comments in the Feedback module to identify improvements. (4) Use the quick access buttons to go directly to the module where you need to work.',
        example: 'Monday morning: you enter the Dashboard and see that completion dropped from 70% to 55%. You click "Notifications" from the quick access and send a reminder to employees with pending courses.',
      },
    ],
  },
  {
    id: 'personnel',
    title: 'Personnel Management',
    icon: 'Users',
    summary: 'Manage employees, admins, departments, roles, role history and requirements by role.',
    sections: [
      {
        heading: 'Employees tab',
        body: 'Here you view and manage all employees in the system. You can create new users with name, email, password, role and department. You can also edit their data, change their role (which generates a history entry), activate or deactivate them, and delete them.',
        example: 'To create an employee: click "New user", fill in the form with name, email and password, select their role and department, and save. The employee can sign in immediately.',
      },
      {
        heading: 'Admins tab',
        body: 'Admins have full access to the admin panel. You can create new admins with the same fields as an employee, but assigning them the administrator role.',
      },
      {
        heading: 'Departments tab',
        body: 'Departments group roles and people. Each department has a name, a code and a description. You can create, edit and delete departments.',
        example: 'Department "Operations" with code "OPS" groups roles related to maintenance and production.',
      },
      {
        heading: 'Roles tab',
        body: 'Roles define which courses each employee must complete. Each role has a name and description. When you assign courses to a role, all employees with that role automatically receive the assignments.',
        example: 'The role "Maintenance Technician" has assigned courses on Industrial Safety, Preventive Maintenance and Emergencies.',
      },
      {
        heading: 'History tab',
        body: 'Shows the role change history for each employee: start date, end date, previous role and reason for the change. This allows tracing each person\'s trajectory in the organization.',
      },
      {
        heading: 'Requirements by role tab',
        body: 'Shows which courses are assigned to each role and lets you manage those assignments: add courses, remove them, define priority, mandatory status and completion deadline days.',
      },
    ],
  },
  {
    id: 'courses',
    title: 'Course Management',
    icon: 'BookOpen',
    summary: 'Create and edit courses with modules, resources, exam questions, role assignments and prerequisites.',
    sections: [
      {
        heading: 'Creating a course',
        body: 'Click "New course" to open the editor. Fill in the title, description, category, duration, image URL, icon and accent color. The course is saved and then you can add content in the editor tabs.',
        example: 'Course "Basic Industrial Safety", category "Safety", duration "2 hours", icon "shield", accent color "blue".',
      },
      {
        heading: 'Modules tab (with resources)',
        body: 'Each course can have multiple modules in sequential order. Available module types are: text (reading), image/infographic, video (YouTube, Vimeo or uploaded file), PDF and PowerPoint presentation. Each module has a title, duration and content. Resources (downloadable files like PDFs, presentations or links) are added directly inside each module they belong to, they no longer exist as a separate tab. Modules unlock sequentially: the employee must complete one to access the next.',
        example: 'A course can have: 1) Text module "Introduction" with an attached PDF "Quick guide", 2) Video module "Demo" with a downloadable PowerPoint presentation, 3) PDF module "Procedures manual".',
      },
      {
        heading: 'Exams tab',
        body: 'Create multiple-choice questions to assess knowledge. Each question has a statement, options (one per line), the correct answer index, an explanation, difficulty level and points. Questions can be associated with the whole course or a specific module.',
      },
      {
        heading: 'How does the correct answer index work?',
        body: 'The "Correct answer index" indicates which of the options you wrote is the correct one. Counting starts at 0, not 1. This means the first option you wrote is number 0, the second is number 1, the third is number 2, and so on. It is important to remember this because it is easy to confuse and put 1 thinking "the first option", when the first option is actually 0.',
        example: 'You write these 3 options (one per line):\n1) Personal Protective Equipment\n2) Pest Prevention Equipment\n3) Pressure Test Equipment\n\nThe correct answer is "Personal Protective Equipment". Since it is the first option, its index is 0. If the correct one were "Pest Prevention Equipment" (the second), the index would be 1. If it were the third, the index would be 2.',
      },
      {
        heading: 'Assignments tab',
        body: 'Assign the course to one or more roles. Define whether it is mandatory, the priority (low, medium, high, critical) and the deadline days for completion. All employees with that role will receive the assignment automatically.',
        example: 'Assign "Industrial Safety" to the role "Maintenance Technician" as mandatory, high priority, 30 days deadline.',
      },
      {
        heading: 'Prerequisites tab',
        body: 'Define which courses must be completed before accessing this one. Prerequisites can be mandatory (the course does not unlock until they are completed) or optional.',
      },
    ],
  },
  {
    id: 'certifications',
    title: 'Certifications',
    icon: 'Award',
    summary: 'View certificates issued for course completion and role certifications of employees.',
    sections: [
      {
        heading: 'Course certificates',
        body: 'When an employee completes a course and passes the final exam with at least 90%, a certificate is automatically generated with a unique number, issue date and expiry date. Here you can see all issued certificates, who they belong to and which course they completed.',
        example: 'Certificate TRIADE-SEG101-2026-001 issued to "Test Employee" for completing "Basic Industrial Safety".',
      },
      {
        heading: 'Role certifications',
        body: 'A role certification validates that an employee has completed all required courses for their position. It shows the certification date, expiry date and whether it is valid or expired.',
      },
    ],
  },
  {
    id: 'feedback',
    title: 'Feedback',
    icon: 'Star',
    summary: 'Review the ratings and comments employees leave about completed courses.',
    sections: [
      {
        heading: 'What is Feedback?',
        body: 'After completing a course, employees can leave a 1 to 5 star rating, a written comment, whether they would recommend the course, whether the time was adequate and the perceived difficulty level. All this information is centralized here.',
        example: 'An employee rates "Preventive Maintenance" with 4 stars, comments "Very useful", marks that they would recommend it and that the difficulty was medium.',
      },
      {
        heading: 'How to use this information',
        body: 'Feedback lets you identify courses that need improvement (low ratings), courses that are too difficult (high difficulty) or time issues (inadequate time). The average rating is shown at the top.',
      },
    ],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: 'Bell',
    summary: 'Send notifications to employees: course reminders, expiry notices, achievement congratulations.',
    sections: [
      {
        heading: 'Creating a notification',
        body: 'You can create manual notifications to send to any employee. Define the type (information, warning, success, error, reminder), the title, the message and the recipient. The notification appears in the employee panel.',
        example: 'Notification type "reminder" with title "Pending course" and message "You have 15 days to complete the Emergencies course".',
      },
      {
        heading: 'Automatic notifications',
        body: 'The system generates notifications automatically when an employee completes a course, earns a certificate, or when a course is about to expire. These notifications do not need to be created manually.',
      },
    ],
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: 'BarChart3',
    summary: 'Detailed statistics: compliance by role, individual progress, exam results and feedback.',
    sections: [
      {
        heading: 'Compliance by role report',
        body: 'Shows what percentage of employees in each role have completed their assigned courses. Useful for identifying roles with low compliance and taking action.',
        example: 'Role "Maintenance Technician": 1 of 3 courses completed on average, 33% compliance.',
      },
      {
        heading: 'Individual progress report',
        body: 'Shows the progress of each employee: how many modules they have completed, which courses they are working on, their progress percentage and exams taken.',
      },
      {
        heading: 'Exam report',
        body: 'Statistics for all exams: total attempts, pass rate, average score, passed vs failed exams.',
      },
      {
        heading: 'Export',
        body: 'Reports can be exported in Excel, PDF or CSV format to share or archive.',
      },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'Settings',
    summary: 'General system settings: branding, evaluation parameters, automatic notifications and security.',
    sections: [
      {
        heading: 'General settings',
        body: 'Global system parameters such as the organization name, the exam pass threshold (default 90%), and other values that affect the entire system.',
      },
      {
        heading: 'Branding',
        body: 'Customize the system appearance: logos, colors and other visual elements shown to employees.',
      },
      {
        heading: 'Security',
        body: 'Configure password policies, session expiration and other system security aspects.',
      },
    ],
  },
  {
    id: 'audit',
    title: 'Audit',
    icon: 'History',
    summary: 'Log of all actions performed in the system: who did what, when and what changes occurred.',
    sections: [
      {
        heading: 'What is logged?',
        body: 'Every time an admin creates, edits or deletes an item (course, user, role, assignment, badge, etc.), an audit log entry is generated that includes: the user who performed the action, the action type (CREATE, UPDATE, DELETE), the affected entity type, the old and new values, the date and time, and the IP address.',
        example: 'Entry: User "System Administrator" created the course "Basic Industrial Safety" on 09/04/2026 from IP 192.168.1.1.',
      },
      {
        heading: 'What is it for?',
        body: 'The audit log maintains traceability of all system changes, meets compliance requirements, investigates incidents and verifies that changes were authorized.',
      },
    ],
  },
  {
    id: 'documentation',
    title: 'Documentation',
    icon: 'FileText',
    summary: 'This page. Detailed guide to each module and system process with examples.',
    sections: [
      {
        heading: 'How to use this documentation',
        body: 'Navigate the sections using the left sidebar menu. Each section explains in detail what the module does, how to use it and includes practical examples. If you need quick help within any module, look for the round button with a question mark (?) in the upper right corner of the page title.',
      },
      {
        heading: 'Contextual help buttons',
        body: 'In each module of the admin panel you will find a small round button with a question mark next to the title. Hovering over it shows a brief description of the module. Clicking it takes you directly to the corresponding documentation section.',
      },
    ],
  },
];

export const docSectionsByLanguage: Record<Language, DocSection[]> = {
  ES: docSections,
  EN: docSectionsEN,
};

export const docSummaryMapByLanguage: Record<Language, Record<string, string>> = {
  ES: Object.fromEntries(docSections.map((s) => [s.id, s.summary])),
  EN: Object.fromEntries(docSectionsEN.map((s) => [s.id, s.summary])),
};

export const docSummaryMap: Record<string, string> = docSummaryMapByLanguage.ES;

export type DocsLabels = {
  eyebrow: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  example: string;
  noResults: string;
  help: string;
  viewFull: string;
};

export const docsLabels: Record<Language, DocsLabels> = {
  ES: {
    eyebrow: 'CENTRO DE AYUDA',
    title: 'Documentación',
    subtitle: 'Guía detallada de cada módulo y proceso del sistema.',
    searchPlaceholder: 'Buscar en documentación...',
    example: 'Ejemplo:',
    noResults: 'No se encontraron resultados.',
    help: 'Ayuda',
    viewFull: 'Ver documentación completa',
  },
  EN: {
    eyebrow: 'HELP CENTER',
    title: 'Documentation',
    subtitle: 'A detailed guide to each module and process in the system.',
    searchPlaceholder: 'Search documentation...',
    example: 'Example:',
    noResults: 'No results found.',
    help: 'Help',
    viewFull: 'View full documentation',
  },
};

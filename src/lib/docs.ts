export type DocSection = {
  id: string;
  title: string;
  icon: string;
  summary: string;
  sections: { heading: string; body: string; example?: string }[];
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
        body: 'El Dashboard es la pantalla de inicio del panel de administración. Muestra tarjetas de estadísticas con los totales de cursos, usuarios, cargos, certificados, insignias, notificaciones, la tasa de aprobación de exámenes y el porcentaje de completación promedio. También incluye accesos rápidos a cada módulo y una vista de actividad reciente.',
      },
      {
        heading: 'Tarjetas de estadísticas',
        body: 'Cada tarjeta muestra un número y una etiqueta. Los datos se calculan en tiempo real desde la base de datos. Por ejemplo, la "Tasa de aprobación" se calcula dividiendo los exámenes aprobados entre el total de intentos.',
        example: 'Si hay 10 exámenes registrados y 8 están aprobados, la tasa mostrada será 80%.',
      },
      {
        heading: 'Accesos rápidos',
        body: 'Debajo de las estadísticas encontrarás botones para ir directamente a cada módulo: Cursos, Personal, Certificaciones, Reportes, Notificaciones y Configuración.',
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
        body: 'Aquí ves y gestionas todos los empleados del sistema. Puedes crear nuevos usuarios con nombre, correo, contraseña, cargo y departamento. También puedes editar sus datos, cambiar su cargo (lo que genera un registro en el historial), activarlos o desactivarlos, y eliminarlos.',
        example: 'Para crear un empleado: haz clic en "Nuevo usuario", completa el formulario con nombre, correo y contraseña, selecciona su cargo y departamento, y guarda. El empleado podrá iniciar sesión inmediatamente.',
      },
      {
        heading: 'Pestaña Administradores',
        body: 'Los administradores tienen acceso completo al panel de administración. Puedes crear nuevos administradores con los mismos campos que un empleado, pero asignándoles el rol de administrador.',
      },
      {
        heading: 'Pestaña Departamentos',
        body: 'Los departamentos agrupan cargos y personas. Cada departamento tiene un nombre, un código y una descripción. Puedes crear, editar y eliminar departamentos.',
        example: 'Departamento "Operaciones" con código "OPS" agrupa los cargos relacionados con mantenimiento y producción.',
      },
      {
        heading: 'Pestaña Cargos',
        body: 'Los cargos definen qué cursos debe completar cada empleado. Cada cargo tiene nombre y descripción. Al asignar cursos a un cargo, todos los empleados con ese cargo recibieron automáticamente las asignaciones.',
        example: 'El cargo "Técnico de Mantenimiento" tiene asignados los cursos de Seguridad Industrial, Mantenimiento Preventivo y Emergencias.',
      },
      {
        heading: 'Pestaña Historial',
        body: 'Muestra el historial de cambios de cargo de cada empleado: fecha de inicio, fecha de fin, cargo anterior y razón del cambio. Esto permite trazar la trayectoria de cada persona en la organización.',
      },
      {
        heading: 'Pestaña Requisitos por cargo',
        body: 'Muestra qué cursos están asignados a cada cargo y permite gestionar esas asignaciones: agregar cursos, quitarlos, definir prioridad, obligatoriedad y días límite de completación.',
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
        body: 'Haz clic en "Nuevo curso" para abrir el editor. Completa el título, descripción, categoría, duración, URL de imagen, ícono y color de acento. El curso se guarda y luego puedes agregarle contenido en las pestañas del editor.',
        example: 'Curso "Seguridad Industrial Básica", categoría "Seguridad", duración "2 horas", ícono "shield", color de acento "blue".',
      },
      {
        heading: 'Pestaña Módulos (con recursos)',
        body: 'Cada curso puede tener múltiples módulos en orden secuencial. Los tipos de módulo disponibles son: texto (lectura), imagen/infografía, video (YouTube, Vimeo o archivo subido), PDF y presentación PowerPoint. Cada módulo tiene título, duración y contenido. Los recursos (archivos descargables como PDFs, presentaciones o enlaces) se agregan directamente dentro de cada módulo al que pertenecen, ya no existen como una pestaña separada. Los módulos se desbloquean secuencialmente: el empleado debe completar uno para acceder al siguiente.',
        example: 'Un curso puede tener: 1) Módulo de texto "Introducción" con un PDF adjunto "Guía rápida", 2) Módulo de video "Demostración" con una presentación PowerPoint descargable, 3) Módulo PDF "Manual de procedimientos".',
      },
      {
        heading: 'Pestaña Exámenes',
        body: 'Crea preguntas de selección múltiple para evaluar el conocimiento. Cada pregunta tiene un enunciado, opciones (una por línea), el índice de la respuesta correcta, una explicación, nivel de dificultad y puntos. Las preguntas pueden estar asociadas al curso completo o a un módulo específico.',
      },
      {
        heading: '¿Cómo funciona el índice de la respuesta correcta?',
        body: 'El "Índice de respuesta correcta" indica cuál de las opciones que escribiste es la correcta. El conteo empieza en 0, no en 1. Esto significa que la primera opción que escribiste es la número 0, la segunda es la número 1, la tercera es la número 2, y así sucesivamente. Es importante recordar esto porque es fácil confundirse y poner 1 pensando en "la primera opción", cuando en realidad la primera opción es 0.',
        example: 'Escribes estas 3 opciones (una por línea):\n1) Equipo de Protección Personal\n2) Equipo de Prevención de Plagas\n3) Equipo de Prueba de Presión\n\nLa respuesta correcta es "Equipo de Protección Personal". Como es la primera opción, su índice es 0. Si la correcta fuera "Equipo de Prevención de Plagas" (la segunda), el índice sería 1. Si fuera la tercera, el índice sería 2.',
      },
      {
        heading: 'Pestaña Asignaciones',
        body: 'Asigna el curso a uno o varios cargos. Define si es obligatorio, la prioridad (baja, media, alta, crítica) y los días límite para completación. Todos los empleados con ese cargo recibirán la asignación automáticamente.',
        example: 'Asignar "Seguridad Industrial" al cargo "Técnico de Mantenimiento" como obligatorio, prioridad alta, 30 días de plazo.',
      },
      {
        heading: 'Pestaña Prerrequisitos',
        body: 'Define qué cursos deben completarse antes de poder acceder a este. Los prerrequisitos pueden ser obligatorios (el curso no se desbloquea hasta completarlos) u opcionales.',
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
        heading: 'Certificados de cursos',
        body: 'Cuando un empleado completa un curso y aprueba el examen final con al menos 90%, se genera automáticamente un certificado con un número único, fecha de emisión y fecha de vencimiento. Aquí puedes ver todos los certificados emitidos, a quién pertenecen y qué curso completaron.',
        example: 'Certificado TRIADE-SEG101-2026-001 emitido a "Empleado de Prueba" por completar "Seguridad Industrial Básica".',
      },
      {
        heading: 'Certificaciones de cargo',
        body: 'Una certificación de cargo valida que un empleado ha completado todos los cursos requeridos para su posición. Muestra la fecha de certificación, la fecha de vencimiento y si está vigente o expirada.',
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
        body: 'Después de completar un curso, los empleados pueden dejar una calificación de 1 a 5 estrellas, un comentario escrito, si recomendarían el curso, si el tiempo fue adecuado y el nivel de dificultad percibido. Toda esta información se centraliza aquí.',
        example: 'Un empleado califica "Mantenimiento Preventivo" con 4 estrellas, comenta "Muy útil", marca que lo recomendaría y que la dificultad fue media.',
      },
      {
        heading: 'Cómo usar esta información',
        body: 'El feedback te permite identificar cursos que necesitan mejoras (calificaciones bajas), cursos muy difíciles (dificultad alta) o problemas de tiempo (tiempo inadecuado). La calificación promedio se muestra en la parte superior.',
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
        heading: 'Crear una notificación',
        body: 'Puedes crear notificaciones manuales para enviar a cualquier empleado. Define el tipo (información, advertencia, éxito, error, recordatorio), el título, el mensaje y el destinatario. La notificación aparece en el panel del empleado.',
        example: 'Notificación tipo "recordatorio" con título "Curso pendiente" y mensaje "Tienes 15 días para completar el curso de Emergencias".',
      },
      {
        heading: 'Notificaciones automáticas',
        body: 'El sistema genera notificaciones automáticamente cuando un empleado completa un curso, obtiene un certificado, o cuando un curso está por vencer. Estas notificaciones no necesitan ser creadas manualmente.',
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
        body: 'Muestra qué porcentaje de empleados en cada cargo han completado los cursos asignados. Útil para identificar cargos con bajo cumplimiento y tomar acciones.',
        example: 'Cargo "Técnico de Mantenimiento": 1 de 3 cursos completados en promedio, 33% de cumplimiento.',
      },
      {
        heading: 'Reporte de progreso individual',
        body: 'Muestra el progreso de cada empleado: cuántos módulos ha completado, en qué cursos está trabajando, su porcentaje de avance y los exámenes rendidos.',
      },
      {
        heading: 'Reporte de exámenes',
        body: 'Estadísticas de todos los exámenes: total de intentos, tasa de aprobación, puntaje promedio, exámenes aprobados vs reprobados.',
      },
      {
        heading: 'Exportación',
        body: 'Los reportes pueden exportarse en formato Excel, PDF o CSV para compartir o archivar.',
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
        heading: 'Configuración general',
        body: 'Parámetros globales del sistema como el nombre de la organización, el umbral de aprobación de exámenes (por defecto 90%), y otros valores que afectan a todo el sistema.',
      },
      {
        heading: 'Branding',
        body: 'Personaliza la apariencia del sistema: logos, colores y otros elementos visuales que se muestran a los empleados.',
      },
      {
        heading: 'Seguridad',
        body: 'Configura políticas de contraseñas, expiración de sesiones y otros aspectos de seguridad del sistema.',
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
        body: 'Cada vez que un administrador crea, edita o elimina un elemento (curso, usuario, cargo, asignación, insignia, etc.), se genera un registro de auditoría que incluye: el usuario que realizó la acción, el tipo de acción (CREATE, UPDATE, DELETE), el tipo de entidad afectada, los valores anteriores y nuevos, la fecha y hora, y la dirección IP.',
        example: 'Registro: Usuario "Administrador del Sistema" creó el curso "Seguridad Industrial Básica" el 04/09/2026 desde la IP 192.168.1.1.',
      },
      {
        heading: '¿Para qué sirve?',
        body: 'El registro de auditoría permite mantener trazabilidad de todos los cambios en el sistema, cumplir con requisitos de compliance, investigar incidentes y verificar que los cambios fueron autorizados.',
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

export const docSummaryMap: Record<string, string> = Object.fromEntries(
  docSections.map((s) => [s.id, s.summary])
);

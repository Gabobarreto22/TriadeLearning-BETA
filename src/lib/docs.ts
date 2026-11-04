import type { Language } from '@/lib/copy';

export type DocVisual =
  | 'stat-cards'
  | 'quick-links'
  | 'course-list'
  | 'feedback-list'
  | 'pass-rate'
  | 'completion-bar';

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
        body: 'El porcentaje de "Completación promedio" representa qué tan avanzada está toda la organización en sus cursos. Se calcula dividiendo los módulos marcados como completados entre el total de módulos asignados a todos los empleados, y multiplicando por 100. Este número te da una idea general del progreso de aprendizaje de toda la empresa.',
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
        body: 'The "Average completion" percentage represents how advanced the entire organization is in its courses. It is calculated by dividing the modules marked as completed by the total modules assigned to all employees, and multiplying by 100. This number gives you a general idea of the learning progress across the whole company.',
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

import type { DocSection } from '@/lib/docs';

export const employeeDocSections: DocSection[] = [
  {
    id: 'inicio',
    title: 'Inicio',
    icon: 'LayoutDashboard',
    summary: 'Tu pantalla de bienvenida: resumen de tus cursos, tu progreso y lo que tienes pendiente.',
    sections: [
      {
        heading: '¿Qué muestra la pantalla de Inicio?',
        body: 'Es la primera pantalla que ves al entrar. Te saluda por tu nombre y muestra tarjetas con tus cursos asignados, tu progreso total, la cantidad de certificados que has obtenido y accesos rápidos al catálogo y al calendario.',
      },
      {
        heading: 'Tarjetas de resumen',
        body: '"Cursos asignados" es la cantidad de cursos que tu cargo requiere. "Progreso total" indica cuántos de esos cursos ya aprobaste. "Certificados" cuenta los cursos que ya tienen su certificado.',
        example: 'Si tu cargo tiene 4 cursos asignados y has aprobado la prueba de aprobación de 2 de ellos, verás 4 en "Cursos asignados" y el progreso de 2 de 4.',
      },
      {
        heading: 'Continúa aprendiendo',
        body: 'Muestra hasta 3 cursos que ya empezaste pero que todavía no terminaste. Haz clic en "Ver todos" para ir al catálogo completo.',
        example: 'Empezaste "Seguridad Industrial Básica" y completaste sus primeros 2 módulos. Aparecerá en esta lista hasta que apruebes su prueba de aprobación.',
      },
      {
        heading: 'Próximas fechas',
        body: 'Lista los cursos que tienen un plazo para completarse. Te sirve para priorizar qué terminar primero.',
      },
      {
        heading: 'Flujo recomendado para empezar',
        body: 'Sigue estos pasos: 1) Entra al Catálogo y elige un curso asignado. 2) Pulsa "Comenzar curso" y revisa los módulos. 3) Completa cada módulo en orden. 4) Aprueba los exámenes de módulo cuando existan. 5) Realiza la prueba de aprobación del curso con al menos 90%. 6) Consulta tu certificado en la sección Certificados.',
        example: 'Un lunes completas 3 módulos de "Mantenimiento Preventivo". El martes, desde "Continúa aprendiendo" en Inicio, vuelves a ese curso para seguir con el cuarto módulo.',
      },
    ],
  },
  {
    id: 'catalogo',
    title: 'Catálogo de cursos',
    icon: 'BookOpen',
    summary: 'Encuentra los cursos asignados a tu cargo, revisa su estado y entra a estudiarlos.',
    sections: [
      {
        heading: '¿Qué encuentro aquí?',
        body: 'Todos los cursos que tu administrador asignó a tu cargo. Cada tarjeta muestra el título, la duración, su estado y el porcentaje de avance con una barra de progreso.',
      },
      {
        heading: 'Estados de un curso',
        body: 'No iniciado: todavía no has abierto el curso. En progreso: ya completaste al menos un módulo pero no has aprobado la prueba de aprobación. Completado: aprobaste la prueba de aprobación del curso.',
      },
      {
        heading: 'Buscar y filtrar',
        body: 'Escribe en el buscador para encontrar un curso por su título. Usa los filtros Todos, En progreso, No iniciados o Completados para reducir la lista. Si hay muchos cursos, la lista se divide en páginas.',
        example: 'Quieres retomar un curso a medias: pulsa "En progreso" y verás solo los cursos que dejaste pendientes.',
      },
      {
        heading: 'Abrir un curso',
        body: 'Haz clic en la portada o en la flecha de la tarjeta para abrir el detalle del curso. Desde ahí puedes ver la lista de módulos, realizar la prueba directa o la prueba de aprobación, y comenzar o continuar el curso.',
      },
    ],
  },
  {
    id: 'curso',
    title: 'Estudiar un curso',
    icon: 'PlayCircle',
    summary: 'Cómo avanzar por los módulos de un curso: lecturas, videos, PDFs y presentaciones.',
    sections: [
      {
        heading: 'Detalle del curso',
        body: 'Al abrir un curso verás la lista de sus módulos con su tipo: Video, Infografía o Lectura. El botón principal dice "Comenzar curso" si es la primera vez, o "Continuar curso" si ya avanzaste.',
      },
      {
        heading: 'Reproductor y barra de módulos',
        body: 'Dentro del curso, la barra lateral "Módulos" muestra cuántos módulos llevas completados (por ejemplo, "2 / 5 módulos completados"). Puedes moverte entre los módulos con los botones "Anterior" y "Siguiente".',
      },
      {
        heading: 'Desbloqueo en orden',
        body: 'Los módulos se habilitan uno a uno. Solo puedes avanzar hasta el primer módulo que aún no has completado. Los siguientes aparecen bloqueados hasta que termines el anterior.',
        example: 'Un curso tiene 4 módulos. Completaste el 1 y el 2. Puedes abrir el 3, pero el 4 seguirá bloqueado hasta que completes el 3.',
      },
      {
        heading: 'Cómo se completa cada tipo de módulo',
        body: 'Lectura e Infografía: el módulo se marca como completado al pulsar "Siguiente". Video, PDF y presentación PowerPoint: el botón "Siguiente" se habilita solo cuando llegas al final del video o a la última página o diapositiva.',
        example: 'En un PDF de 6 páginas, avanza con "Siguiente" hasta la página 6. Al llegar ahí se habilita el paso al siguiente módulo.',
      },
      {
        heading: 'Examen del módulo',
        body: 'Si un módulo tiene preguntas, aparece el botón "Examen del módulo". Debes aprobarlo para poder avanzar al siguiente módulo. Aparecerá el aviso "Debes aprobar el examen del módulo para avanzar" si intentas seguir sin aprobarlo.',
      },
      {
        heading: 'Salir del curso',
        body: 'Usa "Salir del curso" para volver al catálogo. Tu avance se conserva: los módulos que ya completaste siguen marcados la próxima vez que entres.',
      },
    ],
  },
  {
    id: 'examenes',
    title: 'Exámenes y pruebas',
    icon: 'ClipboardCheck',
    summary: 'Tipos de evaluación, la regla del 90% y cómo responder y reintentar.',
    sections: [
      {
        heading: 'Tipos de evaluación',
        body: 'Prueba directa: puedes presentarla sin estudiar el curso, para demostrar que ya conoces el contenido. Examen del módulo: se encuentra dentro de un módulo y debes aprobarlo para avanzar. Prueba de aprobación: es la evaluación final del curso; se habilita al completar todos los módulos.',
      },
      {
        heading: 'Regla de aprobación: 90%',
        body: 'Para aprobar necesitas al menos 90% de respuestas correctas. Si no llegas, el resultado indica que puedes volver a intentarlo.',
        example: 'El examen tiene 10 preguntas. Si respondes 9 correctamente, obtienes 90% y apruebas. Con 8 correctas (80%) no apruebas y puedes reintentar.',
      },
      {
        heading: 'Cómo responder cada pregunta',
        body: 'Selecciona una opción (A, B, C...). Al pulsar "Siguiente", el sistema muestra si tu respuesta es correcta o incorrecta y la bloquea. Pulsa "Siguiente" de nuevo para pasar a la pregunta siguiente. En la última pregunta, el botón dice "Finalizar y ver resultado" y exige que todas estén respondidas.',
      },
      {
        heading: 'Panel de preguntas',
        body: 'En el costado verás la lista de preguntas con un indicador de estado para cada una, y el recordatorio "Mínimo para aprobar: 90%". Así sabes cuántas te faltan por responder.',
      },
      {
        heading: 'Resultado y desglose',
        body: 'Al terminar verás si aprobaste. Debajo aparece el "Desglose de preguntas": cada pregunta marcada como Correcta o Incorrecta, tu respuesta y la respuesta correcta cuando fallaste. Si no respondiste alguna, aparece como "Sin responder".',
      },
      {
        heading: 'Reintentar',
        body: 'Si no apruebas, pulsa "Reintentar". Las respuestas se reinician y puedes volver a presentarlo tantas veces como necesites.',
      },
      {
        heading: 'Prueba directa reprobada',
        body: 'Si reprobaste la prueba directa, esa opción queda bloqueada y el sistema te indica "Has reprobado la prueba directa". En ese caso pulsa "Ir al curso" y completa los módulos.',
      },
    ],
  },
  {
    id: 'calendario',
    title: 'Calendario',
    icon: 'CalendarDays',
    summary: 'Vista mensual de tus cursos y plazos para planificar tu formación.',
    sections: [
      {
        heading: '¿Para qué sirve?',
        body: 'Te muestra tus cursos y evaluaciones programados en un calendario mensual. Úsalo para ver de un vistazo qué tienes pendiente y cuándo vence.',
      },
      {
        heading: 'Navegar por los meses',
        body: 'Usa las flechas junto al nombre del mes para ver el mes anterior o el siguiente. Los cursos con plazo aparecen marcados en el calendario.',
      },
      {
        heading: 'Cursos próximos',
        body: 'El panel lateral lista hasta 5 cursos, ordenados por plazo. Haz clic en uno para abrir su detalle y continuar estudiando.',
        example: 'Ves "Emergencias" primero en la lista porque vence antes que "Mantenimiento Preventivo". Haces clic en él, revisas el detalle y pulsas "Continuar curso".',
      },
    ],
  },
  {
    id: 'certificados',
    title: 'Certificados',
    icon: 'Award',
    summary: 'Certificados de los cursos que aprobaste, listos para consultar.',
    sections: [
      {
        heading: '¿Cuándo obtengo un certificado?',
        body: 'Cada vez que apruebas la prueba de aprobación de un curso, aparece su certificado en la sección "Mis certificados". Solo se genera para cursos aprobados.',
        example: 'Aprobaste "Seguridad Industrial Básica" con 92%. Ahora aparece su tarjeta con el título "Certificado de finalización".',
      },
      {
        heading: 'Ver un certificado',
        body: 'Pulsa "Ver certificado" en la tarjeta para abrir la vista previa, donde aparecen tu nombre como destinatario y el curso completado.',
      },
      {
        heading: 'Resumen de certificaciones',
        body: 'En la parte superior ves cuántas certificaciones has obtenido. Si todavía no tienes ninguna, la lista te lo indicará.',
      },
    ],
  },
  {
    id: 'notificaciones',
    title: 'Notificaciones',
    icon: 'Bell',
    summary: 'Avisos del sistema y de tu administrador: recordatorios, logros y novedades.',
    sections: [
      {
        heading: '¿Qué recibo aquí?',
        body: 'Mensajes de tu administrador (recordatorios, avisos de cursos por vencer, felicitaciones) y avisos automáticos del sistema, por ejemplo cuando completas un curso o obtienes un certificado.',
        example: 'Recibes "Curso pendiente: tienes 15 días para completar el curso de Emergencias".',
      },
      {
        heading: 'Leer y marcar',
        body: 'Las notificaciones sin leer aparecen con el contador "X sin leer". Haz clic en una para marcarla como leída. Si quieres limpiar todo de una vez, pulsa "Marcar todas como leídas".',
      },
    ],
  },
  {
    id: 'gamificacion',
    title: 'Gamificación',
    icon: 'Trophy',
    summary: 'Tus insignias, puntos y avances en un solo lugar.',
    sections: [
      {
        heading: 'Resumen de logros',
        body: 'Muestra cuatro indicadores: insignias obtenidas, puntos totales (la suma de los puntos de tus insignias), cursos completados y cursos en progreso.',
      },
      {
        heading: 'Insignias obtenidas y próximas',
        body: '"Insignias obtenidas" muestra las que ya ganaste. "Próximas insignias" muestra las que están bloqueadas, con un candado y los puntos que valen. Las insignias que aún no ganas aparecen en esa lista.',
        example: 'Tienes la insignia "Primer curso" y ves bloqueada "Experto en seguridad" con 50 puntos. Al completar más cursos, la insignia bloqueada se desbloqueará.',
      },
    ],
  },
  {
    id: 'perfil',
    title: 'Mi perfil',
    icon: 'User',
    summary: 'Tus datos personales, tu foto, tu historial de cargos y tu contraseña.',
    sections: [
      {
        heading: 'Información personal',
        body: 'Pulsa "Editar perfil" para cambiar tu nombre completo, tu correo, cédula, teléfono o dirección. Luego pulsa "Guardar perfil". Verás el aviso "Perfil actualizado correctamente".',
      },
      {
        heading: 'Foto de perfil',
        body: 'Puedes subir una imagen desde tu equipo o tomarla con la cámara. También puedes quitarla si no la quieres usar.',
      },
      {
        heading: 'Datos de solo lectura',
        body: 'Tu cargo, tu fecha de ingreso y la fecha desde la que estás en tu cargo actual los administra la empresa. Si algo está mal, pídelo a tu administrador.',
      },
      {
        heading: 'Cambiar contraseña',
        body: 'Escribe la nueva contraseña, confírmala y pulsa "Actualizar contraseña". Debe tener al menos 6 caracteres y ambos campos deben coincidir.',
        example: 'Escribes "Trabajo2026" en ambos campos y pulsas "Actualizar contraseña". Si uno de los campos no coincide, verás "Las contraseñas no coinciden".',
      },
      {
        heading: 'Historial de cargos',
        body: 'Muestra los cargos que has tenido: fecha de inicio, fecha de fin, el motivo del cambio y cuál es tu cargo actual.',
      },
    ],
  },
  {
    id: 'calificar',
    title: 'Calificar un curso',
    icon: 'Star',
    summary: 'Tu opinión sobre los cursos que completaste, para mejorar la formación.',
    sections: [
      {
        heading: '¿Cuándo aparece?',
        body: 'Después de aprobar la prueba de aprobación de un curso se abre el formulario "Calificar curso". Tu opinión ayuda a tu administrador a mejorar los cursos.',
      },
      {
        heading: 'Qué puedes responder',
        body: 'Una calificación de 1 a 5 estrellas (obligatoria). Si recomendarías el curso: Sí o No. El nivel de dificultad: Muy fácil, Fácil, Medio, Difícil o Muy difícil. Y un comentario opcional.',
        example: 'Calificas "Mantenimiento Preventivo" con 4 estrellas, marcas "Sí" en recomendar, eliges dificultad "Medio" y escribes "Muy útil para el día a día". Pulsa "Enviar calificación".',
      },
    ],
  },
  {
    id: 'documentacion',
    title: 'Documentación',
    icon: 'FileText',
    summary: 'Esta guía. Explica cada parte del sistema con ejemplos.',
    sections: [
      {
        heading: 'Cómo usar esta guía',
        body: 'Elige un tema en el menú lateral izquierdo. Puedes escribir una palabra en el buscador para encontrar la sección que necesitas, por ejemplo "examen" o "contraseña".',
      },
    ],
  },
];

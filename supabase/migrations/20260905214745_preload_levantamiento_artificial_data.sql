/*
# Precarga masiva de datos — TRIADE Learning (Levantamiento Artificial Petrolero)

## Resumen
Precarga datos completos para el sistema de capacitación de una empresa de servicios 
de levantamiento artificial petrolero. Incluye: departamentos, cargos, cursos, módulos,
preguntas de examen, recursos descargables, prerrequisitos, asignaciones, insignias,
notificaciones, configuraciones del sistema y registros de auditoría.

## Cambios
1. Actualización de cursos existentes con iconos/accentos válidos
2. 5 nuevos departamentos
3. 8 nuevos cargos
4. 10 nuevos cursos sobre levantamiento artificial
5. ~50 módulos (texto, video, imagen, PDF, infografía)
6. ~33 preguntas de examen
7. 10 recursos descargables
8. 10 prerrequisitos entre cursos
9. ~38 asignaciones de cursos a cargos
10. 8 nuevas insignias
11. 5 notificaciones
12. 10 configuraciones del sistema
13. 8 registros de auditoría

## Seguridad
- No se crean usuarios (requieren auth.users)
- Se mantienen los datos existentes
- Iconos del conjunto: Award, BarChart3, BookOpen, CircleHelp, Settings, ShieldCheck, Users
- Acentos del rango: gray-1 a gray-6
*/

-- ============================================================
-- 1. ACTUALIZAR CURSOS EXISTENTES
-- ============================================================
UPDATE courses SET icon_name = 'ShieldCheck', accent = 'gray-1' WHERE id = '3a360aa0-8998-465e-b6a8-1d4ea579bc40';
UPDATE courses SET icon_name = 'Settings', accent = 'gray-2' WHERE id = '44800aa8-267e-4994-a45f-7d9ffcc339b2';
UPDATE courses SET icon_name = 'ShieldCheck', accent = 'gray-3' WHERE id = 'f72d1485-a87f-4679-ae80-38527134f92a';

-- ============================================================
-- 2. NUEVOS DEPARTAMENTOS
-- ============================================================
INSERT INTO departments (name, code, description, is_active) VALUES
  ('Ingeniería de Levantamiento', 'ING', 'Departamento de ingeniería especializada en sistemas de levantamiento artificial', true),
  ('HSE (Salud, Seguridad y Medio Ambiente)', 'HSE', 'Departamento de salud ocupacional, seguridad industrial y gestión ambiental', true),
  ('Mantenimiento de Superficie', 'MTS', 'Departamento de mantenimiento de equipos de superficie', true),
  ('Operaciones de Campo', 'OCP', 'Personal operativo en locaciones de producción', true),
  ('Calidad y Certificación', 'CYC', 'Gestión de calidad y certificaciones técnicas', true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- 3. NUEVOS CARGOS
-- ============================================================
INSERT INTO job_roles (name, code, description, department_id, salary_grade, is_active)
SELECT v.name, v.code, v.description, d.id, v.salary_grade, true
FROM (VALUES
  ('Operador de Bomba de Cavidad Progresiva (PCP)', 'OP-PCP', 'Operador especializado en sistemas PCP', 'OCP', 'O3'),
  ('Técnico de Instalación BES', 'TI-BES', 'Técnico de instalación y mantenimiento de Bombas Electrosumergibles', 'MTS', 'T2'),
  ('Ingeniero de Levantamiento Artificial', 'ILA', 'Ingeniero especializado en diseño y optimización de sistemas de levantamiento artificial', 'ING', 'I4'),
  ('Supervisor HSE', 'SUP-HSE', 'Supervisor de salud, seguridad y medio ambiente', 'HSE', 'S2'),
  ('Técnico de Mantenimiento de Superficie', 'TMS', 'Técnico de mantenimiento de equipos de superficie: tableros, transformadores, VSD', 'MTS', 'T3'),
  ('Operador de BCS (Bombeo de Cavidad Sintética)', 'OP-BCS', 'Operador de sistemas BCS', 'OCP', 'O2'),
  ('Especialista en Gas Lift', 'ESP-GL', 'Especialista en sistemas de levantamiento por gas (Gas Lift)', 'ING', 'E1'),
  ('Inspector de Calidad', 'INS-CAL', 'Inspector de calidad y certificación de procedimientos', 'CYC', 'Q2')
) AS v(name, code, description, dept_code, salary_grade)
JOIN departments d ON d.code = v.dept_code
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- 4. NUEVOS CURSOS
-- ============================================================
INSERT INTO courses (title, code, description, category, duration, estimated_hours, accent, icon_name, is_active, is_mandatory_anywhere, created_by)
SELECT v.title, v.code, v.description, v.category, v.duration, v.estimated_hours, v.accent, v.icon_name, true, v.mandatory, 'dd350086-2372-4c30-b0ad-96142113bd19'
FROM (VALUES
  ('Fundamentos del Levantamiento Artificial', 'LA-101', 'Introducción a los sistemas de levantamiento artificial en la industria petrolera. Cubre los principios básicos, tipos de sistemas y criterios de selección.', 'Levantamiento Artificial', '4 horas', 4, 'gray-1', 'BookOpen', true),
  ('Bombas Electrosumergibles (BES)', 'LA-201', 'Curso completo sobre sistemas BES: principios de operación, componentes, instalación, diagnóstico y mantenimiento.', 'Levantamiento Artificial', '6 horas', 6, 'gray-2', 'Settings', true),
  ('Bombeo de Cavidad Progresiva (PCP)', 'LA-202', 'Sistemas PCP: principios, componentes, instalación, operación y mantenimiento de bombas de cavidad progresiva.', 'Levantamiento Artificial', '5 horas', 5, 'gray-3', 'Settings', true),
  ('Bombeo de Cavidad Sintética (BCS)', 'LA-203', 'Sistemas BCS: tecnología, instalación, operación y comparación con PCP.', 'Levantamiento Artificial', '4 horas', 4, 'gray-4', 'Settings', false),
  ('Sistemas de Gas Lift', 'LA-204', 'Levantamiento artificial por gas: principios, diseño de mandriles, optimización y troubleshooting.', 'Levantamiento Artificial', '5 horas', 5, 'gray-5', 'BookOpen', true),
  ('Mantenimiento de Tableros de Control y VSD', 'MT-301', 'Mantenimiento de tableros eléctricos, variadores de frecuencia (VSD) y sistemas de control para levantamiento artificial.', 'Mantenimiento', '4 horas', 4, 'gray-6', 'Settings', true),
  ('Diagnóstico de Fallas en Sistemas de Levantamiento', 'LA-401', 'Diagnóstico avanzado de fallas en BES, PCP y Gas Lift. Análisis de cartas dinométricas, registros de presión y corriente.', 'Levantamiento Artificial', '6 horas', 6, 'gray-1', 'BarChart3', false),
  ('HSE en Operaciones de Levantamiento Artificial', 'HSE-201', 'Seguridad, salud y medio ambiente en operaciones de levantamiento artificial. Riesgos específicos, permisos de trabajo y procedimientos de aislamiento.', 'Seguridad', '3 horas', 3, 'gray-2', 'ShieldCheck', true),
  ('Optimización de Producción en Levantamiento Artificial', 'LA-501', 'Técnicas avanzadas de optimización de producción: análisis nodal, simulación de sistemas y estrategias de mejora.', 'Levantamiento Artificial', '5 horas', 5, 'gray-3', 'BarChart3', false),
  ('Inspección y Certificación de Equipos de Levantamiento', 'QC-301', 'Procedimientos de inspección, normas de certificación y documentación técnica para equipos de levantamiento artificial.', 'Calidad', '4 horas', 4, 'gray-4', 'Award', false)
) AS v(title, code, description, category, duration, estimated_hours, accent, icon_name, mandatory)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- 5. MÓDULOS
-- ============================================================

-- LA-101: Fundamentos (5 módulos)
INSERT INTO modules (course_id, title, type, duration, duration_minutes, body, order_index, is_required, is_free_preview)
SELECT c.id, v.title, v.type, v.duration, v.minutes, v.body, v.ord, true, v.preview
FROM courses c
JOIN (VALUES
  ('LA-101', '¿Qué es el Levantamiento Artificial?', 'text', '20 min', 20, 'El levantamiento artificial es el conjunto de técnicas utilizadas en la industria petrolera para extraer hidrocarburos cuando la energía natural del yacimiento no es suficiente para llevar los fluidos a la superficie. Existen dos categorías principales: sistemas de bombeo (BES, PCP, BCS, BCP) y sistemas de inyección de gas (Gas Lift, Plunger Lift).', 0, true),
  ('LA-101', 'Criterios de Selección de Sistemas', 'text', '25 min', 25, 'La selección del sistema de levantamiento artificial depende de múltiples factores: profundidad del pozo, tasa de producción, propiedades del fluido (API, RAP, corte de agua), condiciones del yacimiento, disponibilidad de energía eléctrica, y análisis económico. Cada sistema tiene ventajas y limitaciones que deben evaluarse cuidadosamente.', 1, false),
  ('LA-101', 'Diagrama de Sistemas de Levantamiento', 'image', '15 min', 15, 'Este diagrama muestra los principales sistemas de levantamiento artificial y sus rangos de aplicación típicos en función de la profundidad y el caudal de producción.', 2, false),
  ('LA-101', 'Comparación de Sistemas: Ventajas y Desventajas', 'text', '30 min', 30, 'Cada sistema de levantamiento tiene características únicas. Las BES son ideales para altos caudales y pozos profundos. Las PCP manejan bien fluidos viscosos y con sólidos. El Gas Lift es flexible pero requiere gas de inyección disponible. Las BCS ofrecen eficiencia energética en pozos de bajo caudal.', 3, false),
  ('LA-101', 'Video Introductorio: Levantamiento Artificial', 'video', '20 min', 20, 'Video explicativo sobre los fundamentos del levantamiento artificial en la industria petrolera.', 4, false)
) AS v(code, title, type, duration, minutes, body, ord, preview)
ON c.code = v.code;

-- LA-201: BES (6 módulos)
INSERT INTO modules (course_id, title, type, duration, duration_minutes, body, order_index, is_required, is_free_preview)
SELECT c.id, v.title, v.type, v.duration, v.minutes, v.body, v.ord, true, v.preview
FROM courses c
JOIN (VALUES
  ('LA-201', 'Principios de Operación BES', 'text', '25 min', 25, 'Una Bomba Electrosumergible (BES) es un sistema de levantamiento artificial que consta de un motor eléctrico, una bomba centrífuga multietapa, un protector, un cable de alimentación y un tablero de control en superficie. El motor gira a alta velocidad impulsando los fluidos a través de las etapas de la bomba, generando presión suficiente para elevarlos a la superficie.', 0, true),
  ('LA-201', 'Componentes del Sistema BES', 'text', '30 min', 30, 'Los componentes principales de un sistema BES son: 1) Motor eléctrico sumergible (inducción, jaula de ardilla), 2) Sello o protector (separa el motor del fluido), 3) Bomba centrífuga multietapa, 4) Cable de alimentación, 5) Tablero de control (con VSD), 6) Transformador, 7) Cabezal de pozo, 8) Sensor de fondo (PIT/PHD).', 1, false),
  ('LA-201', 'Instalación de BES: Procedimientos', 'text', '35 min', 35, 'La instalación de un sistema BES requiere: inspección previa del pozo, limpieza y acondicionamiento, ensamble del equipo en superficie, bajada con tubing o cable continuo, conexión del cable al motor, prueba eléctrica, instalación del cabezal, y puesta en marcha con monitoreo de parámetros (amperaje, voltaje, presión de fondo, temperatura).', 2, false),
  ('LA-201', 'Operación y Monitoreo de BES', 'text', '25 min', 25, 'La operación correcta de un BES requiere monitoreo continuo de: amperaje del motor, voltaje, frecuencia (Hz), presión de descarga, temperatura del motor, y caudal de producción. Los VSD permiten ajustar la frecuencia para optimizar la producción y proteger el equipo. Es fundamental mantener el motor sumergido para evitar daños por sobrecalentamiento.', 3, false),
  ('LA-201', 'Mantenimiento Preventivo de BES', 'text', '30 min', 30, 'El mantenimiento preventivo de BES incluye: inspección periódica del tablero y VSD, medición de aislamiento del cable, análisis de corriente del motor, verificación de protecciones eléctricas, limpieza de filtros, revisión del cabezal, y análisis de tendencias de producción. Un programa de mantenimiento adecuado puede extender la vida útil del equipo de 2 a 5+ años.', 4, false),
  ('LA-201', 'Video: Instalación de BES en Campo', 'video', '20 min', 20, 'Video demostrativo del procedimiento de instalación de un sistema BES en un pozo de petróleo.', 5, false)
) AS v(code, title, type, duration, minutes, body, ord, preview)
ON c.code = v.code;

-- LA-202: PCP (5 módulos)
INSERT INTO modules (course_id, title, type, duration, duration_minutes, body, order_index, is_required, is_free_preview)
SELECT c.id, v.title, v.type, v.duration, v.minutes, v.body, v.ord, true, v.preview
FROM courses c
JOIN (VALUES
  ('LA-202', 'Principios del Bombeo de Cavidad Progresiva', 'text', '20 min', 20, 'El sistema PCP (Progressing Cavity Pump) utiliza un rotor helicoidal que gira dentro de un estator de material elastomérico. Al rotar, se forman cavidades que se desplazan axialmente, impulsando el fluido desde el fondo hacia la superficie. Es ideal para fluidos viscosos, con contenido de arena y gases.', 0, true),
  ('LA-202', 'Componentes del Sistema PCP', 'text', '25 min', 25, 'Componentes principales: 1) Rotor (acero, geometría helicoidal), 2) Estator (elastómero moldeado interiormente), 3) Varilla de transmisión, 4) Cabezal de accionamiento (drivehead), 5) Sistema de freno, 6) Motor (eléctrico o hidráulico), 7) Centralizadores, 8) Tubing. El estator es el componente más crítico y su vida útil depende del tipo de fluido y temperatura.', 1, false),
  ('LA-202', 'Instalación y Puesta en Marcha PCP', 'text', '30 min', 30, 'La instalación de PCP requiere: selección adecuada de rotor/estator según condiciones del pozo, bajada del equipo con tubing, instalación del drivehead en superficie, conexión de la varilla, alineación del sistema, y puesta en marcha gradual con monitoreo de torque, RPM y caudal. Es crítico no operar en seco para evitar daño del elastómero.', 2, false),
  ('LA-202', 'Operación y Troubleshooting PCP', 'text', '30 min', 30, 'Problemas comunes en PCP: 1) Desgaste prematuro del estator (alta temperatura, abrasivos), 2) Rotura de varilla (fatiga, torque excesivo), 3) Fugas en el drivehead, 4) Bloqueo por arena, 5) Gas locking. El monitoreo de torque y RPM es esencial. Se recomienda instalar sensores de fondo para detectar problemas temprano.', 3, false),
  ('LA-202', 'Infografía: Comparación PCP vs BCS', 'infographic', '15 min', 15, 'Infografía comparativa entre los sistemas PCP y BCS, mostrando diferencias en eficiencia, mantenimiento y rangos de aplicación.', 4, false)
) AS v(code, title, type, duration, minutes, body, ord, preview)
ON c.code = v.code;

-- LA-203: BCS (4 módulos)
INSERT INTO modules (course_id, title, type, duration, duration_minutes, body, order_index, is_required, is_free_preview)
SELECT c.id, v.title, v.type, v.duration, v.minutes, v.body, v.ord, true, v.preview
FROM courses c
JOIN (VALUES
  ('LA-203', 'Tecnología BCS: Fundamentos', 'text', '20 min', 20, 'El sistema BCS (Bombeo de Cavidad Sintética) es una evolución del PCP que utiliza materiales sintéticos avanzados para el estator, permitiendo mayor resistencia a temperatura y abrasión. Su diseño modular facilita el mantenimiento y reduce los tiempos de intervención.', 0, true),
  ('LA-203', 'Instalación de BCS', 'text', '25 min', 25, 'La instalación de BCS sigue procedimientos similares al PCP pero con consideraciones especiales: el estator sintético requiere pre-acondicionamiento, la alineación del drivehead debe ser más precisa, y se recomienda uso de centralizadores de material no metálico para proteger el elastómero.', 1, false),
  ('LA-203', 'Mantenimiento de BCS', 'text', '25 min', 25, 'El mantenimiento de BCS se enfoca en: inspección del estator (degradación, hinchazón), verificación de la tolerancia rotor-estator, monitoreo de temperatura de operación, análisis de torque, y reemplazo programado del estator antes de falla catastrófica. La vida útil típica es de 12-18 meses.', 2, false),
  ('LA-203', 'PDF: Manual de Referencia BCS', 'pdf', '15 min', 15, 'Manual técnico de referencia para sistemas BCS, incluyendo especificaciones, procedimientos y troubleshooting.', 3, false)
) AS v(code, title, type, duration, minutes, body, ord, preview)
ON c.code = v.code;

-- LA-204: Gas Lift (5 módulos)
INSERT INTO modules (course_id, title, type, duration, duration_minutes, body, order_index, is_required, is_free_preview)
SELECT c.id, v.title, v.type, v.duration, v.minutes, v.body, v.ord, true, v.preview
FROM courses c
JOIN (VALUES
  ('LA-204', 'Principios del Gas Lift', 'text', '25 min', 25, 'El Gas Lift es un sistema de levantamiento artificial que inyecta gas a alta presión en el pozo para reducir la densidad de la columna de fluido, disminuyendo la presión de fondo y permitiendo que el yacimiento fluya. Es uno de los sistemas más flexibles y utilizados a nivel mundial.', 0, true),
  ('LA-204', 'Diseño de Mandriles de Gas Lift', 'text', '30 min', 30, 'El diseño de mandriles (válvulas de gas lift) consiste en determinar: profundidad de la válvula de operación, presión de apertura, tamaño del orificio, y número de mandriles necesarios. Se utiliza el método de ACOPI o el método de gradiente para el diseño óptimo.', 1, false),
  ('LA-204', 'Operación y Optimización de Gas Lift', 'text', '30 min', 30, 'La operación óptima de Gas Lift requiere: monitoreo de la relación gas-líquido (GLR), ajuste de la presión de inyección, análisis de la temperatura de flujo, y medición del caudal. La sobre-inyección de gas reduce la eficiencia y puede causar fluctuaciones (heading).', 2, false),
  ('LA-204', 'Troubleshooting de Gas Lift', 'text', '25 min', 25, 'Problemas comunes: 1) Congelamiento de válvulas, 2) Heading (fluctuación de producción), 3) Comunicación entre mandriles, 4) Baja eficiencia de inyección, 5) Daño por alta presión. El diagnóstico se realiza mediante: análisis de gradientes, registros de presión/temperatura, y pruebas de producción.', 3, false),
  ('LA-204', 'Video: Operación de Gas Lift', 'video', '20 min', 20, 'Video sobre la operación y mantenimiento de un sistema de Gas Lift en campo.', 4, false)
) AS v(code, title, type, duration, minutes, body, ord, preview)
ON c.code = v.code;

-- MT-301: Tableros y VSD (4 módulos)
INSERT INTO modules (course_id, title, type, duration, duration_minutes, body, order_index, is_required, is_free_preview)
SELECT c.id, v.title, v.type, v.duration, v.minutes, v.body, v.ord, true, v.preview
FROM courses c
JOIN (VALUES
  ('MT-301', 'Tableros de Control: Componentes', 'text', '25 min', 25, 'Los tableros de control para levantamiento artificial incluyen: interruptor principal, contactores, relés de protección (sobrecorriente, subtensión, secuencia), VSD (variador de frecuencia), medidores de amperaje/voltaje, y sistema de monitoreo SCADA. El tablero es el cerebro del sistema de bombeo.', 0, true),
  ('MT-301', 'VSD: Variadores de Frecuencia', 'text', '30 min', 30, 'El VSD (Variable Speed Drive) controla la velocidad del motor eléctrico ajustando la frecuencia y voltaje de alimentación. Permite arranque suave, control de velocidad, protección del motor, y optimización energética. Parámetros clave: frecuencia mínima/máxima, rampa de aceleración, límites de corriente, y compensación de voltaje.', 1, false),
  ('MT-301', 'Mantenimiento Preventivo de Tableros', 'text', '25 min', 25, 'El mantenimiento preventivo incluye: inspección visual (oxidación, conexiones flojas), limpieza de filtros de ventilación, medición de aislamiento, prueba de protecciones, verificación de calibración del VSD, y análisis termográfico para detectar puntos calientes. Frecuencia recomendada: mensual para inspección visual, trimestral para pruebas eléctricas.', 2, false),
  ('MT-301', 'PDF: Checklist de Mantenimiento VSD', 'pdf', '15 min', 15, 'Checklist técnico para el mantenimiento preventivo de variadores de frecuencia (VSD) utilizados en sistemas de levantamiento artificial.', 3, false)
) AS v(code, title, type, duration, minutes, body, ord, preview)
ON c.code = v.code;

-- LA-401: Diagnóstico de Fallas (5 módulos)
INSERT INTO modules (course_id, title, type, duration, duration_minutes, body, order_index, is_required, is_free_preview)
SELECT c.id, v.title, v.type, v.duration, v.minutes, v.body, v.ord, true, v.preview
FROM courses c
JOIN (VALUES
  ('LA-401', 'Análisis de Cartas Dinométricas', 'text', '30 min', 30, 'La carta dinométrica es una herramienta de diagnóstico que grafica la carga sobre la varilla en función del desplazamiento. Permite identificar: gas locking, fuga de válvula viajera, fuga de válvula fija, fricción excesiva, fluido pesado, y golpes de fluido. Cada anomalía produce un patrón característico reconocible.', 0, true),
  ('LA-401', 'Diagnóstico de Fallas en BES', 'text', '30 min', 30, 'Las fallas más comunes en BES incluyen: cortocircuito del motor, degradación del aislamiento del cable, bloqueo de la bomba por arena, gas locking, y sobrecalentamiento. El diagnóstico se realiza mediante: análisis de corriente (amplogramas), medición de aislamiento, presión de fondo, y tendencias de producción.', 1, false),
  ('LA-401', 'Diagnóstico de Fallas en PCP', 'text', '30 min', 30, 'Las fallas en PCP más frecuentes son: desgaste del estator, rotura de varilla, desprendimiento del rotor, bloqueo por arena, y degradación del elastómero. El monitoreo de torque, RPM y temperatura permite detectar anomalías temprano. El análisis de tendencia de producción es fundamental.', 2, false),
  ('LA-401', 'Diagnóstico de Fallas en Gas Lift', 'text', '25 min', 25, 'Las fallas en Gas Lift incluyen: congelamiento de válvulas, comunicación entre mandriles, heading, baja eficiencia, y daño por alta presión. El diagnóstico utiliza: análisis de gradientes de presión, registros de temperatura, y pruebas de producción. La identificación del mandril operativo es clave para la optimización.', 3, false),
  ('LA-401', 'Infografía: Guía de Diagnóstico Rápido', 'infographic', '15 min', 15, 'Guía visual de diagnóstico rápido para identificar las fallas más comunes en sistemas de levantamiento artificial.', 4, false)
) AS v(code, title, type, duration, minutes, body, ord, preview)
ON c.code = v.code;

-- HSE-201: HSE (4 módulos)
INSERT INTO modules (course_id, title, type, duration, duration_minutes, body, order_index, is_required, is_free_preview)
SELECT c.id, v.title, v.type, v.duration, v.minutes, v.body, v.ord, true, v.preview
FROM courses c
JOIN (VALUES
  ('HSE-201', 'Riesgos Específicos de Levantamiento Artificial', 'text', '25 min', 25, 'Los riesgos principales en operaciones de levantamiento artificial incluyen: contacto con alta tensión eléctrica (BES), rotación de partes (PCP/BCS), presión de gas (Gas Lift), exposición a H2S, trabajo en altura, y manipulación de cargas pesadas. Cada riesgo requiere controles específicos y permisos de trabajo.', 0, true),
  ('HSE-201', 'Permisos de Trabajo y LOTO', 'text', '25 min', 25, 'Los permisos de trabajo son documentos que autorizan la realización de tareas específicas con controles definidos. El procedimiento LOTO (Lockout/Tagout) asegura el aislamiento de fuentes de energía antes de intervenir un equipo. Es obligatorio para: trabajos eléctricos, mantenimiento de bombas, intervención de pozos, y trabajo en espacios confinados.', 1, false),
  ('HSE-201', 'Respuesta a Emergencias', 'text', '20 min', 20, 'Las emergencias en operaciones de levantamiento incluyen: incendios en tableros, fugas de gas H2S, derrames de hidrocarburos, lesiones por atrapamiento, y caídas. Cada locación debe tener: plan de respuesta, rutas de evacuación, detectores de H2S, extintores, y personal entrenado en primeros auxilios.', 2, false),
  ('HSE-201', 'Video: Procedimientos HSE', 'video', '15 min', 15, 'Video sobre procedimientos de seguridad en operaciones de levantamiento artificial.', 3, false)
) AS v(code, title, type, duration, minutes, body, ord, preview)
ON c.code = v.code;

-- LA-501: Optimización (4 módulos)
INSERT INTO modules (course_id, title, type, duration, duration_minutes, body, order_index, is_required, is_free_preview)
SELECT c.id, v.title, v.type, v.duration, v.minutes, v.body, v.ord, true, v.preview
FROM courses c
JOIN (VALUES
  ('LA-501', 'Análisis Nodal', 'text', '30 min', 30, 'El análisis nodal es una técnica para evaluar el comportamiento de un sistema de producción dividiéndolo en nodos. Permite identificar cuellos de botella, optimizar la producción, y evaluar escenarios. Se analizan: presión de fondo, presión de línea, diámetro de tubing, y características del sistema de levantamiento.', 0, true),
  ('LA-501', 'Simulación de Sistemas', 'text', '30 min', 30, 'La simulación de sistemas de levantamiento utiliza software especializado (PIPESIM, PROSPER, etc.) para modelar el comportamiento del pozo y predecir la producción bajo diferentes condiciones. Permite: optimizar parámetros de operación, evaluar intervenciones, y planificar estrategias de producción.', 1, false),
  ('LA-501', 'Estrategias de Mejora Continua', 'text', '25 min', 25, 'Las estrategias de mejora continua en levantamiento artificial incluyen: monitoreo continuo, análisis de tendencias, mantenimiento predictivo, optimización de frecuencia (BES), ajuste de mandriles (Gas Lift), y reemplazo proactivo de componentes. El objetivo es maximizar la producción y minimizar los costos de operación.', 2, false),
  ('LA-501', 'PDF: Guía de Optimización', 'pdf', '15 min', 15, 'Guía técnica de optimización de producción para sistemas de levantamiento artificial.', 3, false)
) AS v(code, title, type, duration, minutes, body, ord, preview)
ON c.code = v.code;

-- QC-301: Inspección (4 módulos)
INSERT INTO modules (course_id, title, type, duration, duration_minutes, body, order_index, is_required, is_free_preview)
SELECT c.id, v.title, v.type, v.duration, v.minutes, v.body, v.ord, true, v.preview
FROM courses c
JOIN (VALUES
  ('QC-301', 'Normas de Certificación', 'text', '25 min', 25, 'Las normas aplicables a equipos de levantamiento artificial incluyen: API 11S (BES), API 11AX (varillas), API 11V (Gas Lift), ISO 15136 (PCP). La certificación asegura que los equipos cumplen con estándares de calidad y seguridad. Es obligatoria para operaciones en la mayoría de los países productores.', 0, true),
  ('QC-301', 'Procedimientos de Inspección', 'text', '30 min', 30, 'Los procedimientos de inspección incluyen: inspección visual, ensayos no destructivos (NDT), pruebas de presión, análisis dimensional, verificación de documentación, y pruebas funcionales. La frecuencia depende del equipo y condiciones de operación.', 1, false),
  ('QC-301', 'Documentación Técnica', 'text', '25 min', 25, 'La documentación técnica requerida incluye: certificados de calidad, reportes de inspección, manuales de operación, planos eléctricos y mecánicos, registros de mantenimiento, y bitácoras de operación. Una documentación completa es esencial para auditorías y para el seguimiento de la vida útil del equipo.', 2, false),
  ('QC-301', 'PDF: Checklist de Inspección', 'pdf', '15 min', 15, 'Checklist técnico para la inspección y certificación de equipos de levantamiento artificial.', 3, false)
) AS v(code, title, type, duration, minutes, body, ord, preview)
ON c.code = v.code;

-- ============================================================
-- 6. PREGUNTAS DE EXAMEN
-- ============================================================
INSERT INTO exam_questions (course_id, question, options, correct_index, difficulty, points, order_index)
SELECT c.id, v.question, v.options::jsonb, v.correct, v.difficulty, v.points, v.ord
FROM courses c
JOIN (VALUES
  ('LA-101', '¿Cuál es el propósito principal del levantamiento artificial?', '["Extraer hidrocarburos cuando la energía del yacimiento es insuficiente","Aumentar la presión del yacimiento","Reducir la viscosidad del crudo","Enfriar el pozo"]', 0, 'easy', 10, 0),
  ('LA-101', '¿Cuáles son las dos categorías principales de sistemas de levantamiento artificial?', '["Sistemas de bombeo y sistemas de inyección de gas","Sistemas eléctricos y mecánicos","Sistemas verticales y horizontales","Sistemas de alta y baja presión"]', 0, 'medium', 10, 1),
  ('LA-101', '¿Qué factor NO se considera en la selección de un sistema de levantamiento?', '["Color del equipo","Profundidad del pozo","Tasa de producción","Disponibilidad de energía"]', 0, 'easy', 10, 2),
  ('LA-101', '¿Para qué tipo de fluidos es más adecuado el sistema PCP?', '["Fluidos viscosos con arena y gases","Fluidos livianos sin sólidos","Agua dulce","Gas seco"]', 0, 'medium', 10, 3),
  ('LA-101', '¿Qué sistema es más flexible pero requiere gas de inyección disponible?', '["Gas Lift","BES","PCP","BCS"]', 0, 'medium', 10, 4),
  ('LA-201', '¿Qué tipo de bomba utiliza un sistema BES?', '["Bomba centrífuga multietapa","Bomba de desplazamiento positivo","Bomba helicoidal","Bomba de pistón"]', 0, 'easy', 10, 0),
  ('LA-201', '¿Cuál es la función del sello o protector en un sistema BES?', '["Separar el motor del fluido del pozo","Generar presión","Enfriar el motor","Medir el caudal"]', 0, 'medium', 10, 1),
  ('LA-201', '¿Qué parámetro NO se monitorea en la operación de un BES?', '["Color del cable","Amperaje del motor","Presión de fondo","Temperatura del motor"]', 0, 'easy', 10, 2),
  ('LA-201', '¿Por qué es fundamental mantener el motor del BES sumergido?', '["Para evitar daños por sobrecalentamiento","Para aumentar la producción","Para reducir costos","Para mejorar la calidad del crudo"]', 0, 'medium', 10, 3),
  ('LA-201', '¿Cuál es la función del VSD en un sistema BES?', '["Controlar la velocidad del motor ajustando la frecuencia","Medir la presión del pozo","Filtrar el fluido","Generar energía eléctrica"]', 0, 'medium', 10, 4),
  ('LA-202', '¿Cómo funciona una bomba de cavidad progresiva?', '["Un rotor helicoidal gira dentro de un estator formando cavidades que se desplazan","Un pistón sube y baja","Un impulsor gira a alta velocidad","Gas comprimido empuja el fluido"]', 0, 'easy', 10, 0),
  ('LA-202', '¿Cuál es el componente más crítico de un sistema PCP?', '["El estator (elastómero)","El motor","El cable","El tablero"]', 0, 'medium', 10, 1),
  ('LA-202', '¿Qué puede causar el desgaste prematuro del estator en una PCP?', '["Alta temperatura y fluidos abrasivos","Baja temperatura","Falta de electricidad","Exceso de lubricación"]', 0, 'medium', 10, 2),
  ('LA-202', '¿Por qué no se debe operar una PCP en seco?', '["Porque daña el elastómero del estator","Porque aumenta la producción","Porque mejora la eficiencia","Porque reduce el consumo eléctrico"]', 0, 'easy', 10, 3),
  ('LA-204', '¿Cuál es el principio del Gas Lift?', '["Inyectar gas para reducir la densidad de la columna de fluido","Inyectar agua para aumentar la presión","Inyectar químicos para reducir la viscosidad","Inyectar aire para oxidar el crudo"]', 0, 'easy', 10, 0),
  ('LA-204', '¿Qué es un mandril en un sistema de Gas Lift?', '["Una válvula que permite la inyección de gas a una profundidad específica","Un tipo de tubing","Un sensor de presión","Un motor eléctrico"]', 0, 'medium', 10, 1),
  ('LA-204', '¿Qué es el "heading" en Gas Lift?', '["Fluctuación de producción por sobre-inyección de gas","Un tipo de válvula","Un procedimiento de mantenimiento","Un tipo de medidor"]', 0, 'medium', 10, 2),
  ('LA-204', '¿Qué busca la optimización de Gas Lift?', '["Máxima producción con mínimo consumo de gas","Mínima producción con máximo gas","Reducir la presión del pozo","Aumentar la temperatura"]', 0, 'easy', 10, 3),
  ('MT-301', '¿Qué controla un VSD (Variador de Frecuencia)?', '["La velocidad del motor ajustando frecuencia y voltaje","La presión del pozo","El caudal de producción","La temperatura del fluido"]', 0, 'easy', 10, 0),
  ('MT-301', '¿Con qué frecuencia se recomienda la inspección visual del tablero?', '["Mensual","Diaria","Anual","Cada 5 años"]', 0, 'easy', 10, 1),
  ('MT-301', '¿Qué es el análisis termográfico en tableros eléctricos?', '["Detección de puntos calientes mediante cámara térmica","Medición de voltaje","Limpieza de filtros","Calibración del VSD"]', 0, 'medium', 10, 2),
  ('LA-401', '¿Qué es una carta dinométrica?', '["Gráfico de carga sobre la varilla vs desplazamiento","Gráfico de presión vs temperatura","Gráfico de caudal vs tiempo","Gráfico de voltaje vs corriente"]', 0, 'easy', 10, 0),
  ('LA-401', '¿Qué herramienta se usa para diagnosticar fallas en BES?', '["Análisis de corriente (amplogramas)","Carta dinométrica","Análisis de gas","Medición de pH"]', 0, 'medium', 10, 1),
  ('LA-401', '¿Qué parámetro se monitorea para detectar fallas en PCP?', '["Torque, RPM y temperatura","pH y densidad","Voltaje y frecuencia","Humedad y presión"]', 0, 'medium', 10, 2),
  ('LA-401', '¿Qué causa el congelamiento de válvulas en Gas Lift?', '["Hidratos por baja temperatura y alta presión","Exceso de calor","Falta de electricidad","Arena en el pozo"]', 0, 'hard', 10, 3),
  ('HSE-201', '¿Qué significa LOTO?', '["Lockout/Tagout (Aislamiento y etiquetado)","Lubricación de tornillos","Limpieza de tableros","Ninguna de las anteriores"]', 0, 'easy', 10, 0),
  ('HSE-201', '¿Qué gas tóxico es común en operaciones de levantamiento artificial?', '["H2S (Sulfuro de hidrógeno)","CO2 (Dióxido de carbono)","O2 (Oxígeno)","N2 (Nitrógeno)"]', 0, 'easy', 10, 1),
  ('HSE-201', '¿Cuándo es obligatorio el procedimiento LOTO?', '["Para trabajos eléctricos, mantenimiento e intervención de pozos","Solo en emergencias","Solo en inspecciones","Nunca es obligatorio"]', 0, 'medium', 10, 2),
  ('LA-501', '¿Qué es el análisis nodal?', '["Técnica para evaluar el sistema de producción dividiéndolo en nodos","Análisis químico del crudo","Medición de nodos eléctricos","Análisis de vibración"]', 0, 'medium', 10, 0),
  ('LA-501', '¿Qué software se usa para simulación de sistemas de levantamiento?', '["PIPESIM, PROSPER","Excel, Word","AutoCAD","Photoshop"]', 0, 'easy', 10, 1),
  ('LA-501', '¿Cuál es el objetivo de la optimización de levantamiento artificial?', '["Maximizar la producción y minimizar costos","Reducir la producción","Aumentar los costos","Minimizar el personal"]', 0, 'easy', 10, 2),
  ('QC-301', '¿Qué norma API aplica a sistemas BES?', '["API 11S","API 11AX","API 11V","API 15136"]', 0, 'medium', 10, 0),
  ('QC-301', '¿Qué son los ensayos no destructivos (NDT)?', '["Pruebas que no dañan el equipo: ultrasonido, radiografía, partículas magnéticas","Pruebas que destruyen el equipo","Pruebas químicas","Pruebas eléctricas destructivas"]', 0, 'easy', 10, 1),
  ('QC-301', '¿Qué documentación es obligatoria para equipos de levantamiento?', '["Certificados de calidad, reportes de inspección, manuales, planos","Solo facturas","Solo fotos","No se requiere documentación"]', 0, 'easy', 10, 2)
) AS v(code, question, options, correct, difficulty, points, ord)
ON c.code = v.code;

-- ============================================================
-- 7. RECURSOS DESCARGABLES
-- ============================================================
INSERT INTO resources (course_id, title, description, file_url, file_type, order_index, is_downloadable)
SELECT c.id, v.title, v.description, v.url, v.type, v.ord, true
FROM courses c
JOIN (VALUES
  ('LA-101', 'Guía de Selección de Sistemas de Levantamiento', 'Documento técnico con criterios de selección y comparación de sistemas', 'https://example.com/docs/guia_seleccion.pdf', 'PDF', 0),
  ('LA-201', 'Manual Técnico BES - Modelo XYZ', 'Manual completo de instalación y operación de bombas electrosumergibles', 'https://example.com/docs/manual_bes.pdf', 'PDF', 0),
  ('LA-201', 'Checklist de Instalación BES', 'Lista de verificación para instalación de sistemas BES', 'https://example.com/docs/checklist_bes.xlsx', 'XLS', 1),
  ('LA-202', 'Manual PCP - Especificaciones Técnicas', 'Especificaciones técnicas de bombas de cavidad progresiva', 'https://example.com/docs/manual_pcp.pdf', 'PDF', 0),
  ('LA-204', 'Guía de Diseño de Mandriles Gas Lift', 'Procedimiento de diseño y selección de mandriles', 'https://example.com/docs/guia_mandriles.pdf', 'PDF', 0),
  ('MT-301', 'Checklist de Mantenimiento VSD', 'Lista de verificación para mantenimiento preventivo de variadores', 'https://example.com/docs/checklist_vsd.xlsx', 'XLS', 0),
  ('LA-401', 'Atlas de Cartas Dinométricas', 'Catálogo de cartas dinométricas y su interpretación', 'https://example.com/docs/atlas_dinometricas.pdf', 'PDF', 0),
  ('HSE-201', 'Procedimiento LOTO', 'Procedimiento de bloqueo y etiquetado para operaciones de levantamiento', 'https://example.com/docs/procedimiento_loto.pdf', 'PDF', 0),
  ('LA-501', 'Guía de Optimización de Producción', 'Documento técnico con estrategias de optimización', 'https://example.com/docs/guia_optimizacion.pdf', 'PDF', 0),
  ('QC-301', 'Normas API para Levantamiento Artificial', 'Resumen de normas API aplicables a equipos de levantamiento', 'https://example.com/docs/normas_api.pdf', 'PDF', 0)
) AS v(code, title, description, url, type, ord)
ON c.code = v.code;

-- ============================================================
-- 8. PRERREQUISITOS ENTRE CURSOS
-- ============================================================
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, is_mandatory)
SELECT c.id, p.id, v.mandatory
FROM (VALUES
  ('LA-201', 'LA-101', true),
  ('LA-202', 'LA-101', true),
  ('LA-203', 'LA-202', true),
  ('LA-204', 'LA-101', true),
  ('MT-301', 'LA-201', true),
  ('LA-401', 'LA-201', true),
  ('LA-401', 'LA-202', false),
  ('HSE-201', 'LA-101', true),
  ('LA-501', 'LA-401', true),
  ('QC-301', 'LA-101', false)
) AS v(course_code, prereq_code, mandatory)
JOIN courses c ON c.code = v.course_code
JOIN courses p ON p.code = v.prereq_code;

-- ============================================================
-- 9. ASIGNACIONES DE CURSOS A CARGOS
-- ============================================================
INSERT INTO course_assignments (course_id, job_role_id, is_mandatory, priority, completion_deadline_days, order_index, created_by)
SELECT c.id, j.id, v.mandatory, v.priority::text, v.days, v.ord, 'dd350086-2372-4c30-b0ad-96142113bd19'
FROM (VALUES
  ('LA-101', 'MANT', true, 'high', 30, 0),
  ('HSE-201', 'MANT', true, 'critical', 15, 1),
  ('MT-301', 'MANT', true, 'medium', 45, 2),
  ('LA-101', 'OP-PCP', true, 'high', 30, 0),
  ('LA-202', 'OP-PCP', true, 'critical', 30, 1),
  ('HSE-201', 'OP-PCP', true, 'high', 15, 2),
  ('LA-401', 'OP-PCP', false, 'medium', 60, 3),
  ('LA-101', 'TI-BES', true, 'high', 30, 0),
  ('LA-201', 'TI-BES', true, 'critical', 30, 1),
  ('MT-301', 'TI-BES', true, 'high', 45, 2),
  ('HSE-201', 'TI-BES', true, 'high', 15, 3),
  ('LA-101', 'ILA', true, 'high', 30, 0),
  ('LA-201', 'ILA', true, 'high', 45, 1),
  ('LA-202', 'ILA', true, 'high', 45, 2),
  ('LA-204', 'ILA', true, 'high', 45, 3),
  ('LA-401', 'ILA', true, 'critical', 30, 4),
  ('LA-501', 'ILA', false, 'medium', 90, 5),
  ('QC-301', 'ILA', false, 'low', 90, 6),
  ('HSE-201', 'SUP-HSE', true, 'critical', 15, 0),
  ('LA-101', 'SUP-HSE', true, 'high', 30, 1),
  ('QC-301', 'SUP-HSE', true, 'high', 30, 2),
  ('LA-101', 'TMS', true, 'high', 30, 0),
  ('MT-301', 'TMS', true, 'critical', 30, 1),
  ('LA-201', 'TMS', true, 'high', 45, 2),
  ('HSE-201', 'TMS', true, 'high', 15, 3),
  ('LA-101', 'OP-BCS', true, 'high', 30, 0),
  ('LA-203', 'OP-BCS', true, 'critical', 30, 1),
  ('LA-202', 'OP-BCS', false, 'medium', 60, 2),
  ('HSE-201', 'OP-BCS', true, 'high', 15, 3),
  ('LA-101', 'ESP-GL', true, 'high', 30, 0),
  ('LA-204', 'ESP-GL', true, 'critical', 30, 1),
  ('LA-401', 'ESP-GL', true, 'high', 45, 2),
  ('LA-501', 'ESP-GL', false, 'medium', 90, 3),
  ('LA-101', 'INS-CAL', true, 'high', 30, 0),
  ('QC-301', 'INS-CAL', true, 'critical', 30, 1),
  ('HSE-201', 'INS-CAL', true, 'high', 15, 2),
  ('LA-101', 'SUP', true, 'high', 30, 0),
  ('HSE-201', 'SUP', true, 'critical', 15, 1),
  ('LA-401', 'SUP', true, 'high', 45, 2)
) AS v(course_code, role_code, mandatory, priority, days, ord)
JOIN courses c ON c.code = v.course_code
JOIN job_roles j ON j.code = v.role_code;

-- ============================================================
-- 10. NUEVAS INSIGNIAS
-- ============================================================
INSERT INTO badges (name, description, icon_url, points, category, criteria) VALUES
  ('Especialista en BES', 'Completó todos los cursos de Bombas Electrosumergibles', 'Settings', 300, 'excellence', '{"type": "course_completion"}'),
  ('Especialista en PCP', 'Completó todos los cursos de Bombeo de Cavidad Progresiva', 'Settings', 300, 'excellence', '{"type": "course_completion"}'),
  ('Especialista en Gas Lift', 'Completó todos los cursos de Gas Lift', 'BookOpen', 300, 'excellence', '{"type": "course_completion"}'),
  ('Guardián de Seguridad', 'Completó todos los cursos HSE', 'ShieldCheck', 250, 'safety', '{"type": "course_completion"}'),
  ('Maestro del Levantamiento', 'Completó el curso de Fundamentos y al menos 3 cursos avanzados', 'Award', 500, 'mastery', '{"type": "multi_course"}'),
  ('Diagnosticador Experto', 'Completó el curso de Diagnóstico de Fallas', 'BarChart3', 200, 'excellence', '{"type": "course_completion"}'),
  ('Inspector Certificado', 'Completó el curso de Inspección y Certificación', 'Award', 200, 'quality', '{"type": "course_completion"}'),
  ('Optimizador de Producción', 'Completó el curso de Optimización de Producción', 'BarChart3', 250, 'excellence', '{"type": "course_completion"}')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 11. NOTIFICACIONES DEL SISTEMA
-- ============================================================
INSERT INTO notifications (user_id, type, title, message, is_read, sent_at) VALUES
  ('cf5c5733-e1d3-4d23-b96e-367df83f9fed', 'info', 'Nuevos cursos disponibles', 'Se han agregado 8 nuevos cursos sobre levantamiento artificial petrolero. Revisa tu catálogo para ver los cursos asignados a tu cargo.', false, NOW()),
  ('cf5c5733-e1d3-4d23-b96e-367df83f9fed', 'reminder', 'Curso próximo a vencer', 'Tienes 10 días para completar el curso "Protocolos de Atención de Emergencias". No dejes que venza.', false, NOW() - INTERVAL '2 hours'),
  ('cf5c5733-e1d3-4d23-b96e-367df83f9fed', 'success', '¡Módulo completado!', 'Has completado el módulo "Introducción a la Seguridad Industrial". Continúa con el siguiente módulo.', true, NOW() - INTERVAL '1 day'),
  ('cf5c5733-e1d3-4d23-b96e-367df83f9fed', 'warning', 'Actualización de prerrequisitos', 'El curso "Bombas Electrosumergibles (BES)" ahora requiere completar primero "Fundamentos del Levantamiento Artificial".', false, NOW() - INTERVAL '3 days'),
  ('dd350086-2372-4c30-b0ad-96142113bd19', 'info', 'Datos precargados en el sistema', 'Se han cargado 8 cursos nuevos, 8 cargos, 5 departamentos, 10 insignias y recursos técnicos completos.', false, NOW())
ON CONFLICT DO NOTHING;

-- ============================================================
-- 12. CONFIGURACIONES DEL SISTEMA
-- ============================================================
INSERT INTO system_settings (key, value, description, category, is_public) VALUES
  ('company_name', '{"value": "TRIADE Learning - Servicios de Levantamiento Artificial"}', 'Nombre de la empresa', 'general', true),
  ('company_mission', '{"value": "Capacitar personal técnico especializado en sistemas de levantamiento artificial para la industria petrolera"}', 'Misión de la empresa', 'general', true),
  ('pass_threshold', '{"value": 90}', 'Puntaje mínimo para aprobar exámenes (%)', 'general', true),
  ('max_exam_attempts', '{"value": 3}', 'Número máximo de intentos de examen', 'general', true),
  ('notification_email_enabled', '{"value": true}', 'Habilitar notificaciones por correo', 'email', false),
  ('reminder_days_before', '{"value": 7}', 'Días antes del vencimiento para enviar recordatorio', 'email', false),
  ('primary_color', '{"value": "#374151"}', 'Color primario del sistema', 'branding', true),
  ('logo_url', '{"value": "/LOGOTIPO_POSITIVO.png"}', 'URL del logotipo', 'branding', true),
  ('session_timeout', '{"value": 30}', 'Tiempo de inactividad antes de cerrar sesión (minutos)', 'security', false),
  ('password_min_length', '{"value": 6}', 'Longitud mínima de contraseña', 'security', false)
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 13. REGISTROS DE AUDITORÍA (entity_id usa placeholder UUID)
-- ============================================================
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values, created_at) VALUES
  ('dd350086-2372-4c30-b0ad-96142113bd19', 'CREATE', 'department', '00000000-0000-0000-0000-000000000000', '{"action": "Precarga masiva de departamentos"}', NOW()),
  ('dd350086-2372-4c30-b0ad-96142113bd19', 'CREATE', 'job_role', '00000000-0000-0000-0000-000000000000', '{"action": "Precarga masiva de cargos"}', NOW()),
  ('dd350086-2372-4c30-b0ad-96142113bd19', 'CREATE', 'course', '00000000-0000-0000-0000-000000000000', '{"action": "Precarga masiva de cursos de levantamiento artificial"}', NOW()),
  ('dd350086-2372-4c30-b0ad-96142113bd19', 'CREATE', 'badge', '00000000-0000-0000-0000-000000000000', '{"action": "Precarga masiva de insignias"}', NOW()),
  ('dd350086-2372-4c30-b0ad-96142113bd19', 'CREATE', 'system_setting', '00000000-0000-0000-0000-000000000000', '{"action": "Precarga de configuraciones del sistema"}', NOW()),
  ('dd350086-2372-4c30-b0ad-96142113bd19', 'CREATE', 'notification', '00000000-0000-0000-0000-000000000000', '{"action": "Precarga de notificaciones"}', NOW()),
  ('dd350086-2372-4c30-b0ad-96142113bd19', 'CREATE', 'resource', '00000000-0000-0000-0000-000000000000', '{"action": "Precarga de recursos descargables"}', NOW()),
  ('dd350086-2372-4c30-b0ad-96142113bd19', 'CREATE', 'course_prerequisite', '00000000-0000-0000-0000-000000000000', '{"action": "Precarga de prerrequisitos"}', NOW())
ON CONFLICT DO NOTHING;

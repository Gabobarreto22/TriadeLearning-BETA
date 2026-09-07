/*
# Enriquecer contenido de módulos y preguntas de examen

## Resumen
1. Actualiza módulos existentes con contenido textual más completo y detallado
2. Agrega módulos adicionales a cursos con pocos módulos
3. Agrega preguntas de examen a cursos con 0 o muy pocas preguntas

## Tablas afectadas
- modules: UPDATE de body con contenido más rico, INSERT de nuevos módulos
- exam_questions: INSERT de nuevas preguntas
*/

-- ============================================================
-- 1. ACTUALIZAR MÓDULOS EXISTENTES CON CONTENIDO MÁS COMPLETO
-- ============================================================

UPDATE modules SET body = 'El levantamiento artificial es el conjunto de técnicas utilizadas en la industria petrolera para extraer hidrocarburos cuando la energía natural del yacimiento no es suficiente para llevar los fluidos a la superficie.

## Definición
Cuando un pozo deja de producir por flujo natural (por agotamiento de la presión del yacimiento o aumento del corte de agua), se requiere un sistema externo que aporte la energía necesaria para elevar los fluidos hasta la superficie. A esto se le llama levantamiento artificial.

## Categorías principales
1. Sistemas de bombeo: Utilizan un dispositivo mecánico o eléctrico para impulsar el fluido. Incluyen BES, PCP, BCS y BCP.
2. Sistemas de inyección de gas: Reducen la densidad de la columna de fluido para que el yacimiento pueda empujarlo. Incluyen Gas Lift y Plunger Lift.

## Importancia económica
El levantamiento artificial se utiliza en más del 90% de los pozos activos a nivel mundial. La selección del sistema adecuado impacta directamente en la rentabilidad de la operación.' 
WHERE title = '¿Qué es el Levantamiento Artificial?' AND body LIKE 'El levantamiento artificial es el conjunto%';

UPDATE modules SET body = 'La selección del sistema de levantamiento artificial depende de múltiples factores que deben evaluarse cuidadosamente. Una selección incorrecta puede resultar en bajo rendimiento, costos excesivos o fallas prematuras.

## Factores principales

### 1. Características del pozo
- Profundidad: Determina la presión requerida del sistema
- Tasa de producción: Caudal que el sistema debe manejar
- Presión de fondo (Pwf): Presión disponible del yacimiento
- Presión de línea (Pth): Presión en superficie que el sistema debe vencer

### 2. Propiedades del fluido
- Gravedad API: Determina la densidad del crudo
- Relación Gas-Petróleo (RGP): Cantidad de gas disuelto
- Corte de agua (%BSW): Porcentaje de agua en la producción
- Viscosidad: Resistencia al flujo
- Contenido de arena: Puede dañar equipos de bombeo

### 3. Condiciones del yacimiento
- Presión estática: Energía disponible del yacimiento
- Productividad (PI): Capacidad de producción
- Temperatura de fondo: Afecta elastómeros y motores eléctricos

### 4. Factores económicos y operativos
- Disponibilidad de energía eléctrica (crucial para BES)
- Disponibilidad de gas de inyección (crucial para Gas Lift)
- Costo de capital (CAPEX) y costo de operación (OPEX)

## Reglas generales
- Altos caudales + pozos profundos = BES
- Fluidos viscosos + contenido de arena = PCP
- Gas disponible + flexibilidad = Gas Lift
- Bajos caudales + pozos someros = BCP o BCS'
WHERE title = 'Criterios de Selección de Sistemas' AND body LIKE 'La selección del sistema%';

UPDATE modules SET body = 'Una Bomba Electrosumergible (BES) es un sistema de levantamiento artificial que consta de un motor eléctrico, una bomba centrífuga multietapa, un protector, un cable de alimentación y un tablero de control en superficie.

## Principio de funcionamiento
El motor eléctrico de inducción (tipo jaula de ardilla) recibe energía a través del cable de alimentación desde el tablero de control. El motor gira típicamente entre 2,900 y 3,600 RPM, acoplado directamente a la bomba centrífuga.

## Etapas de la bomba
Cada etapa consta de un impulsor (rotor que acelera el fluido) y un difusor (componente estático que convierte velocidad en presión). Un sistema BES típico puede tener entre 50 y 400 etapas.

## Ventajas
- Alto caudal de producción (hasta 20,000 BPD)
- Adaptable a pozos profundos (hasta 4,500 m)
- Operación continua y automática
- Control de velocidad mediante VSD

## Limitaciones
- Requiere fuente de energía eléctrica
- Sensible a gas y arena
- Alto costo de intervención
- Limitación de temperatura del motor (< 150°C)'
WHERE title = 'Principios de Operación BES' AND body LIKE 'Una Bomba Electrosumergible (BES)%';

UPDATE modules SET body = 'El sistema PCP (Progressing Cavity Pump) utiliza un rotor helicoidal de acero que gira dentro de un estator de material elastomérico. Al rotar, se forman cavidades herméticas que se desplazan axialmente, impulsando el fluido desde el fondo hacia la superficie.

## Principio de funcionamiento
El rotor es una hélice de perfil helicoidal. El estator tiene un perfil interno helicoidal con una vuelta más que el rotor, creando cavidades selladas. A medida que el rotor gira, las cavidades se desplazan desde la succión hasta la descarga.

## Características clave
- Desplazamiento positivo: El caudal es proporcional a la velocidad de rotación
- Baja sensibilidad a la viscosidad: Maneja crudos pesados eficientemente
- Tolerancia a sólidos: El elastómero permite manejar arena
- Bajo cizallamiento: No emulsiona el fluido

## Rangos de aplicación
- Caudal: 10 - 2,000 BPD
- Profundidad: hasta 1,500 m (con varilla), hasta 2,500 m (con motor de fondo)
- Viscosidad: hasta 10,000 cP
- Temperatura: hasta 130°C

## Ventajas
- Ideal para crudos pesados y viscosos
- Maneja contenido de arena y sólidos
- Bajo consumo energético en bajo caudal
- Mantenimiento más económico que BES

## Limitaciones
- Vida útil del estator limitada (12-24 meses)
- Sensibilidad a temperatura (degradación del elastómero)
- No apto para altos caudales
- Riesgo de rotura de varilla por torque excesivo'
WHERE title = 'Principios del Bombeo de Cavidad Progresiva' AND body LIKE 'El sistema PCP (Progressing%';

UPDATE modules SET body = 'El Gas Lift es un sistema de levantamiento artificial que inyecta gas a alta presión en el pozo para reducir la densidad de la columna de fluido, disminuyendo la presión de fondo y permitiendo que el yacimiento fluya.

## Principio de funcionamiento
El gas se inyecta desde la superficie a través del espacio anular y entra al tubing a través de mandriles (válvulas) a profundidades específicas. Al mezclarse con el fluido, reduce la densidad promedio de la columna, disminuyendo la presión hidrostática.

## Tipos de Gas Lift
1. Gas Lift Continuo: Inyección constante para mantener producción. Más común.
2. Gas Lift Intermittente: Inyección intermitente en baches. Para pozos de baja productividad.

## Componentes del sistema
- Compresor de gas: Eleva la presión del gas de inyección
- Línea de inyección: Transporta el gas al cabezal
- Mandriles: Alojan las válvulas a diferentes profundidades
- Válvulas de gas lift: Regulan la entrada de gas al tubing
- Separador: Separa el gas del líquido producido

## Ventajas
- No tiene partes móviles en el fondo del pozo
- Maneja altos caudales
- Flexible: se adapta a cambios de producción
- Tolerante a arena y gas
- Bajo mantenimiento en fondo

## Limitaciones
- Requiere disponibilidad de gas de inyección
- Necesita compresores (alto CAPEX)
- No apto para crudos muy viscosos
- Requiere presión de gas suficiente (> 800-1500 psi)'
WHERE title = 'Principios del Gas Lift' AND body LIKE 'El Gas Lift es un sistema%';

UPDATE modules SET body = 'Los riesgos principales en operaciones de levantamiento artificial incluyen múltiples peligros que requieren controles específicos.

## Riesgos por tipo de sistema

### BES (Bombas Electrosumergibles)
- Alta tensión eléctrica: Los motores operan a 480V-4,160V. Riesgo de electrocución y arco eléctrico.
- Sobrecalentamiento: Falla del motor puede generar incendio.
- Trabajo en altura: Intervención del cabezal requiere trabajo elevado.

### PCP / BCS (Bombeo de Cavidad)
- Rotación de partes: El drivehead gira a 100-500 RPM. Riesgo de atrapamiento.
- Torque elevado: Rotura de varilla puede liberar energía almacenada.
- Fugas de fluido: El drivehead puede liberar hidrocarburos.

### Gas Lift
- Presión de gas: Líneas a 1,000-2,000 psi. Riesgo de explosión.
- H2S: Gas tóxico presente en muchos yacimientos. Letal a 700 ppm.
- Congelamiento por Joule-Thomson: Las válvulas pueden congelarse.

## Riesgos comunes
- Trabajo en altura
- Manipulación de cargas pesadas
- Exposición a H2S
- Espacios confinados
- Clima extremo
- Ruido industrial

## Controles obligatorios
- Análisis de riesgo (JSA) antes de cada tarea
- Permiso de trabajo específico
- LOTO (Lockout/Tagout) para aislamiento de energía
- EPP completo (casco, lentes, guantes, calzado dieléctrico)
- Detector personal de H2S
- Plan de respuesta a emergencias'
WHERE title = 'Riesgos Específicos de Levantamiento Artificial' AND body LIKE 'Los riesgos principales%';

-- ============================================================
-- 2. AGREGAR MÓDULOS ADICIONALES A CURSOS CON POCOS MÓDULOS
-- ============================================================

-- LA-203 (BCS): Agregar 2 módulos más
INSERT INTO modules (course_id, title, type, duration, duration_minutes, body, order_index, is_required, is_free_preview)
SELECT c.id, v.title, v.type, v.duration, v.minutes, v.body, v.ord, true, v.preview
FROM courses c
JOIN (VALUES
  ('LA-203', 'Operación y Monitoreo de BCS', 'text', '25 min', 25, 'La operación de un sistema BCS requiere monitoreo continuo de varios parámetros para asegurar eficiencia y prevenir fallas.

## Parámetros de monitoreo
- Torque (ft-lb): Indica la carga del sistema. Un aumento repentino puede señalar bloqueo por arena o desgaste del estator.
- RPM: Velocidad de rotación del drivehead. Se ajusta según las condiciones del pozo.
- Caudal de producción (BPD): Verifica que el sistema entregue el volumen esperado.
- Temperatura del fluido: Debe estar dentro del rango del elastómero (menos de 130 grados C).
- Presión de fondo: Indica el comportamiento del yacimiento.
- Amperaje del motor: Un aumento puede indicar sobrecarga.

## Procedimientos de operación
1. Arranque: Verificar alineación, lubricación del drivehead, abrir válvulas gradualmente.
2. Operación normal: Monitorear parámetros cada 2 horas, registrar tendencias.
3. Ajuste de RPM: Modificar gradualmente, no más de 50 RPM por ajuste.
4. Parada programada: Cerrar válvula de descarga, detener motor, registrar motivo.
5. Parada de emergencia: Botón de paro, aislar energía, investigar causa antes de re-arrancar.

## Indicadores de problemas
- Aumento progresivo de torque: Desgaste del estator o bloqueo por arena
- Caida de caudal con torque normal: Fuga en tubing o desprendimiento del rotor
- Vibración excesiva: Desalineación o centralizadores dañados
- Temperatura elevada: Sobrecarga o degradación del elastómero', 4, false),
  ('LA-203', 'Comparativa Técnica: BCS vs PCP', 'text', '20 min', 20, 'La comparación entre BCS y PCP es fundamental para la selección del sistema adecuado en cada aplicacion.

## Tabla comparativa

Caracteristica | PCP | BCS
Material del estator | Elastomero natural o sintetico | Elastomero sintetico avanzado
Resistencia a temperatura | Hasta 120C | Hasta 150C
Resistencia a abrasivos | Moderada | Alta
Vida util del estator | 12-18 meses | 18-30 meses
Costo del estator | Menor | Mayor (30-50% mas)
Eficiencia energetica | 70-80% | 75-85%
Caudal maximo | 2,000 BPD | 1,500 BPD

## Criterios de seleccion
- Elegir PCP cuando: El crudo es muy viscoso, el presupuesto es ajustado, la temperatura es moderada (menos de 120C).
- Elegir BCS cuando: La temperatura es alta (120-150C), hay contenido significativo de arena, se busca mayor vida util y menor frecuencia de intervencion.

## Consideracion economica
Aunque el BCS tiene un costo inicial mayor, el menor numero de intervenciones y la mayor vida util del estator pueden resultar en un menor costo total de propiedad (TCO) a lo largo de 3-5 años.', 5, false)
) AS v(code, title, type, duration, minutes, body, ord, preview)
ON c.code = v.code;

-- LA-501 (Optimizacion): Agregar 1 modulo mas
INSERT INTO modules (course_id, title, type, duration, duration_minutes, body, order_index, is_required, is_free_preview)
SELECT c.id, v.title, v.type, v.duration, v.minutes, v.body, v.ord, true, v.preview
FROM courses c
JOIN (VALUES
  ('LA-501', 'Análisis de Datos de Producción', 'text', '25 min', 25, 'El análisis de datos de producción es fundamental para la optimización continua de los sistemas de levantamiento artificial.

## Tipos de datos a analizar
- Producción diaria: Caudal de petróleo, agua y gas
- Parámetros de operación: Frecuencia (Hz), amperaje, torque, RPM
- Presiones: Presión de fondo (Pwf), presión de tubing (Pth), presión de línea
- Temperaturas: Temperatura de fondo, temperatura del motor
- Eventos: Paradas, arranques, alarmas, intervenciones

## Herramientas de análisis
1. Gráficos de tendencia: Visualización de producción vs tiempo para detectar declinación.
2. Análisis de correlación: Relación entre parámetros (ej: frecuencia vs caudal).
3. Análisis de declinación: Curva de declinación exponencial o hiperbólica.
4. Detección de anomalías: Identificación de cambios bruscos en tendencias.
5. Benchmarking: Comparación entre pozos similares del mismo campo.

## Indicadores clave (KPIs)
- Disponibilidad (%): Tiempo operativo / tiempo total
- MTBF: Tiempo medio entre fallas
- MTTR: Tiempo medio de reparación
- Costo por barril (OPEX/bbl): Costo de levantamiento por barril producido
- Eficiencia del sistema (%): Producción actual / producción potencial

## Frecuencia recomendada
- Diario: Revisión de producción y alarmas
- Semanal: Análisis de tendencias y comparación entre pozos
- Mensual: Análisis de declinación y planificación de intervenciones
- Trimestral: Optimización de parámetros y evaluación de KPIs', 4, false)
) AS v(code, title, type, duration, minutes, body, ord, preview)
ON c.code = v.code;

-- QC-301: Agregar 1 modulo mas
INSERT INTO modules (course_id, title, type, duration, duration_minutes, body, order_index, is_required, is_free_preview)
SELECT c.id, v.title, v.type, v.duration, v.minutes, v.body, v.ord, true, v.preview
FROM courses c
JOIN (VALUES
  ('QC-301', 'Trazabilidad y Gestión de Calidad', 'text', '25 min', 25, 'La trazabilidad es la capacidad de rastrear el historial completo de un equipo desde su fabricación hasta su disposición final.

## Elementos de trazabilidad
- Identificación única: Número de serie, código QR, etiqueta RFID
- Registro de fabricación: Fecha, lote, especificaciones, certificados de material
- Registro de instalación: Fecha, pozo, profundidad, condiciones iniciales
- Historial de operación: Parámetros, producción, eventos, alarmas
- Historial de mantenimiento: Fechas, tipo de intervención, repuestos, técnicos
- Disposición final: Baja, reacondicionamiento, reubicación

## Normas de gestión de calidad
- ISO 9001: Sistema de gestión de calidad general
- API Q1: Especificación para productos de la industria del petróleo y gas
- ISO/TS 29001: Sector específico petróleo y gas
- ASME: Para equipos a presión

## Documentación obligatoria
1. Certificado de calidad del fabricante (MTR - Material Test Report)
2. Certificado de conformidad con normas API
3. Reporte de inspección inicial
4. Plan de mantenimiento preventivo
5. Registros de cada intervención
6. Reporte de disposición final

## Auditorías de calidad
- Internas: Realizadas por la empresa
- De segunda parte: Realizadas por el cliente
- De tercera parte: Realizadas por organismos certificados (ABS, DNV, TUV)

## Importancia
- Permite identificar la causa raíz de fallas
- Facilita el análisis de vida útil
- Cumple requisitos regulatorios
- Soporta decisiones de reemplazo
- Protege contra reclamos de garantía', 4, false)
) AS v(code, title, type, duration, minutes, body, ord, preview)
ON c.code = v.code;

-- ============================================================
-- 3. AGREGAR PREGUNTAS DE EXAMEN A CURSOS CON POCAS PREGUNTAS
-- ============================================================

-- LA-203 (BCS): 0 preguntas -> agregar 5
INSERT INTO exam_questions (course_id, question, options, correct_index, difficulty, points, order_index)
SELECT c.id, v.question, v.options::jsonb, v.correct, v.difficulty, v.points, v.ord
FROM courses c
JOIN (VALUES
  ('LA-203', '¿Qué es el sistema BCS (Bombeo de Cavidad Sintética)?', '["Una evolución del PCP con estator de materiales sintéticos avanzados","Un sistema de gas lift","Un tipo de bomba centrífuga","Un sistema de inyección de químicos"]', 0, 'easy', 10, 0),
  ('LA-203', '¿Cuál es la principal ventaja del estator sintético en BCS sobre el PCP convencional?', '["Mayor resistencia a temperatura y abrasión","Menor costo inicial","Mayor caudal máximo","Menor consumo de energía"]', 0, 'medium', 10, 1),
  ('LA-203', '¿Hasta qué temperatura típica puede operar un sistema BCS?', '["150°C","100°C","200°C","80°C"]', 0, 'medium', 10, 2),
  ('LA-203', '¿Qué se debe verificar durante el mantenimiento del estator de BCS?', '["Degradación, hinchazón y tolerancia rotor-estator","Solo el color del elastómero","Solo el nivel de aceite","Solo la presión de descarga"]', 0, 'hard', 10, 3),
  ('LA-203', '¿Cuál es la vida útil típica de un estator BCS?', '["18-30 meses","6-12 meses","5 años","3 meses"]', 0, 'medium', 10, 4)
) AS v(code, question, options, correct, difficulty, points, ord)
ON c.code = v.code;

-- LA-202 (PCP): agregar 3 mas
INSERT INTO exam_questions (course_id, question, options, correct_index, difficulty, points, order_index)
SELECT c.id, v.question, v.options::jsonb, v.correct, v.difficulty, v.points, v.ord
FROM courses c
JOIN (VALUES
  ('LA-202', '¿Qué tipo de motor puede utilizar un sistema PCP en superficie?', '["Eléctrico o hidráulico","Solo neumático","Solo de combustión interna","Solo solar"]', 0, 'medium', 10, 4),
  ('LA-202', '¿Qué problema puede causar la rotura de varilla en PCP?', '["Fatiga por torque excesivo o cavitación","Exceso de lubricación","Baja temperatura","Falta de arena"]', 0, 'hard', 10, 5),
  ('LA-202', '¿Qué sensores se recomienda instalar en el fondo para detección temprana de problemas en PCP?', '["Sensores de torque, RPM y temperatura","Sensores de pH","Sensores de humedad","Sensores de luz"]', 0, 'medium', 10, 6)
) AS v(code, question, options, correct, difficulty, points, ord)
ON c.code = v.code;

-- LA-204 (Gas Lift): agregar 3 mas
INSERT INTO exam_questions (course_id, question, options, correct_index, difficulty, points, order_index)
SELECT c.id, v.question, v.options::jsonb, v.correct, v.difficulty, v.points, v.ord
FROM courses c
JOIN (VALUES
  ('LA-204', '¿Qué método se utiliza para el diseño óptimo de mandriles de gas lift?', '["Método de ACOPI o método de gradiente","Método de Newton","Método de Euler","Método de Monte Carlo"]', 0, 'hard', 10, 4),
  ('LA-204', '¿Qué es la relación gas-líquido (GLR) en Gas Lift?', '["La cantidad de gas inyectado por barril de líquido producido","La presión del gas en superficie","La temperatura del gas de inyección","El volumen del mandril"]', 0, 'medium', 10, 5),
  ('LA-204', '¿Qué componentes conforman un sistema de Gas Lift en superficie?', '["Compresor, línea de inyección y separador","Solo tubing y varillas","Motor y bomba","VSD y tablero"]', 0, 'easy', 10, 6)
) AS v(code, question, options, correct, difficulty, points, ord)
ON c.code = v.code;

-- LA-401 (Diagnostico): agregar 3 mas
INSERT INTO exam_questions (course_id, question, options, correct_index, difficulty, points, order_index)
SELECT c.id, v.question, v.options::jsonb, v.correct, v.difficulty, v.points, v.ord
FROM courses c
JOIN (VALUES
  ('LA-401', '¿Qué patrón produce el gas locking en una carta dinométrica?', '["Forma aplanada en la parte superior","Forma ovalada perfecta","Forma triangular","Forma de reloj de arena"]', 0, 'hard', 10, 4),
  ('LA-401', '¿Qué es un amplograma en el diagnóstico de BES?', '["Gráfico de corriente del motor vs tiempo","Gráfico de presión vs temperatura","Gráfico de caudal vs viscosidad","Gráfico de torque vs RPM"]', 0, 'medium', 10, 5),
  ('LA-401', '¿Qué causa los hidratos en válvulas de Gas Lift?', '["Combinación de baja temperatura y alta presión con agua","Exceso de calor en el pozo","Falta de presión de gas","Exceso de producción de petróleo"]', 0, 'hard', 10, 6)
) AS v(code, question, options, correct, difficulty, points, ord)
ON c.code = v.code;

-- HSE-201: agregar 3 mas
INSERT INTO exam_questions (course_id, question, options, correct_index, difficulty, points, order_index)
SELECT c.id, v.question, v.options::jsonb, v.correct, v.difficulty, v.points, v.ord
FROM courses c
JOIN (VALUES
  ('HSE-201', '¿Qué debe tener cada locación para emergencias?', '["Plan de respuesta, rutas de evacuación, detectores de H2S y extintores","Solo extintores","Solo un botiquín","Solo teléfono"]', 0, 'medium', 10, 3),
  ('HSE-201', '¿A qué concentración es letal el H2S?', '["700 ppm","100 ppm","50 ppm","10 ppm"]', 0, 'hard', 10, 4),
  ('HSE-201', '¿Qué EPP es obligatorio en operaciones de levantamiento artificial?', '["Casco, lentes, guantes y calzado dieléctrico","Solo casco","Solo guantes","Solo lentes"]', 0, 'easy', 10, 5)
) AS v(code, question, options, correct, difficulty, points, ord)
ON c.code = v.code;

-- LA-501 (Optimizacion): agregar 3 mas
INSERT INTO exam_questions (course_id, question, options, correct_index, difficulty, points, order_index)
SELECT c.id, v.question, v.options::jsonb, v.correct, v.difficulty, v.points, v.ord
FROM courses c
JOIN (VALUES
  ('LA-501', '¿Qué es la disponibilidad como KPI en levantamiento artificial?', '["Tiempo operativo dividido por tiempo total","Producción dividida por costo","Frecuencia dividida por amperaje","Torque dividido por RPM"]', 0, 'medium', 10, 3),
  ('LA-501', '¿Qué es el MTBF?', '["Tiempo Medio Entre Fallas","Máxima Temperatura de Bombeo de Fluido","Método de Troubleshooting Básico de Fallas","Medición de Tasa de Bajada de Fluidos"]', 0, 'medium', 10, 4),
  ('LA-501', '¿Con qué frecuencia se recomienda el análisis de declinación?', '["Mensual","Diaria","Cada 5 años","Solo al final de la vida del pozo"]', 0, 'easy', 10, 5)
) AS v(code, question, options, correct, difficulty, points, ord)
ON c.code = v.code;

-- QC-301: agregar 3 mas
INSERT INTO exam_questions (course_id, question, options, correct_index, difficulty, points, order_index)
SELECT c.id, v.question, v.options::jsonb, v.correct, v.difficulty, v.points, v.ord
FROM courses c
JOIN (VALUES
  ('QC-301', '¿Qué norma ISO aplica específicamente al sector petróleo y gas?', '["ISO/TS 29001","ISO 14001","ISO 27001","ISO 22000"]', 0, 'medium', 10, 3),
  ('QC-301', '¿Qué es la trazabilidad de equipos?', '["Capacidad de rastrear el historial completo del equipo desde fabricación hasta disposición final","Medición del caudal del pozo","Análisis de la composición del crudo","Inspección visual del equipo"]', 0, 'easy', 10, 4),
  ('QC-301', '¿Quién realiza las auditorías de tercera parte?', '["Organismos certificados como ABS, DNV, TÜV","El operador del pozo","El técnico de mantenimiento","El supervisor de turno"]', 0, 'medium', 10, 5)
) AS v(code, question, options, correct, difficulty, points, ord)
ON c.code = v.code;

-- MT-301: agregar 2 mas
INSERT INTO exam_questions (course_id, question, options, correct_index, difficulty, points, order_index)
SELECT c.id, v.question, v.options::jsonb, v.correct, v.difficulty, v.points, v.ord
FROM courses c
JOIN (VALUES
  ('MT-301', '¿Qué permite el VSD además de controlar la velocidad?', '["Arranque suave, protección del motor y optimización energética","Medir el caudal del pozo","Filtrar el fluido producido","Generar energía eléctrica"]', 0, 'medium', 10, 3),
  ('MT-301', '¿Qué parámetros clave se configuran en un VSD?', '["Frecuencia mín/máx, rampa de aceleración, límites de corriente, compensación de voltaje","Color del tablero, tamaño del gabinete, tipo de cable","Presión de descarga, temperatura ambiente, humedad relativa","Modelo del motor, fabricante, año de instalación"]', 0, 'hard', 10, 4)
) AS v(code, question, options, correct, difficulty, points, ord)
ON c.code = v.code;

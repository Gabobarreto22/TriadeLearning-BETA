import { useState, useEffect } from 'react';
import {
  BookOpen, ChevronRight, FileText, Search, Award, BarChart3, Bell, Users, Settings,
  Star, Check, ShieldCheck, Mail, Lock, Building2, History, Plus, Trash2, Clock,
  PlayCircle, FileText as FileIcon, Image, Video, Presentation, ArrowRight, ArrowDown,
  TrendingUp, Download, AlertTriangle, Info, CheckCircle, XCircle, BellRing, Palette,
  Eye, Filter, Zap, User, FileCheck, Calendar,
} from 'lucide-react';
import type { DocSection, DocVisual, DocsLabels } from '@/lib/docs';

function VisualExample({ kind }: { kind: DocVisual }) {
  switch (kind) {
    case 'stat-cards':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Vista previa de las tarjetas</div>
          <div className="docs-mock-stats">
            <div className="docs-mock-stat"><div className="docs-mock-icon g1"><BookOpen size={16} /></div><div><strong>12</strong><span>Cursos totales</span></div></div>
            <div className="docs-mock-stat"><div className="docs-mock-icon g2"><Users size={16} /></div><div><strong>48</strong><span>Usuarios totales</span></div></div>
            <div className="docs-mock-stat"><div className="docs-mock-icon g4"><Check size={16} /></div><div><strong>6</strong><span>Cargos totales</span></div></div>
            <div className="docs-mock-stat"><div className="docs-mock-icon g3"><Award size={16} /></div><div><strong>23</strong><span>Certificados totales</span></div></div>
          </div>
        </div>
      );
    case 'quick-links':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Vista previa de accesos rápidos</div>
          <div className="docs-mock-links">
            <div className="docs-mock-link"><BookOpen size={20} /><strong>Cursos</strong><span>Ver todos</span></div>
            <div className="docs-mock-link"><Users size={20} /><strong>Personal</strong><span>Ver todos</span></div>
            <div className="docs-mock-link"><Award size={20} /><strong>Certificaciones</strong><span>Ver todos</span></div>
            <div className="docs-mock-link"><BarChart3 size={20} /><strong>Reportes</strong><span>Ver todos</span></div>
          </div>
        </div>
      );
    case 'course-list':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Vista previa de lista de cursos</div>
          <div className="docs-mock-list">
            <div className="docs-mock-row"><div className="docs-mock-course-icon blue"><BookOpen size={16} /></div><div><strong>Seguridad Industrial Básica</strong><small>5 módulos · 3 cargos asignados</small></div></div>
            <div className="docs-mock-row"><div className="docs-mock-course-icon green"><BookOpen size={16} /></div><div><strong>Mantenimiento Preventivo</strong><small>4 módulos · 2 cargos asignados</small></div></div>
            <div className="docs-mock-row"><div className="docs-mock-course-icon orange"><BookOpen size={16} /></div><div><strong>Emergencias y Contingencias</strong><small>3 módulos · 4 cargos asignados</small></div></div>
          </div>
        </div>
      );
    case 'feedback-list':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Vista previa de feedback reciente</div>
          <div className="docs-mock-list">
            <div className="docs-mock-row"><div className="docs-mock-avatar">JP</div><div><strong>Juan Pérez</strong><small>Mantenimiento Preventivo</small></div><span className="docs-mock-stars">★★★★</span></div>
            <div className="docs-mock-row"><div className="docs-mock-avatar">MG</div><div><strong>María Gómez</strong><small>Seguridad Industrial Básica</small></div><span className="docs-mock-stars">★★★★★</span></div>
          </div>
        </div>
      );
    case 'pass-rate':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Cálculo de la tasa de aprobación</div>
          <div className="docs-mock-formula">
            <div className="docs-mock-formula-box"><strong>8</strong><span>Exámenes aprobados</span></div>
            <div className="docs-mock-formula-op">÷</div>
            <div className="docs-mock-formula-box"><strong>10</strong><span>Total de intentos</span></div>
            <div className="docs-mock-formula-op">=</div>
            <div className="docs-mock-formula-result"><strong>80%</strong><span>Tasa de aprobación</span></div>
          </div>
        </div>
      );
    case 'completion-bar':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Vista previa del porcentaje de completación</div>
          <div className="docs-mock-completion">
            <div className="docs-mock-completion-header"><span>Completación promedio</span><strong>65%</strong></div>
            <div className="docs-mock-bar-track"><div className="docs-mock-bar-fill" style={{ width: '65%' }} /></div>
            <div className="docs-mock-completion-detail">
              <div className="docs-mock-completion-item"><Check size={14} /><span>Promedio de progreso de asignaciones activas</span></div>
            </div>
          </div>
        </div>
      );

    // ===== PERSONNEL =====
    case 'employee-form':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Formulario de nuevo usuario</div>
          <div className="docs-mock-form">
            <div className="docs-mock-form-row"><User size={16} /><div className="docs-mock-field"><span>Nombre completo</span><div className="docs-mock-input">Juan Pérez</div></div></div>
            <div className="docs-mock-form-row"><Mail size={16} /><div className="docs-mock-field"><span>Correo electrónico</span><div className="docs-mock-input">juan.perez@empresa.com</div></div></div>
            <div className="docs-mock-form-row"><Lock size={16} /><div className="docs-mock-field"><span>Contraseña</span><div className="docs-mock-input">••••••••</div></div></div>
            <div className="docs-mock-form-row"><ShieldCheck size={16} /><div className="docs-mock-field"><span>Cargo</span><div className="docs-mock-select">Técnico de Mantenimiento</div></div></div>
            <div className="docs-mock-form-row"><Building2 size={16} /><div className="docs-mock-field"><span>Departamento</span><div className="docs-mock-select">Operaciones</div></div></div>
          </div>
        </div>
      );
    case 'department-list':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Lista de departamentos</div>
          <div className="docs-mock-list">
            <div className="docs-mock-row"><div className="docs-mock-dept-icon"><Building2 size={16} /></div><div><strong>Operaciones</strong><small>OPS · Mantenimiento y producción</small></div></div>
            <div className="docs-mock-row"><div className="docs-mock-dept-icon"><Building2 size={16} /></div><div><strong>Seguridad</strong><small>SEG · Seguridad industrial</small></div></div>
            <div className="docs-mock-row"><div className="docs-mock-dept-icon"><Building2 size={16} /></div><div><strong>Recursos Humanos</strong><small>RH · Gestión de personal</small></div></div>
          </div>
        </div>
      );
    case 'role-assignment':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Asignación de cursos a un cargo</div>
          <div className="docs-mock-assignment">
            <div className="docs-mock-assignment-role"><ShieldCheck size={18} /><strong>Técnico de Mantenimiento</strong></div>
            <div className="docs-mock-assignment-courses">
              <div className="docs-mock-assignment-course"><BookOpen size={14} /><span>Seguridad Industrial</span><span className="docs-mock-priority high">Alta</span></div>
              <div className="docs-mock-assignment-course"><BookOpen size={14} /><span>Mantenimiento Preventivo</span><span className="docs-mock-priority medium">Media</span></div>
              <div className="docs-mock-assignment-course"><BookOpen size={14} /><span>Emergencias</span><span className="docs-mock-priority critical">Crítica</span></div>
            </div>
          </div>
        </div>
      );
    case 'history-timeline':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Historial de cambios de cargo</div>
          <div className="docs-mock-timeline">
            <div className="docs-mock-timeline-item">
              <div className="docs-mock-timeline-dot active" />
              <div className="docs-mock-timeline-content"><strong>Técnico de Mantenimiento</strong><small>01/01/2026 — Actual · Cargo actual</small></div>
            </div>
            <div className="docs-mock-timeline-item">
              <div className="docs-mock-timeline-dot" />
              <div className="docs-mock-timeline-content"><strong>Operador Junior</strong><small>15/06/2025 — 31/12/2025 · Ascenso</small></div>
            </div>
            <div className="docs-mock-timeline-item">
              <div className="docs-mock-timeline-dot" />
              <div className="docs-mock-timeline-content"><strong>Aprendiz</strong><small>01/03/2025 — 14/06/2025 · Ingreso</small></div>
            </div>
          </div>
        </div>
      );
    case 'requirements-table':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Tabla de requisitos por cargo</div>
          <div className="docs-mock-table">
            <div className="docs-mock-table-header">
              <span>Curso</span><span>Obligatorio</span><span>Prioridad</span><span>Días</span>
            </div>
            <div className="docs-mock-table-row"><span>Seguridad Industrial</span><span className="docs-mock-badge">Sí</span><span className="docs-mock-priority high">Alta</span><span>30</span></div>
            <div className="docs-mock-table-row"><span>Mantenimiento Preventivo</span><span className="docs-mock-badge">Sí</span><span className="docs-mock-priority medium">Media</span><span>45</span></div>
            <div className="docs-mock-table-row"><span>Gas Lift Básico</span><span className="docs-mock-badge no">No</span><span className="docs-mock-priority low">Baja</span><span>90</span></div>
          </div>
        </div>
      );

    // ===== COURSES =====
    case 'course-editor-tabs':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Pestañas del editor de cursos</div>
          <div className="docs-mock-tabs">
            <div className="docs-mock-tab active"><Info size={14} /><span>Información</span></div>
            <div className="docs-mock-tab"><BookOpen size={14} /><span>Módulos</span></div>
            <div className="docs-mock-tab"><FileCheck size={14} /><span>Exámenes</span></div>
            <div className="docs-mock-tab"><Users size={14} /><span>Asignaciones</span></div>
            <div className="docs-mock-tab"><ArrowRight size={14} /><span>Prerrequisitos</span></div>
          </div>
        </div>
      );
    case 'module-types':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Tipos de módulo disponibles</div>
          <div className="docs-mock-module-types">
            <div className="docs-mock-module-type"><FileText size={20} /><strong>Texto</strong><span>Lectura</span></div>
            <div className="docs-mock-module-type"><Image size={20} /><strong>Imagen</strong><span>Infografía</span></div>
            <div className="docs-mock-module-type"><Video size={20} /><strong>Video</strong><span>YouTube / Vimeo</span></div>
            <div className="docs-mock-module-type"><FileIcon size={20} /><strong>PDF</strong><span>Documento</span></div>
            <div className="docs-mock-module-type"><Presentation size={20} /><strong>PPT</strong><span>PowerPoint</span></div>
          </div>
        </div>
      );
    case 'exam-question-form':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Formulario de pregunta de examen</div>
          <div className="docs-mock-exam-form">
            <div className="docs-mock-field"><span>Pregunta</span><div className="docs-mock-input">¿Qué significa EPP?</div></div>
            <div className="docs-mock-field"><span>Opciones (una por línea)</span><div className="docs-mock-textarea">Equipo de Protección Personal\nEquipo de Prevención de Plagas\nEquipo de Prueba de Presión</div></div>
            <div className="docs-mock-exam-row">
              <div className="docs-mock-field small"><span>Índice correcto</span><div className="docs-mock-input center">0</div></div>
              <div className="docs-mock-field small"><span>Dificultad</span><div className="docs-mock-select">Fácil</div></div>
              <div className="docs-mock-field small"><span>Puntos</span><div className="docs-mock-input center">10</div></div>
            </div>
          </div>
        </div>
      );
    case 'assignment-form':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Formulario de asignación</div>
          <div className="docs-mock-assignment-form">
            <div className="docs-mock-field"><span>Cargo</span><div className="docs-mock-select">Técnico de Mantenimiento</div></div>
            <div className="docs-mock-assignment-row">
              <div className="docs-mock-field small"><span>Obligatorio</span><div className="docs-mock-toggle on">Sí</div></div>
              <div className="docs-mock-field small"><span>Prioridad</span><div className="docs-mock-select">Alta</div></div>
              <div className="docs-mock-field small"><span>Días límite</span><div className="docs-mock-input center">30</div></div>
            </div>
          </div>
        </div>
      );
    case 'prerequisite-chain':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Cadena de prerrequisitos</div>
          <div className="docs-mock-chain">
            <div className="docs-mock-chain-item done"><Check size={16} /><span>Seguridad Industrial Básica</span></div>
            <ArrowRight size={18} className="docs-mock-chain-arrow" />
            <div className="docs-mock-chain-item current"><PlayCircle size={16} /><span>Mantenimiento Preventivo</span></div>
            <ArrowRight size={18} className="docs-mock-chain-arrow" />
            <div className="docs-mock-chain-item locked"><Lock size={16} /><span>Gas Lift Avanzado</span></div>
          </div>
        </div>
      );

    // ===== CERTIFICATIONS =====
    case 'certificate-card':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Vista previa de un certificado</div>
          <div className="docs-mock-cert">
            <div className="docs-mock-cert-header"><Award size={24} /><span>Certificado de Finalización</span></div>
            <div className="docs-mock-cert-body">
              <small>Otorgado a</small>
              <strong>Juan Pérez</strong>
              <small>Por completar satisfactoriamente</small>
              <strong>Seguridad Industrial Básica</strong>
            </div>
            <div className="docs-mock-cert-footer">
              <div><small>N° de certificado</small><strong>TRIADE-SEG101-2026-001</strong></div>
              <div><small>Fecha de emisión</small><strong>15/09/2026</strong></div>
            </div>
          </div>
        </div>
      );
    case 'role-cert-badge':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Certificación de cargo</div>
          <div className="docs-mock-role-cert">
            <div className="docs-mock-role-cert-icon"><ShieldCheck size={22} /></div>
            <div className="docs-mock-role-cert-info">
              <strong>Técnico de Mantenimiento</strong>
              <small>Juan Pérez</small>
            </div>
            <div className="docs-mock-role-cert-status valid"><CheckCircle size={16} /><span>Vigente</span></div>
          </div>
          <div className="docs-mock-role-cert">
            <div className="docs-mock-role-cert-icon"><ShieldCheck size={22} /></div>
            <div className="docs-mock-role-cert-info">
              <strong>Operador Senior</strong>
              <small>María Gómez</small>
            </div>
            <div className="docs-mock-role-cert-status expired"><XCircle size={16} /><span>Expirado</span></div>
          </div>
        </div>
      );

    // ===== FEEDBACK =====
    case 'feedback-form':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Formulario de feedback del empleado</div>
          <div className="docs-mock-feedback-form">
            <div className="docs-mock-field"><span>Calificación (1-5 estrellas)</span><div className="docs-mock-stars-input">★★★★☆</div></div>
            <div className="docs-mock-field"><span>¿Recomendaría este curso?</span><div className="docs-mock-toggle-row"><span className="docs-mock-toggle on">Sí</span><span className="docs-mock-toggle">No</span></div></div>
            <div className="docs-mock-field"><span>Dificultad percibida</span><div className="docs-mock-select">Media</div></div>
            <div className="docs-mock-field"><span>Comentario</span><div className="docs-mock-textarea">Muy útil para el día a día</div></div>
          </div>
        </div>
      );
    case 'rating-breakdown':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Desglose de calificaciones</div>
          <div className="docs-mock-rating-breakdown">
            <div className="docs-mock-rating-row"><span>5★</span><div className="docs-mock-bar-track small"><div className="docs-mock-bar-fill green" style={{ width: '60%' }} /></div><strong>12</strong></div>
            <div className="docs-mock-rating-row"><span>4★</span><div className="docs-mock-bar-track small"><div className="docs-mock-bar-fill blue" style={{ width: '25%' }} /></div><strong>5</strong></div>
            <div className="docs-mock-rating-row"><span>3★</span><div className="docs-mock-bar-track small"><div className="docs-mock-bar-fill yellow" style={{ width: '10%' }} /></div><strong>2</strong></div>
            <div className="docs-mock-rating-row"><span>2★</span><div className="docs-mock-bar-track small"><div className="docs-mock-bar-fill orange" style={{ width: '5%' }} /></div><strong>1</strong></div>
            <div className="docs-mock-rating-row"><span>1★</span><div className="docs-mock-bar-track small"><div className="docs-mock-bar-fill red" style={{ width: '0%' }} /></div><strong>0</strong></div>
            <div className="docs-mock-rating-summary"><Star size={16} /><strong>4.4</strong><span>Promedio</span></div>
          </div>
        </div>
      );

    // ===== NOTIFICATIONS =====
    case 'notification-types':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Tipos de notificación</div>
          <div className="docs-mock-notif-types">
            <div className="docs-mock-notif-type info"><Info size={18} /><div><strong>Información</strong><span>Avisos generales</span></div></div>
            <div className="docs-mock-notif-type warning"><AlertTriangle size={18} /><div><strong>Advertencia</strong><span>Alertas importantes</span></div></div>
            <div className="docs-mock-notif-type success"><CheckCircle size={18} /><div><strong>Éxito</strong><span>Logros completados</span></div></div>
            <div className="docs-mock-notif-type error"><XCircle size={18} /><div><strong>Error</strong><span>Problemas detectados</span></div></div>
            <div className="docs-mock-notif-type reminder"><BellRing size={18} /><div><strong>Recordatorio</strong><span>Plazos pendientes</span></div></div>
          </div>
        </div>
      );
    case 'notification-form':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Formulario de notificación</div>
          <div className="docs-mock-form">
            <div className="docs-mock-form-row"><Bell size={16} /><div className="docs-mock-field"><span>Tipo</span><div className="docs-mock-select">Recordatorio</div></div></div>
            <div className="docs-mock-form-row"><FileText size={16} /><div className="docs-mock-field"><span>Título</span><div className="docs-mock-input">Curso pendiente</div></div></div>
            <div className="docs-mock-form-row"><Mail size={16} /><div className="docs-mock-field"><span>Mensaje</span><div className="docs-mock-textarea">Tienes 15 días para completar el curso de Emergencias</div></div></div>
            <div className="docs-mock-form-row"><User size={16} /><div className="docs-mock-field"><span>Destinatario</span><div className="docs-mock-select">Juan Pérez</div></div></div>
          </div>
        </div>
      );

    // ===== REPORTS =====
    case 'compliance-chart':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Reporte de cumplimiento por cargo</div>
          <div className="docs-mock-compliance">
            <div className="docs-mock-compliance-row"><span>Técnico de Mantenimiento</span><div className="docs-mock-bar-track"><div className="docs-mock-bar-fill green" style={{ width: '85%' }} /></div><strong>85%</strong></div>
            <div className="docs-mock-compliance-row"><span>Operador Senior</span><div className="docs-mock-bar-track"><div className="docs-mock-bar-fill blue" style={{ width: '60%' }} /></div><strong>60%</strong></div>
            <div className="docs-mock-compliance-row"><span>Inspector</span><div className="docs-mock-bar-track"><div className="docs-mock-bar-fill yellow" style={{ width: '33%' }} /></div><strong>33%</strong></div>
            <div className="docs-mock-compliance-row"><span>Aprendiz</span><div className="docs-mock-bar-track"><div className="docs-mock-bar-fill orange" style={{ width: '15%' }} /></div><strong>15%</strong></div>
          </div>
        </div>
      );
    case 'progress-table':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Reporte de progreso individual</div>
          <div className="docs-mock-table">
            <div className="docs-mock-table-header"><span>Empleado</span><span>Curso</span><span>Progreso</span><span>Estado</span></div>
            <div className="docs-mock-table-row"><span>Juan Pérez</span><span>Seguridad Industrial</span><div className="docs-mock-bar-track small"><div className="docs-mock-bar-fill green" style={{ width: '80%' }} /></div><span className="docs-mock-status in-progress">En progreso</span></div>
            <div className="docs-mock-table-row"><span>María Gómez</span><span>Mantenimiento Preventivo</span><div className="docs-mock-bar-track small"><div className="docs-mock-bar-fill blue" style={{ width: '100%' }} /></div><span className="docs-mock-status completed">Completado</span></div>
            <div className="docs-mock-table-row"><span>Carlos Ruiz</span><span>Emergencias</span><div className="docs-mock-bar-track small"><div className="docs-mock-bar-fill gray" style={{ width: '0%' }} /></div><span className="docs-mock-status pending">Pendiente</span></div>
          </div>
        </div>
      );
    case 'export-buttons':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Opciones de exportación</div>
          <div className="docs-mock-export">
            <div className="docs-mock-export-btn"><Download size={16} /><span>Excel</span></div>
            <div className="docs-mock-export-btn"><Download size={16} /><span>PDF</span></div>
            <div className="docs-mock-export-btn"><Download size={16} /><span>CSV</span></div>
          </div>
        </div>
      );

    // ===== SETTINGS =====
    case 'settings-categories':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Categorías de configuración</div>
          <div className="docs-mock-settings-cats">
            <div className="docs-mock-settings-cat active"><Settings size={18} /><strong>General</strong><span>Parámetros globales</span></div>
            <div className="docs-mock-settings-cat"><Palette size={18} /><strong>Branding</strong><span>Logos y colores</span></div>
            <div className="docs-mock-settings-cat"><Lock size={18} /><strong>Seguridad</strong><span>Contraseñas y sesiones</span></div>
          </div>
        </div>
      );
    case 'branding-preview':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Vista previa de branding</div>
          <div className="docs-mock-branding">
            <div className="docs-mock-branding-row"><span>Nombre de la organización</span><div className="docs-mock-input">TRIADE</div></div>
            <div className="docs-mock-branding-row"><span>Logo</span><div className="docs-mock-logo-preview"><Eye size={16} /><span>LOGO_POSITIVO.png</span></div></div>
            <div className="docs-mock-branding-row"><span>Umbral de aprobación</span><div className="docs-mock-input center">90%</div></div>
          </div>
        </div>
      );

    // ===== AUDIT =====
    case 'audit-log-table':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Tabla de registros de auditoría</div>
          <div className="docs-mock-table">
            <div className="docs-mock-table-header"><span>Usuario</span><span>Acción</span><span>Entidad</span><span>Fecha</span></div>
            <div className="docs-mock-table-row"><span>Admin Sistema</span><span className="docs-mock-action create">CREATE</span><span>Curso</span><span>04/09/2026</span></div>
            <div className="docs-mock-table-row"><span>Admin Sistema</span><span className="docs-mock-action update">UPDATE</span><span>Usuario</span><span>04/09/2026</span></div>
            <div className="docs-mock-table-row"><span>Admin Sistema</span><span className="docs-mock-action delete">DELETE</span><span>Insignia</span><span>05/09/2026</span></div>
          </div>
        </div>
      );
    case 'action-types':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Tipos de acciones registradas</div>
          <div className="docs-mock-action-types">
            <div className="docs-mock-action-type create"><Plus size={18} /><div><strong>CREATE</strong><span>Creación de un elemento</span></div></div>
            <div className="docs-mock-action-type update"><TrendingUp size={18} /><div><strong>UPDATE</strong><span>Edición de un elemento</span></div></div>
            <div className="docs-mock-action-type delete"><Trash2 size={18} /><div><strong>DELETE</strong><span>Eliminación de un elemento</span></div></div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

export function DocumentationModule({ sections, labels }: { sections: DocSection[]; labels: DocsLabels }) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = (e: Event) => {
      const docId = (e as CustomEvent<string>).detail;
      if (docId && sections.some((s) => s.id === docId)) {
        setActiveId(docId);
      }
    };
    window.addEventListener('docs:navigate', handler);
    return () => window.removeEventListener('docs:navigate', handler);
  }, [sections]);

  const filtered = sections.filter((s) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q) ||
      s.sections.some((sec) => sec.heading.toLowerCase().includes(q) || sec.body.toLowerCase().includes(q))
    );
  });

  const active: DocSection | undefined = sections.find((s) => s.id === activeId) ?? sections[0];

  return (
    <div className="page animate-in">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{labels.eyebrow}</p>
          <h1>{labels.title}</h1>
          <p className="muted">{labels.subtitle}</p>
        </div>
      </div>

      <div className="docs-layout">
        <aside className="docs-sidebar">
          <div className="docs-search">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={labels.searchPlaceholder}
            />
          </div>
          <nav className="docs-nav">
            {filtered.map((s) => (
              <button
                key={s.id}
                className={activeId === s.id ? 'docs-nav-item active' : 'docs-nav-item'}
                onClick={() => setActiveId(s.id)}
              >
                <FileText size={15} />
                <span>{s.title}</span>
                {activeId === s.id && <ChevronRight size={14} />}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="muted" style={{ padding: '16px 8px', fontSize: 12 }}>
                {labels.noResults}
              </p>
            )}
          </nav>
        </aside>

        <div className="docs-content">
          {active && (
            <>
              <div className="docs-header">
                <div className="docs-header-icon">
                  <BookOpen size={22} />
                </div>
                <div>
                  <h2>{active.title}</h2>
                  <p className="muted">{active.summary}</p>
                </div>
              </div>
              <div className="docs-sections">
                {active.sections.map((sec, i) => (
                  <article key={i} className="docs-article">
                    <h3>{sec.heading}</h3>
                    <p>{sec.body}</p>
                    {sec.visual && <VisualExample kind={sec.visual} />}
                    {sec.example && (
                      <div className="docs-example">
                        <strong>{labels.example}</strong>
                        <p>{sec.example}</p>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

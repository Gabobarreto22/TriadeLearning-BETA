function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch] as string);
}

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  try { return new Date(value).toLocaleDateString(); } catch { return value; }
}

const BASE_STYLE = `
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',Arial,sans-serif;color:#0f172a;padding:40px;font-size:13px;line-height:1.5}
  .header{display:flex;align-items:center;gap:14px;margin-bottom:24px;border-bottom:2px solid #1e293b;padding-bottom:16px}
  .header-logo{font-size:20px;font-weight:800;color:#1e293b;letter-spacing:-.02em}
  .header-sub{font-size:11px;color:#64748b;margin-top:2px}
  h1{font-size:22px;margin:0 0 4px;letter-spacing:-.02em}
  h2{font-size:17px;margin:28px 0 10px;padding-bottom:6px;border-bottom:1px solid #e2e8f0}
  h3{font-size:14px;margin:18px 0 8px;color:#334155}
  .muted{color:#64748b;font-size:12px}
  .meta{display:flex;gap:20px;margin-bottom:20px;font-size:11px;color:#64748b;flex-wrap:wrap}
  .meta-item{display:flex;flex-direction:column}
  .meta-item strong{color:#0f172a;font-size:13px;margin-top:2px}
  table{width:100%;border-collapse:collapse;margin-top:10px;font-size:12px}
  th{background:#f1f5f9;padding:9px 10px;text-align:left;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.03em;color:#475569;border-bottom:2px solid #e2e8f0}
  td{padding:8px 10px;border-bottom:1px solid #f1f5f9;vertical-align:top}
  tr:nth-child(even) td{background:#fafbfc}
  .badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.03em}
  .badge-green{background:#d1fae5;color:#065f46}
  .badge-red{background:#fee2e2;color:#991b1b}
  .badge-yellow{background:#fef3c7;color:#92400e}
  .badge-blue{background:#dbeafe;color:#1e40af}
  .badge-gray{background:#f3f4f6;color:#374151}
  .summary-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:16px 0}
  .summary-card{border:1px solid #e2e8f0;border-radius:8px;padding:12px}
  .summary-card strong{font-size:24px;display:block;font-weight:800}
  .summary-card span{font-size:11px;color:#64748b}
  .section{margin-bottom:28px}
  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 20px;margin:12px 0}
  .info-item{display:flex;flex-direction:column}
  .info-item label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#64748b}
  .info-item span{font-size:13px;margin-top:2px}
  .empty{color:#94a3b8;font-style:italic;padding:12px 0}
  ul{margin:8px 0;padding-left:18px}
  li{margin:4px 0;font-size:12px}
  .footer{margin-top:40px;padding-top:12px;border-top:1px solid #e2e8f0;font-size:10px;color:#94a3b8;text-align:center}
  @media print{body{padding:20px}}
`;

function buildHtml(title: string, subtitle: string, bodyContent: string): string {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
  <style>${BASE_STYLE}</style></head><body>
  <div class="header">
    <div>
      <div class="header-logo">TRIADE</div>
      <div class="header-sub">Sistema de Gestión de Aprendizaje</div>
    </div>
  </div>
  <h1>${escapeHtml(title)}</h1>
  <p class="muted">${escapeHtml(subtitle)}</p>
  <div class="meta">
    <div class="meta-item"><span>Fecha de generación</span><strong>${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></div>
  </div>
  ${bodyContent}
  <div class="footer">Documento generado por TRIADE · ${new Date().toLocaleDateString()}</div>
  </body></html>`;
}

function printHtml(html: string) {
  const frame = document.createElement('iframe');
  frame.style.position = 'fixed';
  frame.style.width = '0';
  frame.style.height = '0';
  frame.style.border = '0';
  document.body.appendChild(frame);
  const frameDoc = frame.contentWindow?.document;
  if (!frameDoc || !frame.contentWindow) { frame.remove(); return; }
  frameDoc.open();
  frameDoc.write(html);
  frameDoc.close();
  frame.contentWindow.focus();
  setTimeout(() => {
    frame.contentWindow?.print();
    setTimeout(() => frame.remove(), 1000);
  }, 300);
}

function table(headers: string[], rows: (string)[][]): string {
  if (rows.length === 0) return '<p class="empty">Sin datos disponibles</p>';
  return `<table><thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

function badge(text: string, color: 'green' | 'red' | 'yellow' | 'blue' | 'gray'): string {
  return `<span class="badge badge-${color}">${escapeHtml(text)}</span>`;
}

function summaryCards(items: { value: string | number; label: string }[]): string {
  return `<div class="summary-grid">${items.map((s) => `<div class="summary-card"><strong>${escapeHtml(s.value)}</strong><span>${escapeHtml(s.label)}</span></div>`).join('')}</div>`;
}

function infoGrid(items: { label: string; value: string }[]): string {
  return `<div class="info-grid">${items.map((i) => `<div class="info-item"><label>${escapeHtml(i.label)}</label><span>${escapeHtml(i.value)}</span></div>`).join('')}</div>`;
}

function section(title: string, content: string): string {
  return `<div class="section"><h2>${escapeHtml(title)}</h2>${content}</div>`;
}

// ============ REPORT BUILDERS ============

export type PdfReportContext = {
  orgName?: string;
};

export function exportPersonnelReport(opts: {
  employees: { full_name: string; email: string | null; cedula: string | null; telefono: string | null; is_active: boolean; jobRoleName?: string; deptName?: string }[];
  admins: { full_name: string; email: string | null; is_active: boolean }[];
  departments: { name: string; code: string; description: string; is_active: boolean }[];
  jobRoles: { name: string; description: string; deptName?: string; courseCount: number; is_active: boolean }[];
  scope: 'all' | 'employees' | 'admins' | 'departments' | 'roles' | 'history' | 'requirements';
  history?: { userName: string; roleName: string; startDate: string; endDate: string | null; reason: string | null }[];
  requirements?: { roleName: string; courses: { title: string; mandatory: boolean; priority: string; deadlineDays: number | null }[] }[];
}) {
  const { scope } = opts;
  const titleMap: Record<string, string> = {
    all: 'Reporte General de Personal',
    employees: 'Reporte de Empleados',
    admins: 'Reporte de Administradores',
    departments: 'Reporte de Departamentos',
    roles: 'Reporte de Cargos',
    history: 'Reporte de Historial de Cargos',
    requirements: 'Reporte de Requisitos por Cargo',
  };
  const title = titleMap[scope] ?? 'Reporte de Personal';
  let body = '';

  if (scope === 'all' || scope === 'employees') {
    body += section('Empleados', summaryCards([
      { value: opts.employees.length, label: 'Empleados totales' },
      { value: opts.employees.filter((e) => e.is_active).length, label: 'Activos' },
      { value: opts.employees.filter((e) => !e.is_active).length, label: 'Inactivos' },
    ]) + table(['Nombre', 'Correo', 'Cédula', 'Teléfono', 'Cargo', 'Departamento', 'Estado'],
      opts.employees.map((e) => [escapeHtml(e.full_name), escapeHtml(e.email), escapeHtml(e.cedula), escapeHtml(e.telefono), escapeHtml(e.jobRoleName), escapeHtml(e.deptName), e.is_active ? badge('Activo', 'green') : badge('Inactivo', 'red')])));
  }
  if (scope === 'all' || scope === 'admins') {
    body += section('Administradores', table(['Nombre', 'Correo', 'Estado'],
      opts.admins.map((a) => [escapeHtml(a.full_name), escapeHtml(a.email), a.is_active ? badge('Activo', 'green') : badge('Inactivo', 'red')])));
  }
  if (scope === 'all' || scope === 'departments') {
    body += section('Departamentos', table(['Nombre', 'Código', 'Descripción', 'Estado'],
      opts.departments.map((d) => [escapeHtml(d.name), escapeHtml(d.code), escapeHtml(d.description), d.is_active ? badge('Activo', 'green') : badge('Inactivo', 'red')])));
  }
  if (scope === 'all' || scope === 'roles') {
    body += section('Cargos', table(['Nombre', 'Descripción', 'Departamento', 'Cursos asignados', 'Estado'],
      opts.jobRoles.map((r) => [escapeHtml(r.name), escapeHtml(r.description), escapeHtml(r.deptName), String(r.courseCount), r.is_active ? badge('Activo', 'green') : badge('Inactivo', 'red')])));
  }
  if (scope === 'history' && opts.history) {
    body += section('Historial de Cargos', table(['Persona', 'Cargo', 'Fecha inicio', 'Fecha fin', 'Razón'],
      opts.history.map((h) => [escapeHtml(h.userName), escapeHtml(h.roleName), formatDate(h.startDate), h.endDate ? formatDate(h.endDate) : 'Actual', escapeHtml(h.reason)])));
  }
  if (scope === 'requirements' && opts.requirements) {
    opts.requirements.forEach((req) => {
      body += section(`Requisitos — ${req.roleName}`, table(['Curso', 'Obligatorio', 'Prioridad', 'Días límite'],
        req.courses.map((c) => [escapeHtml(c.title), c.mandatory ? badge('Sí', 'green') : badge('No', 'gray'), escapeHtml(c.priority), c.deadlineDays ? String(c.deadlineDays) : '—'])));
    });
  }

  printHtml(buildHtml(title, 'Gestión de Personal', body));
}

export function exportCoursesReport(opts: {
  courses: { id: string; title: string; description: string | null; category: string | null; duration: string | null; estimated_hours: number | null; moduleName: string; moduleType: string; moduleDuration: string | null; assignments: { roleName: string; mandatory: boolean; priority: string; deadlineDays: number | null }[]; prerequisites: string[] }[];
  singleCourseId?: string;
}) {
  if (opts.singleCourseId) {
    const c = opts.courses.find((course) => course.id === opts.singleCourseId);
    if (!c) return;
    let body = infoGrid([
      { label: 'Título', value: c.title },
      { label: 'Categoría', value: c.category ?? '—' },
      { label: 'Duración', value: c.duration ?? '—' },
      { label: 'Horas estimadas', value: String(c.estimated_hours ?? 0) },
    ]);
    if (c.description) body += `<p style="margin:12px 0">${escapeHtml(c.description)}</p>`;
    body += section('Módulos', table(['#', 'Título', 'Tipo', 'Duración'],
      [[['1', c.moduleName, c.moduleType, c.moduleDuration ?? '—']].flat() as string[]]));
    body += section('Asignaciones', table(['Cargo', 'Obligatorio', 'Prioridad', 'Días límite'],
      c.assignments.map((a) => [escapeHtml(a.roleName), a.mandatory ? badge('Sí', 'green') : badge('No', 'gray'), escapeHtml(a.priority), a.deadlineDays ? String(a.deadlineDays) : '—'])));
    if (c.prerequisites.length > 0) body += section('Prerrequisitos', `<ul>${c.prerequisites.map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul>`);
    printHtml(buildHtml(`Reporte de Curso: ${c.title}`, 'Gestión de Cursos', body));
    return;
  }

  const body = summaryCards([
    { value: opts.courses.length, label: 'Cursos totales' },
    { value: opts.courses.reduce((acc, c) => acc + 1, 0), label: 'Cursos con módulos' },
    { value: opts.courses.reduce((acc, c) => acc + c.assignments.length, 0), label: 'Asignaciones' },
    { value: opts.courses.reduce((acc, c) => acc + c.prerequisites.length, 0), label: 'Prerrequisitos' },
  ]) + section('Listado de Cursos', table(['Título', 'Categoría', 'Duración', 'Horas', 'Módulos', 'Asignaciones'],
    opts.courses.map((c) => [escapeHtml(c.title), escapeHtml(c.category), escapeHtml(c.duration), String(c.estimated_hours ?? 0), '1', String(c.assignments.length)])));

  printHtml(buildHtml('Reporte General de Cursos', 'Gestión de Cursos', body));
}

export function exportCertificationsReport(opts: {
  certificates: { certificate_number: string; userName: string; courseTitle: string; issue_date: string | null; expiry_date: string | null }[];
  roleCerts: { userName: string; roleName: string; certified_at: string | null; is_valid: boolean }[];
  scope: 'general' | 'byCourse' | 'byWorker';
  filterLabel?: string;
}) {
  const { scope, filterLabel } = opts;
  const titleMap: Record<string, string> = {
    general: 'Reporte General de Certificaciones',
    byCourse: 'Reporte de Certificaciones por Curso',
    byWorker: 'Reporte de Certificaciones por Trabajador',
  };
  let body = '';

  if (filterLabel) body += `<p class="muted" style="margin-bottom:16px">Filtro: <strong>${escapeHtml(filterLabel)}</strong></p>`;

  body += summaryCards([
    { value: opts.certificates.length, label: 'Certificados de curso' },
    { value: opts.roleCerts.length, label: 'Certificaciones de cargo' },
    { value: opts.certificates.filter((c) => c.issue_date).length, label: 'Emitidos' },
    { value: opts.roleCerts.filter((r) => r.is_valid).length, label: 'Vigentes' },
  ]);

  body += section('Certificados de Cursos', table(['N° Certificado', 'Trabajador', 'Curso', 'Emisión', 'Vencimiento'],
    opts.certificates.map((c) => [escapeHtml(c.certificate_number), escapeHtml(c.userName), escapeHtml(c.courseTitle), formatDate(c.issue_date), formatDate(c.expiry_date)])));

  body += section('Certificaciones de Cargo', table(['Trabajador', 'Cargo', 'Certificado el', 'Estado'],
    opts.roleCerts.map((r) => [escapeHtml(r.userName), escapeHtml(r.roleName), formatDate(r.certified_at), r.is_valid ? badge('Vigente', 'green') : badge('Expirado', 'red')])));

  printHtml(buildHtml(titleMap[scope] ?? 'Reporte de Certificaciones', 'Certificaciones', body));
}

export function exportFeedbackReport(opts: {
  feedback: { userName: string; courseTitle: string; rating: number; difficulty: string | null; wouldRecommend: boolean | null; timeAdequate: boolean | null; comment: string | null }[];
  scope: 'general' | 'byCourse' | 'byWorker';
  filterLabel?: string;
}) {
  const { scope, filterLabel } = opts;
  const titleMap: Record<string, string> = {
    general: 'Reporte General de Feedback',
    byCourse: 'Reporte de Feedback por Curso',
    byWorker: 'Reporte de Feedback por Trabajador',
  };
  const avg = opts.feedback.length > 0 ? (opts.feedback.reduce((acc, f) => acc + f.rating, 0) / opts.feedback.length).toFixed(1) : '0';
  let body = '';

  if (filterLabel) body += `<p class="muted" style="margin-bottom:16px">Filtro: <strong>${escapeHtml(filterLabel)}</strong></p>`;

  body += summaryCards([
    { value: opts.feedback.length, label: 'Calificaciones totales' },
    { value: avg, label: 'Promedio de estrellas' },
    { value: opts.feedback.filter((f) => f.wouldRecommend).length, label: 'Recomendarían' },
    { value: opts.feedback.filter((f) => f.difficulty === 'hard' || f.difficulty === 'very_hard').length, label: 'Difíciles' },
  ]);

  body += section('Detalle de Calificaciones', table(['Trabajador', 'Curso', 'Estrellas', 'Dificultad', 'Recomendaría', 'Tiempo adecuado', 'Comentario'],
    opts.feedback.map((f) => [
      escapeHtml(f.userName),
      escapeHtml(f.courseTitle),
      `${'★'.repeat(f.rating)}${'☆'.repeat(5 - f.rating)}`,
      escapeHtml(f.difficulty),
      f.wouldRecommend === null ? '—' : f.wouldRecommend ? 'Sí' : 'No',
      f.timeAdequate === null ? '—' : f.timeAdequate ? 'Sí' : 'No',
      escapeHtml(f.comment?.slice(0, 60)),
    ])));

  printHtml(buildHtml(titleMap[scope] ?? 'Reporte de Feedback', 'Feedback', body));
}

export function exportNotificationsReport(opts: {
  notifications: { title: string; message: string | null; type: string; userName: string; is_read: boolean; created_at: string }[];
  scope: 'general' | 'byType' | 'byRole' | 'byWorker';
  filterLabel?: string;
}) {
  const { scope, filterLabel } = opts;
  const titleMap: Record<string, string> = {
    general: 'Reporte General de Notificaciones',
    byType: 'Reporte de Notificaciones por Tipo',
    byRole: 'Reporte de Notificaciones por Cargo',
    byWorker: 'Reporte de Notificaciones por Trabajador',
  };
  let body = '';

  if (filterLabel) body += `<p class="muted" style="margin-bottom:16px">Filtro: <strong>${escapeHtml(filterLabel)}</strong></p>`;

  const types = ['info', 'success', 'warning', 'error', 'reminder'];
  body += summaryCards([
    { value: opts.notifications.length, label: 'Notificaciones totales' },
    { value: opts.notifications.filter((n) => n.is_read).length, label: 'Leídas' },
    { value: opts.notifications.filter((n) => !n.is_read).length, label: 'No leídas' },
    { value: types.map((tp) => opts.notifications.filter((n) => n.type === tp).length).filter((c) => c > 0).length, label: 'Tipos usados' },
  ]);

  body += section('Notificaciones', table(['Título', 'Tipo', 'Destinatario', 'Estado', 'Fecha', 'Mensaje'],
    opts.notifications.map((n) => [escapeHtml(n.title), badge(n.type, n.type === 'success' ? 'green' : n.type === 'error' ? 'red' : n.type === 'warning' ? 'yellow' : 'blue'), escapeHtml(n.userName), n.is_read ? badge('Leída', 'green') : badge('No leída', 'gray'), formatDate(n.created_at), escapeHtml(n.message?.slice(0, 50))])));

  printHtml(buildHtml(titleMap[scope] ?? 'Reporte de Notificaciones', 'Notificaciones', body));
}

export function exportExamResultsReport(opts: {
  attempts: { userName: string; courseTitle: string; score: number | null; passed: boolean; attempted_at: string }[];
  scope: 'general' | 'byWorker';
  filterLabel?: string;
}) {
  const { scope, filterLabel } = opts;
  const title = scope === 'byWorker' ? 'Reporte de Resultados de Exámenes por Trabajador' : 'Reporte General de Resultados de Exámenes';
  const passed = opts.attempts.filter((a) => a.passed).length;
  const avgScore = opts.attempts.length > 0 && opts.attempts[0].score !== null
    ? (opts.attempts.reduce((acc, a) => acc + (a.score ?? 0), 0) / opts.attempts.length).toFixed(1)
    : '—';

  let body = '';
  if (filterLabel) body += `<p class="muted" style="margin-bottom:16px">Trabajador: <strong>${escapeHtml(filterLabel)}</strong></p>`;

  body += summaryCards([
    { value: opts.attempts.length, label: 'Intentos totales' },
    { value: passed, label: 'Aprobados' },
    { value: opts.attempts.length - passed, label: 'Reprobados' },
    { value: opts.attempts.length > 0 ? `${Math.round((passed / opts.attempts.length) * 100)}%` : '—', label: 'Tasa de aprobación' },
  ]);

  body += section('Resultados de Exámenes', table(['Trabajador', 'Curso', 'Puntaje', 'Resultado', 'Fecha'],
    opts.attempts.map((a) => [escapeHtml(a.userName), escapeHtml(a.courseTitle), a.score !== null ? `${a.score}%` : '—', a.passed ? badge('Aprobado', 'green') : badge('Reprobado', 'red'), formatDate(a.attempted_at)])));

  printHtml(buildHtml(title, 'Resultados de Exámenes', body));
}

export function exportAuditReport(opts: {
  logs: { action: string; entity_type: string; userName: string; ip_address: string | null; created_at: string; changesSummary: string | null }[];
}) {
  const body = summaryCards([
    { value: opts.logs.length, label: 'Registros totales' },
    { value: opts.logs.filter((l) => l.action === 'CREATE').length, label: 'Creaciones' },
    { value: opts.logs.filter((l) => l.action === 'UPDATE').length, label: 'Actualizaciones' },
    { value: opts.logs.filter((l) => l.action === 'DELETE').length, label: 'Eliminaciones' },
  ]) + section('Registro de Auditoría', table(['Acción', 'Entidad', 'Usuario', 'IP', 'Fecha', 'Cambios'],
    opts.logs.map((l) => [badge(l.action, l.action === 'CREATE' ? 'green' : l.action === 'UPDATE' ? 'yellow' : 'red'), escapeHtml(l.entity_type), escapeHtml(l.userName), escapeHtml(l.ip_address), formatDate(l.created_at), escapeHtml(l.changesSummary?.slice(0, 50))])));

  printHtml(buildHtml('Reporte General de Auditoría', 'Auditoría del Sistema', body));
}

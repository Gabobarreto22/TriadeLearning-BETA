function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch] as string);
}

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  try { return new Date(value).toLocaleDateString(); } catch { return value; }
}

const BASE_STYLE = `
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{background:#fff}
  body{font-family:'Segoe UI',Arial,sans-serif;color:#0f172a;padding:40px;font-size:13px;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .header{display:flex;align-items:center;justify-content:flex-start;margin-bottom:24px;border-bottom:2px solid #1e293b;padding-bottom:16px}
  .header-logo{display:block;width:180px;height:auto;max-height:42px;object-fit:contain;object-position:left center}
  h2{font-size:17px;margin:28px 0 10px;padding-bottom:6px;border-bottom:1px solid #e2e8f0;break-after:avoid;page-break-after:avoid}
  h3{font-size:14px;margin:18px 0 8px;color:#334155;break-after:avoid;page-break-after:avoid}
  .muted{color:#64748b;font-size:12px}
  table{width:100%;border-collapse:collapse;margin-top:10px;font-size:12px;table-layout:auto}
  table.personnel-employees-table{font-size:11px;table-layout:fixed}
  table.personnel-employees-table th,table.personnel-employees-table td{padding:6px 7px}
  table.personnel-employees-table th:nth-child(1){width:17%}
  table.personnel-employees-table th:nth-child(2){width:22%}
  table.personnel-employees-table th:nth-child(3){width:12%}
  table.personnel-employees-table th:nth-child(4){width:11%}
  table.personnel-employees-table th:nth-child(5){width:15%}
  table.personnel-employees-table th:nth-child(6){width:15%}
  table.personnel-employees-table th:nth-child(7){width:8%}
  .report-table-page{margin-top:8px}
  .report-page-heading th{background:#fff;color:#0f172a;text-transform:none;font-size:12px;padding:4px 0;border-bottom:1px solid #cbd5e1}
  .single-page-report .report-page-heading{display:none}
  thead{display:table-header-group}
  tbody{display:table-row-group}
  th{background:#f1f5f9;padding:9px 10px;text-align:left;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.03em;color:#475569;border-bottom:2px solid #e2e8f0;overflow-wrap:anywhere}
  td{padding:8px 10px;border-bottom:1px solid #f1f5f9;vertical-align:top;overflow-wrap:anywhere}
  tr{break-inside:avoid;page-break-inside:avoid}
  tr:nth-child(even) td{background:#fafbfc}
  .badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;white-space:nowrap}
  .badge-green{background:#d1fae5;color:#065f46}
  .badge-red{background:#fee2e2;color:#991b1b}
  .badge-yellow{background:#fef3c7;color:#92400e}
  .badge-blue{background:#dbeafe;color:#1e40af}
  .badge-gray{background:#f3f4f6;color:#374151}
  .summary-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:16px 0;break-inside:avoid;page-break-inside:avoid}
  .summary-card{border:1px solid #e2e8f0;border-radius:8px;padding:12px;break-inside:avoid;page-break-inside:avoid;display:flex;flex-direction:column;gap:4px;position:relative;overflow:hidden;background:#fff}
  .summary-card::before{content:'';position:absolute;inset:0 auto 0 0;width:3px;background:#334155}
  .summary-card:nth-child(2)::before{background:#2563eb}
  .summary-card:nth-child(3)::before{background:#0f766e}
  .summary-card:nth-child(4)::before{background:#b45309}
  .summary-card strong{font-size:24px;display:block;font-weight:800;line-height:1.1;color:#0f172a}
  .summary-card span{font-size:11px;color:#334155;font-weight:700}
  .summary-card small{font-size:10px;line-height:1.35;color:#64748b}
  .section{margin-bottom:28px}
  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 20px;margin:12px 0;break-inside:avoid;page-break-inside:avoid}
  .info-item{display:flex;flex-direction:column}
  .info-item label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#64748b}
  .info-item span{font-size:13px;margin-top:2px}
  .course-module-specs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:8px 0 14px}
  .course-module-spec{border-left:3px solid #2563eb;background:#f8fafc;padding:8px 10px}
  .course-module-spec label{display:block;color:#64748b;font-size:9px;font-weight:700;text-transform:uppercase}
  .course-module-spec strong{display:block;margin-top:3px;color:#0f172a;font-size:12px}
  .course-module-layout{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(210px,1fr);gap:14px;align-items:start}
  .course-module-block{margin:0 0 14px;break-inside:avoid;page-break-inside:avoid}
  .course-module-block:last-child{margin-bottom:0}
  .course-module-panel{border:1px solid #e2e8f0;border-radius:6px;padding:12px;min-width:0}
  .course-module-panel h4{margin:0 0 8px;color:#334155;font-size:11px}
  .course-module-content{font-size:11px;line-height:1.55;white-space:pre-wrap;overflow-wrap:anywhere}
  .course-module-resources{background:#f8fafc}
  .course-resource-item{border-top:1px solid #e2e8f0;padding:8px 0;overflow-wrap:anywhere}
  .course-resource-item:first-of-type{border-top:0;padding-top:0}
  .course-resource-item strong{display:block;color:#0f172a;font-size:10px}
  .course-resource-item p{margin:3px 0;color:#475569;font-size:9px;line-height:1.4;overflow-wrap:anywhere}
  .course-resource-item span{display:block;color:#64748b;font-size:8px;overflow-wrap:anywhere}
  .empty{color:#94a3b8;font-style:italic;padding:12px 0}
  ul{margin:8px 0;padding-left:18px}
  li{margin:4px 0;font-size:12px}
  @media print{
    @page{size:A4 landscape;margin:0}
    body{width:297mm;min-height:0;padding:21mm 14mm 27mm;font-size:11px}
    .header{position:fixed;top:3mm;left:14mm;right:14mm;height:14mm;margin:0;padding-bottom:3mm;background:#fff;z-index:10}
    .header-logo{width:48mm;max-height:12mm}
    h2{font-size:14px;margin:18px 0 7px}
    h3{font-size:12px;margin:12px 0 6px}
    table{font-size:10.5px;margin-top:8px}
    .report-table-page{margin-top:6px}
    .report-page-heading th{background:#fff;color:#0f172a;text-transform:none;font-size:11px;padding:4px 0;border-bottom:1px solid #cbd5e1}
    table.personnel-employees-table{font-size:10.5px}
    table.personnel-employees-table th,table.personnel-employees-table td{padding:5px 6px}
    th{padding:7px 8px;font-size:9.5px}
    td{padding:7px 8px}
    .badge{font-size:9px;padding:2px 6px}
    .summary-grid{gap:7px;margin:10px 0}
    .summary-card{padding:7px}
    .summary-card strong{font-size:17px}
    .summary-card span{font-size:8px}
    .summary-card small{font-size:7px;line-height:1.25}
    .section{margin-bottom:16px}
    .page-break-before{break-before:page;page-break-before:always;padding-top:21mm}
    .info-grid{gap:5px 12px;margin:8px 0}
    .info-item label{font-size:8px}
    .info-item span{font-size:10px}
    .course-module-specs{gap:6px;margin:6px 0 10px}
    .course-module-spec{padding:6px 8px}
    .course-module-spec label{font-size:8px}
    .course-module-spec strong{font-size:10px}
    .course-module-layout{grid-template-columns:minmax(0,1.7fr) minmax(190px,1fr);gap:10px}
    .course-module-block{margin-bottom:10px}
    .course-module-panel{padding:9px}
    .course-module-panel h4{font-size:10px}
    .course-module-content{font-size:10px;line-height:1.45}
    .course-resource-item{padding:6px 0}
    .course-resource-item strong{font-size:9px}
    .course-resource-item p{font-size:8px}
    .course-resource-item span{font-size:7px}
    .empty{padding:8px 0}
    ul{margin:5px 0;padding-left:14px}
    li{margin:3px 0;font-size:9px}
  }
`;

function buildHtml(_title: string, _subtitle: string, bodyContent: string): string {
  const isMultiPage = bodyContent.includes('page-break-before');
  const reportClass = isMultiPage ? 'multi-page-report' : 'single-page-report';
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title></title>
  <style>${BASE_STYLE}</style></head><body>
  <div class="header">
    <img class="header-logo" src="/LOGOTIPO_POSITIVO.png" alt="TRIADE" />
  </div>
  <main class="${reportClass}">${bodyContent}</main>
  </body></html>`;
}

function openReportPreview(html: string) {
  window.dispatchEvent(new CustomEvent('report:preview', { detail: html }));
}

let reportPageTitle = '';
let reportPageNumber = 0;
let reportHasSection = false;
let reportHasTable = false;

function beginReport(title: string) {
  reportPageTitle = title;
  reportPageNumber = 0;
  reportHasSection = false;
  reportHasTable = false;
}

function table(headers: string[], rows: (string)[][], className = '', repeatedTitle = '', manualPagination = false): string {
  const starts = manualPagination || repeatedTitle ? [0] : Array.from({ length: Math.max(1, Math.ceil(rows.length / 8)) }, (_, index) => index * 8);
  const startsNewSectionPage = reportHasSection && !reportHasTable;
  reportHasTable = true;
  return starts.map((start, chunkIndex) => {
    const chunk = rows.slice(start, start + 8);
    const advancesPage = chunkIndex > 0 || (chunkIndex === 0 && startsNewSectionPage);
    const pageBreak = chunkIndex > 0;
    if (reportPageNumber === 0 || advancesPage) reportPageNumber += 1;
    const heading = repeatedTitle || `${reportPageTitle} - Página ${reportPageNumber}`;
    if (chunk.length === 0) {
      return `<div class="report-table-page${pageBreak ? ' page-break-before' : ''}"><p class="report-page-heading">${escapeHtml(heading)}</p><p class="empty">Sin datos disponibles</p></div>`;
    }
    const pageHeading = manualPagination && !repeatedTitle ? '' : `<tr class="report-page-heading"><th colspan="${headers.length}">${escapeHtml(heading)}</th></tr>`;
    return `<div class="report-table-page${pageBreak ? ' page-break-before' : ''}"><table${className ? ` class="${className}"` : ''}><thead>${pageHeading}<tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>
      <tbody>${chunk.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }).join('');
}

function badge(text: string, color: 'green' | 'red' | 'yellow' | 'blue' | 'gray'): string {
  return `<span class="badge badge-${color}">${escapeHtml(text)}</span>`;
}

function summaryCards(items: { value: string | number; label: string; detail?: string }[]): string {
  return `<div class="summary-grid">${items.map((s) => `<div class="summary-card"><strong>${escapeHtml(s.value)}</strong><span>${escapeHtml(s.label)}</span>${s.detail ? `<small>${escapeHtml(s.detail)}</small>` : ''}</div>`).join('')}</div>`;
}

function infoGrid(items: { label: string; value: string }[]): string {
  return `<div class="info-grid">${items.map((i) => `<div class="info-item"><label>${escapeHtml(i.label)}</label><span>${escapeHtml(i.value)}</span></div>`).join('')}</div>`;
}

function section(title: string, content: string, pageBreakBefore = false): string {
  const startsNewPage = reportHasSection && (pageBreakBefore || reportHasTable);
  if (!reportHasSection) reportPageNumber = Math.max(reportPageNumber, 1);
  reportHasSection = true;
  reportHasTable = false;
  const pageTitleClass = / - Página \d+$/.test(title) ? ' report-page-heading' : '';
  return `<div class="section${startsNewPage ? ' page-break-before' : ''}">${title ? `<h2 class="${pageTitleClass.trim()}">${escapeHtml(title)}</h2>` : ''}${content}</div>`;
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
  beginReport(title);
  let body = '';

  if (scope === 'all' || scope === 'employees') {
    body += section('Empleados', summaryCards([
      { value: opts.employees.length, label: 'Empleados totales', detail: 'Personas incluidas en el reporte' },
      { value: opts.employees.filter((e) => e.is_active).length, label: 'Activos', detail: 'Personal con estado vigente' },
      { value: opts.employees.filter((e) => !e.is_active).length, label: 'Inactivos', detail: 'Requieren revisión o actualización' },
    ]) + table(['Nombre', 'Correo', 'Cédula', 'Teléfono', 'Cargo', 'Departamento', 'Estado'],
      opts.employees.map((e) => [escapeHtml(e.full_name), escapeHtml(e.email), escapeHtml(e.cedula), escapeHtml(e.telefono), escapeHtml(e.jobRoleName), escapeHtml(e.deptName), e.is_active ? badge('Activo', 'green') : badge('Inactivo', 'red')]), 'personnel-employees-table'));
  }
  if (scope === 'all' || scope === 'admins') {
    body += section('Administradores', summaryCards([
      { value: opts.admins.length, label: 'Administradores', detail: 'Cuentas incluidas' },
      { value: opts.admins.filter((a) => a.is_active).length, label: 'Activos', detail: 'Con acceso vigente' },
      { value: opts.admins.filter((a) => !a.is_active).length, label: 'Inactivos', detail: 'Sin acceso vigente' },
    ]) + table(['Nombre', 'Correo', 'Estado'],
      opts.admins.map((a) => [escapeHtml(a.full_name), escapeHtml(a.email), a.is_active ? badge('Activo', 'green') : badge('Inactivo', 'red')])), scope === 'all');
  }
  if (scope === 'all' || scope === 'departments') {
    body += section('Departamentos', summaryCards([
      { value: opts.departments.length, label: 'Departamentos', detail: 'Áreas registradas' },
      { value: opts.departments.filter((d) => d.is_active).length, label: 'Activos', detail: 'Áreas vigentes' },
      { value: opts.departments.filter((d) => !d.is_active).length, label: 'Inactivos', detail: 'Áreas no vigentes' },
    ]) + table(['Nombre', 'Código', 'Descripción', 'Estado'],
      opts.departments.map((d) => [escapeHtml(d.name), escapeHtml(d.code), escapeHtml(d.description), d.is_active ? badge('Activo', 'green') : badge('Inactivo', 'red')])), scope === 'all');
  }
  if (scope === 'all' || scope === 'roles') {
    const roleRows = opts.jobRoles.map((r) => [escapeHtml(r.name), escapeHtml(r.description), escapeHtml(r.deptName), String(r.courseCount), r.is_active ? badge('Activo', 'green') : badge('Inactivo', 'red')]);
    const rolePageSize = 9;
    const rolePages = Array.from({ length: Math.ceil(roleRows.length / rolePageSize) }, (_, index) => roleRows.slice(index * rolePageSize, (index + 1) * rolePageSize));
    const roleSummary = summaryCards([
      { value: opts.jobRoles.length, label: 'Cargos', detail: 'Posiciones registradas' },
      { value: opts.jobRoles.filter((r) => r.is_active).length, label: 'Activos', detail: 'Cargos vigentes' },
      { value: opts.jobRoles.reduce((total, role) => total + role.courseCount, 0), label: 'Asignaciones', detail: 'Cursos asociados a cargos' },
    ]);
    rolePages.forEach((rows, index) => {
      const pageTitle = `Cargos - Página ${index + 1}`;
      const pageBody = (index === 0 ? roleSummary : '') + table(['Nombre', 'Descripción', 'Departamento', 'Cursos asignados', 'Estado'], rows, '', pageTitle);
      body += section('', pageBody, (scope === 'all' && index === 0) || index > 0);
    });
  }
  if (scope === 'history' && opts.history) {
    body += section('Historial de Cargos', summaryCards([
      { value: opts.history.length, label: 'Cambios de cargo', detail: 'Movimientos registrados' },
      { value: opts.history.filter((h) => !h.endDate).length, label: 'Cargos actuales', detail: 'Asignaciones vigentes' },
    ]) + table(['Persona', 'Cargo', 'Fecha inicio', 'Fecha fin', 'Razón'],
      opts.history.map((h) => [escapeHtml(h.userName), escapeHtml(h.roleName), formatDate(h.startDate), h.endDate ? formatDate(h.endDate) : 'Actual', escapeHtml(h.reason)])));
  }
  if (scope === 'requirements' && opts.requirements) {
    opts.requirements.forEach((req) => {
      body += section(`Requisitos — ${req.roleName}`, summaryCards([
        { value: req.courses.length, label: 'Cursos asignados', detail: 'Requisitos de este cargo' },
        { value: req.courses.filter((course) => course.mandatory).length, label: 'Obligatorios', detail: 'Cursos requeridos' },
      ]) + table(['Curso', 'Obligatorio', 'Prioridad', 'Días límite'],
        req.courses.map((c) => [escapeHtml(c.title), c.mandatory ? badge('Sí', 'green') : badge('No', 'gray'), escapeHtml(c.priority), c.deadlineDays ? String(c.deadlineDays) : '—'])));
    });
  }

  openReportPreview(buildHtml(title, 'Gestión de Personal', body));
}

export function exportCoursesReport(opts: {
  courses: {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    duration: string | null;
    estimated_hours: number | null;
    moduleName: string;
    moduleType: string;
    moduleDuration: string | null;
    modules?: { title: string; type: string; duration: string | null; duration_minutes?: number; body?: string | null; image_url?: string | null; video_url?: string | null; resource_type?: string | null; resource_url?: string | null; resources?: { title: string; description: string | null; file_type: string | null; file_url: string; is_downloadable: boolean }[] }[];
    assignments: { roleName: string; mandatory: boolean; priority: string; deadlineDays: number | null }[];
    prerequisites: string[];
  }[];
  singleCourseId?: string;
}) {
  if (opts.singleCourseId) {
    const c = opts.courses.find((course) => course.id === opts.singleCourseId);
    if (!c) return;
    beginReport(`Reporte de Curso: ${c.title}`);
    const courseInfo = infoGrid([
      { label: 'Título', value: c.title },
      { label: 'Categoría', value: c.category ?? '—' },
      { label: 'Duración', value: c.duration ?? '—' },
      { label: 'Horas estimadas', value: String(c.estimated_hours ?? 0) },
    ]);
    const description = c.description ? `<p style="margin:12px 0">${escapeHtml(c.description)}</p>` : '';
    const modules = c.modules ?? [{ title: c.moduleName, type: c.moduleType, duration: c.moduleDuration }];
    const modulePageSize = 8;
    const moduleListPages = Array.from({ length: Math.max(1, Math.ceil(modules.length / modulePageSize)) }, (_, index) =>
      modules.slice(index * modulePageSize, (index + 1) * modulePageSize));
    let body = '';
    moduleListPages.forEach((pageModules, index) => {
      const pageNumber = index + 1;
      const pageContent = (index === 0 ? courseInfo + description : '') + `<h2>Módulos</h2>${table(['#', 'Título', 'Tipo', 'Duración'],
        pageModules.map((module, moduleIndex) => [
          String(index * modulePageSize + moduleIndex + 1), escapeHtml(module.title), escapeHtml(module.type), escapeHtml(module.duration),
        ]), '', '', true)}`;
      body += section(`${c.title} - Página ${pageNumber}`, pageContent, index > 0);
    });
    const moduleDetails = modules.map((module, index) => {
      const resources = [
        ...(module.video_url ? [{ title: 'Video del módulo', description: null, type: 'Video', url: module.video_url }] : []),
        ...(module.resource_url ? [{ title: 'Recurso del módulo', description: null, type: module.resource_type ?? 'Archivo', url: module.resource_url }] : []),
        ...(module.resources ?? []).map((resource) => ({
          title: resource.title,
          description: resource.description,
          type: resource.file_type ?? 'Archivo',
          url: resource.file_url,
        })),
      ];
      const resourcePanel = resources.length
        ? `<aside class="course-module-panel course-module-resources"><h4>Material de apoyo</h4>${resources.map((resource) => `<div class="course-resource-item"><strong>${escapeHtml(resource.title)}</strong>${resource.description ? `<p>${escapeHtml(resource.description)}</p>` : ''}<span>${escapeHtml(resource.type)} · ${escapeHtml(resource.url)}</span></div>`).join('')}</aside>`
        : '';
      const content = `<div class="course-module-specs"><div class="course-module-spec"><label>Tipo de módulo</label><strong>${escapeHtml(module.type)}</strong></div><div class="course-module-spec"><label>Duración</label><strong>${escapeHtml(module.duration ?? '—')}</strong></div></div><div class="course-module-layout"><section class="course-module-panel"><h4>Contenido del módulo</h4><div class="course-module-content">${module.body ? escapeHtml(module.body) : 'Sin contenido textual.'}</div></section>${resourcePanel}</div>`;
      const bodyLines = Math.ceil((module.body?.length ?? 24) / 100);
      const resourceLines = resources.reduce((total, resource) => total + Math.ceil((resource.title.length + (resource.description?.length ?? 0) + resource.url.length) / 52), 0);
      const estimatedHeight = 38 + bodyLines * 4.5 + resourceLines * 4.5;
      return {
        markup: `<article class="course-module-block"><h3>Módulo ${index + 1}: ${escapeHtml(module.title)}</h3>${content}</article>`,
        estimatedHeight,
      };
    });
    const detailPageCapacity = 125;
    const detailPages: typeof moduleDetails[] = [];
    let currentPage: typeof moduleDetails = [];
    let currentPageHeight = 0;
    moduleDetails.forEach((moduleDetail) => {
      if (currentPage.length > 0 && currentPageHeight + moduleDetail.estimatedHeight > detailPageCapacity) {
        detailPages.push(currentPage);
        currentPage = [];
        currentPageHeight = 0;
      }
      currentPage.push(moduleDetail);
      currentPageHeight += moduleDetail.estimatedHeight;
    });
    if (currentPage.length > 0) detailPages.push(currentPage);
    detailPages.forEach((pageModules, index) => {
      const pageNumber = moduleListPages.length + index + 1;
      body += section(`${c.title} - Página ${pageNumber}`, pageModules.map((moduleDetail) => moduleDetail.markup).join(''), true);
    });
    openReportPreview(buildHtml(`Reporte de Curso: ${c.title}`, 'Gestión de Cursos', body));
    return;
  }

  beginReport('Reporte General de Cursos');
  const body = summaryCards([
    { value: opts.courses.length, label: 'Cursos totales', detail: 'Cursos incluidos en el catálogo' },
    { value: opts.courses.filter((course) => (course.modules?.length ?? (course.moduleName ? 1 : 0)) > 0).length, label: 'Cursos con módulos', detail: 'Cursos con contenido asociado' },
    { value: opts.courses.reduce((acc, c) => acc + c.assignments.length, 0), label: 'Asignaciones', detail: 'Relaciones con cargos' },
    { value: opts.courses.reduce((acc, c) => acc + c.prerequisites.length, 0), label: 'Prerrequisitos', detail: 'Condiciones previas registradas' },
  ]) + section('Listado de Cursos', table(['Título', 'Categoría', 'Duración', 'Horas', 'Módulos', 'Asignaciones'],
    opts.courses.map((c) => [escapeHtml(c.title), escapeHtml(c.category), escapeHtml(c.duration), String(c.estimated_hours ?? 0), '1', String(c.assignments.length)])));

  openReportPreview(buildHtml('Reporte General de Cursos', 'Gestión de Cursos', body));
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
  beginReport(titleMap[scope] ?? 'Reporte de Certificaciones');
  let body = '';

  if (filterLabel) body += `<p class="muted" style="margin-bottom:16px">Filtro: <strong>${escapeHtml(filterLabel)}</strong></p>`;

  body += summaryCards([
    { value: opts.certificates.length, label: 'Certificados de curso', detail: 'Credenciales de capacitación' },
    { value: opts.roleCerts.length, label: 'Certificaciones de cargo', detail: 'Acreditaciones por posición' },
    { value: opts.certificates.filter((c) => c.issue_date).length, label: 'Emitidos', detail: 'Con fecha de emisión registrada' },
    { value: opts.roleCerts.filter((r) => r.is_valid).length, label: 'Vigentes', detail: 'Certificaciones actualmente válidas' },
  ]);

  body += section('Certificados de Cursos', table(['N° Certificado', 'Trabajador', 'Curso', 'Emisión', 'Vencimiento'],
    opts.certificates.map((c) => [escapeHtml(c.certificate_number), escapeHtml(c.userName), escapeHtml(c.courseTitle), formatDate(c.issue_date), formatDate(c.expiry_date)])));

  body += section('Certificaciones de Cargo', table(['Trabajador', 'Cargo', 'Certificado el', 'Estado'],
    opts.roleCerts.map((r) => [escapeHtml(r.userName), escapeHtml(r.roleName), formatDate(r.certified_at), r.is_valid ? badge('Vigente', 'green') : badge('Expirado', 'red')])));

  openReportPreview(buildHtml(titleMap[scope] ?? 'Reporte de Certificaciones', 'Certificaciones', body));
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
  beginReport(titleMap[scope] ?? 'Reporte de Feedback');
  const avg = opts.feedback.length > 0 ? (opts.feedback.reduce((acc, f) => acc + f.rating, 0) / opts.feedback.length).toFixed(1) : '0';
  let body = '';

  if (filterLabel) body += `<p class="muted" style="margin-bottom:16px">Filtro: <strong>${escapeHtml(filterLabel)}</strong></p>`;

  body += summaryCards([
    { value: opts.feedback.length, label: 'Calificaciones totales', detail: 'Respuestas recibidas' },
    { value: avg, label: 'Promedio de estrellas', detail: 'Sobre una escala de 1 a 5' },
    { value: opts.feedback.filter((f) => f.wouldRecommend).length, label: 'Recomendarían', detail: 'Respuestas con recomendación positiva' },
    { value: opts.feedback.filter((f) => f.difficulty === 'hard' || f.difficulty === 'very_hard').length, label: 'Difíciles', detail: 'Marcadas como alta dificultad' },
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

  openReportPreview(buildHtml(titleMap[scope] ?? 'Reporte de Feedback', 'Feedback', body));
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
  beginReport(titleMap[scope] ?? 'Reporte de Notificaciones');
  let body = '';

  if (filterLabel) body += `<p class="muted" style="margin-bottom:16px">Filtro: <strong>${escapeHtml(filterLabel)}</strong></p>`;

  const types = ['info', 'success', 'warning', 'error', 'reminder'];
  body += summaryCards([
    { value: opts.notifications.length, label: 'Notificaciones totales', detail: 'Mensajes incluidos en el reporte' },
    { value: opts.notifications.filter((n) => n.is_read).length, label: 'Leídas', detail: 'Mensajes ya revisados' },
    { value: opts.notifications.filter((n) => !n.is_read).length, label: 'No leídas', detail: 'Pendientes de revisión' },
    { value: types.map((tp) => opts.notifications.filter((n) => n.type === tp).length).filter((c) => c > 0).length, label: 'Tipos usados', detail: 'Categorías con registros' },
  ]);

  body += section('Notificaciones', table(['Título', 'Tipo', 'Destinatario', 'Estado', 'Fecha', 'Mensaje'],
    opts.notifications.map((n) => [escapeHtml(n.title), badge(n.type, n.type === 'success' ? 'green' : n.type === 'error' ? 'red' : n.type === 'warning' ? 'yellow' : 'blue'), escapeHtml(n.userName), n.is_read ? badge('Leída', 'green') : badge('No leída', 'gray'), formatDate(n.created_at), escapeHtml(n.message?.slice(0, 50))])));

  openReportPreview(buildHtml(titleMap[scope] ?? 'Reporte de Notificaciones', 'Notificaciones', body));
}

export function exportExamResultsReport(opts: {
  attempts: { userName: string; courseTitle: string; score: number | null; passed: boolean; attempted_at: string }[];
  scope: 'general' | 'byWorker';
  filterLabel?: string;
}) {
  const { scope, filterLabel } = opts;
  const title = scope === 'byWorker' ? 'Reporte de Resultados de Exámenes por Trabajador' : 'Reporte General de Resultados de Exámenes';
  beginReport(title);
  const passed = opts.attempts.filter((a) => a.passed).length;
  const avgScore = opts.attempts.length > 0 && opts.attempts[0].score !== null
    ? (opts.attempts.reduce((acc, a) => acc + (a.score ?? 0), 0) / opts.attempts.length).toFixed(1)
    : '—';

  let body = '';
  if (filterLabel) body += `<p class="muted" style="margin-bottom:16px">Trabajador: <strong>${escapeHtml(filterLabel)}</strong></p>`;

  body += summaryCards([
    { value: opts.attempts.length, label: 'Intentos totales', detail: `Puntaje promedio: ${avgScore}` },
    { value: passed, label: 'Aprobados', detail: 'Resultados que cumplen el mínimo' },
    { value: opts.attempts.length - passed, label: 'Reprobados', detail: 'Requieren refuerzo o repetición' },
    { value: opts.attempts.length > 0 ? `${Math.round((passed / opts.attempts.length) * 100)}%` : '—', label: 'Tasa de aprobación', detail: 'Aprobados sobre el total' },
  ]);

  body += section('Resultados de Exámenes', table(['Trabajador', 'Curso', 'Puntaje', 'Resultado', 'Fecha'],
    opts.attempts.map((a) => [escapeHtml(a.userName), escapeHtml(a.courseTitle), a.score !== null ? `${a.score}%` : '—', a.passed ? badge('Aprobado', 'green') : badge('Reprobado', 'red'), formatDate(a.attempted_at)])));

  openReportPreview(buildHtml(title, 'Resultados de Exámenes', body));
}

export function exportAuditReport(opts: {
  logs: { action: string; entity_type: string; userName: string; ip_address: string | null; created_at: string; changesSummary: string | null }[];
}) {
  beginReport('Reporte General de Auditoría');
  const body = summaryCards([
    { value: opts.logs.length, label: 'Registros totales', detail: 'Eventos registrados en el sistema' },
    { value: opts.logs.filter((l) => l.action === 'CREATE').length, label: 'Creaciones', detail: 'Nuevos registros generados' },
    { value: opts.logs.filter((l) => l.action === 'UPDATE').length, label: 'Actualizaciones', detail: 'Cambios realizados' },
    { value: opts.logs.filter((l) => l.action === 'DELETE').length, label: 'Eliminaciones', detail: 'Registros removidos' },
  ]) + section('Registro de Auditoría', table(['Acción', 'Entidad', 'Usuario', 'IP', 'Fecha', 'Cambios'],
    opts.logs.map((l) => [badge(l.action, l.action === 'CREATE' ? 'green' : l.action === 'UPDATE' ? 'yellow' : 'red'), escapeHtml(l.entity_type), escapeHtml(l.userName), escapeHtml(l.ip_address), formatDate(l.created_at), escapeHtml(l.changesSummary?.slice(0, 50))])));

  openReportPreview(buildHtml('Reporte General de Auditoría', 'Auditoría del Sistema', body));
}

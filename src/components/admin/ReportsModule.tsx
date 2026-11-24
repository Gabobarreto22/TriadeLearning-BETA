import { useState } from 'react';
import { BarChart3, BookOpen, FileText, Star, Users } from 'lucide-react';
import { strToU8, zipSync } from 'fflate';
import type { AdminData, AdminStrings } from './types';
import { openReportPreviewModal } from './ReportPreviewModal';
import { ReportDropdown } from './ReportDropdown';
import { PaginatedList } from '../PaginatedList';
import { SelectionModal, type SelectionOption } from './SelectionModal';

type ReportType = 'compliance' | 'progress' | 'exams' | 'feedback';
type ReportMetric = { label: string; value: string | number; icon: typeof Users; tone: string };

function escapeHtml(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] as string);
}

function downloadCsv(filename: string, columns: string[], rows: string[][]) {
  const content = [columns, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\r\n');
  const blob = new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadXlsx(filename: string, columns: string[], rows: string[][]) {
  const xmlEscape = (value: string) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character] as string);
  const columnName = (index: number) => {
    let value = index + 1;
    let name = '';
    while (value > 0) {
      const remainder = (value - 1) % 26;
      name = String.fromCharCode(65 + remainder) + name;
      value = Math.floor((value - 1) / 26);
    }
    return name;
  };
  const sheetRows = [columns, ...rows].map((row, rowIndex) => {
    const cells = row.map((cell, columnIndex) => {
      const reference = `${columnName(columnIndex)}${rowIndex + 1}`;
      return `<c r="${reference}" t="inlineStr"><is><t xml:space="preserve">${xmlEscape(String(cell ?? ''))}</t></is></c>`;
    }).join('');
    return `<row r="${rowIndex + 1}">${cells}</row>`;
  }).join('');
  const files = {
    '[Content_Types].xml': strToU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>'),
    '_rels/.rels': strToU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'),
    'xl/workbook.xml': strToU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Reporte" sheetId="1" r:id="rId1"/></sheets></workbook>'),
    'xl/_rels/workbook.xml.rels': strToU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>'),
    'xl/worksheets/sheet1.xml': strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheetRows}</sheetData></worksheet>`),
  };
  const blob = new Blob([zipSync(files)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function createPrintableReport(title: string, metrics: ReportMetric[], columns: string[], rows: string[][]) {
  const cards = metrics.map((metric) => `<div class="metric"><strong>${escapeHtml(metric.value)}</strong><span>${escapeHtml(metric.label)}</span></div>`).join('');
  const header = columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('');
  const body = rows.length
    ? rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')
    : `<tr><td colspan="${Math.max(columns.length, 1)}">Sin datos disponibles</td></tr>`;
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>
    *{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#17212b;margin:32px;font-size:12px}header{border-bottom:2px solid #264653;padding-bottom:14px;margin-bottom:22px}header img{width:160px;max-height:42px;object-fit:contain;object-position:left}h1{font-size:24px;margin:0 0 6px}p{color:#66727c;margin:0 0 18px}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px}.metric{border:1px solid #dce3e8;border-radius:6px;padding:12px;display:grid;gap:4px}.metric strong{font-size:21px}.metric span{color:#52616b;font-size:11px}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:9px;border-bottom:1px solid #e6eaed;vertical-align:top}th{background:#f1f5f7;font-size:10px;text-transform:uppercase}tr:nth-child(even) td{background:#fafbfc}@media print{body{margin:12mm}header{margin-bottom:18px}}
    </style></head><body><header><img src="/LOGOTIPO_POSITIVO.png" alt="TRIADE"></header><h1>${escapeHtml(title)}</h1><p>${new Date().toLocaleString()}</p><div class="metrics">${cards}</div><table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table></body></html>`;
  openReportPreviewModal(html);
}

const statusLabels = (t: AdminStrings): Record<string, string> => ({
  pending: t.pending,
  in_progress: t.inProgress,
  completed: t.completed,
  overdue: t.overdue,
  exempted: t.exempted,
  cancelled: t.cancelled,
});

function selectedFilterLabelFor(options: SelectionOption[], value: string) {
  return options.find((option) => option.value === value)?.label ?? '';
}

export function ReportsModule({ t, data }: { t: AdminStrings; data: AdminData }) {
  const [reportType, setReportType] = useState<ReportType>('compliance');
  const [roleFilter, setRoleFilter] = useState('all');
  const [workerFilter, setWorkerFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [filterPicker, setFilterPicker] = useState<'role' | 'worker' | 'status' | 'course' | null>(null);
  const statusNames = statusLabels(t);

  const requirements = data.userCourseReqs.map((requirement) => {
    const user = data.team.find((person) => person.id === requirement.user_id);
    const course = data.courses.find((item) => item.id === requirement.course_id);
    const role = data.jobRoles.find((item) => item.id === user?.job_role_id);
    const department = data.departments.find((item) => item.id === role?.department_id);
    return { requirement, user, course, role, department };
  }).filter((record) => record.user?.role === 'employee');

  const activeEmployees = data.team.filter((user) => user.role === 'employee' && user.is_active);
  const roleOptions = data.jobRoles.filter((role) => activeEmployees.some((employee) => employee.job_role_id === role.id));
  const roleFilterOptions: SelectionOption[] = [{ value: 'all', label: t.allRoles }, ...roleOptions.map((role) => ({ value: role.id, label: role.name }))];
  const workerFilterOptions: SelectionOption[] = [{ value: 'all', label: t.allWorkers }, ...activeEmployees.map((employee) => ({ value: employee.id, label: employee.full_name }))];
  const statusFilterOptions: SelectionOption[] = [{ value: 'all', label: t.allStatuses }, ...Object.entries(statusNames).map(([value, label]) => ({ value, label }))];
  const activeCourses = data.courses.filter((course) =>
    data.userCourseReqs.some((requirement) => requirement.course_id === course.id) ||
    data.examAttempts.some((attempt) => attempt.status === 'completed' && data.userCourseReqs.find((requirement) => requirement.id === attempt.user_course_requirement_id)?.course_id === course.id) ||
    data.feedback.some((entry) => data.userCourseReqs.find((requirement) => requirement.id === entry.user_course_requirement_id)?.course_id === course.id),
  );

  let columns: string[] = [];
  let rows: string[][] = [];
  let metrics: ReportMetric[] = [];

  if (reportType === 'compliance') {
    const roleRows = data.jobRoles
      .filter((role) => roleFilter === 'all' || role.id === roleFilter)
      .map((role) => {
        const roleEmployees = activeEmployees.filter((employee) => employee.job_role_id === role.id);
        const roleCourses = data.courses.filter((course) => course.assignments.some((assignment) => assignment.job_role_id === role.id));
        const expectedAssignments = roleEmployees.flatMap((employee) => roleCourses.flatMap((course) => {
          const userRequirements = data.userCourseReqs
            .filter((requirement) => requirement.user_id === employee.id && requirement.course_id === course.id && requirement.job_role_id === role.id)
            .sort((left, right) => right.assigned_at.localeCompare(left.assigned_at));
          const latestRequirement = userRequirements[0];
          if (latestRequirement && ['exempted', 'cancelled'].includes(latestRequirement.status)) return [];
          return [{ employeeId: employee.id, status: latestRequirement?.status ?? 'pending' }];
        }));
        const employeeIds = roleEmployees.map((employee) => employee.id);
        const completedEmployees = employeeIds.filter((employeeId) => {
          const employeeAssignments = expectedAssignments.filter((assignment) => assignment.employeeId === employeeId);
          return employeeAssignments.length > 0 && employeeAssignments.every((assignment) => assignment.status === 'completed');
        }).length;
        const completedRequirements = expectedAssignments.filter((assignment) => assignment.status === 'completed').length;
        const assignmentCompletion = expectedAssignments.length ? Math.round((completedRequirements / expectedAssignments.length) * 100) : 0;
        const employeeCompletion = employeeIds.length ? Math.round((completedEmployees / employeeIds.length) * 100) : 0;
        const department = data.departments.find((item) => item.id === role.department_id)?.name ?? '—';
        return { role: role.name, department, employees: employeeIds.length, completedEmployees, assignmentCount: expectedAssignments.length, completedRequirements, assignmentCompletion, employeeCompletion };
      })
      .filter((row) => row.employees > 0);
    const enrolledEmployees = roleRows.reduce((total, row) => total + row.employees, 0);
    const totalAssignments = roleRows.reduce((total, row) => total + row.assignmentCount, 0);
    const completedAssignments = roleRows.reduce((total, row) => total + row.completedRequirements, 0);
    const assignmentCompletion = totalAssignments ? Math.round((completedAssignments / totalAssignments) * 100) : 0;
    const fullyCompliantEmployees = roleRows.reduce((total, row) => total + row.completedEmployees, 0);
    columns = [t.jobRoleCol, t.departmentCol, t.employeesInRole, t.employeesFullyCompliant, t.completedAssignments, t.assignmentCompletion];
    rows = roleRows.map((row) => [row.role, row.department, String(row.employees), `${row.completedEmployees}/${row.employees} (${row.employeeCompletion}%)`, `${row.completedRequirements}/${row.assignmentCount}`, `${row.assignmentCompletion}%`]);
    metrics = [
      { label: t.jobRole, value: roleRows.length, icon: Users, tone: 'g1' },
      { label: t.employeesInRole, value: enrolledEmployees, icon: Users, tone: 'g2' },
      { label: t.employeesFullyCompliant, value: fullyCompliantEmployees, icon: BookOpen, tone: 'g3' },
      { label: t.assignmentCompletion, value: `${assignmentCompletion}%`, icon: BarChart3, tone: 'g4' },
    ];
  } else if (reportType === 'progress') {
    const visible = requirements.filter(({ requirement, course, role }) =>
      Boolean(role && requirement.job_role_id === role.id && course?.assignments.some((assignment) => assignment.job_role_id === role.id)) &&
      (roleFilter === 'all' || role?.id === roleFilter) &&
      (workerFilter === 'all' || requirement.user_id === workerFilter) &&
      (statusFilter === 'all' || requirement.status === statusFilter),
    );
    columns = [t.user, t.courseName, t.jobRoleCol, t.departmentCol, t.progressCol, t.status, t.lastAccessed];
    rows = visible.map(({ requirement, user, course, role, department }) => [
      user?.full_name ?? '—', course?.title ?? '—', role?.name ?? '—', department?.name ?? '—',
      `${requirement.status === 'completed' ? 100 : Math.max(0, Math.min(100, Math.round(requirement.progress_percent ?? 0)))}%`, statusNames[requirement.status] ?? requirement.status,
      requirement.last_accessed_at ? new Date(requirement.last_accessed_at).toLocaleDateString() : '—',
    ]);
    const activeRequirements = visible.filter((record) => !['exempted', 'cancelled'].includes(record.requirement.status));
    const averageProgress = activeRequirements.length ? Math.round(activeRequirements.reduce((total, record) => total + (record.requirement.status === 'completed' ? 100 : Math.max(0, Math.min(100, record.requirement.progress_percent ?? 0))), 0) / activeRequirements.length) : 0;
    const completed = visible.filter((record) => record.requirement.status === 'completed').length;
    metrics = [
      { label: t.totalUsers, value: new Set(visible.map((record) => record.user?.id).filter(Boolean)).size, icon: Users, tone: 'g1' },
      { label: t.totalAssignments, value: visible.length, icon: BookOpen, tone: 'g2' },
      { label: t.completedAssignments, value: completed, icon: Star, tone: 'g3' },
      { label: t.totalProgress, value: `${averageProgress}%`, icon: BarChart3, tone: 'g4' },
    ];
  } else if (reportType === 'exams') {
    const attemptsByCourse = new Map<string, typeof data.examAttempts>();
    const completedAttempts = data.examAttempts.filter((attempt) => attempt.status === 'completed');
    for (const attempt of completedAttempts) {
      const courseId = data.userCourseReqs.find((requirement) => requirement.id === attempt.user_course_requirement_id)?.course_id;
      if (!courseId || (courseFilter !== 'all' && courseId !== courseFilter)) continue;
      const existing = attemptsByCourse.get(courseId) ?? [];
      existing.push(attempt);
      attemptsByCourse.set(courseId, existing);
    }
    const examRows = [...attemptsByCourse.entries()].map(([courseId, attempts]) => {
      const course = data.courses.find((item) => item.id === courseId);
      const passed = attempts.filter((attempt) => attempt.passed).length;
      const average = attempts.length ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length) : 0;
      return { course: course?.title ?? '—', attempts: attempts.length, passed, failed: attempts.length - passed, rate: Math.round((passed / attempts.length) * 100), average };
    }).sort((left, right) => left.course.localeCompare(right.course));
    const total = examRows.reduce((sum, row) => sum + row.attempts, 0);
    const passed = examRows.reduce((sum, row) => sum + row.passed, 0);
    const average = total ? Math.round(completedAttempts.filter((attempt) => {
      const courseId = data.userCourseReqs.find((requirement) => requirement.id === attempt.user_course_requirement_id)?.course_id;
      return courseFilter === 'all' || courseId === courseFilter;
    }).reduce((sum, attempt) => sum + attempt.score, 0) / total) : 0;
    columns = [t.courseName, t.totalExams, t.passed, t.failed, t.passRate, t.avgScore];
    rows = examRows.map((row) => [row.course, String(row.attempts), String(row.passed), String(row.failed), `${row.rate}%`, `${row.average}%`]);
    metrics = [
      { label: t.totalExams, value: total, icon: FileText, tone: 'g1' },
      { label: t.passed, value: passed, icon: Star, tone: 'g2' },
      { label: t.passRate, value: total ? `${Math.round((passed / total) * 100)}%` : '0%', icon: BarChart3, tone: 'g3' },
      { label: t.avgScore, value: `${average}%`, icon: BarChart3, tone: 'g4' },
    ];
  } else {
    const feedbackByCourse = new Map<string, typeof data.feedback>();
    for (const entry of data.feedback) {
      const courseId = data.userCourseReqs.find((requirement) => requirement.id === entry.user_course_requirement_id)?.course_id;
      if (!courseId || (courseFilter !== 'all' && courseId !== courseFilter)) continue;
      const existing = feedbackByCourse.get(courseId) ?? [];
      existing.push(entry);
      feedbackByCourse.set(courseId, existing);
    }
    const feedbackRows = [...feedbackByCourse.entries()].map(([courseId, entries]) => {
      const course = data.courses.find((item) => item.id === courseId);
      const average = entries.reduce((sum, entry) => sum + entry.rating, 0) / entries.length;
      const recommendationAnswers = entries.filter((entry) => entry.would_recommend !== null);
      const recommendations = recommendationAnswers.filter((entry) => entry.would_recommend === true).length;
      const difficultyAnswers = entries.filter((entry) => entry.difficulty_level !== null);
      const difficult = difficultyAnswers.filter((entry) => entry.difficulty_level === 'hard' || entry.difficulty_level === 'very_hard').length;
      return {
        course: course?.title ?? '—', count: entries.length, average: average.toFixed(1),
        recommendations, recommendationAnswers: recommendationAnswers.length,
        recommendationRate: recommendationAnswers.length ? Math.round((recommendations / recommendationAnswers.length) * 100) : 0,
        difficult, difficultyAnswers: difficultyAnswers.length,
        difficultyRate: difficultyAnswers.length ? Math.round((difficult / difficultyAnswers.length) * 100) : 0,
      };
    }).sort((left, right) => left.course.localeCompare(right.course));
    const total = feedbackRows.reduce((sum, row) => sum + row.count, 0);
    const average = total ? (data.feedback.filter((entry) => {
      const courseId = data.userCourseReqs.find((requirement) => requirement.id === entry.user_course_requirement_id)?.course_id;
      return courseFilter === 'all' || courseId === courseFilter;
    }).reduce((sum, entry) => sum + entry.rating, 0) / total).toFixed(1) : '0.0';
    const selectedFeedback = data.feedback.filter((entry) => {
      const courseId = data.userCourseReqs.find((requirement) => requirement.id === entry.user_course_requirement_id)?.course_id;
      return courseFilter === 'all' || courseId === courseFilter;
    });
    const recommendations = selectedFeedback.filter((entry) => entry.would_recommend !== null);
    const positiveRecommendations = recommendations.filter((entry) => entry.would_recommend === true).length;
    columns = [t.courseName, t.totalFeedback, t.rating, t.recommend, t.difficulty];
    rows = feedbackRows.map((row) => [row.course, String(row.count), `${row.average}/5`, `${row.recommendations}/${row.recommendationAnswers} (${row.recommendationRate}%)`, `${row.difficult}/${row.difficultyAnswers} (${row.difficultyRate}%)`]);
    metrics = [
      { label: t.totalFeedback, value: total, icon: Star, tone: 'g1' },
      { label: t.avgScore, value: `${average}/5`, icon: BarChart3, tone: 'g2' },
      { label: t.recommend, value: recommendations.length ? `${Math.round((positiveRecommendations / recommendations.length) * 100)}%` : '—', icon: Users, tone: 'g3' },
      { label: t.courseName, value: feedbackRows.length, icon: BookOpen, tone: 'g4' },
    ];
  }

  const reportTitles: Record<ReportType, string> = {
    compliance: t.complianceReport,
    progress: t.progressReport,
    exams: t.examResults,
    feedback: t.feedbackReport,
  };
  const fileStem = reportType === 'compliance' ? 'cumplimiento' : reportType === 'progress' ? 'progreso' : reportType === 'exams' ? 'examenes' : 'feedback';
  const tabs: { id: ReportType; label: string }[] = [
    { id: 'compliance', label: t.complianceReport },
    { id: 'progress', label: t.progressReport },
    { id: 'exams', label: t.examResults },
    { id: 'feedback', label: t.feedbackReport },
  ];

  const exportExcel = () => downloadXlsx(`reporte-${fileStem}.xlsx`, columns, rows);
  const exportCsv = () => downloadCsv(`reporte-${fileStem}.csv`, columns, rows);
  const exportPdf = () => createPrintableReport(reportTitles[reportType], metrics, columns, rows);
  const reportActions = [
    { value: 'excel', label: t.exportExcel },
    { value: 'pdf', label: t.exportPdf },
    { value: 'csv', label: t.exportCsv },
  ];
  const handleReportAction = (action: string) => {
    if (action === 'excel') exportExcel();
    else if (action === 'pdf') exportPdf();
    else if (action === 'csv') exportCsv();
  };
  const filterOptions: SelectionOption[] = filterPicker === 'role'
    ? roleFilterOptions
    : filterPicker === 'worker'
      ? workerFilterOptions
      : filterPicker === 'status'
        ? statusFilterOptions
        : [{ value: 'all', label: t.allCourses }, ...activeCourses.map((course) => ({ value: course.id, label: course.title }))];
  const filterValue = filterPicker === 'role'
    ? roleFilter
    : filterPicker === 'worker'
      ? workerFilter
      : filterPicker === 'status'
        ? statusFilter
        : courseFilter;
  const filterTitle = filterPicker === 'role'
    ? t.jobRole
    : filterPicker === 'worker'
      ? t.user
      : filterPicker === 'status'
        ? t.status
        : t.courseName;
  const filterSearchPlaceholder = filterPicker === 'role'
    ? `${t.search} ${t.jobRole.toLowerCase()}`
    : filterPicker === 'worker'
      ? `${t.search} ${t.user.toLowerCase()}`
      : filterPicker === 'status'
        ? `${t.search} ${t.status.toLowerCase()}`
        : `${t.search} ${t.courseName.toLowerCase()}`;
  const applyFilter = (value: string) => {
    if (filterPicker === 'role') setRoleFilter(value);
    else if (filterPicker === 'worker') setWorkerFilter(value);
    else if (filterPicker === 'status') setStatusFilter(value);
    else if (filterPicker === 'course') setCourseFilter(value);
    setFilterPicker(null);
  };

  return (
    <div className="page animate-in">
      <div className="page-heading">
        <div><p className="eyebrow">{t.reports}</p><h1>{t.reports}</h1><p className="muted">{t.reportsDesc}</p></div>
        <ReportDropdown label={t.generateReport} options={reportActions} onSelect={handleReportAction} />
      </div>

      <div className="admin-tabs report-tabs" role="tablist" aria-label={t.reports}>
        {tabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={reportType === tab.id} className={reportType === tab.id ? 'admin-tab active' : 'admin-tab'} onClick={() => setReportType(tab.id)}>{tab.label}</button>)}
      </div>

      <div className="reports-filter-row">
        {reportType === 'compliance' && (
          <div className="field-group"><label>{t.jobRole}</label><button type="button" className="selection-trigger" onClick={() => setFilterPicker('role')}><span>{selectedFilterLabelFor(roleFilterOptions, roleFilter)}</span><Users size={16} /></button></div>
        )}
        {reportType === 'progress' && <>
          <div className="field-group"><label>{t.jobRole}</label><button type="button" className="selection-trigger" onClick={() => setFilterPicker('role')}><span>{selectedFilterLabelFor(roleFilterOptions, roleFilter)}</span><Users size={16} /></button></div>
          <div className="field-group"><label>{t.user}</label><button type="button" className="selection-trigger" onClick={() => setFilterPicker('worker')}><span>{selectedFilterLabelFor(workerFilterOptions, workerFilter)}</span><Users size={16} /></button></div>
          <div className="field-group"><label>{t.status}</label><button type="button" className="selection-trigger" onClick={() => setFilterPicker('status')}><span>{selectedFilterLabelFor(statusFilterOptions, statusFilter)}</span><BarChart3 size={16} /></button></div>
        </>}
        {(reportType === 'exams' || reportType === 'feedback') && <div className="field-group"><label>{t.courseName}</label><button type="button" className="selection-trigger" onClick={() => setFilterPicker('course')}><span>{selectedFilterLabelFor([{ value: 'all', label: t.allCourses }, ...activeCourses.map((course) => ({ value: course.id, label: course.title }))], courseFilter)}</span><BookOpen size={16} /></button></div>}
      </div>

      {filterPicker && <SelectionModal
        eyebrow={t.reports}
        title={filterTitle}
        options={filterOptions}
        selectedValue={filterValue}
        searchPlaceholder={filterSearchPlaceholder}
        onSelect={applyFilter}
        onClose={() => setFilterPicker(null)}
      />}

      <div className="stats-grid reports-metrics-grid">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return <div key={metric.label} className="stat-card"><div className={`stat-icon ${metric.tone}`}><Icon size={18} /></div><div><strong>{metric.value}</strong><span>{metric.label}</span></div></div>;
        })}
      </div>

      <section className="section-card reports-table-section">
        <div className="section-title"><div><h2>{reportTitles[reportType]}</h2><p className="muted">{rows.length} {t.resultsCount}</p></div></div>
        {rows.length === 0 ? <div className="empty-state"><BarChart3 size={28} /><h3>{t.noData}</h3></div> : (
          <PaginatedList items={rows}>{(pageRows, firstItemIndex) => <div className="reports-table-scroll"><table className="reports-table"><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>
            {pageRows.map((row, index) => <tr key={`${reportType}-${firstItemIndex + index}`}>{row.map((cell, cellIndex) => <td key={`${firstItemIndex + index}-${cellIndex}`}>{cell}</td>)}</tr>)}
          </tbody></table></div>}</PaginatedList>
        )}
      </section>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, Award, BarChart3, Bell, BookOpen, Check, Clock3, Download, FileText, History, Plus, Settings, ShieldCheck, Star, Trash2, Users, X, Zap, User } from 'lucide-react';
import { supabase, type Profile, type JobRole, type CourseWithRelations, type Certificate, type RoleCertification, type Notification, type CourseFeedback, type Badge, type UserBadge, type SystemSetting, type AuditLog, type UserCourseRequirement } from '@/lib/supabase';
import { fetchUserCourseRequirements, assignCourseToUser, fetchAllCertificates, fetchRoleCertifications, fetchAllNotifications, createNotification, deleteNotification, fetchAllFeedback, fetchBadges, createBadge, deleteBadge, fetchUserBadges, fetchSystemSettings, updateSystemSetting, createSystemSetting, fetchAuditLogs } from '@/lib/data';
import { getIcon } from '@/lib/icons';
import type { AdminSection } from '@/lib/routes';
import { useToast } from '@/lib/toast';
import type { AdminStrings, AdminData } from './types';
import { PaginatedList } from '../PaginatedList';

export function ReportsModule({ t, data }: { t: AdminStrings; data: AdminData }) {
  const { courses, team, certificates, feedback, examAttempts, userCourseReqs } = data;
  const employeeUsers = team.filter((user) => user.role === 'employee');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(employeeUsers[0]?.id ?? '');

  const reportCards = [
    { title: t.complianceReport, icon: ShieldCheck, count: userCourseReqs.length, desc: t.totalAssignments },
    { title: t.progressReport, icon: BarChart3, count: data.moduleProgress.length, desc: t.totalProgress },
    { title: t.certReport, icon: Award, count: certificates.length, desc: t.totalCertificates },
    { title: t.feedbackReport, icon: Star, count: feedback.length, desc: t.totalFeedback },
  ];

  const selectedEmployee = employeeUsers.find((user) => user.id === selectedEmployeeId) ?? employeeUsers[0] ?? null;
  const completedCourses = selectedEmployee
    ? userCourseReqs.filter((req) => req.user_id === selectedEmployee.id && req.status === 'completed')
      .map((req) => ({
        ...req,
        course: courses.find((course) => course.id === req.course_id),
      }))
      .filter((req) => req.course)
    : [];

  const employeeAttempts = selectedEmployee
    ? userCourseReqs
        .filter((req) => req.user_id === selectedEmployee.id)
        .map((req) => {
          const course = courses.find((course) => course.id === req.course_id);
          const attempts = examAttempts.filter((attempt) => attempt.user_course_requirement_id === req.id);
          return {
            id: req.id,
            courseTitle: course?.title ?? 'Curso sin nombre',
            attempts,
            failedAttempts: attempts.filter((attempt) => !attempt.passed),
          };
        })
        .filter((item) => item.attempts.length > 0)
    : [];

  const exportData = (format: string) => {
    const data = { courses, team, certificates, feedback, examAttempts };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-${new Date().toISOString().slice(0, 10)}.${format === 'excel' ? 'json' : format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch] as string);
    const summaryRows = reportCards.map((r) => `<tr><td>${escapeHtml(r.title)}</td><td class="num">${r.count}</td></tr>`).join('');
    const employeeHtml = selectedEmployee ? `
      <h2>${escapeHtml(selectedEmployee.full_name)}</h2>
      <h3>Cursos realizados (${completedCourses.length})</h3>
      <ul>${completedCourses.map((req) => `<li>${escapeHtml(req.course?.title ?? 'Curso sin nombre')}${req.completed_at ? ` - ${new Date(req.completed_at).toLocaleDateString()}` : ''}</li>`).join('') || '<li>Sin cursos realizados</li>'}</ul>
      <h3>Intentos fallidos (${employeeAttempts.reduce((total, item) => total + item.failedAttempts.length, 0)})</h3>
      <ul>${employeeAttempts.filter((item) => item.failedAttempts.length > 0).map((item) => `<li>${escapeHtml(item.courseTitle)} - ${item.failedAttempts.length} intento(s)</li>`).join('') || '<li>Sin intentos fallidos</li>'}</ul>` : '';
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Reporte ${new Date().toISOString().slice(0, 10)}</title>
      <style>
        body{font-family:Arial,sans-serif;color:#0f172a;padding:32px;font-size:13px}
        h1{font-size:22px;margin:0 0 4px}
        h2{font-size:17px;margin:28px 0 8px}
        h3{font-size:14px;margin:18px 0 6px}
        table{width:100%;border-collapse:collapse;margin-top:12px}
        th,td{border-bottom:1px solid #e2e8f0;padding:8px 6px;text-align:left}
        td.num{text-align:right;font-weight:700}
        ul{margin:0;padding-left:18px}
        li{margin:4px 0}
        .muted{color:#64748b}
      </style></head><body>
      <h1>Reporte de capacitación</h1>
      <p class="muted">Generado el ${new Date().toLocaleDateString()}</p>
      <table><thead><tr><th>Indicador</th><th class="num">Total</th></tr></thead><tbody>${summaryRows}</tbody></table>
      ${employeeHtml}
    </body></html>`;
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
    frame.contentWindow.print();
    setTimeout(() => frame.remove(), 1000);
  };

  return (
    <div className="page animate-in">
      <div className="page-heading"><div><p className="eyebrow">REPORTES</p><h1>{t.reports}</h1><p className="muted">{t.reportsDesc}</p></div>
        <div className="report-export-buttons">
          <button className="outline-button" onClick={exportPdf}><Download size={16} />{t.exportPdf}</button>
          <button className="outline-button" onClick={() => exportData('excel')}><Download size={16} />{t.exportExcel}</button>
          <button className="outline-button" onClick={() => exportData('csv')}><Download size={16} />{t.exportCsv}</button>
        </div>
      </div>
      <div className="report-cards-grid">
        {reportCards.map((r, i) => {
          const Icon = r.icon;
          return <div key={i} className="report-card">
            <div className="report-card-icon"><Icon size={24} /></div>
            <div className="report-card-copy"><strong>{r.title}</strong><small>{r.desc}</small></div>
            <div className="report-count">{r.count}</div>
            <button className="outline-button report-export-btn" onClick={() => exportData('csv')}><Download size={14} />{t.exportCsv}</button>
          </div>;
        })}
      </div>
      <div className="section-card" style={{ marginTop: 18 }}>
        <div className="section-title">
          <div>
            <h2>{t.examResults}</h2>
            <p className="muted">{team.length} empleados</p>
          </div>
        </div>

        {employeeUsers.length === 0 ? <p className="muted" style={{ padding: '20px 0' }}>{t.noData}</p> : (
          <div style={{ display: 'grid', gap: 18 }}>
            <div className="field-group field-group-full">
              <label>Empleado</label>
              <select className="auth-input" value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
                {employeeUsers.map((user) => (
                  <option key={user.id} value={user.id}>{user.full_name}</option>
                ))}
              </select>
            </div>

            {selectedEmployee ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                  <strong>{selectedEmployee.full_name}</strong>
                  <span className="meta-tag">{completedCourses.length} cursos realizados</span>
                </div>

                {completedCourses.length === 0 ? (
                  <p className="muted">Este empleado aún no ha realizado cursos.</p>
                ) : (
                  <PaginatedList items={completedCourses}>{(pageCompletedCourses) => <div className="admin-list-stack">
                    {pageCompletedCourses.map((req) => (
                      <div key={req.id} className="admin-course-row">
                        <div className="course-icon gray-2"><FileText size={18} /></div>
                        <div className="course-row-info">
                          <strong>{req.course?.title ?? 'Curso sin nombre'}</strong>
                          <small>{req.completed_at ? new Date(req.completed_at).toLocaleDateString() : 'Fecha no disponible'}</small>
                        </div>
                        <span className="status-badge completed">{t.completed}</span>
                      </div>
                    ))}
                  </div>}</PaginatedList>
                )}

                <div style={{ marginTop: 22 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                    <strong>Intentos fallidos</strong>
                    <span className="meta-tag">{employeeAttempts.reduce((total, item) => total + item.failedAttempts.length, 0)} total</span>
                  </div>

                  {employeeAttempts.every((item) => item.failedAttempts.length === 0) ? (
                    <p className="muted">Este empleado no tiene intentos fallidos.</p>
                  ) : (
                    <PaginatedList items={employeeAttempts.filter((item) => item.failedAttempts.length > 0)}>{(pageEmployeeAttempts) => <div className="admin-list-stack">
                      {pageEmployeeAttempts.map((item) => (
                          <div key={item.id} className="admin-course-row">
                            <div className="course-icon gray-2"><AlertCircle size={18} /></div>
                            <div className="course-row-info">
                              <strong>{item.courseTitle}</strong>
                              <small>{item.failedAttempts.length} intento(s) fallido(s)</small>
                            </div>
                            <span className="status-badge inactive">{item.failedAttempts.length}</span>
                          </div>
                        ))}
                    </div>}</PaginatedList>
                  )}
                </div>
              </div>
            ) : <p className="muted">{t.noData}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// ===================== SETTINGS =====================

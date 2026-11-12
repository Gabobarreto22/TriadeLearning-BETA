import { useState } from 'react';
import { AlertCircle, FileText } from 'lucide-react';
import type { AdminStrings, AdminData } from './types';
import { PaginatedList } from '../PaginatedList';
import { ReportDropdown } from './ReportDropdown';
import { exportExamResultsReport } from '@/lib/pdfReport';

export function ReportsModule({ t, data }: { t: AdminStrings; data: AdminData }) {
  const { courses, team, examAttempts, userCourseReqs } = data;
  const employeeUsers = team.filter((user) => user.role === 'employee');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [reportMode, setReportMode] = useState<'all' | 'worker'>('all');

  const allAttempts = examAttempts.map((a) => {
    const req = userCourseReqs.find((r) => r.id === a.user_course_requirement_id);
    const user = team.find((u) => u.id === req?.user_id);
    const course = courses.find((c) => c.id === req?.course_id);
    return {
      userName: user?.full_name ?? '—',
      courseTitle: course?.title ?? '—',
      score: a.score,
      passed: a.passed,
      attempted_at: a.completed_at ?? a.created_at,
    };
  });

  const selectedEmployee = employeeUsers.find((u) => u.id === selectedEmployeeId) ?? null;

  const workerAttempts = selectedEmployee
    ? examAttempts
        .filter((a) => {
          const req = userCourseReqs.find((r) => r.id === a.user_course_requirement_id);
          return req?.user_id === selectedEmployee.id;
        })
        .map((a) => {
          const req = userCourseReqs.find((r) => r.id === a.user_course_requirement_id);
          const course = courses.find((c) => c.id === req?.course_id);
          return {
            userName: selectedEmployee.full_name,
            courseTitle: course?.title ?? '—',
            score: a.score,
            passed: a.passed,
            attempted_at: a.completed_at ?? a.created_at,
          };
        })
    : [];

  const completedCourses = selectedEmployee
    ? userCourseReqs
        .filter((req) => req.user_id === selectedEmployee.id && req.status === 'completed')
        .map((req) => ({
          ...req,
          course: courses.find((course) => course.id === req.course_id),
        }))
        .filter((req) => req.course)
    : [];

  const employeeFailedAttempts = selectedEmployee
    ? userCourseReqs
        .filter((req) => req.user_id === selectedEmployee.id)
        .map((req) => {
          const course = courses.find((course) => course.id === req.course_id);
          const attempts = examAttempts.filter((attempt) => attempt.user_course_requirement_id === req.id);
          return {
            id: req.id,
            courseTitle: course?.title ?? 'Curso sin nombre',
            failedAttempts: attempts.filter((attempt) => !attempt.passed),
          };
        })
        .filter((item) => item.failedAttempts.length > 0)
    : [];

  const examReportOpts = [
    { value: 'general', label: t.reportGeneral },
    { value: 'byWorker', label: t.reportByWorker },
  ];

  const handleExamReport = (scope: string) => {
    if (scope === 'general') {
      exportExamResultsReport({ attempts: allAttempts, scope: 'general' });
    } else {
      const names = employeeUsers.map((u) => u.full_name);
      if (names.length === 0) return;
      const chosen = prompt(t.reportByWorker + ': ' + names.slice(0, 20).join(', '), names[0] ?? '');
      if (!chosen) return;
      const worker = employeeUsers.find((u) => u.full_name === chosen);
      if (!worker) return;
      const attempts = examAttempts
        .filter((a) => {
          const req = userCourseReqs.find((r) => r.id === a.user_course_requirement_id);
          return req?.user_id === worker.id;
        })
        .map((a) => {
          const req = userCourseReqs.find((r) => r.id === a.user_course_requirement_id);
          const course = courses.find((c) => c.id === req?.course_id);
          return {
            userName: worker.full_name,
            courseTitle: course?.title ?? '—',
            score: a.score,
            passed: a.passed,
            attempted_at: a.completed_at ?? a.created_at,
          };
        });
      exportExamResultsReport({ attempts, scope: 'byWorker', filterLabel: chosen });
    }
  };

  return (
    <div className="page animate-in">
      <div className="page-heading">
        <div><p className="eyebrow">REPORTES</p><h1>{t.examResults}</h1><p className="muted">{t.reportsDesc}</p></div>
        <ReportDropdown label={t.reportExamResults} options={examReportOpts} onSelect={handleExamReport} />
      </div>

      <div className="section-card">
        <div className="section-title">
          <div>
            <h2>{t.examResults}</h2>
            <p className="muted">{employeeUsers.length} {t.teamMembers.toLowerCase()}</p>
          </div>
        </div>

        {employeeUsers.length === 0 ? <p className="muted" style={{ padding: '20px 0' }}>{t.noData}</p> : (
          <div style={{ display: 'grid', gap: 18 }}>
            <div className="field-group field-group-full">
              <label>{t.user}</label>
              <select className="auth-input" value={selectedEmployeeId} onChange={(e) => { setSelectedEmployeeId(e.target.value); setReportMode(e.target.value ? 'worker' : 'all'); }}>
                <option value="">{t.allWorkers}</option>
                {employeeUsers.map((user) => (
                  <option key={user.id} value={user.id}>{user.full_name}</option>
                ))}
              </select>
            </div>

            {!selectedEmployeeId ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                  <strong>{t.allWorkers}</strong>
                  <span className="meta-tag">{allAttempts.length} {t.totalExams.toLowerCase()}</span>
                </div>
                {allAttempts.length === 0 ? (
                  <p className="muted">{t.noData}</p>
                ) : (
                  <PaginatedList items={allAttempts}>{(pageAttempts) => <div className="admin-list-stack">
                    {pageAttempts.map((a, i) => (
                      <div key={i} className="admin-course-row">
                        <div className="course-icon gray-2"><FileText size={18} /></div>
                        <div className="course-row-info">
                          <strong>{a.userName}</strong>
                          <small>{a.courseTitle} · {a.score !== null ? `${a.score}%` : '—'}</small>
                        </div>
                        <span className={`status-badge ${a.passed ? 'active' : 'inactive'}`}>{a.passed ? t.passed : t.failed}</span>
                      </div>
                    ))}
                  </div>}</PaginatedList>
                )}
              </div>
            ) : selectedEmployee ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                  <strong>{selectedEmployee.full_name}</strong>
                  <span className="meta-tag">{completedCourses.length} {t.completed.toLowerCase()}</span>
                </div>

                {completedCourses.length === 0 ? (
                  <p className="muted">{t.noData}</p>
                ) : (
                  <PaginatedList items={completedCourses}>{(pageCompletedCourses) => <div className="admin-list-stack">
                    {pageCompletedCourses.map((req) => (
                      <div key={req.id} className="admin-course-row">
                        <div className="course-icon gray-2"><FileText size={18} /></div>
                        <div className="course-row-info">
                          <strong>{req.course?.title ?? 'Curso sin nombre'}</strong>
                          <small>{req.completed_at ? new Date(req.completed_at).toLocaleDateString() : '—'}</small>
                        </div>
                        <span className="status-badge active">{t.completed}</span>
                      </div>
                    ))}
                  </div>}</PaginatedList>
                )}

                {workerAttempts.length > 0 && (
                  <div style={{ marginTop: 22 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                      <strong>{t.examResults}</strong>
                      <span className="meta-tag">{workerAttempts.length} {t.totalExams.toLowerCase()}</span>
                    </div>
                    <PaginatedList items={workerAttempts}>{(pageWorkerAttempts) => <div className="admin-list-stack">
                      {pageWorkerAttempts.map((a, i) => (
                        <div key={i} className="admin-course-row">
                          <div className="course-icon gray-2">{a.passed ? <FileText size={18} /> : <AlertCircle size={18} />}</div>
                          <div className="course-row-info">
                            <strong>{a.courseTitle}</strong>
                            <small>{a.score !== null ? `${a.score}%` : '—'}</small>
                          </div>
                          <span className={`status-badge ${a.passed ? 'active' : 'inactive'}`}>{a.passed ? t.passed : t.failed}</span>
                        </div>
                      ))}
                    </div>}</PaginatedList>
                  </div>
                )}

                {employeeFailedAttempts.length > 0 && (
                  <div style={{ marginTop: 22 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                      <strong>Intentos fallidos</strong>
                      <span className="meta-tag">{employeeFailedAttempts.reduce((total, item) => total + item.failedAttempts.length, 0)} total</span>
                    </div>
                    <PaginatedList items={employeeFailedAttempts}>{(pageFailed) => <div className="admin-list-stack">
                      {pageFailed.map((item) => (
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
                  </div>
                )}
              </div>
            ) : <p className="muted">{t.noData}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

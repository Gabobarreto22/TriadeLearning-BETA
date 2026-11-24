import { useState } from 'react';
import { AlertCircle, FileText, Users } from 'lucide-react';
import type { AdminStrings, AdminData } from './types';
import { PaginatedList } from '../PaginatedList';
import { ReportDropdown } from './ReportDropdown';
import { SelectionModal } from './SelectionModal';
import { exportExamResultsReport } from '@/lib/pdfReport';

export function ExamResultsModule({ t, data }: { t: AdminStrings; data: AdminData }) {
  const { courses, team, examAttempts, userCourseReqs } = data;
  const employeeUsers = team.filter((user) => user.role === 'employee');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [workerPickerOpen, setWorkerPickerOpen] = useState(false);
  const [reportPickerOpen, setReportPickerOpen] = useState(false);

  const allAttempts = examAttempts.map((attempt) => {
    const requirement = userCourseReqs.find((item) => item.id === attempt.user_course_requirement_id);
    const user = team.find((item) => item.id === requirement?.user_id);
    const course = courses.find((item) => item.id === requirement?.course_id);
    return {
      userName: user?.full_name ?? '—',
      courseTitle: course?.title ?? '—',
      score: attempt.score,
      passed: attempt.passed,
      attempted_at: attempt.completed_at ?? attempt.created_at,
    };
  });

  const selectedEmployee = employeeUsers.find((user) => user.id === selectedEmployeeId) ?? null;

  const workerAttempts = selectedEmployee
    ? examAttempts
        .filter((attempt) => {
          const requirement = userCourseReqs.find((item) => item.id === attempt.user_course_requirement_id);
          return requirement?.user_id === selectedEmployee.id;
        })
        .map((attempt) => {
          const requirement = userCourseReqs.find((item) => item.id === attempt.user_course_requirement_id);
          const course = courses.find((item) => item.id === requirement?.course_id);
          return {
            userName: selectedEmployee.full_name,
            courseTitle: course?.title ?? '—',
            score: attempt.score,
            passed: attempt.passed,
            attempted_at: attempt.completed_at ?? attempt.created_at,
          };
        })
    : [];

  const completedCourses = selectedEmployee
    ? userCourseReqs
        .filter((requirement) => requirement.user_id === selectedEmployee.id && requirement.status === 'completed')
        .map((requirement) => ({
          ...requirement,
          course: courses.find((course) => course.id === requirement.course_id),
        }))
        .filter((requirement) => requirement.course)
    : [];

  const employeeFailedAttempts = selectedEmployee
    ? userCourseReqs
        .filter((requirement) => requirement.user_id === selectedEmployee.id)
        .map((requirement) => {
          const course = courses.find((item) => item.id === requirement.course_id);
          const attempts = examAttempts.filter((attempt) => attempt.user_course_requirement_id === requirement.id);
          return {
            id: requirement.id,
            courseTitle: course?.title ?? 'Curso sin nombre',
            failedAttempts: attempts.filter((attempt) => !attempt.passed),
          };
        })
        .filter((item) => item.failedAttempts.length > 0)
    : [];

  const exportWorkerReport = (workerId: string) => {
    const worker = employeeUsers.find((user) => user.id === workerId);
    if (!worker) return;
    const attempts = examAttempts
      .filter((attempt) => {
        const requirement = userCourseReqs.find((item) => item.id === attempt.user_course_requirement_id);
        return requirement?.user_id === worker.id;
      })
      .map((attempt) => {
        const requirement = userCourseReqs.find((item) => item.id === attempt.user_course_requirement_id);
        const course = courses.find((item) => item.id === requirement?.course_id);
        return {
          userName: worker.full_name,
          courseTitle: course?.title ?? '—',
          score: attempt.score,
          passed: attempt.passed,
          attempted_at: attempt.completed_at ?? attempt.created_at,
        };
      });
    exportExamResultsReport({ attempts, scope: 'byWorker', filterLabel: worker.full_name });
  };

  return (
    <div className="page animate-in">
      <div className="page-heading">
        <div><p className="eyebrow">{t.examResults}</p><h1>{t.examResults}</h1><p className="muted">{t.reportsDesc}</p></div>
        <ReportDropdown label={t.reportExamResults} options={[{ value: 'byWorker', label: t.reportByWorker }]} onSelect={() => setReportPickerOpen(true)} />
      </div>

      {reportPickerOpen && (
        <SelectionModal
          eyebrow={t.reportExamResults}
          title={t.reportByWorker}
          options={employeeUsers.map((user) => ({ value: user.id, label: user.full_name }))}
          selectedValue=""
          searchPlaceholder={`${t.search} ${t.user.toLowerCase()}`}
          onSelect={(value) => { setReportPickerOpen(false); exportWorkerReport(value); }}
          onClose={() => setReportPickerOpen(false)}
        />
      )}
      {workerPickerOpen && (
        <SelectionModal
          eyebrow={t.user}
          title={t.user}
          options={[{ value: '', label: t.allWorkers }, ...employeeUsers.map((user) => ({ value: user.id, label: user.full_name }))]}
          selectedValue={selectedEmployeeId}
          searchPlaceholder={`${t.search} ${t.user.toLowerCase()}`}
          onSelect={(value) => { setSelectedEmployeeId(value); setWorkerPickerOpen(false); }}
          onClose={() => setWorkerPickerOpen(false)}
        />
      )}

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
              <button type="button" className="selection-trigger" onClick={() => setWorkerPickerOpen(true)}>
                <span>{selectedEmployee?.full_name ?? t.allWorkers}</span>
                <Users size={16} />
              </button>
            </div>

            {!selectedEmployeeId ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                  <strong>{t.allWorkers}</strong>
                  <span className="meta-tag">{allAttempts.length} {t.totalExams.toLowerCase()}</span>
                </div>
                {allAttempts.length === 0 ? <p className="muted">{t.noData}</p> : (
                  <PaginatedList items={allAttempts}>{(pageAttempts) => <div className="admin-list-stack">
                    {pageAttempts.map((attempt, index) => (
                      <div key={index} className="admin-course-row">
                        <div className="course-icon gray-2"><FileText size={18} /></div>
                        <div className="course-row-info">
                          <strong>{attempt.userName}</strong>
                          <small>{attempt.courseTitle} · {attempt.score !== null ? `${attempt.score}%` : '—'}</small>
                        </div>
                        <span className={`status-badge ${attempt.passed ? 'active' : 'inactive'}`}>{attempt.passed ? t.passed : t.failed}</span>
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
                {completedCourses.length === 0 ? <p className="muted">{t.noData}</p> : (
                  <PaginatedList items={completedCourses}>{(pageCompletedCourses) => <div className="admin-list-stack">
                    {pageCompletedCourses.map((requirement) => (
                      <div key={requirement.id} className="admin-course-row">
                        <div className="course-icon gray-2"><FileText size={18} /></div>
                        <div className="course-row-info">
                          <strong>{requirement.course?.title ?? 'Curso sin nombre'}</strong>
                          <small>{requirement.completed_at ? new Date(requirement.completed_at).toLocaleDateString() : '—'}</small>
                        </div>
                        <span className="status-badge active">{t.completed}</span>
                      </div>
                    ))}
                  </div>}</PaginatedList>
                )}
                {workerAttempts.length > 0 && (
                  <div style={{ marginTop: 22 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                      <strong>{t.examResults}</strong><span className="meta-tag">{workerAttempts.length} {t.totalExams.toLowerCase()}</span>
                    </div>
                    <PaginatedList items={workerAttempts}>{(pageWorkerAttempts) => <div className="admin-list-stack">
                      {pageWorkerAttempts.map((attempt, index) => (
                        <div key={index} className="admin-course-row">
                          <div className="course-icon gray-2">{attempt.passed ? <FileText size={18} /> : <AlertCircle size={18} />}</div>
                          <div className="course-row-info"><strong>{attempt.courseTitle}</strong><small>{attempt.score !== null ? `${attempt.score}%` : '—'}</small></div>
                          <span className={`status-badge ${attempt.passed ? 'active' : 'inactive'}`}>{attempt.passed ? t.passed : t.failed}</span>
                        </div>
                      ))}
                    </div>}</PaginatedList>
                  </div>
                )}
                {employeeFailedAttempts.length > 0 && (
                  <div style={{ marginTop: 22 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                      <strong>{t.failed}</strong><span className="meta-tag">{employeeFailedAttempts.reduce((total, item) => total + item.failedAttempts.length, 0)}</span>
                    </div>
                    <PaginatedList items={employeeFailedAttempts}>{(pageFailed) => <div className="admin-list-stack">
                      {pageFailed.map((item) => (
                        <div key={item.id} className="admin-course-row">
                          <div className="course-icon gray-2"><AlertCircle size={18} /></div>
                          <div className="course-row-info"><strong>{item.courseTitle}</strong><small>{item.failedAttempts.length} {t.failed.toLowerCase()}</small></div>
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

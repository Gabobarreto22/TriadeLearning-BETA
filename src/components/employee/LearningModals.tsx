import { createPortal } from 'react-dom';
import { AlertTriangle, Award, Check, Clock3, Download, FileText, LockKeyhole, Play, ShieldCheck, X } from 'lucide-react';
import { PaginatedList } from '@/components/PaginatedList';
import type { ExamType } from '@/components/employee/employeeTypes';
import { copy } from '@/lib/copy';
import { getIcon } from '@/lib/icons';
import type { CourseWithRelations } from '@/lib/supabase';

export function ExitWarningModal({ t, onConfirm, onCancel }: { t: typeof copy.ES; onConfirm: () => void; onCancel: () => void }) {
  return createPortal(<div className="modal-backdrop" onClick={onCancel}><div className="exit-warning-modal" onClick={(e) => e.stopPropagation()}>
    <div className="exit-warning-icon"><AlertTriangle size={40} /></div>
    <h2>{t.exitWarningTitle}</h2><p>{t.exitWarningDesc}</p>
    <div className="exit-warning-actions"><button className="outline-button" onClick={onCancel}>{t.exitWarningStay}</button><button className="primary-button exit-confirm" onClick={onConfirm}>{t.exitWarningLeave}</button></div>
  </div></div>, document.body);
}
export function CertificatePreview({ t, cert, profileName, onClose }: { t: typeof copy.ES; cert: { title: string; id: string; date: string }; profileName: string; onClose: () => void }) {
  return createPortal(<div className="modal-backdrop cert-backdrop" onClick={onClose}><div className="cert-preview-modal" onClick={(e) => e.stopPropagation()}>
    <button className="modal-close cert-modal-close" onClick={onClose}><X size={19} /></button>
    <div className="cert-preview-paper"><div className="cert-border"><div className="cert-border-inner">
      <div className="cert-header"><img src="/LOGO_POSITIVO.png" alt="TRIADE" className="cert-logo" /><span className="cert-company">TRIADE LEARNING</span></div>
      <div className="cert-seal"><Award size={40} /></div>
      <small className="cert-label">{t.certificate}</small><p className="cert-presented">{t.awardedTo}</p><h2 className="cert-name">{profileName}</h2>
      <p className="cert-course-label">{t.courseLabel}</p><h3 className="cert-course-title">{cert.title}</h3>
      <div className="cert-footer"><div className="cert-footer-item"><span className="cert-footer-label">{t.certId}</span><strong>{cert.id}</strong></div><div className="cert-footer-divider" /><div className="cert-footer-item"><span className="cert-footer-label">{t.issueDate}</span><strong>{cert.date}</strong></div></div>
    </div></div></div>
    <div className="cert-preview-actions"><button className="primary-button"><Download size={17} />{t.downloadCert}</button><button className="outline-button"><FileText size={17} />{t.printCert}</button></div>
  </div></div>, document.body);
}

export function CourseModal({ course, t, courseState, onClose, onOpenPlayer, onOpenExam }: { course: CourseWithRelations; t: typeof copy.ES; courseState: { completedModules: boolean[]; directFailed: boolean; directPassed: boolean; courseExamPassed: boolean }; onClose: () => void; onOpenPlayer: (c: CourseWithRelations) => void; onOpenExam: (c: CourseWithRelations, type: ExamType) => void }) {
  const Icon = getIcon(course.icon_name);
  const completedCount = courseState.completedModules.filter(Boolean).length;
  const allModulesComplete = courseState.completedModules.length > 0 && courseState.completedModules.every(Boolean);
  const courseExamAvailable = courseState.directPassed || (courseState.directFailed && allModulesComplete) || (allModulesComplete && !courseState.directFailed);
  const progress = course.modules.length > 0 ? Math.round((completedCount / course.modules.length) * 100) : 0;

  return createPortal(<div className="modal-backdrop" onClick={onClose}><div className="course-modal" onClick={(e) => e.stopPropagation()}>
    <button className="modal-close" onClick={onClose}><X size={19} /></button>
    <div className={`modal-hero ${course.accent}`} style={{ backgroundImage: `url(${course.image_url})` }}><div className="modal-hero-overlay" /><div className="cover-icon"><Icon size={22} /></div><span className="modal-hero-cat">{course.category}</span></div>
    <div className="modal-body">
      <div className="course-meta"><span><Clock3 size={14} />{course.duration}</span></div>
      <h2>{course.title}</h2><p>{course.description}</p>
      <div className="module-progress-bar"><div className="progress-label"><span>{completedCount} de {course.modules.length} {t.modules}</span><strong>{progress}%</strong></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>
      <PaginatedList items={course.modules}>{(pageModules, firstModuleIndex) => <div className="module-list">{pageModules.map((m, i) => <div key={m.id}><span className={courseState.completedModules[firstModuleIndex + i] ? 'module-check' : 'module-check locked'}>{courseState.completedModules[firstModuleIndex + i] ? <Check size={14} /> : <LockKeyhole size={13} />}</span><span><strong>{m.title}</strong><small>{m.duration} · {m.type === 'video' ? t.videoModule : m.type === 'image' ? t.imageModule : t.textModule}</small></span></div>)}</div>}</PaginatedList>
      <div className="exam-section">
        <div className="exam-type-card"><div className="exam-type-header"><div className="exam-type-icon direct"><ShieldCheck size={18} /></div><div><strong>{t.directExam}</strong><small>{t.directExamDesc}</small></div></div>
          {courseState.directPassed ? <span className="exam-badge passed"><Check size={14} />Aprobada</span> : courseState.directFailed ? <span className="exam-badge locked"><LockKeyhole size={14} />{t.examLocked}</span> : <button className="primary-button exam-action" onClick={() => onOpenExam(course, 'direct')}><Play size={15} />{t.takeDirectExam}</button>}
        </div>
        <div className="exam-type-card"><div className="exam-type-header"><div className="exam-type-icon course"><Award size={18} /></div><div><strong>{t.courseExam}</strong><small>{t.courseExamDesc}</small></div></div>
          {courseState.courseExamPassed ? <span className="exam-badge passed"><Check size={14} />Aprobada</span> : courseExamAvailable ? <button className="primary-button exam-action" onClick={() => onOpenExam(course, 'course')}><Play size={15} />{t.takeCourseExam}</button> : <span className="exam-badge locked"><LockKeyhole size={14} />{t.modulesRequired}</span>}
        </div>
      </div>
      <button className="primary-button modal-action" onClick={() => onOpenPlayer(course)}><Play size={17} />{progress > 0 ? t.resume : t.start}</button>
    </div>
  </div></div>, document.body);
}


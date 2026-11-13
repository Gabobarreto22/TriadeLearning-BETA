import { useState } from 'react';
import { Award, FileText, ShieldCheck, Users, BookOpen, X } from 'lucide-react';
import type { AdminStrings, AdminData } from './types';
import { PaginatedList } from '../PaginatedList';
import { FilterSelect } from './FilterSelect';
import { CertificatePreview } from '@/components/employee/LearningModals';
import { usePreferences } from '@/lib/preferences';
import { ReportDropdown } from './ReportDropdown';
import { SelectionModal } from './SelectionModal';
import { exportCertificationsReport } from '@/lib/pdfReport';

type CertScope = 'general' | 'byCourse' | 'byWorker';

type CertificateItem = AdminData['certificates'][number];

export function CertificationsModule({ t, data }: { t: AdminStrings; data: AdminData }) {
  const { certificates, roleCertifications } = data;
  const { t: copyT } = usePreferences();
  const [previewCert, setPreviewCert] = useState<CertificateItem | null>(null);
  const [certWorkerId, setCertWorkerId] = useState('');
  const [certCourseId, setCertCourseId] = useState('');
  const [certPicker, setCertPicker] = useState<'worker' | 'course' | null>(null);
  const [roleWorkerId, setRoleWorkerId] = useState('');
  const [rolePickerOpen, setRolePickerOpen] = useState(false);
  const [roleStatus, setRoleStatus] = useState('');
  const [reportPicker, setReportPicker] = useState<Exclude<CertScope, 'general'> | null>(null);

  const certWorkerOptions = Array.from(new Map(
    certificates.flatMap((c) => c.user_course_requirement?.user ? [[c.user_course_requirement.user.id, c.user_course_requirement.user.full_name] as const] : [])
  )).map(([value, label]) => ({ value, label }));

  const certCourseOptions = Array.from(new Map(
    certificates.flatMap((c) => c.user_course_requirement?.course ? [[c.user_course_requirement.course.id, c.user_course_requirement.course.title] as const] : [])
  )).map(([value, label]) => ({ value, label }));

  const roleWorkerOptions = Array.from(new Map(
    roleCertifications.flatMap((rc) => rc.user ? [[rc.user.id, rc.user.full_name] as const] : [])
  )).map(([value, label]) => ({ value, label }));

  const statusOptions = [
    { value: 'valid', label: 'Vigente' },
    { value: 'expired', label: 'Expirado' },
  ];

  const filteredCertificates = certificates.filter((c) =>
    (!certWorkerId || c.user_course_requirement?.user?.id === certWorkerId) &&
    (!certCourseId || c.user_course_requirement?.course?.id === certCourseId)
  );

  const filteredRoleCertifications = roleCertifications.filter((rc) =>
    (!roleWorkerId || rc.user_id === roleWorkerId) &&
    (!roleStatus || (roleStatus === 'valid') === rc.is_valid)
  );

  const certHasFilters = Boolean(certWorkerId || certCourseId);
  const roleHasFilters = Boolean(roleWorkerId || roleStatus);

  const certReportOpts = [
    { value: 'general', label: t.reportGeneral },
    { value: 'byCourse', label: t.reportByCourse },
    { value: 'byWorker', label: t.reportByWorker },
  ];

  const exportCertReport = (scope: CertScope, chosenId = '') => {
    const mapCert = (c: typeof certificates[number]) => ({
      certificate_number: c.certificate_number,
      userName: c.user_course_requirement?.user?.full_name ?? '—',
      courseTitle: c.user_course_requirement?.course?.title ?? '—',
      issue_date: c.issue_date,
      expiry_date: c.expiry_date,
    });
    const mapRoleCert = (rc: typeof roleCertifications[number]) => ({
      userName: rc.user?.full_name ?? '—',
      roleName: rc.job_role?.name ?? '—',
      certified_at: rc.certified_at,
      is_valid: rc.is_valid,
    });
    let filterLabel: string | undefined;
    let certs = certificates;
    let roleCerts = roleCertifications;
    if (scope === 'byCourse') {
      const course = certCourseOptions.find((c) => c.value === chosenId);
      if (!course) return;
      certs = certificates.filter((c) => c.user_course_requirement?.course?.id === course.value);
      filterLabel = course.label;
    } else if (scope === 'byWorker') {
      const worker = certWorkerOptions.find((w) => w.value === chosenId);
      if (!worker) return;
      certs = certificates.filter((c) => c.user_course_requirement?.user?.id === worker.value);
      roleCerts = roleCertifications.filter((rc) => rc.user_id === worker.value);
      filterLabel = worker.label;
    }
    exportCertificationsReport({
      certificates: certs.map(mapCert),
      roleCerts: roleCerts.map(mapRoleCert),
      scope,
      filterLabel,
    });
  };

  const handleCertReport = (scope: string) => {
    if (scope === 'general') exportCertReport('general');
    else setReportPicker(scope as Exclude<CertScope, 'general'>);
  };

  return (
    <div className="page animate-in">
      <div className="page-heading"><div><p className="eyebrow">CERTIFICACIONES</p><h1>{t.certifications}</h1><p className="muted">{t.certificationsDesc}</p></div>
        <ReportDropdown label={t.reportCertifications} options={certReportOpts} onSelect={handleCertReport} />
      </div>
      <div className="admin-two-up">
        <div className="section-card">
          <div className="section-title">
            <div><h2>{t.totalCertificates}</h2><p className="muted">{filteredCertificates.length} de {certificates.length}</p></div>
            {certHasFilters && <button className="outline-button" style={{ minHeight: 36, padding: '8px 12px', fontSize: 11 }} onClick={() => { setCertWorkerId(''); setCertCourseId(''); }}><X size={16} />Limpiar filtros</button>}
          </div>
          <div className="editor-grid" style={{ marginBottom: 16 }}>
            <div className="field-group">
              <label>Trabajador</label>
              <button type="button" className="selection-trigger" onClick={() => setCertPicker('worker')}>
                <span>{certWorkerOptions.find((o) => o.value === certWorkerId)?.label ?? 'Todos los trabajadores'}</span>
                <Users size={16} />
              </button>
            </div>
            <div className="field-group">
              <label>Curso</label>
              <button type="button" className="selection-trigger" onClick={() => setCertPicker('course')}>
                <span>{certCourseOptions.find((o) => o.value === certCourseId)?.label ?? 'Todos los cursos'}</span>
                <BookOpen size={16} />
              </button>
            </div>
          </div>
          {filteredCertificates.length === 0 ? <div className="empty-state"><Award size={30} /><h3>{t.noCertificates}</h3></div> :
           <PaginatedList items={filteredCertificates}>{(pageCertificates) => <div className="admin-list-stack">{pageCertificates.map((c) => (
             <div key={c.id} className="admin-course-row">
               <div className="course-icon gray-3"><Award size={20} /></div>
               <div><strong>{c.certificate_number}</strong><small>{c.user_course_requirement?.user?.full_name ?? '—'} · {c.user_course_requirement?.course?.title ?? '—'}</small></div>
               <button className="outline-button" style={{ minHeight: 36, padding: '8px 12px', fontSize: 11 }} onClick={() => setPreviewCert(c)}><FileText size={16} />Ver certificado</button>
               <span className="status-badge active">{c.issue_date}</span>
             </div>
           ))}</div>}</PaginatedList>}
        </div>
        <div className="section-card">
          <div className="section-title">
            <div><h2>{t.roleManagement}</h2><p className="muted">{filteredRoleCertifications.length} de {roleCertifications.length}</p></div>
            {roleHasFilters && <button className="outline-button" style={{ minHeight: 36, padding: '8px 12px', fontSize: 11 }} onClick={() => { setRoleWorkerId(''); setRoleStatus(''); }}><X size={16} />Limpiar filtros</button>}
          </div>
          <div className="editor-grid" style={{ marginBottom: 16 }}>
            <div className="field-group">
              <label>Trabajador</label>
              <button type="button" className="selection-trigger" onClick={() => setRolePickerOpen(true)}>
                <span>{roleWorkerOptions.find((o) => o.value === roleWorkerId)?.label ?? 'Todos los trabajadores'}</span>
                <Users size={16} />
              </button>
            </div>
            <FilterSelect label="Estado" value={roleStatus} onChange={setRoleStatus} placeholder="Todos los estados" options={statusOptions} />
          </div>
          {filteredRoleCertifications.length === 0 ? <div className="empty-state"><ShieldCheck size={30} /><h3>{t.noData}</h3></div> :
           <PaginatedList items={filteredRoleCertifications}>{(pageRoleCertifications) => <div className="admin-list-stack">{pageRoleCertifications.map((rc) => (
             <div key={rc.id} className="admin-course-row">
               <div className="course-icon gray-2"><ShieldCheck size={20} /></div>
               <div><strong>{rc.user?.full_name ?? '—'}</strong><small>{rc.job_role?.name ?? '—'} · {rc.certified_at?.slice(0, 10)}</small></div>
               <span className={`status-badge ${rc.is_valid ? 'active' : 'inactive'}`}>{rc.is_valid ? t.valid : t.expired}</span>
             </div>
           ))}</div>}</PaginatedList>}
        </div>
      </div>
      {certPicker && (
        <SelectionModal
          eyebrow={t.totalCertificates}
          title={certPicker === 'course' ? 'Seleccionar curso' : 'Seleccionar trabajador'}
          options={certPicker === 'course' ? certCourseOptions : certWorkerOptions}
          selectedValue={certPicker === 'course' ? certCourseId : certWorkerId}
          searchPlaceholder={certPicker === 'course' ? 'Buscar curso' : 'Buscar trabajador'}
          onSelect={(value) => { if (certPicker === 'course') setCertCourseId(value); else setCertWorkerId(value); setCertPicker(null); }}
          onClose={() => setCertPicker(null)}
        />
      )}
      {rolePickerOpen && (
        <SelectionModal
          eyebrow={t.roleManagement}
          title="Seleccionar trabajador"
          options={roleWorkerOptions}
          selectedValue={roleWorkerId}
          searchPlaceholder="Buscar trabajador"
          onSelect={(value) => { setRoleWorkerId(value); setRolePickerOpen(false); }}
          onClose={() => setRolePickerOpen(false)}
        />
      )}
      {reportPicker && (
        <SelectionModal
          eyebrow={t.reportCertifications}
          title={reportPicker === 'byCourse' ? 'Seleccionar curso' : 'Seleccionar trabajador'}
          options={reportPicker === 'byCourse' ? certCourseOptions : certWorkerOptions}
          selectedValue=""
          searchPlaceholder={reportPicker === 'byCourse' ? 'Buscar curso' : 'Buscar trabajador'}
          onSelect={(value) => { setReportPicker(null); exportCertReport(reportPicker, value); }}
          onClose={() => setReportPicker(null)}
        />
      )}
      {previewCert && <CertificatePreview t={copyT} cert={{ title: previewCert.user_course_requirement?.course?.title ?? '—', id: previewCert.certificate_number, date: previewCert.issue_date }} profileName={previewCert.user_course_requirement?.user?.full_name ?? '—'} onClose={() => setPreviewCert(null)} />}
    </div>
  );
}

// ===================== AUTO-ASSIGN =====================

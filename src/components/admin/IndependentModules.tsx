import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, Award, BarChart3, Bell, BookOpen, Check, Clock3, Download, FileText, History, Plus, Settings, ShieldCheck, Star, Trash2, Users, X, Zap, User } from 'lucide-react';
import { supabase, type Profile, type JobRole, type CourseWithRelations, type Certificate, type RoleCertification, type Notification, type CourseFeedback, type Badge, type UserBadge, type SystemSetting, type AuditLog, type UserCourseRequirement } from '@/lib/supabase';
import { fetchUserCourseRequirements, assignCourseToUser, fetchAllCertificates, fetchRoleCertifications, fetchAllNotifications, createNotification, deleteNotification, fetchAllFeedback, fetchBadges, createBadge, deleteBadge, fetchUserBadges, fetchSystemSettings, updateSystemSetting, createSystemSetting, fetchAuditLogs } from '@/lib/data';
import { getIcon } from '@/lib/icons';
import { useToast } from '@/lib/toast';
import type { AdminStrings, AdminData } from './types';

// ===================== DASHBOARD =====================
export function DashboardModule({ t, data, onNavigate }: {
  t: AdminStrings;
  data: AdminData;
  onNavigate: (view: string) => void;
}) {
  const { courses, team, jobRoles, certificates, badges, notifications, feedback, examAttempts } = data;
  const activeUsers = team.filter((u) => u.is_active).length;
  const totalProgress = data.moduleProgress.length > 0
    ? Math.round((data.moduleProgress.filter((p) => p.completed).length / data.moduleProgress.length) * 100)
    : 0;
  const passRate = examAttempts.length > 0
    ? Math.round((examAttempts.filter((a) => a.passed).length / examAttempts.length) * 100)
    : 0;

  const stats = [
    { icon: BookOpen, value: String(courses.length), label: t.totalCourses, tone: 'g1' },
    { icon: Users, value: String(team.length), label: t.totalUsers, tone: 'g2' },
    { icon: ShieldCheck, value: String(jobRoles.length), label: t.totalRoles, tone: 'g4' },
    { icon: Award, value: String(certificates.length), label: t.totalCertificates, tone: 'g3' },
    { icon: BarChart3, value: `${totalProgress}%`, label: t.completion, tone: 'g1' },
    { icon: Check, value: `${passRate}%`, label: t.passRate, tone: 'g2' },
    { icon: Star, value: String(badges.length), label: t.totalBadges, tone: 'g3' },
    { icon: Bell, value: String(notifications.length), label: t.totalNotifications, tone: 'g4' },
  ];

  const quickLinks = [
    { label: t.courses, icon: BookOpen, view: 'courses' },
    { label: t.personnel, icon: Users, view: 'personnel' },
    { label: t.certifications, icon: Award, view: 'certifications' },
    { label: t.reports, icon: BarChart3, view: 'reports' },
    { label: t.gamification, icon: Star, view: 'gamification' },
    { label: t.settings, icon: Settings, view: 'settings' },
  ];

  return (
    <div className="page animate-in">
      <div className="page-heading"><div><p className="eyebrow">CENTRO DE CONTROL</p><h1>{t.dashboard}</h1><p className="muted">{t.adminIntro}</p></div></div>
      <section className="stats-grid">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return <div key={i} className="stat-card"><div className={`stat-icon ${s.tone}`}><Icon size={18} /></div><div><strong>{s.value}</strong><span>{s.label}</span></div><span className="stat-trend">↗</span></div>;
        })}
      </section>
      <div className="admin-dashboard-stack">
        <div className="section-card admin-card-primary">
          <div className="section-title"><div><h2>{t.recentActivity}</h2><p className="muted">{t.statsOverview}</p></div></div>
          <div className="quick-links-grid">
            {quickLinks.map((ql) => {
              const Icon = ql.icon;
              return <button key={ql.view} className="quick-link-card" onClick={() => onNavigate(ql.view)}><Icon size={22} /><strong>{ql.label}</strong><span>{t.viewAll}</span></button>;
            })}
          </div>
        </div>
        <div className="admin-two-up">
          <div className="section-card">
            <div className="section-title"><div><h2>{t.courses}</h2><p className="muted">{courses.length} {t.totalCourses.toLowerCase()}</p></div><button className="text-button" onClick={() => onNavigate('courses')}>{t.viewAll}</button></div>
            {courses.length === 0 ? <p className="muted" style={{ padding: '20px 0' }}>{t.noCourses}</p> :
             <div className="admin-list-stack">{courses.slice(0, 4).map((c) => {
               const Icon = getIcon(c.icon_name);
               return <div key={c.id} className="admin-course-row"><div className={`course-icon ${c.accent}`}><Icon size={20} /></div><div><strong>{c.title}</strong><small>{c.modules.length} {t.modulesLabel} · {c.assignments.length} {t.assignedRole}s</small></div></div>;
             })}</div>}
          </div>
          <div className="section-card">
            <div className="section-title"><div><h2>{t.feedback}</h2><p className="muted">{feedback.length} {t.totalFeedback.toLowerCase()}</p></div><button className="text-button" onClick={() => onNavigate('feedback')}>{t.viewAll}</button></div>
            {feedback.length === 0 ? <p className="muted" style={{ padding: '20px 0' }}>{t.noFeedback}</p> :
             feedback.slice(0, 5).map((f) => (
               <div key={f.id} className="admin-team-row">
                 <div className="avatar avatar-small">{f.user_course_requirement?.user?.full_name?.slice(0, 2).toUpperCase() ?? '??'}</div>
                 <div><strong>{f.user_course_requirement?.user?.full_name ?? '—'}</strong><small>{f.user_course_requirement?.course?.title ?? '—'}</small></div>
                 <span className="rating-badge">{'★'.repeat(f.rating)}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== CERTIFICATIONS =====================
export function CertificationsModule({ t, data }: { t: AdminStrings; data: AdminData }) {
  const { certificates, roleCertifications } = data;
  return (
    <div className="page animate-in">
      <div className="page-heading"><div><p className="eyebrow">CERTIFICACIONES</p><h1>{t.certifications}</h1><p className="muted">{t.certificationsDesc}</p></div></div>
      <div className="admin-two-up">
        <div className="section-card">
          <div className="section-title"><div><h2>{t.totalCertificates}</h2><p className="muted">{certificates.length}</p></div></div>
          {certificates.length === 0 ? <div className="empty-state"><Award size={30} /><h3>{t.noCertificates}</h3></div> :
           <div className="admin-list-stack">{certificates.map((c) => (
             <div key={c.id} className="admin-course-row">
               <div className="course-icon gray-3"><Award size={20} /></div>
               <div><strong>{c.certificate_number}</strong><small>{c.user_course_requirement?.user?.full_name ?? '—'} · {c.user_course_requirement?.course?.title ?? '—'}</small></div>
               <span className="status-badge active">{c.issue_date}</span>
             </div>
           ))}</div>}
        </div>
        <div className="section-card">
          <div className="section-title"><div><h2>{t.roleManagement}</h2><p className="muted">{roleCertifications.length}</p></div></div>
          {roleCertifications.length === 0 ? <div className="empty-state"><ShieldCheck size={30} /><h3>{t.noData}</h3></div> :
           <div className="admin-list-stack">{roleCertifications.map((rc) => (
             <div key={rc.id} className="admin-course-row">
               <div className="course-icon gray-2"><ShieldCheck size={20} /></div>
               <div><strong>{rc.user?.full_name ?? '—'}</strong><small>{rc.job_role?.name ?? '—'} · {rc.certified_at?.slice(0, 10)}</small></div>
               <span className={`status-badge ${rc.is_valid ? 'active' : 'inactive'}`}>{rc.is_valid ? t.valid : t.expired}</span>
             </div>
           ))}</div>}
        </div>
      </div>
    </div>
  );
}

// ===================== AUTO-ASSIGN =====================
export function AutoAssignModule({ t, data, onRefresh }: { t: AdminStrings; data: AdminData; onRefresh: () => void }) {
  const { team, jobRoles, courses, departments } = data;
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const coursesForRole = courses.filter((c) => c.assignments.some((a) => a.job_role_id === selectedRoleId));
  const usersInRole = team.filter((u) => u.job_role_id === selectedRoleId);

  const handleAutoAssign = async () => {
    if (!selectedRoleId) return;
    setAssigning(true);
    let count = 0;
    for (const user of usersInRole) {
      for (const course of coursesForRole) {
        const { error } = await assignCourseToUser(user.id, course.id, selectedRoleId, null, 'medium', true, user.id);
        if (!error) count++;
      }
    }
    setAssigning(false);
    setResult(`${count} ${t.assignedUsers.toLowerCase()}`);
    toast(`${count} asignaciones realizadas`, 'success');
  };

  return (
    <div className="page animate-in">
      <div className="page-heading"><div><p className="eyebrow">ASIGNACIÓN AUTOMÁTICA</p><h1>{t.autoAssign}</h1><p className="muted">{t.autoAssignDesc}</p></div></div>
      <div className="section-card">
        <div className="editor-grid" style={{ marginBottom: 16 }}>
          <div className="field-group">
            <label>{t.jobRole}</label>
            <select className="auth-input" value={selectedRoleId} onChange={(e) => { setSelectedRoleId(e.target.value); setResult(null); }}>
              <option value="">{t.selectRole}</option>
              {jobRoles.map((r) => {
                const dept = departments.find((d) => d.id === r.department_id)?.name;
                return <option key={r.id} value={r.id}>{dept ? `${r.name} · ${dept}` : r.name}</option>;
              })}
            </select>
          </div>
        </div>
        {selectedRoleId && (
          <>
            <div className="admin-two-up" style={{ marginBottom: 16 }}>
              <div className="auto-assign-stat"><Users size={24} /><div><strong>{usersInRole.length}</strong><span>{t.assignedUsers}</span></div></div>
              <div className="auto-assign-stat"><BookOpen size={24} /><div><strong>{coursesForRole.length}</strong><span>{t.assignedCourses}</span></div></div>
            </div>
            <button className="primary-button" onClick={handleAutoAssign} disabled={assigning || usersInRole.length === 0 || coursesForRole.length === 0}>
              <Zap size={18} />{assigning ? t.loading : t.assignNow}
            </button>
            {result && <div className="module-complete-banner" style={{ marginTop: 12 }}><Check size={16} />{result}</div>}
          </>
        )}
      </div>
    </div>
  );
}

// ===================== FEEDBACK =====================
export function FeedbackModule({ t, data }: { t: AdminStrings; data: AdminData }) {
  const { feedback } = data;
  const avgRating = feedback.length > 0 ? (feedback.reduce((acc, f) => acc + f.rating, 0) / feedback.length).toFixed(1) : '0';
  return (
    <div className="page animate-in">
      <div className="page-heading"><div><p className="eyebrow">FEEDBACK</p><h1>{t.feedback}</h1><p className="muted">{t.feedbackDesc}</p></div>
        <div className="stat-card" style={{ minWidth: 120 }}><div className="stat-icon g3"><Star size={18} /></div><div><strong>{avgRating}</strong><span>{t.rating}</span></div></div>
      </div>
      <div className="section-card">
        {feedback.length === 0 ? <div className="empty-state"><Star size={30} /><h3>{t.noFeedback}</h3></div> :
         <div className="admin-list-stack">{feedback.map((f) => (
           <div key={f.id} className="feedback-card">
             <div className="feedback-header">
               <div className="avatar avatar-small">{f.user_course_requirement?.user?.full_name?.slice(0, 2).toUpperCase() ?? '??'}</div>
               <div><strong>{f.user_course_requirement?.user?.full_name ?? '—'}</strong><small>{f.user_course_requirement?.course?.title ?? '—'}</small></div>
               <span className="rating-badge">{'★'.repeat(f.rating)}</span>
             </div>
             <div className="feedback-meta">
               {f.difficulty_level && <span className="meta-tag">{t.difficulty}: {f.difficulty_level}</span>}
               {f.would_recommend !== null && <span className="meta-tag">{f.would_recommend ? `✓ ${t.wouldRecommend}` : `✗ ${t.wouldRecommend}`}</span>}
               {f.time_commitment_adequate !== null && <span className="meta-tag">{f.time_commitment_adequate ? `✓ ${t.timeAdequate}` : `✗ ${t.timeAdequate}`}</span>}
             </div>
             {f.feedback_text && <p className="feedback-text">{f.feedback_text}</p>}
           </div>
         ))}</div>}
      </div>
    </div>
  );
}

// ===================== GAMIFICATION =====================
export function GamificationModule({ t, data, onRefresh }: { t: AdminStrings; data: AdminData; onRefresh: () => void }) {
  const { badges, userBadges } = data;
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('/badges/achievement.svg');
  const [points, setPoints] = useState('0');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [iconPage, setIconPage] = useState(0);
  const { toast } = useToast();

  const badgeAssetMap: Record<string, string> = {
    'Primer Curso': '/badges/first_course.svg',
    'Aprendiz Constante': '/badges/constant_learner.svg',
    'Experto': '/badges/expert.svg',
    'Especialista en BES': '/badges/specialist_bes.svg',
    'Especialista en PCP': '/badges/specialist_pcp.svg',
    'Especialista en Gas Lift': '/badges/gas_lift.svg',
    'Guardián de Seguridad': '/badges/guardian_safety.svg',
    'Maestro del Levantamiento': '/badges/mastery_levantamiento.svg',
    'Diagnosticador Experto': '/badges/diagnostic_expert.svg',
    'Inspector Certificado': '/badges/inspector_certified.svg',
    'Optimizador de Producción': '/badges/production_optimizer.svg',
    'Logro': '/badges/achievement.svg',
    'Certificación': '/badges/certification.svg',
    'Seguridad': '/badges/safety.svg',
    'Analítica': '/badges/analytics.svg',
    'Liderazgo': '/badges/leadership.svg',
    'Enfoque': '/badges/focus.svg',
    'Trabajo en equipo': '/badges/teamwork.svg',
    'Productividad': '/badges/productivity.svg',
    'Rendimiento': '/badges/achievement.svg',
  };

  const badgeIconOptions = [
    { label: 'Logro', value: '/badges/achievement.svg' },
    { label: 'Constancia', value: '/badges/constant_learner.svg' },
    { label: 'Aprendizaje', value: '/badges/first_course.svg' },
    { label: 'Experiencia', value: '/badges/expert.svg' },
    { label: 'Habilidad', value: '/badges/specialist_bes.svg' },
    { label: 'Meta', value: '/badges/specialist_pcp.svg' },
    { label: 'Eficiencia', value: '/badges/gas_lift.svg' },
    { label: 'Seguridad', value: '/badges/guardian_safety.svg' },
    { label: 'Desempeño', value: '/badges/mastery_levantamiento.svg' },
    { label: 'Diagnóstico', value: '/badges/diagnostic_expert.svg' },
    { label: 'Inspección', value: '/badges/inspector_certified.svg' },
    { label: 'Optimización', value: '/badges/production_optimizer.svg' },
    { label: 'Certificación', value: '/badges/certification.svg' },
    { label: 'Analítica', value: '/badges/analytics.svg' },
    { label: 'Liderazgo', value: '/badges/leadership.svg' },
    { label: 'Enfoque', value: '/badges/focus.svg' },
    { label: 'Equipo', value: '/badges/teamwork.svg' },
    { label: 'Productividad', value: '/badges/productivity.svg' },
    { label: 'Rendimiento', value: '/badges/badge_01.svg' },
    { label: 'Reconocimiento', value: '/badges/badge_02.svg' },
    { label: 'Progreso', value: '/badges/badge_03.svg' },
    { label: 'Mejora', value: '/badges/badge_04.svg' },
    { label: 'Desafío', value: '/badges/badge_05.svg' },
    { label: 'Avance', value: '/badges/badge_06.svg' },
    { label: 'Estrella', value: '/badges/badge_07.svg' },
    { label: 'Trayectoria', value: '/badges/badge_08.svg' },
    { label: 'Crecimiento', value: '/badges/badge_09.svg' },
    { label: 'Éxito', value: '/badges/badge_10.svg' },
    { label: 'Foco', value: '/badges/badge_11.svg' },
    { label: 'Ritmo', value: '/badges/badge_12.svg' },
    { label: 'Evolución', value: '/badges/badge_13.svg' },
    { label: 'Nivel', value: '/badges/badge_14.svg' },
    { label: 'Puntualidad', value: '/badges/badge_15.svg' },
    { label: 'Objetivo', value: '/badges/badge_16.svg' },
    { label: 'Visionario', value: '/badges/badge_17.svg' },
    { label: 'Confianza', value: '/badges/badge_18.svg' },
    { label: 'Potencial', value: '/badges/badge_19.svg' },
    { label: 'Excelencia', value: '/badges/badge_20.svg' },
  ];

  const iconsPerPage = 12;
  const totalIconPages = Math.ceil(badgeIconOptions.length / iconsPerPage);
  const visibleBadgeIconOptions = badgeIconOptions.slice(iconPage * iconsPerPage, (iconPage + 1) * iconsPerPage);

  const renderBadgeIcon = (iconName?: string | null, label?: string) => {
    const rawValue = (iconName ?? label ?? '').trim();
    const assetMatch = Object.entries(badgeAssetMap).find(([name]) => name.toLowerCase() === rawValue.toLowerCase());
    const asset = assetMatch?.[1] ?? (rawValue.startsWith('/') ? rawValue : null);

    if (asset) {
      return <img src={asset} alt={label || 'Badge icon'} style={{ width: 24, height: 24, objectFit: 'contain' }} />;
    }

    if (!rawValue) return <Award size={24} />;

    if (/^https?:\/\//i.test(rawValue)) {
      return <img src={rawValue} alt={label || 'Badge icon'} style={{ width: 24, height: 24, objectFit: 'contain' }} />;
    }

    const Icon = getIcon(rawValue);
    return <Icon size={24} />;
  };

  const resetForm = () => { setName(''); setDescription(''); setIconUrl('/badges/achievement.svg'); setPoints('0'); setError(null); setIconPage(0); setShowForm(false); };

  const handleCreate = async () => {
    if (!name || !description || !iconUrl) { setError(t.badgeName + ' / ' + t.badgeDesc + ' / ' + t.iconUrl); return; }
    setSaving(true);
    const { error: err } = await createBadge({ name, description, icon_url: iconUrl, points: parseInt(points) || 0 });
    if (err) { setError(err); setSaving(false); return; }
    setSaving(false); resetForm(); toast('Insignia creada', 'success'); onRefresh();
  };

  return (
    <div className="page animate-in">
      <div className="page-heading"><div><p className="eyebrow">GAMIFICACIÓN</p><h1>{t.gamification}</h1><p className="muted">{t.gamificationDesc}</p></div>
        <button className="primary-button" onClick={() => setShowForm(true)}><Plus size={18} />{t.newBadge}</button>
      </div>
      {showForm && createPortal(<div className="modal-backdrop" onClick={resetForm}><div className="course-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={resetForm}><X size={19} /></button>
        <div className="modal-body">
          <h2>{t.newBadge}</h2>
          {error && <div className="auth-error" style={{ marginBottom: 12 }}><AlertCircle size={16} />{error}</div>}
          <div className="modal-form-grid" style={{ marginTop: 10 }}>
            <div className="field-group"><label>{t.badgeName}</label><input className="auth-input" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="field-group"><label>{t.points}</label><input className="auth-input" type="number" value={points} onChange={(e) => setPoints(e.target.value)} /></div>
            <div className="field-group field-group-full"><label>{t.badgeDesc}</label><input className="auth-input" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <div className="field-group field-group-full"><label>{t.iconUrl}</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10, marginTop: 8 }}>
                {visibleBadgeIconOptions.map((icon) => {
                  const isSelected = iconUrl === icon.value;
                  return (
                    <button
                      key={icon.value}
                      type="button"
                      onClick={() => setIconUrl(icon.value)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        padding: '10px 8px',
                        borderRadius: 12,
                        border: isSelected ? '1px solid #2563eb' : '1px solid rgba(148, 163, 184, 0.35)',
                        background: isSelected ? '#eff6ff' : '#f8fafc',
                        color: '#0f172a',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 0 0 2px rgba(37, 99, 235, 0.08)' : 'none',
                        width: '100%'
                      }}
                    >
                      <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: '#fff' }}>
                        {renderBadgeIcon(icon.value, icon.label)}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>{icon.label}</span>
                    </button>
                  );
                })}
              </div>
              {totalIconPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, gap: 10 }}>
                  <button type="button" className="outline-button" onClick={() => setIconPage((prev) => Math.max(prev - 1, 0))} disabled={iconPage === 0} style={{ opacity: iconPage === 0 ? 0.5 : 1 }}>
                    Anterior
                  </button>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Página {iconPage + 1} / {totalIconPages}</span>
                  <button type="button" className="outline-button" onClick={() => setIconPage((prev) => Math.min(prev + 1, totalIconPages - 1))} disabled={iconPage >= totalIconPages - 1} style={{ opacity: iconPage >= totalIconPages - 1 ? 0.5 : 1 }}>
                    Siguiente
                  </button>
                </div>
              )}
              {iconUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, padding: '8px 10px', borderRadius: 12, border: '1px solid rgba(148, 163, 184, 0.35)', background: '#f8fafc' }}>
                  <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: '#fff' }}>
                    {renderBadgeIcon(iconUrl, 'Vista previa')}
                  </div>
                  <span style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>{badgeIconOptions.find((icon) => icon.value === iconUrl)?.label || 'Vista previa del icono'}</span>
                </div>
              )}
            </div>

          </div>
          <div className="form-actions-row" style={{ marginTop: 4 }}>
            <button className="outline-button" onClick={resetForm}>{t.cancel}</button>
            <button className="primary-button" onClick={handleCreate} disabled={saving}>{saving ? t.loading : t.saveBadge}</button>
          </div>
        </div>
      </div></div>, document.body)}

      {deleteConfirm && createPortal(<div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}><div className="exit-warning-modal" onClick={(e) => e.stopPropagation()}>
        <div className="exit-warning-icon"><Trash2 size={40} /></div>
        <h2>{t.deleteBadgeConfirm}</h2>
        <div className="exit-warning-actions"><button className="outline-button" onClick={() => setDeleteConfirm(null)}>{t.cancel}</button>
        <button className="primary-button exit-confirm" disabled={deleting} onClick={async () => { setDeleting(true); await deleteBadge(deleteConfirm); setDeleting(false); setDeleteConfirm(null); toast('Insignia eliminada', 'success'); onRefresh(); }}>{deleting ? t.loading : t.delete}</button></div>
      </div></div>, document.body)}

      <div className="admin-two-up">
        <div className="section-card">
          <div className="section-title"><div><h2>{t.totalBadges}</h2><p className="muted">{badges.length}</p></div></div>
          {badges.length === 0 ? <div className="empty-state"><Star size={30} /><h3>{t.noBadges}</h3></div> :
           <div className="badges-grid">{badges.map((b) => (
             <div key={b.id} className="badge-card">
               <div className="badge-icon">{renderBadgeIcon(b.icon_url, b.name)}</div>
               <strong>{b.name}</strong>
               <small>{b.description}</small>
               <span className="badge-points">{b.points} {t.pointsLabel.toLowerCase()}</span>
               <button className="icon-button badge-delete" onClick={() => setDeleteConfirm(b.id)}><Trash2 size={14} /></button>
             </div>
           ))}</div>}
        </div>
        <div className="section-card">
          <div className="section-title"><div><h2>{t.earnedBy}</h2><p className="muted">{userBadges.length}</p></div></div>
          {userBadges.length === 0 ? <div className="empty-state"><Award size={30} /><h3>{t.noUserBadges}</h3></div> :
           <div className="admin-list-stack">{userBadges.map((ub) => (
             <div key={ub.id} className="admin-team-row">
               <div className="badge-icon-sm">{renderBadgeIcon(ub.badge?.icon_url, ub.badge?.name)}</div>
               <div><strong>{ub.badge?.name ?? '—'}</strong><small>{ub.user?.full_name ?? '—'} · {ub.earned_at?.slice(0, 10)}</small></div>
             </div>
           ))}</div>}
        </div>
      </div>
    </div>
  );
}

// ===================== NOTIFICATIONS =====================
export function NotificationsModule({ t, data, onRefresh }: { t: AdminStrings; data: AdminData; onRefresh: () => void }) {
  const { notifications, team } = data;
  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'success' | 'error' | 'reminder'>('info');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const resetForm = () => { setUserId(''); setType('info'); setTitle(''); setMessage(''); setError(null); setShowForm(false); };

  const handleCreate = async () => {
    if (!userId || !title || !message) { setError(t.user + ' / ' + t.title + ' / ' + t.message); return; }
    setSaving(true);
    const { error: err } = await createNotification({ user_id: userId, type, title, message });
    if (err) { setError(err); setSaving(false); return; }
    setSaving(false); resetForm(); toast('Notificación enviada', 'success'); onRefresh();
  };

  const typeIcon = (tp: string) => tp === 'warning' ? <AlertCircle size={14} /> : tp === 'success' ? <Check size={14} /> : tp === 'error' ? <AlertCircle size={14} /> : tp === 'reminder' ? <Clock3 size={14} /> : <Bell size={14} />;

  return (
    <div className="page animate-in">
      <div className="page-heading"><div><p className="eyebrow">NOTIFICACIONES</p><h1>{t.notifications}</h1><p className="muted">{t.notificationsDesc}</p></div>
        <button className="primary-button" onClick={() => setShowForm(true)}><Plus size={18} />{t.newNotification}</button>
      </div>
      {showForm && createPortal(<div className="modal-backdrop" onClick={resetForm}><div className="course-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={resetForm}><X size={19} /></button>
        <div className="modal-body">
          <h2>{t.newNotification}</h2>
          {error && <div className="auth-error" style={{ marginBottom: 12 }}><AlertCircle size={16} />{error}</div>}
          <div className="modal-form-grid" style={{ marginTop: 10 }}>
            <div className="field-group field-group-full"><label>{t.user}</label>
              <select className="auth-input" value={userId} onChange={(e) => setUserId(e.target.value)}>
                <option value="">—</option>
                {team.map((u) => <option key={u.id} value={u.id}>{u.full_name}</option>)}
              </select>
            </div>
            <div className="field-group"><label>{t.type}</label>
              <select className="auth-input" value={type} onChange={(e) => setType(e.target.value as any)}>
                <option value="info">{t.info}</option><option value="warning">{t.warning}</option>
                <option value="success">{t.success}</option><option value="error">{t.error}</option><option value="reminder">{t.reminder}</option>
              </select>
            </div>
            <div className="field-group field-group-full"><label>{t.title}</label><input className="auth-input" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="field-group field-group-full"><label>{t.message}</label><textarea className="auth-input" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} /></div>
          </div>
          <div className="form-actions-row" style={{ marginTop: 4 }}>
            <button className="outline-button" onClick={resetForm}>{t.cancel}</button>
            <button className="primary-button" onClick={handleCreate} disabled={saving}>{saving ? t.loading : t.saveNotification}</button>
          </div>
        </div>
      </div></div>, document.body)}

      {deleteConfirm && createPortal(<div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}><div className="exit-warning-modal" onClick={(e) => e.stopPropagation()}>
        <div className="exit-warning-icon"><Trash2 size={40} /></div>
        <h2>{t.deleteNotificationConfirm}</h2>
        <div className="exit-warning-actions"><button className="outline-button" onClick={() => setDeleteConfirm(null)}>{t.cancel}</button>
        <button className="primary-button exit-confirm" disabled={deleting} onClick={async () => { setDeleting(true); await deleteNotification(deleteConfirm); setDeleting(false); setDeleteConfirm(null); toast('Notificación eliminada', 'success'); onRefresh(); }}>{deleting ? t.loading : t.delete}</button></div>
      </div></div>, document.body)}

      <div className="section-card">
        {notifications.length === 0 ? <div className="empty-state"><Bell size={30} /><h3>{t.noNotifications}</h3></div> :
         <div className="admin-list-stack">{notifications.map((n) => (
           <div key={n.id} className="admin-course-row">
             <div className={`course-icon ${n.type === 'warning' ? 'gray-3' : 'gray-1'}`}>{typeIcon(n.type)}</div>
             <div className="course-row-info"><strong>{n.title}</strong><small>{n.user?.full_name ?? '—'} · {n.message}</small></div>
             <span className={`status-badge ${n.is_read ? 'active' : 'inactive'}`}>{n.is_read ? t.read : t.unread}</span>
             <div className="admin-course-actions"><button className="icon-button" onClick={() => setDeleteConfirm(n.id)}><Trash2 size={16} /></button></div>
           </div>
         ))}</div>}
      </div>
    </div>
  );
}

// ===================== REPORTS =====================
export function ReportsModule({ t, data }: { t: AdminStrings; data: AdminData }) {
  const { courses, team, certificates, feedback, examAttempts, userCourseReqs } = data;
  const reportCards = [
    { title: t.complianceReport, icon: ShieldCheck, count: userCourseReqs.length, desc: t.totalAssignments },
    { title: t.progressReport, icon: BarChart3, count: data.moduleProgress.length, desc: t.totalProgress },
    { title: t.certReport, icon: Award, count: certificates.length, desc: t.totalCertificates },
    { title: t.feedbackReport, icon: Star, count: feedback.length, desc: t.totalFeedback },
  ];

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

  return (
    <div className="page animate-in">
      <div className="page-heading"><div><p className="eyebrow">REPORTES</p><h1>{t.reports}</h1><p className="muted">{t.reportsDesc}</p></div>
        <div className="report-export-buttons">
          <button className="outline-button" onClick={() => exportData('excel')}><Download size={16} />{t.exportExcel}</button>
          <button className="outline-button" onClick={() => exportData('csv')}><Download size={16} />{t.exportCsv}</button>
        </div>
      </div>
      <div className="report-cards-grid">
        {reportCards.map((r, i) => {
          const Icon = r.icon;
          return <div key={i} className="report-card">
            <div className="report-card-icon"><Icon size={24} /></div>
            <div><strong>{r.title}</strong><small>{r.desc}</small></div>
            <div className="report-count">{r.count}</div>
            <button className="outline-button report-export-btn" onClick={() => exportData('csv')}><Download size={14} />{t.exportCsv}</button>
          </div>;
        })}
      </div>
      <div className="section-card" style={{ marginTop: 18 }}>
        <div className="section-title"><div><h2>{t.examResults}</h2><p className="muted">{examAttempts.length} {t.totalExams.toLowerCase()}</p></div></div>
        {examAttempts.length === 0 ? <p className="muted" style={{ padding: '20px 0' }}>{t.noData}</p> :
         <div className="admin-list-stack">{examAttempts.slice(0, 10).map((a) => (
           <div key={a.id} className="admin-course-row">
             <div className="course-icon gray-2"><FileText size={18} /></div>
             <div><strong>{t.scoreCol}: {a.score}%</strong><small>{a.correct_answers}/{a.total_questions} · {a.passed ? t.passed : t.failed}</small></div>
             <span className={`status-badge ${a.passed ? 'active' : 'inactive'}`}>{a.passed ? t.passed : t.failed}</span>
           </div>
         ))}</div>}
      </div>
    </div>
  );
}

// ===================== SETTINGS =====================
export function SettingsModule({ t, data, onRefresh }: { t: AdminStrings; data: AdminData; onRefresh: () => void }) {
  const { settings } = data;
  const [showForm, setShowForm] = useState(false);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const resetForm = () => { setKey(''); setValue(''); setDescription(''); setCategory('general'); setIsPublic(false); setEditingId(null); setError(null); setShowForm(false); };

  const handleSave = async () => {
    if (!key || !value) { setError(t.key + ' / ' + t.value); return; }
    setSaving(true);
    let parsedValue: Record<string, unknown>;
    try { parsedValue = JSON.parse(value); } catch { parsedValue = { value }; }
    if (editingId) {
      const { error: err } = await updateSystemSetting(editingId, parsedValue);
      if (err) { setError(err); setSaving(false); return; }
    } else {
      const { error: err } = await createSystemSetting(key, parsedValue, description, category);
      if (err) { setError(err); setSaving(false); return; }
    }
    setSaving(false); resetForm(); toast(editingId ? 'Configuración actualizada' : 'Configuración guardada', 'success'); onRefresh();
  };

  return (
    <div className="page animate-in">
      <div className="page-heading"><div><p className="eyebrow">CONFIGURACIÓN</p><h1>{t.settings}</h1><p className="muted">{t.settingsDesc}</p></div>
        <button className="primary-button" onClick={() => { resetForm(); setShowForm(true); }}><Plus size={18} />{t.saveSetting}</button>
      </div>
      {showForm && createPortal(<div className="modal-backdrop" onClick={resetForm}><div className="course-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={resetForm}><X size={19} /></button>
        <div className="modal-body">
          <h2>{t.saveSetting}</h2>
          {error && <div className="auth-error" style={{ marginBottom: 12 }}><AlertCircle size={16} />{error}</div>}
          <div className="modal-form-grid" style={{ marginTop: 10 }}>
            <div className="field-group"><label>{t.key}</label><input className="auth-input" value={key} onChange={(e) => setKey(e.target.value)} disabled={!!editingId} /></div>
            <div className="field-group"><label>{t.category}</label>
              <select className="auth-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="general">{t.general}</option><option value="branding">{t.branding}</option>
                <option value="email">{t.email2}</option><option value="security">{t.security}</option>
              </select>
            </div>
            <div className="field-group field-group-full"><label>{t.value}</label><input className="auth-input" value={value} onChange={(e) => setValue(e.target.value)} placeholder="JSON o texto" /></div>
            <div className="field-group field-group-full"><label>{t.description}</label><input className="auth-input" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <div className="field-group field-group-full"><label>{t.isPublic}</label>
              <div className="auth-role-select">
                <button className={isPublic ? 'active' : ''} onClick={() => setIsPublic(true)}><Check size={16} />{t.isPublic}</button>
                <button className={!isPublic ? 'active' : ''} onClick={() => setIsPublic(false)}>{t.general}</button>
              </div>
            </div>
          </div>
          <div className="form-actions-row" style={{ marginTop: 4 }}>
            <button className="outline-button" onClick={resetForm}>{t.cancel}</button>
            <button className="primary-button" onClick={handleSave} disabled={saving}>{saving ? t.loading : t.saveSetting}</button>
          </div>
        </div>
      </div></div>, document.body)}

      <div className="section-card">
        {settings.length === 0 ? <div className="empty-state"><Settings size={30} /><h3>{t.noSettings}</h3></div> :
         <div className="admin-list-stack">{settings.map((s) => (
           <div key={s.id} className="admin-course-row">
             <div className="course-icon gray-2"><Settings size={18} /></div>
             <div className="course-row-info"><strong>{s.key}</strong><small>{s.category} · {s.description ?? '—'}{s.is_public ? ' · Público' : ''}</small></div>
             <button className="icon-button" onClick={() => { setEditingId(s.id); setKey(s.key); setValue(JSON.stringify(s.value)); setDescription(s.description ?? ''); setCategory(s.category); setIsPublic(s.is_public); setShowForm(true); }}><Settings size={16} /></button>
           </div>
         ))}</div>}
      </div>
    </div>
  );
}

// ===================== AUDIT =====================
export function AuditModule({ t, data }: { t: AdminStrings; data: AdminData }) {
  const [auditLogs, setAuditLogs] = useState(data.auditLogs);

  useEffect(() => {
    let active = true;
    fetchAuditLogs().then((logs) => {
      if (active) setAuditLogs(logs);
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="page animate-in">
      <div className="page-heading"><div><p className="eyebrow">AUDITORÍA</p><h1>{t.audit}</h1><p className="muted">{t.auditDesc}</p></div></div>
      <div className="section-card">
        {auditLogs.length === 0 ? <div className="empty-state"><History size={30} /><h3>{t.noAudit}</h3></div> :
         <div className="admin-list-stack">{auditLogs.map((log) => {
           const date = new Date(log.created_at);
           const dateStr = date.toLocaleDateString();
           const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
           return (
             <div key={log.id} className="audit-row">
               <div className="audit-user-avatar">
                 <User size={16} />
               </div>
               <div className="audit-content">
                 <div className="audit-top">
                   <strong>{log.action}</strong>
                   <span className="audit-entity">{log.entity_type}</span>
                 </div>
                 <div className="audit-detail">
                   <span className="audit-who"><User size={12} />{log.user?.full_name ?? 'Sistema'}</span>
                   {log.ip_address && <span className="audit-ip">IP: {log.ip_address}</span>}
                   <span className="audit-time"><Clock3 size={12} />{dateStr} · {timeStr}</span>
                 </div>
                 {log.new_values && Object.keys(log.new_values).length > 0 && (
                   <div className="audit-changes">
                     {Object.entries(log.new_values).slice(0, 3).map(([k, v]) => (
                       <span key={k} className="audit-change-tag">{k}: {String(v).slice(0, 40)}</span>
                     ))}
                   </div>
                 )}
               </div>
             </div>
           );
         })}</div>}
      </div>
    </div>
  );
}

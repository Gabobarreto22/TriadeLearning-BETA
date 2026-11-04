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
           <PaginatedList items={badges}>{(pageBadges) => <div className="badges-grid">{pageBadges.map((b) => (
             <div key={b.id} className="badge-card">
               <div className="badge-icon">{renderBadgeIcon(b.icon_url, b.name)}</div>
               <strong>{b.name}</strong>
               <small>{b.description}</small>
               <span className="badge-points">{b.points} {t.pointsLabel.toLowerCase()}</span>
               <button className="icon-button badge-delete" onClick={() => setDeleteConfirm(b.id)}><Trash2 size={14} /></button>
             </div>
           ))}</div>}</PaginatedList>}
        </div>
        <div className="section-card">
          <div className="section-title"><div><h2>{t.earnedBy}</h2><p className="muted">{userBadges.length}</p></div></div>
          {userBadges.length === 0 ? <div className="empty-state"><Award size={30} /><h3>{t.noUserBadges}</h3></div> :
           <PaginatedList items={userBadges}>{(pageUserBadges) => <div className="admin-list-stack">{pageUserBadges.map((ub) => (
             <div key={ub.id} className="admin-team-row">
               <div className="badge-icon-sm">{renderBadgeIcon(ub.badge?.icon_url, ub.badge?.name)}</div>
               <div><strong>{ub.badge?.name ?? '—'}</strong><small>{ub.user?.full_name ?? '—'} · {ub.earned_at?.slice(0, 10)}</small></div>
             </div>
           ))}</div>}</PaginatedList>}
        </div>
      </div>
    </div>
  );
}

// ===================== NOTIFICATIONS =====================

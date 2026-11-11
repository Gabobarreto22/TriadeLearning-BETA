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

type Recipients = 'user' | 'role';
type NotificationType = 'info' | 'warning' | 'success' | 'error' | 'reminder';

export function NotificationsModule({ t, data, onRefresh }: { t: AdminStrings; data: AdminData; onRefresh: () => void }) {
  const { notifications, team, jobRoles } = data;
  const [showForm, setShowForm] = useState(false);
  const [recipients, setRecipients] = useState<Recipients>('user');
  const [userId, setUserId] = useState('');
  const [roleId, setRoleId] = useState('');
  const [type, setType] = useState<NotificationType>('info');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const resetForm = () => { setRecipients('user'); setUserId(''); setRoleId(''); setType('info'); setTitle(''); setMessage(''); setError(null); setShowForm(false); };

  const roleMembers = team.filter((u) => u.job_role_id === roleId);
  const targets: Profile[] = recipients === 'role' ? roleMembers : team.filter((u) => u.id === userId);
  const notificationTypes: { value: NotificationType; label: string; icon: JSX.Element }[] = [
    { value: 'info', label: t.info, icon: <Bell size={14} /> },
    { value: 'success', label: t.success, icon: <Check size={14} /> },
    { value: 'warning', label: t.warning, icon: <AlertCircle size={14} /> },
    { value: 'error', label: t.error, icon: <AlertCircle size={14} /> },
    { value: 'reminder', label: t.reminder, icon: <Clock3 size={14} /> },
  ];

  const handleCreate = async () => {
    if (!title || !message) { setError(t.title + ' / ' + t.message); return; }
    if (targets.length === 0) { setError(recipients === 'role' ? t.selectRole : t.user); return; }
    setSaving(true);
    const results = await Promise.all(targets.map((u) => createNotification({ user_id: u.id, type, title, message })));
    const failed = results.find((r) => r.error);
    if (failed?.error) { setError(failed.error); setSaving(false); return; }
    setSaving(false); resetForm(); toast(targets.length > 1 ? `Notificación enviada a ${targets.length} personas` : 'Notificación enviada', 'success'); onRefresh();
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
            <div className="field-group field-group-full"><label>Destinatario</label>
              <div className="segmented-control">
                <button type="button" className={recipients === 'user' ? 'active' : ''} onClick={() => setRecipients('user')}><User size={14} />Persona</button>
                <button type="button" className={recipients === 'role' ? 'active' : ''} onClick={() => setRecipients('role')}><Users size={14} />Cargo</button>
              </div>
            </div>
            {recipients === 'user' ? (
              <div className="field-group field-group-full"><label>{t.user}</label>
                <select className="auth-input" value={userId} onChange={(e) => setUserId(e.target.value)}>
                  <option value="">—</option>
                  {team.map((u) => <option key={u.id} value={u.id}>{u.full_name}</option>)}
                </select>
              </div>
            ) : (
              <div className="field-group field-group-full"><label>{t.jobRole}</label>
                <select className="auth-input" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
                  <option value="">—</option>
                  {jobRoles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                {roleId && <small className="muted">{roleMembers.length} {roleMembers.length === 1 ? 'persona recibirá' : 'personas recibirán'} esta notificación</small>}
              </div>
            )}
            <div className="field-group field-group-full"><label>{t.type}</label>
              <div className="segmented-control notification-type-control">
                {notificationTypes.map((option) => (
                  <button key={option.value} type="button" className={type === option.value ? 'active' : ''} onClick={() => setType(option.value)}>{option.icon}{option.label}</button>
                ))}
              </div>
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
         <PaginatedList items={notifications}>{(pageNotifications) => <div className="admin-list-stack">{pageNotifications.map((n) => (
           <div key={n.id} className="admin-course-row">
             <div className={`course-icon ${n.type === 'warning' ? 'gray-3' : 'gray-1'}`}>{typeIcon(n.type)}</div>
             <div className="course-row-info"><strong>{n.title}</strong><small>{n.user?.full_name ?? '—'} · {n.message}</small></div>
             <span className={`status-badge ${n.is_read ? 'active' : 'inactive'}`}>{n.is_read ? t.read : t.unread}</span>
             <div className="admin-course-actions"><button className="icon-button" onClick={() => setDeleteConfirm(n.id)}><Trash2 size={16} /></button></div>
           </div>
         ))}</div>}</PaginatedList>}
      </div>
    </div>
  );
}

// ===================== REPORTS =====================

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, Bell, Check, ChevronDown, Clock3, Plus, Trash2, Users, X, User } from 'lucide-react';
import { supabase, type Profile, type JobRole, type CourseWithRelations, type Certificate, type RoleCertification, type Notification, type CourseFeedback, type Badge, type UserBadge, type SystemSetting, type AuditLog, type UserCourseRequirement } from '@/lib/supabase';
import { fetchUserCourseRequirements, assignCourseToUser, fetchAllCertificates, fetchRoleCertifications, fetchAllNotifications, createNotification, deleteNotification, fetchAllFeedback, fetchBadges, createBadge, deleteBadge, fetchUserBadges, fetchSystemSettings, updateSystemSetting, createSystemSetting, fetchAuditLogs } from '@/lib/data';
import { getIcon } from '@/lib/icons';
import type { AdminSection } from '@/lib/routes';
import { useToast } from '@/lib/toast';
import type { AdminStrings, AdminData } from './types';
import { PaginatedList } from '../PaginatedList';
import { ReportDropdown } from './ReportDropdown';
import { SelectionModal } from './SelectionModal';
import { exportNotificationsReport } from '@/lib/pdfReport';

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
  const [formPicker, setFormPicker] = useState<'user' | 'role' | 'type' | null>(null);
  const [reportPicker, setReportPicker] = useState<'byType' | 'byRole' | 'byWorker' | null>(null);
  const { toast } = useToast();

  const resetForm = () => { setRecipients('user'); setUserId(''); setRoleId(''); setType('info'); setTitle(''); setMessage(''); setError(null); setFormPicker(null); setShowForm(false); };

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

  const notifReportOpts = [
    { value: 'general', label: t.reportGeneral },
    { value: 'byType', label: t.reportByType },
    { value: 'byRole', label: t.reportByRole },
    { value: 'byWorker', label: t.reportByWorker },
  ];

  const exportNotifScope = (scope: 'general' | 'byType' | 'byRole' | 'byWorker', chosenId = '') => {
    const mapNotif = (n: typeof notifications[number]) => ({
      title: n.title,
      message: n.message,
      type: n.type,
      userName: n.user?.full_name ?? '—',
      is_read: n.is_read,
      created_at: n.sent_at,
    });
    let filterLabel: string | undefined;
    let scoped = notifications;
    if (scope === 'byType') {
      const option = notificationTypes.find((o) => o.value === chosenId);
      if (!option) return;
      scoped = notifications.filter((n) => n.type === option.value);
      filterLabel = option.label;
    } else if (scope === 'byRole') {
      const role = jobRoles.find((r) => r.id === chosenId);
      if (!role) return;
      scoped = notifications.filter((n) => team.find((u) => u.id === n.user_id)?.job_role_id === role.id);
      filterLabel = role.name;
    } else if (scope === 'byWorker') {
      const worker = team.find((u) => u.id === chosenId);
      if (!worker) return;
      scoped = notifications.filter((n) => n.user_id === worker.id);
      filterLabel = worker.full_name;
    }
    exportNotificationsReport({
      notifications: scoped.map(mapNotif),
      scope,
      filterLabel,
    });
  };

  const handleNotifReport = (scope: string) => {
    if (scope === 'general') exportNotifScope('general');
    else setReportPicker(scope as 'byType' | 'byRole' | 'byWorker');
  };

  return (
    <div className="page animate-in">
      <div className="page-heading"><div><p className="eyebrow">NOTIFICACIONES</p><h1>{t.notifications}</h1><p className="muted">{t.notificationsDesc}</p></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <ReportDropdown label={t.reportNotifications} options={notifReportOpts} onSelect={handleNotifReport} />
          <button className="primary-button" onClick={() => setShowForm(true)}><Plus size={18} />{t.newNotification}</button>
        </div>
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
                <button type="button" className="selection-trigger" onClick={() => setFormPicker('user')}>
                  <span>{team.find((u) => u.id === userId)?.full_name ?? 'Seleccionar trabajador'}</span>
                  <User size={16} />
                </button>
              </div>
            ) : (
              <div className="field-group field-group-full"><label>{t.jobRole}</label>
                <button type="button" className="selection-trigger" onClick={() => setFormPicker('role')}>
                  <span>{jobRoles.find((r) => r.id === roleId)?.name ?? 'Seleccionar cargo'}</span>
                  <Users size={16} />
                </button>
                {roleId && <small className="muted">{roleMembers.length} {roleMembers.length === 1 ? 'persona recibirá' : 'personas recibirán'} esta notificación</small>}
              </div>
            )}
            <div className="field-group field-group-full"><label>{t.type}</label>
              <button type="button" className="selection-trigger" onClick={() => setFormPicker('type')}>
                <span className="notification-type-current">{notificationTypes.find((o) => o.value === type)?.icon}{notificationTypes.find((o) => o.value === type)?.label}</span>
                <ChevronDown size={16} />
              </button>
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

      {formPicker && (
        <SelectionModal
          eyebrow={t.newNotification}
          title={formPicker === 'user' ? 'Seleccionar trabajador' : formPicker === 'role' ? 'Seleccionar cargo' : 'Seleccionar tipo'}
          options={formPicker === 'user'
            ? team.map((u) => ({ value: u.id, label: u.full_name }))
            : formPicker === 'role'
              ? jobRoles.map((r) => ({ value: r.id, label: r.name, hint: `${team.filter((u) => u.job_role_id === r.id).length} personas` }))
              : notificationTypes}
          selectedValue={formPicker === 'user' ? userId : formPicker === 'role' ? roleId : type}
          searchPlaceholder={formPicker === 'type' ? 'Buscar tipo' : formPicker === 'role' ? 'Buscar cargo' : 'Buscar trabajador'}
          onSelect={(value) => {
            if (formPicker === 'user') setUserId(value);
            else if (formPicker === 'role') setRoleId(value);
            else setType(value as NotificationType);
            setFormPicker(null);
          }}
          onClose={() => setFormPicker(null)}
        />
      )}
      {reportPicker && (
        <SelectionModal
          eyebrow={t.reportNotifications}
          title={reportPicker === 'byType' ? 'Seleccionar tipo' : reportPicker === 'byRole' ? 'Seleccionar cargo' : 'Seleccionar trabajador'}
          options={reportPicker === 'byType'
            ? notificationTypes.filter((o) => notifications.some((n) => n.type === o.value))
            : reportPicker === 'byRole'
              ? jobRoles.map((r) => ({ value: r.id, label: r.name }))
              : team.map((u) => ({ value: u.id, label: u.full_name }))}
          selectedValue=""
          searchPlaceholder={reportPicker === 'byType' ? 'Buscar tipo' : reportPicker === 'byRole' ? 'Buscar cargo' : 'Buscar trabajador'}
          onSelect={(value) => { setReportPicker(null); exportNotifScope(reportPicker, value); }}
          onClose={() => setReportPicker(null)}
        />
      )}

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

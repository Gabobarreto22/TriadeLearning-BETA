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

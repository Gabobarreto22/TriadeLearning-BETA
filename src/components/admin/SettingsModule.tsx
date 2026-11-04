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
         <PaginatedList items={settings}>{(pageSettings) => <div className="admin-list-stack">{pageSettings.map((s) => (
           <div key={s.id} className="admin-course-row">
             <div className="course-icon gray-2"><Settings size={18} /></div>
             <div className="course-row-info"><strong>{s.key}</strong><small>{s.category} · {s.description ?? '—'}{s.is_public ? ' · Público' : ''}</small></div>
             <button className="icon-button" onClick={() => { setEditingId(s.id); setKey(s.key); setValue(JSON.stringify(s.value)); setDescription(s.description ?? ''); setCategory(s.category); setIsPublic(s.is_public); setShowForm(true); }}><Settings size={16} /></button>
           </div>
         ))}</div>}</PaginatedList>}
      </div>
    </div>
  );
}

// ===================== AUDIT =====================

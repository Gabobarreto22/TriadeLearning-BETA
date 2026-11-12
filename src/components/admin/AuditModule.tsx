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
import { ReportDropdown } from './ReportDropdown';
import { exportAuditReport } from '@/lib/pdfReport';

export function AuditModule({ t, data }: { t: AdminStrings; data: AdminData }) {
  const [auditLogs, setAuditLogs] = useState(data.auditLogs);

  useEffect(() => {
    let active = true;
    fetchAuditLogs().then((logs) => {
      if (active) setAuditLogs(logs);
    });
    return () => { active = false; };
  }, []);

  const handleReport = () => {
    exportAuditReport({
      logs: auditLogs.map((l) => ({
        action: l.action,
        entity_type: l.entity_type,
        userName: l.user?.full_name ?? 'Sistema',
        ip_address: l.ip_address,
        created_at: l.created_at,
        changesSummary: l.new_values ? Object.entries(l.new_values).slice(0, 3).map(([k, v]) => `${k}: ${String(v)}`).join(', ') : null,
      })),
    });
  };

  return (
    <div className="page animate-in">
      <div className="page-heading"><div><p className="eyebrow">AUDITORÍA</p><h1>{t.audit}</h1><p className="muted">{t.auditDesc}</p></div>
        <ReportDropdown label={t.reportAudit} options={[{ value: 'general', label: t.reportGeneral }]} onSelect={handleReport} />
      </div>
      <div className="section-card">
        {auditLogs.length === 0 ? <div className="empty-state"><History size={30} /><h3>{t.noAudit}</h3></div> :
         <PaginatedList items={auditLogs}>{(pageAuditLogs) => <div className="admin-list-stack">{pageAuditLogs.map((log) => {
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
         })}</div>}</PaginatedList>}
      </div>
    </div>
  );
}

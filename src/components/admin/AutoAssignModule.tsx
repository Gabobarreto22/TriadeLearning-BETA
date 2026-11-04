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

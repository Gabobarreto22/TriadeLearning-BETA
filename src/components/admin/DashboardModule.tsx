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

export function DashboardModule({ t, data, onNavigate }: {
  t: AdminStrings;
  data: AdminData;
  onNavigate: (view: AdminSection) => void;
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

  const quickLinks: { label: string; icon: typeof BookOpen; view: AdminSection }[] = [
    { label: t.courses, icon: BookOpen, view: 'courses' },
    { label: t.personnel, icon: Users, view: 'personnel' },
    { label: t.certifications, icon: Award, view: 'certifications' },
    { label: t.reports, icon: BarChart3, view: 'reports' },
    { label: t.notifications, icon: Bell, view: 'notifications' },
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

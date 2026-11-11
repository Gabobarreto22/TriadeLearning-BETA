import { AlertCircle, Award, BarChart3, Bell, BookOpen, Check, CheckCircle, ChevronRight, Clock3, Download, FileText, History, Lock, Plus, Settings, ShieldCheck, Star, Trash2, Users, X, Zap, User, Mail, TrendingUp, Info, AlertTriangle, BellRing, XCircle, PlayCircle, Image, Presentation, FileCheck, Calendar, Eye, Filter, Palette, ArrowRight, ArrowDown, Lock as LockIcon } from 'lucide-react';
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
  const activeAssignments = data.userCourseReqs.filter((r) => r.status !== 'cancelled' && r.status !== 'exempted');
  const totalProgress = activeAssignments.length > 0
    ? Math.round(activeAssignments.reduce((sum, r) => sum + (r.progress_percent || 0), 0) / activeAssignments.length)
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

  const quickLinks: { label: string; icon: typeof BookOpen; view: AdminSection; tone: string }[] = [
    { label: t.courses, icon: BookOpen, view: 'courses', tone: 'g1' },
    { label: t.personnel, icon: Users, view: 'personnel', tone: 'g2' },
    { label: t.certifications, icon: Award, view: 'certifications', tone: 'g3' },
    { label: t.reports, icon: BarChart3, view: 'reports', tone: 'g4' },
    { label: t.notifications, icon: Bell, view: 'notifications', tone: 'g1' },
  ];

  const progressTone = totalProgress >= 70 ? 'green' : totalProgress >= 40 ? 'blue' : 'orange';
  const passTone = passRate >= 70 ? 'green' : passRate >= 40 ? 'blue' : 'orange';

  return (
    <div className="page animate-in">
      <div className="page-heading">
        <div>
          <p className="eyebrow">CENTRO DE CONTROL</p>
          <h1>{t.dashboard}</h1>
          <p className="muted">{t.adminIntro}</p>
        </div>
      </div>

      {/* Stats grid — docs-mock-stat style */}
      <section className="dash-stats-grid">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="dash-stat-card">
              <div className={`dash-stat-icon ${s.tone}`}>
                <Icon size={18} />
              </div>
              <div className="dash-stat-body">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            </div>
          );
        })}
      </section>

      <div className="dash-stack">
        {/* Quick access — docs-mock-link style */}
        <div className="dash-article">
          <div className="dash-article-header">
            <div className="dash-article-icon">
              <Zap size={20} />
            </div>
            <div>
              <h2>{t.recentActivity}</h2>
              <p className="muted">{t.statsOverview}</p>
            </div>
          </div>
          <div className="dash-quick-grid">
            {quickLinks.map((ql) => {
              const Icon = ql.icon;
              return (
                <button
                  key={ql.view}
                  className="dash-quick-card"
                  onClick={() => onNavigate(ql.view)}
                >
                  <div className={`dash-quick-icon ${ql.tone}`}>
                    <Icon size={20} />
                  </div>
                  <strong>{ql.label}</strong>
                  <span className="dash-quick-arrow">
                    {t.viewAll} <ChevronRight size={13} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Completion + Pass rate visual bars */}
        <div className="dash-metrics-row">
          <div className="dash-article">
            <div className="dash-metric-header">
              <div className="dash-metric-icon g1">
                <BarChart3 size={18} />
              </div>
              <span>{t.completion}</span>
              <strong>{totalProgress}%</strong>
            </div>
            <div className="dash-bar-track">
              <div
                className={`dash-bar-fill ${progressTone}`}
                style={{ width: `${totalProgress}%` }}
              />
            </div>
            <div className="dash-metric-detail">
              <div className="dash-metric-item">
                <Check size={13} />
                <span>{activeAssignments.length} asignaciones activas</span>
              </div>
            </div>
          </div>

          <div className="dash-article">
            <div className="dash-metric-header">
              <div className="dash-metric-icon g2">
                <Check size={18} />
              </div>
              <span>{t.passRate}</span>
              <strong>{passRate}%</strong>
            </div>
            <div className="dash-bar-track">
              <div
                className={`dash-bar-fill ${passTone}`}
                style={{ width: `${passRate}%` }}
              />
            </div>
            <div className="dash-metric-detail">
              <div className="dash-metric-item">
                <TrendingUp size={13} />
                <span>{examAttempts.filter((a) => a.passed).length}/{examAttempts.length} exámenes aprobados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two-up: courses + feedback — docs-mock-row style */}
        <div className="dash-two-up">
          <div className="dash-article">
            <div className="dash-article-header">
              <div className="dash-article-icon">
                <BookOpen size={20} />
              </div>
              <div>
                <h2>{t.courses}</h2>
                <p className="muted">{courses.length} {t.totalCourses.toLowerCase()}</p>
              </div>
              <button className="dash-view-all" onClick={() => onNavigate('courses')}>
                {t.viewAll} <ChevronRight size={13} />
              </button>
            </div>
            {courses.length === 0 ? (
              <p className="muted dash-empty">{t.noCourses}</p>
            ) : (
              <div className="dash-list">
                {courses.slice(0, 4).map((c) => {
                  const Icon = getIcon(c.icon_name);
                  return (
                    <div key={c.id} className="dash-list-row">
                      <div className={`dash-list-icon ${c.accent || 'blue'}`}>
                        <Icon size={16} />
                      </div>
                      <div className="dash-list-body">
                        <strong>{c.title}</strong>
                        <small>{c.modules.length} {t.modulesLabel} · {c.assignments.length} {t.assignedRole}s</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="dash-article">
            <div className="dash-article-header">
              <div className="dash-article-icon">
                <Star size={20} />
              </div>
              <div>
                <h2>{t.feedback}</h2>
                <p className="muted">{feedback.length} {t.totalFeedback.toLowerCase()}</p>
              </div>
              <button className="dash-view-all" onClick={() => onNavigate('feedback')}>
                {t.viewAll} <ChevronRight size={13} />
              </button>
            </div>
            {feedback.length === 0 ? (
              <p className="muted dash-empty">{t.noFeedback}</p>
            ) : (
              <div className="dash-list">
                {feedback.slice(0, 5).map((f) => (
                  <div key={f.id} className="dash-list-row">
                    <div className="dash-avatar">
                      {f.user_course_requirement?.user?.full_name?.slice(0, 2).toUpperCase() ?? '??'}
                    </div>
                    <div className="dash-list-body">
                      <strong>{f.user_course_requirement?.user?.full_name ?? '—'}</strong>
                      <small>{f.user_course_requirement?.course?.title ?? '—'}</small>
                    </div>
                    <span className="dash-stars">{'★'.repeat(f.rating)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== CERTIFICATIONS =====================

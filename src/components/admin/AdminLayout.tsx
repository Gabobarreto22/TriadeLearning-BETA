import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { Award, BarChart3, Bell, BookOpen, FileText, History, LayoutDashboard, Settings, Star, Users } from 'lucide-react';
import { adminStringsES } from '@/components/admin/strings';
import type { AdminData } from '@/components/admin/types';
import { HelpButton } from '@/components/admin/HelpButton';
import { AppFrame, LoadingScreen } from '@/components/layout/AppFrame';
import { useAuth } from '@/lib/auth';
import { docSummaryMap } from '@/lib/docs';
import {
  fetchAllCourses, fetchAllProfiles, fetchJobRoles, fetchDepartments,
  fetchUserCourseRequirements, fetchAllModuleProgress, fetchAllExamAttempts,
  fetchAllCertificates, fetchRoleCertifications, fetchAllNotifications,
  fetchAllFeedback, fetchBadges, fetchUserBadges, fetchSystemSettings, fetchAuditLogs,
} from '@/lib/data';
import { usePreferences } from '@/lib/preferences';
import { adminPaths, type AdminSection } from '@/lib/routes';
import type { Profile } from '@/lib/supabase';

export type AdminContextValue = {
  profile: Profile;
  data: AdminData;
  refreshAll: () => Promise<void>;
  navigateToSection: (section: AdminSection) => void;
  registerCourseEditorLeaveGuard: (guard: (() => boolean) | null) => void;
};

export function useAdminContext() {
  return useOutletContext<AdminContextValue>();
}

export function AdminLayout({ profile }: { profile: Profile }) {
  const { t } = usePreferences();
  const at = adminStringsES;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const courseEditorLeaveGuardRef = useRef<(() => boolean) | null>(null);

  const refreshAll = async () => {
    const [
      courses, team, jobRoles, departments, userCourseReqs,
      moduleProgress, examAttempts, certificates, roleCertifications,
      notifications, feedback, badges, userBadges, settings, auditLogs,
    ] = await Promise.all([
      fetchAllCourses(), fetchAllProfiles(), fetchJobRoles(), fetchDepartments(),
      fetchUserCourseRequirements(), fetchAllModuleProgress(), fetchAllExamAttempts(),
      fetchAllCertificates(), fetchRoleCertifications(), fetchAllNotifications(),
      fetchAllFeedback(), fetchBadges(), fetchUserBadges(), fetchSystemSettings(), fetchAuditLogs(),
    ]);
    setData({
      courses, team: team as Profile[], jobRoles, departments,
      userCourseReqs, moduleProgress, examAttempts, certificates,
      roleCertifications, notifications, feedback, badges, userBadges, settings, auditLogs,
    });
  };

  useEffect(() => {
    void refreshAll();
  }, []);

  const go = (path: string) => {
    if (courseEditorLeaveGuardRef.current && !courseEditorLeaveGuardRef.current()) return;
    navigate(path);
    setMobileOpen(false);
  };
  const navigateToSection = (section: AdminSection) => go(adminPaths[section]);
  const navigateDoc = (docId: string) => {
    navigate(adminPaths.documentation);
    setMobileOpen(false);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('docs:navigate', { detail: docId }));
    }, 50);
  };
  const registerCourseEditorLeaveGuard = (guard: (() => boolean) | null) => {
    courseEditorLeaveGuardRef.current = guard;
  };

  if (!data) return <LoadingScreen />;

  const navItems: { key: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
    { key: 'dashboard', label: at.dashboard, icon: LayoutDashboard },
    { key: 'personnel', label: at.personnel, icon: Users },
    { key: 'courses', label: at.courses, icon: BookOpen },
    { key: 'certifications', label: at.certifications, icon: Award },
    { key: 'feedback', label: at.feedback, icon: Star },
    { key: 'notifications', label: at.notifications, icon: Bell },
    { key: 'reports', label: at.reports, icon: BarChart3 },
    { key: 'settings', label: at.settings, icon: Settings },
    { key: 'audit', label: at.audit, icon: History },
    { key: 'documentation', label: at.documentation, icon: FileText },
  ];
  const currentItem = navItems.find((item) => adminPaths[item.key] === pathname);
  const currentKey = currentItem?.key;
  const initials = profile.full_name.slice(0, 2).toUpperCase();

  const contextValue: AdminContextValue = {
    profile,
    data,
    refreshAll,
    navigateToSection,
    registerCourseEditorLeaveGuard,
  };

  return <AppFrame
    workspaceLabel="TRIADE ADMIN"
    breadcrumb={currentItem?.label ?? ''}
    initials={initials}
    mobileOpen={mobileOpen}
    onMobileOpenChange={setMobileOpen}
    topbarExtras={currentKey && currentKey !== 'documentation' && docSummaryMap[currentKey]
      ? <HelpButton summary={docSummaryMap[currentKey]} docId={currentKey} onNavigateDoc={navigateDoc} />
      : null}
    sidebarContent={<>
      <nav className="admin-nav-scroll">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.key === currentKey;
          return <button key={item.key} className={active ? 'nav-item active' : 'nav-item'} onClick={() => navigateToSection(item.key)}><Icon size={19} /><span>{item.label}</span>{active && <span className="active-dot" />}</button>;
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="profile-mini"><div className="avatar">{initials}</div><div><strong>{profile.full_name}</strong><span>{t.admin}</span></div></div>
        <button className="signout-button" onClick={signOut}>{t.signOut}</button>
      </div>
    </>}
  >
    <Outlet context={contextValue} />
  </AppFrame>;
}

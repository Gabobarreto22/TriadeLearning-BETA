import { PersonnelModule } from '@/components/admin/PersonnelModule';
import { CoursesModule } from '@/components/admin/CoursesModule';
import { DashboardModule } from '@/components/admin/DashboardModule';
import { CertificationsModule } from '@/components/admin/CertificationsModule';
import { FeedbackModule } from '@/components/admin/FeedbackModule';
import { NotificationsModule } from '@/components/admin/NotificationsModule';
import { ReportsModule } from '@/components/admin/ReportsModule';
import { SettingsModule } from '@/components/admin/SettingsModule';
import { AuditModule } from '@/components/admin/AuditModule';
import { DocumentationModule } from '@/components/docs/DocumentationModule';
import { docSections } from '@/lib/docs';
import { adminStringsES } from '@/components/admin/strings';
import { useAdminContext } from '@/components/admin/AdminLayout';

const t = adminStringsES;

export function AdminDashboardPage() {
  const { data, navigateToSection } = useAdminContext();
  return <DashboardModule t={t} data={data} onNavigate={navigateToSection} />;
}

export function AdminPersonnelPage() {
  const { data, refreshAll } = useAdminContext();
  return <PersonnelModule t={t} team={data.team} jobRoles={data.jobRoles} departments={data.departments} courses={data.courses} onRefresh={refreshAll} />;
}

export function AdminCoursesPage() {
  const { data, profile, refreshAll, registerCourseEditorLeaveGuard } = useAdminContext();
  return <CoursesModule t={t} courses={data.courses} jobRoles={data.jobRoles} departments={data.departments} profile={profile} onRefresh={refreshAll} onLeaveGuardChange={registerCourseEditorLeaveGuard} />;
}

export function AdminCertificationsPage() {
  const { data } = useAdminContext();
  return <CertificationsModule t={t} data={data} />;
}

export function AdminFeedbackPage() {
  const { data } = useAdminContext();
  return <FeedbackModule t={t} data={data} />;
}

export function AdminNotificationsPage() {
  const { data, refreshAll } = useAdminContext();
  return <NotificationsModule t={t} data={data} onRefresh={refreshAll} />;
}

export function AdminReportsPage() {
  const { data } = useAdminContext();
  return <ReportsModule t={t} data={data} />;
}

export function AdminSettingsPage() {
  const { data, refreshAll } = useAdminContext();
  return <SettingsModule t={t} data={data} onRefresh={refreshAll} />;
}

export function AdminAuditPage() {
  const { data } = useAdminContext();
  return <AuditModule t={t} data={data} />;
}

export function AdminDocumentationPage() {
  return <DocumentationModule sections={docSections} />;
}

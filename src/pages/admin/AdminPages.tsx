import { PersonnelModule } from '@/components/admin/PersonnelModule';
import { CoursesModule } from '@/components/admin/CoursesModule';
import { DashboardModule } from '@/components/admin/DashboardModule';
import { CertificationsModule } from '@/components/admin/CertificationsModule';
import { FeedbackModule } from '@/components/admin/FeedbackModule';
import { NotificationsModule } from '@/components/admin/NotificationsModule';
import { ReportsModule } from '@/components/admin/ReportsModule';
import { AuditModule } from '@/components/admin/AuditModule';
import { DocumentationModule } from '@/components/docs/DocumentationModule';
import { docSectionsByLanguage, docsLabels } from '@/lib/docs';
import { adminStringsByLanguage } from '@/components/admin/strings';
import { useAdminContext } from '@/components/admin/AdminLayout';
import { usePreferences } from '@/lib/preferences';

export function AdminDashboardPage() {
  const { language } = usePreferences();
  const { data, navigateToSection } = useAdminContext();
  return <DashboardModule t={adminStringsByLanguage[language]} data={data} onNavigate={navigateToSection} />;
}

export function AdminPersonnelPage() {
  const { language } = usePreferences();
  const { data, refreshAll } = useAdminContext();
  return <PersonnelModule t={adminStringsByLanguage[language]} team={data.team} jobRoles={data.jobRoles} departments={data.departments} courses={data.courses} onRefresh={refreshAll} />;
}

export function AdminCoursesPage() {
  const { language } = usePreferences();
  const { data, profile, refreshAll, registerCourseEditorLeaveGuard } = useAdminContext();
  return <CoursesModule t={adminStringsByLanguage[language]} courses={data.courses} jobRoles={data.jobRoles} departments={data.departments} profile={profile} onRefresh={refreshAll} onLeaveGuardChange={registerCourseEditorLeaveGuard} />;
}

export function AdminCertificationsPage() {
  const { language } = usePreferences();
  const { data } = useAdminContext();
  return <CertificationsModule t={adminStringsByLanguage[language]} data={data} />;
}

export function AdminFeedbackPage() {
  const { language } = usePreferences();
  const { data } = useAdminContext();
  return <FeedbackModule t={adminStringsByLanguage[language]} data={data} />;
}

export function AdminNotificationsPage() {
  const { language } = usePreferences();
  const { data, refreshAll } = useAdminContext();
  return <NotificationsModule t={adminStringsByLanguage[language]} data={data} onRefresh={refreshAll} />;
}

export function AdminReportsPage() {
  const { language } = usePreferences();
  const { data } = useAdminContext();
  return <ReportsModule t={adminStringsByLanguage[language]} data={data} />;
}

export function AdminAuditPage() {
  const { language } = usePreferences();
  const { data } = useAdminContext();
  return <AuditModule t={adminStringsByLanguage[language]} data={data} />;
}

export function AdminDocumentationPage() {
  const { language } = usePreferences();
  return <DocumentationModule sections={docSectionsByLanguage[language]} labels={docsLabels[language]} />;
}

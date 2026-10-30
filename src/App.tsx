import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { EmployeeLayout } from '@/components/employee/EmployeeLayout';
import { LoadingScreen } from '@/components/layout/AppFrame';
import { useAuth } from '@/lib/auth';
import { adminPaths, employeePaths } from '@/lib/routes';
import { AuthPage } from '@/pages/AuthPage';
import {
  AdminAuditPage, AdminCertificationsPage, AdminCoursesPage, AdminDashboardPage, AdminDocumentationPage,
  AdminFeedbackPage, AdminNotificationsPage, AdminPersonnelPage, AdminReportsPage, AdminSettingsPage,
} from '@/pages/admin/AdminPages';
import { CalendarPage } from '@/pages/employee/CalendarPage';
import { CatalogPage } from '@/pages/employee/CatalogPage';
import { CertificatesPage } from '@/pages/employee/CertificatesPage';
import { CoursePlayerPage } from '@/pages/employee/CoursePlayerPage';
import { DashboardPage } from '@/pages/employee/DashboardPage';
import { ExamPage } from '@/pages/employee/ExamPage';
import { GamificationPage, NotificationsPage, ProfilePage } from '@/pages/employee/AccountPages';

export default function App() {
  const { profile, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!profile) return <AuthPage />;

  if (profile.role === 'admin') {
    return <Routes>
      <Route element={<AdminLayout profile={profile} />}>
        <Route index element={<Navigate to={adminPaths.dashboard} replace />} />
        <Route path={adminPaths.dashboard} element={<AdminDashboardPage />} />
        <Route path={adminPaths.personnel} element={<AdminPersonnelPage />} />
        <Route path={adminPaths.courses} element={<AdminCoursesPage />} />
        <Route path={adminPaths.certifications} element={<AdminCertificationsPage />} />
        <Route path={adminPaths.feedback} element={<AdminFeedbackPage />} />
        <Route path={adminPaths.notifications} element={<AdminNotificationsPage />} />
        <Route path={adminPaths.reports} element={<AdminReportsPage />} />
        <Route path={adminPaths.settings} element={<AdminSettingsPage />} />
        <Route path={adminPaths.audit} element={<AdminAuditPage />} />
        <Route path={adminPaths.documentation} element={<AdminDocumentationPage />} />
        <Route path="*" element={<Navigate to={adminPaths.dashboard} replace />} />
      </Route>
    </Routes>;
  }

  return <Routes>
    <Route element={<EmployeeLayout profile={profile} />}>
      <Route index element={<Navigate to={employeePaths.dashboard} replace />} />
      <Route path={employeePaths.dashboard} element={<DashboardPage />} />
      <Route path={employeePaths.catalog} element={<CatalogPage />} />
      <Route path={employeePaths.calendar} element={<CalendarPage />} />
      <Route path={employeePaths.certificates} element={<CertificatesPage />} />
      <Route path={employeePaths.notifications} element={<NotificationsPage />} />
      <Route path={employeePaths.gamification} element={<GamificationPage />} />
      <Route path={employeePaths.profile} element={<ProfilePage />} />
      <Route path="/curso/:courseId/reproducir" element={<CoursePlayerPage />} />
      <Route path="/curso/:courseId/evaluacion" element={<ExamPage />} />
      <Route path="*" element={<Navigate to={employeePaths.dashboard} replace />} />
    </Route>
  </Routes>;
}

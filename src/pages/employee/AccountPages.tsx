import { EmployeeGamification, EmployeeNotifications, EmployeeProfile } from '@/components/employee/EmployeeModules';
import { buildEmployeeStrings } from '@/components/employee/employeeStrings';
import { useEmployeeContext } from '@/components/employee/EmployeeLayout';
import { usePreferences } from '@/lib/preferences';

export function NotificationsPage() {
  const { t } = usePreferences();
  const { profile } = useEmployeeContext();
  return <EmployeeNotifications userId={profile.id} t={buildEmployeeStrings(t)} />;
}

export function GamificationPage() {
  const { t } = usePreferences();
  const { profile, completedCourses, inProgressCourses } = useEmployeeContext();
  return <EmployeeGamification userId={profile.id} t={buildEmployeeStrings(t)} completedCount={completedCourses.length} inProgressCount={inProgressCourses.length} />;
}

export function ProfilePage() {
  const { t } = usePreferences();
  const { profile } = useEmployeeContext();
  return <EmployeeProfile profile={profile} t={buildEmployeeStrings(t)} />;
}

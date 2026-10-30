import { useNavigate } from 'react-router-dom';
import { Dashboard } from '@/components/employee/EmployeeDashboard';
import { useEmployeeContext } from '@/components/employee/EmployeeLayout';
import { usePreferences } from '@/lib/preferences';

export function DashboardPage() {
  const { t } = usePreferences();
  const navigate = useNavigate();
  const { profile, courses, getCourseState, setSelectedCourse } = useEmployeeContext();
  return <Dashboard t={t} navigate={navigate} courses={courses} getCourseState={getCourseState} onSelect={setSelectedCourse} profile={profile} />;
}

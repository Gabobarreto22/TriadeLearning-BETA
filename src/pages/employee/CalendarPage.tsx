import { CalendarView } from '@/components/employee/CalendarView';
import { useEmployeeContext } from '@/components/employee/EmployeeLayout';
import { usePreferences } from '@/lib/preferences';

export function CalendarPage() {
  const { t, language } = usePreferences();
  const { courses, setSelectedCourse } = useEmployeeContext();
  return <CalendarView t={t} language={language} courses={courses} onSelect={setSelectedCourse} />;
}

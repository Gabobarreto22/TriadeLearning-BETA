import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CoursePlayer } from '@/components/employee/CoursePlayer';
import { useCourseEntry, useEmployeeContext } from '@/components/employee/EmployeeLayout';
import { usePreferences } from '@/lib/preferences';
import { employeePaths } from '@/lib/routes';

export function CoursePlayerPage() {
  const { t } = usePreferences();
  const { courseId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { courses, getCourseState, requestExit, openExam, handleMarkComplete } = useEmployeeContext();
  const course = courses.find((c) => c.id === courseId);
  const entryStatus = useCourseEntry(course);

  if (!course) return <div className="page animate-in"><p className="muted" style={{ padding: 40 }}>{t.noCourses}</p></div>;
  if (entryStatus === 'loading') return <div className="page animate-in"><p className="muted" style={{ padding: 40 }}>{t.loading}</p></div>;
  if (entryStatus === 'error') return <div className="page animate-in"><p className="muted" style={{ padding: 40 }}><button className="outline-button" onClick={() => navigate(employeePaths.catalog)}>{t.backToCatalog}</button></p></div>;

  return <CoursePlayer
    t={t}
    course={course}
    initialModuleId={searchParams.get('modulo') ?? undefined}
    courseState={getCourseState(course.id)}
    onBack={() => requestExit(() => navigate(employeePaths.catalog))}
    onExam={openExam}
    onMarkComplete={handleMarkComplete}
  />;
}

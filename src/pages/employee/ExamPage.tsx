import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Exam } from '@/components/employee/Exam';
import { useCourseEntry, useEmployeeContext } from '@/components/employee/EmployeeLayout';
import type { ExamType } from '@/components/employee/employeeTypes';
import { usePreferences } from '@/lib/preferences';
import { employeePaths } from '@/lib/routes';

export function ExamPage() {
  const { t } = usePreferences();
  const { courseId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { courses, getCourseState, requestExit, openPlayer, goToNextModule, handleExamResult, openFeedback } = useEmployeeContext();
  const course = courses.find((c) => c.id === courseId);
  const entryStatus = useCourseEntry(course);

  if (!course) return <div className="page animate-in"><p className="muted" style={{ padding: 40 }}>{t.noCourses}</p></div>;
  if (entryStatus === 'loading') return <div className="page animate-in"><p className="muted" style={{ padding: 40 }}>{t.loading}</p></div>;
  if (entryStatus === 'error') return <div className="page animate-in"><p className="muted" style={{ padding: 40 }}><button className="outline-button" onClick={() => navigate(employeePaths.catalog)}>{t.backToCatalog}</button></p></div>;

  const rawType = searchParams.get('tipo');
  const examType: ExamType = rawType === 'course' || rawType === 'module' ? rawType : 'direct';
  const moduleId = searchParams.get('modulo') ?? undefined;

  return <Exam
    t={t}
    course={course}
    examType={examType}
    moduleId={moduleId}
    courseState={getCourseState(course.id)}
    onBack={() => requestExit(() => navigate(employeePaths.catalog))}
    onBackToCourse={() => void openPlayer(course, moduleId)}
    onResult={handleExamResult}
    onPass={() => openFeedback(course)}
    onNextModule={goToNextModule}
  />;
}

import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CalendarView } from '@/components/employee/CalendarView';
import { Certificates } from '@/components/employee/CertificatesView';
import { Catalog } from '@/components/employee/CourseCatalog';
import { CoursePlayer } from '@/components/employee/CoursePlayer';
import { Dashboard } from '@/components/employee/EmployeeDashboard';
import { EmployeeGamification, EmployeeNotifications, EmployeeProfile } from '@/components/employee/EmployeeModules';
import { useCourseEntry, useEmployeeContext } from '@/components/employee/EmployeeLayout';
import { Exam } from '@/components/employee/Exam';
import { buildEmployeeStrings } from '@/components/employee/employeeStrings';
import type { ExamType } from '@/components/employee/employeeTypes';
import { usePreferences } from '@/lib/preferences';
import { employeePaths } from '@/lib/routes';

export function DashboardPage() {
  const { t } = usePreferences();
  const navigate = useNavigate();
  const { profile, courses, getCourseState, setSelectedCourse } = useEmployeeContext();
  return <Dashboard t={t} navigate={navigate} courses={courses} getCourseState={getCourseState} onSelect={setSelectedCourse} profile={profile} />;
}

export function CatalogPage() {
  const { t } = usePreferences();
  const { profile, courses, getCourseState, setSelectedCourse } = useEmployeeContext();
  const [filter, setFilter] = useState(t.all);
  const [query, setQuery] = useState('');
  return <Catalog t={t} filter={filter} setFilter={setFilter} query={query} setQuery={setQuery} courses={courses} getCourseState={getCourseState} onSelect={setSelectedCourse} jobRole={profile.job_role} />;
}

export function CalendarPage() {
  const { t, language } = usePreferences();
  const { courses, setSelectedCourse } = useEmployeeContext();
  return <CalendarView t={t} language={language} courses={courses} onSelect={setSelectedCourse} />;
}

export function CertificatesPage() {
  const { t } = usePreferences();
  const { completedCourses, setPreviewCert } = useEmployeeContext();
  return <Certificates t={t} completedCourses={completedCourses} onPreview={setPreviewCert} />;
}

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

export function CoursePlayerPage() {
  const { t } = usePreferences();
  const { courseId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { courses, getCourseState, requestExit, openExam, handleMarkComplete } = useEmployeeContext();
  const course = courses.find((item) => item.id === courseId);
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

export function ExamPage() {
  const { t } = usePreferences();
  const { courseId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { courses, getCourseState, requestExit, openPlayer, goToNextModule, handleExamResult, openFeedback } = useEmployeeContext();
  const course = courses.find((item) => item.id === courseId);
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

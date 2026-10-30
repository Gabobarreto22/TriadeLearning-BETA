import { useEffect, useState, type ReactNode } from 'react';
import { Outlet, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { Award, Bell, BookOpen, CalendarDays, LayoutDashboard, User } from 'lucide-react';
import { CourseFeedbackModal } from '@/components/employee/EmployeeModules';
import { buildEmployeeStrings } from '@/components/employee/employeeStrings';
import { CertificatePreview, CourseModal, ExitWarningModal } from '@/components/employee/LearningModals';
import type { CertificatePreviewData, CourseState, EmployeeContextValue, ExamType } from '@/components/employee/employeeTypes';
import { AppFrame, LoadingScreen } from '@/components/layout/AppFrame';
import { useAuth } from '@/lib/auth';
import { ensureUserCourseRequirement, fetchCoursesForRole, fetchExamResults, fetchModuleProgress, markModuleComplete, saveCourseFeedback, saveExamResult } from '@/lib/data';
import { usePreferences } from '@/lib/preferences';
import { coursePath, employeePaths } from '@/lib/routes';
import type { CourseWithRelations, Profile } from '@/lib/supabase';
import { useToast } from '@/lib/toast';

export function useEmployeeContext() {
  return useOutletContext<EmployeeContextValue>();
}

export function useCourseEntry(course: CourseWithRelations | undefined) {
  const { ensureRequirement } = useEmployeeContext();
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const courseId = course?.id;

  useEffect(() => {
    if (!course) return;
    let cancelled = false;
    setStatus('loading');
    ensureRequirement(course).then((ok) => {
      if (!cancelled) setStatus(ok ? 'ready' : 'error');
    });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  return status;
}

function NavItem({ icon, label, active, onClick }: { icon: ReactNode; label: string; active: boolean; onClick: () => void }) {
  return <button className={active ? 'nav-item active' : 'nav-item'} onClick={onClick}>{icon}<span>{label}</span>{active && <span className="active-dot" />}</button>;
}

export function EmployeeLayout({ profile }: { profile: Profile }) {
  const { t } = usePreferences();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseWithRelations | null>(null);
  const [previewCert, setPreviewCert] = useState<CertificatePreviewData | null>(null);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [feedbackCourse, setFeedbackCourse] = useState<CourseWithRelations | null>(null);
  const [pendingBack, setPendingBack] = useState<(() => void) | null>(null);
  const [courses, setCourses] = useState<CourseWithRelations[]>([]);
  const [progressMap, setProgressMap] = useState<Map<string, boolean>>(new Map());
  const [passedModuleExams, setPassedModuleExams] = useState<Record<string, Record<string, boolean>>>({});
  const [examResults, setExamResults] = useState<{ course_id: string; exam_type: ExamType; passed: boolean; direct_failed: boolean }[]>([]);
  const [courseReqMap, setCourseReqMap] = useState<Record<string, string>>({});
  const [dataLoading, setDataLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await fetchCoursesForRole(profile.job_role_id ?? '');
      setCourses(data);
      const allModuleIds = data.flatMap((c) => c.modules.map((m) => m.id));
      const pMap = await fetchModuleProgress(profile.id, allModuleIds);
      setProgressMap(pMap);
      const courseIds = data.map((c) => c.id);
      const results = await fetchExamResults(profile.id, courseIds);
      setExamResults(results.map((r) => ({ course_id: r.course_id, exam_type: r.exam_type, passed: r.passed, direct_failed: r.direct_failed })));
      setDataLoading(false);
    })();
  }, [profile.id, profile.job_role_id]);

  const isFullscreen = pathname.startsWith('/curso/');
  const go = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const getCourseState = (courseId: string): CourseState => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return { completedModules: [] as boolean[], directFailed: false, directPassed: false, courseExamPassed: false };
    const completedModules = course.modules.map((m) => {
      const moduleQuestions = course.exam_questions.filter((q) => q.module_id === m.id);
      const moduleExamPassed = passedModuleExams[courseId]?.[m.id] ?? false;
      return (progressMap.get(m.id) ?? false) || (moduleQuestions.length > 0 ? moduleExamPassed : false);
    });
    const directResults = examResults.filter((r) => r.course_id === courseId && r.exam_type === 'direct');
    const courseResults = examResults.filter((r) => r.course_id === courseId && r.exam_type === 'course');
    return {
      completedModules,
      directFailed: directResults.some((r) => r.direct_failed),
      directPassed: directResults.some((r) => r.passed),
      courseExamPassed: courseResults.some((r) => r.passed),
    };
  };

  const handleMarkComplete = async (moduleId: string) => {
    if (saving) return;
    setSaving(true);
    const { error } = await markModuleComplete(profile.id, moduleId);
    setSaving(false);
    if (error) { toast(error, 'error'); return; }
    toast('Módulo completado', 'success');
    setProgressMap((prev) => { const n = new Map(prev); n.set(moduleId, true); return n; });
  };

  const handleExamResult = async (courseId: string, type: ExamType, score: number, passed: boolean, directFailed: boolean, totalQuestions: number, correctAnswers: number, answers: number[], moduleId?: string) => {
    if (saving) return;
    if (type === 'module' && moduleId) {
      setSaving(true);
      const reqId = courseReqMap[courseId] ?? null;
      const { error: resultError } = await saveExamResult(profile.id, courseId, type, score, passed, false, reqId ?? undefined, totalQuestions, correctAnswers, answers, moduleId);
      if (resultError) {
        setSaving(false);
        toast(resultError, 'error');
        return;
      }
      if (passed) {
        const { error: progressError } = await markModuleComplete(profile.id, moduleId);
        setSaving(false);
        if (progressError) {
          toast(progressError, 'error');
          return;
        }
        setProgressMap((prev) => {
          const next = new Map(prev);
          next.set(moduleId, true);
          return next;
        });
      } else {
        setSaving(false);
      }
      setPassedModuleExams((prev) => ({
        ...prev,
        [courseId]: {
          ...(prev[courseId] ?? {}),
          [moduleId]: passed,
        },
      }));
      if (passed) {
        toast('Examen del módulo aprobado', 'success');
      } else {
        toast('Debes aprobar el examen del módulo para continuar', 'error');
      }
      return;
    }
    setSaving(true);
    const reqId = courseReqMap[courseId] ?? null;
    const { error } = await saveExamResult(profile.id, courseId, type, score, passed, directFailed, reqId ?? undefined, totalQuestions, correctAnswers, answers);
    setSaving(false);
    if (error) { toast(error, 'error'); return; }
    toast(passed ? 'Evaluación aprobada' : 'Evaluación registrada', 'success');
    setExamResults((prev) => [...prev, { course_id: courseId, exam_type: type, passed, direct_failed: directFailed }]);
  };

  const handleFeedbackSave = async (rating: number, text: string, wouldRecommend: boolean | null, difficulty: string | null): Promise<{ error: string | null }> => {
    if (!feedbackCourse) return { error: 'No hay curso seleccionado' };
    let reqId = courseReqMap[feedbackCourse.id];
    if (!reqId) {
      const { req, error: reqErr } = await ensureUserCourseRequirement(profile.id, feedbackCourse.id, profile.job_role_id ?? '');
      if (reqErr || !req) {
        toast('No se pudo registrar el progreso del curso', 'error');
        return { error: 'No se pudo registrar el progreso del curso. Intenta abrir el curso primero.' };
      }
      reqId = req.id;
      setCourseReqMap((prev) => ({ ...prev, [feedbackCourse.id]: req.id }));
    }
    const { error } = await saveCourseFeedback(reqId, rating, text, wouldRecommend, difficulty);
    if (error) {
      toast('No se pudo guardar tu calificación', 'error');
      return { error: 'No se pudo guardar tu calificación. Intenta nuevamente.' };
    }
    toast('Calificación guardada', 'success');
    return { error: null };
  };

  const ensureRequirement = async (course: CourseWithRelations) => {
    if (courseReqMap[course.id]) return true;
    const { req, error } = await ensureUserCourseRequirement(profile.id, course.id, profile.job_role_id ?? '');
    if (error || !req) { toast('No se pudo abrir el curso', 'error'); return false; }
    setCourseReqMap((prev) => ({ ...prev, [course.id]: req.id }));
    return true;
  };

  const openPlayer = async (course: CourseWithRelations, moduleId?: string) => {
    if (!(await ensureRequirement(course))) return;
    setSelectedCourse(null);
    setMobileOpen(false);
    const search = moduleId ? `?${new URLSearchParams({ modulo: moduleId })}` : '';
    navigate(`${coursePath(course.id, 'reproducir')}${search}`);
  };

  const openExam = async (course: CourseWithRelations, type: ExamType, moduleId?: string) => {
    if (!(await ensureRequirement(course))) return;
    setSelectedCourse(null);
    setMobileOpen(false);
    const params = new URLSearchParams({ tipo: type });
    if (moduleId) params.set('modulo', moduleId);
    navigate(`${coursePath(course.id, 'evaluacion')}?${params}`);
  };

  const goToNextModule = (course: CourseWithRelations, currentModuleId?: string) => {
    const moduleIndex = currentModuleId ? course.modules.findIndex((m) => m.id === currentModuleId) : -1;
    const nextModule = moduleIndex >= 0 ? course.modules[moduleIndex + 1] : undefined;
    if (nextModule) {
      void openPlayer(course, nextModule.id);
      return;
    }
    navigate(coursePath(course.id, 'reproducir'));
  };

  const requestExit = (onConfirm: () => void) => { setPendingBack(() => onConfirm); setShowExitWarning(true); };
  const confirmExit = () => { setShowExitWarning(false); if (pendingBack) pendingBack(); setPendingBack(null); };

  const sectionLabels: Record<string, string> = {
    [employeePaths.dashboard]: t.dashboard,
    [employeePaths.catalog]: t.catalog,
    [employeePaths.calendar]: t.calendar,
    [employeePaths.certificates]: t.certificates,
    [employeePaths.notifications]: t.notifications,
    [employeePaths.gamification]: t.gamification,
    [employeePaths.profile]: t.myProfile,
  };
  const breadcrumb = pathname.startsWith('/curso/')
    ? (pathname.endsWith('/evaluacion') ? t.exam : t.player)
    : sectionLabels[pathname] ?? '';

  const completedCourses = courses.filter((c) => getCourseState(c.id).courseExamPassed);
  const inProgressCourses = courses.filter((c) => { const s = getCourseState(c.id); return s.completedModules.some(Boolean) && !s.courseExamPassed; });

  if (dataLoading) return <LoadingScreen />;

  const contextValue: EmployeeContextValue = {
    profile,
    courses,
    completedCourses,
    inProgressCourses,
    getCourseState,
    setSelectedCourse,
    setPreviewCert,
    ensureRequirement,
    openPlayer,
    openExam,
    goToNextModule,
    openFeedback: setFeedbackCourse,
    requestExit,
    handleMarkComplete,
    handleExamResult,
  };

  const navItems = [
    { path: employeePaths.dashboard, label: t.dashboard, icon: <LayoutDashboard size={19} /> },
    { path: employeePaths.catalog, label: t.catalog, icon: <BookOpen size={19} /> },
    { path: employeePaths.calendar, label: t.calendar, icon: <CalendarDays size={19} /> },
    { path: employeePaths.certificates, label: t.certificates, icon: <Award size={19} /> },
  ];
  const accountItems = [
    { path: employeePaths.notifications, label: t.notifications, icon: <Bell size={19} /> },
    { path: employeePaths.profile, label: t.myProfile, icon: <User size={19} /> },
  ];

  return <AppFrame
    workspaceLabel="TRIADE LEARNING"
    breadcrumb={breadcrumb}
    initials={profile.full_name.slice(0, 2).toUpperCase()}
    fullscreen={isFullscreen}
    mobileOpen={mobileOpen}
    onMobileOpenChange={setMobileOpen}
    sidebarContent={<>
      <nav>
        {navItems.map((item) => <NavItem key={item.path} icon={item.icon} label={item.label} active={pathname === item.path} onClick={() => go(item.path)} />)}
        <div className="nav-divider" />
        {accountItems.map((item) => <NavItem key={item.path} icon={item.icon} label={item.label} active={pathname === item.path} onClick={() => go(item.path)} />)}
      </nav>
      <div className="sidebar-bottom">
        <div className="profile-mini"><div className="avatar">{profile.full_name.slice(0, 2).toUpperCase()}</div><div><strong>{profile.full_name}</strong><span>{profile.job_role}</span></div></div>
        <button className="signout-button" onClick={signOut}>{t.signOut}</button>
      </div>
    </>}
  >
    <Outlet context={contextValue} />
    {selectedCourse && <CourseModal course={selectedCourse} t={t} courseState={getCourseState(selectedCourse.id)} onClose={() => setSelectedCourse(null)} onOpenPlayer={openPlayer} onOpenExam={openExam} />}
    {previewCert && <CertificatePreview t={t} cert={previewCert} profileName={profile.full_name} onClose={() => setPreviewCert(null)} />}
    {showExitWarning && <ExitWarningModal t={t} onConfirm={confirmExit} onCancel={() => setShowExitWarning(false)} />}
    {feedbackCourse && <CourseFeedbackModal courseTitle={feedbackCourse.title} t={buildEmployeeStrings(t)} onSave={handleFeedbackSave} onClose={() => setFeedbackCourse(null)} />}
  </AppFrame>;
}

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, Award, BarChart3, Bell, BookOpen, CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Download, FileText, Image as ImageIcon, LayoutDashboard, LockKeyhole, Menu, Moon, Pause, Play, Plus, RotateCcw, Search, Settings, ShieldCheck, Star, Sun, Trash2, Users, Video, X, Zap, History,
} from 'lucide-react';
import { useAuth } from './lib/auth';
import { supabase, type Profile, type CourseWithRelations, type JobRole } from './lib/supabase';
import {
  fetchCoursesForRole, fetchAllCourses, fetchModuleProgress, fetchExamResults,
  markModuleComplete, saveExamResult,
  fetchAllProfiles, fetchJobRoles, fetchDepartments,
  fetchUserCourseRequirements, fetchAllModuleProgress, fetchAllExamAttempts,
  fetchAllCertificates, fetchRoleCertifications, fetchAllNotifications,
  fetchAllFeedback, fetchBadges, fetchUserBadges, fetchSystemSettings, fetchAuditLogs,
} from './lib/data';
import { getIcon, availableIcons, availableAccents } from './lib/icons';
import { PersonnelModule } from '@/components/admin/PersonnelModule';
import { CoursesModule } from '@/components/admin/CoursesModule';
import { DashboardModule, CertificationsModule, AutoAssignModule, FeedbackModule, GamificationModule, NotificationsModule, ReportsModule, SettingsModule, AuditModule } from '@/components/admin/IndependentModules';
import { adminStringsES } from '@/components/admin/strings';
import type { AdminData, AdminView } from '@/components/admin/types';

type Language = 'ES' | 'EN';
type View = 'dashboard' | 'catalog' | 'certificates' | 'calendar' | 'player' | 'exam';
type AdminTab = 'dashboard' | 'personnel' | 'courses' | 'certifications' | 'auto-assign' | 'feedback' | 'gamification' | 'notifications' | 'reports' | 'settings' | 'audit';
type ExamType = 'direct' | 'course';

const copy = {
  ES: {
    signIn: 'Iniciar sesión', signUp: 'Crear cuenta', email: 'Correo electrónico', password: 'Contraseña', fullName: 'Nombre completo', jobRole: 'Cargo', role: 'Rol', employee: 'Empleado', admin: 'Administrador', welcome: 'Buenos días', subtitle: 'Aquí tienes un resumen de tu aprendizaje.', dashboard: 'Panel principal', catalog: 'Catálogo de cursos', certificates: 'Mis certificados', adminPanel: 'Administración', calendar: 'Calendario', assigned: 'Cursos asignados', progress: 'Progreso total', certificatesStat: 'Certificados', hours: 'Horas de aprendizaje', continue: 'Continúa aprendiendo', viewAll: 'Ver todos', deadline: 'Próximas fechas', seeCertificate: 'Ver certificado', catalogIntro: 'Formación seleccionada para tu cargo', search: 'Buscar cursos', all: 'Todos', completed: 'Completados', inProgress: 'En progreso', notStarted: 'No iniciados', roleTag: 'Técnico de Mantenimiento', start: 'Comenzar curso', resume: 'Continuar curso', empty: 'No hay cursos con este filtro.', adminIntro: 'Gestiona el aprendizaje de tu organización.', team: 'Equipo activo', completion: 'Completación promedio', roles: 'Cargos con acceso', player: 'Reproductor del curso', exam: 'Evaluación', question: 'Pregunta', of: 'de', nextQ: 'Siguiente', prevQ: 'Anterior', passed: '¡Felicitaciones! Has aprobado.', failed: 'No has alcanzado el 90%. Puedes volver a intentarlo.', retry: 'Reintentar', backToCatalog: 'Volver al catálogo', passThreshold: 'Mínimo para aprobar: 90%', correctAnswers: 'Respuestas correctas', finishExam: 'Finalizar y ver resultado', certificate: 'Certificado de finalización', awardedTo: 'Otorgado a', courseLabel: 'Por completar satisfactoriamente', certId: 'Identificación única', issueDate: 'Fecha de emisión', downloadCert: 'Descargar', printCert: 'Imprimir', upcomingCourses: 'Cursos próximos', activeCourses: 'Cursos activos', calendarIntro: 'Cursos y evaluaciones programados', moduleProgress: 'Módulos completados', takeExam: 'Realizar evaluación', modules: 'Módulos', videoModule: 'Video', textModule: 'Lectura', imageModule: 'Infografía', directExam: 'Prueba directa', courseExam: 'Prueba de aprobación', directExamDesc: 'Evalúa tu conocimiento previo. Si repruebas, deberás completar el curso obligatoriamente.', courseExamDesc: 'Evaluación final del curso. Se aprueba con 90%.', takeDirectExam: 'Realizar prueba directa', takeCourseExam: 'Realizar prueba de aprobación', examLocked: 'Bloqueada', modulesRequired: 'Completa todos los módulos para desbloquear', directFailed: 'Has reprobado la prueba directa', directFailedDesc: 'Ahora debes completar todos los módulos del curso obligatoriamente. La prueba directa queda bloqueada.', courseExamReadyDesc: 'Has completado todos los módulos. Ya puedes realizar la evaluación final.', moduleComplete: 'Módulo completado', goToExam: 'Ir a la evaluación', goToCourse: 'Ir al curso', exitCourse: 'Salir del curso', exitWarningTitle: '¿Seguro que deseas salir?', exitWarningDesc: 'Si abandonas el curso ahora, deberás repetir el módulo actual desde el principio. Tu progreso no se guardará para este módulo.', exitWarningStay: 'Quedarme y continuar', exitWarningLeave: 'Salir de todos modos', signOut: 'Cerrar sesión', loading: 'Cargando...', noCourses: 'Aún no tienes cursos asignados para tu cargo.', newCourse: 'Nuevo curso', editCourse: 'Editar curso', courseEditor: 'Editor de curso', courseTitle: 'Título del curso', courseDescription: 'Descripción', courseCategory: 'Categoría', courseDuration: 'Duración', courseImage: 'URL de imagen del curso', courseIcon: 'Ícono', courseAccent: 'Color de acento', moduleTitle: 'Título del módulo', moduleType: 'Tipo de módulo', moduleDuration: 'Duración del módulo', moduleBody: 'Contenido del módulo', moduleImage: 'URL de imagen (para módulos tipo imagen)', moduleVideo: 'URL de video (para módulos tipo video)', addModule: 'Agregar módulo', addQuestion: 'Agregar pregunta', questionText: 'Pregunta', options: 'Opciones (una por línea)', correctOption: 'Índice de respuesta correcta (0-based)', assignToRole: 'Asignar a cargo', assignDeadline: 'Fecha límite (opcional)', addAssignment: 'Asignar a otro cargo', save: 'Guardar curso', cancel: 'Cancelar', delete: 'Eliminar', manageCourses: 'Gestionar cursos', manageCourseAction: 'Gestionar curso', manageTeam: 'Equipo', manageAssignments: 'Asignaciones', teamMembers: 'Miembros del equipo', name: 'Nombre', jobRoleCol: 'Cargo', roleCol: 'Rol', noTeam: 'No hay miembros registrados.', assignmentsTitle: 'Asignaciones de cursos', courseCol: 'Curso', assignedRole: 'Cargo asignado', deadlineCol: 'Fecha límite', noAssignments: 'No hay asignaciones creadas.', deleteConfirm: '¿Seguro que deseas eliminar este curso? Esta acción no se puede deshacer.', saved: 'Curso guardado correctamente', errorSaving: 'Error al guardar el curso', selectCourse: 'Selecciona un curso para ver los detalles', managePersonnel: 'Gestión de personal', manageRoles: 'Gestión de cargos', newRole: 'Nuevo cargo', editRole: 'Editar cargo', roleName: 'Nombre del cargo', roleDescription: 'Descripción', saveRole: 'Guardar cargo', newUser: 'Nuevo usuario', editUser: 'Editar usuario', createUser: 'Crear usuario', deleteUser: 'Eliminar usuario', deleteUserConfirm: '¿Seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.', deleteRoleConfirm: '¿Seguro que deseas eliminar este cargo?', noRoles: 'No hay cargos creados.', assignedCourses: 'Cursos asignados', assignCourse: 'Asignar curso', removeAssignment: 'Quitar asignación', noRoleAssignments: 'Este cargo no tiene cursos asignados.', selectRole: 'Selecciona un cargo', coursesForRole: 'Cursos para este cargo', addCourse: 'Agregar curso', personName: 'Nombre', personEmail: 'Correo electrónico', personPassword: 'Contraseña', personRole: 'Rol del usuario', saveUser: 'Guardar usuario', roleManagement: 'Gestión de cargos', personnelManagement: 'Gestión de personal', totalRoles: 'Cargos totales', totalUsers: 'Usuarios totales', backToAdmin: 'Volver al panel',
  },
  EN: {
    signIn: 'Sign in', signUp: 'Sign up', email: 'Email', password: 'Password', fullName: 'Full name', jobRole: 'Job role', role: 'Role', employee: 'Employee', admin: 'Administrator', welcome: 'Good morning', subtitle: 'Here is a summary of your learning.', dashboard: 'Dashboard', catalog: 'Course catalog', certificates: 'My certificates', adminPanel: 'Administration', calendar: 'Calendar', assigned: 'Assigned courses', progress: 'Overall progress', certificatesStat: 'Certificates', hours: 'Learning hours', continue: 'Continue learning', viewAll: 'View all', deadline: 'Upcoming dates', seeCertificate: 'View certificate', catalogIntro: 'Learning selected for your role', search: 'Search courses', all: 'All', completed: 'Completed', inProgress: 'In progress', notStarted: 'Not started', roleTag: 'Maintenance Technician', start: 'Start course', resume: 'Continue course', empty: 'No courses match this filter.', adminIntro: 'Manage learning across your organization.', team: 'Active team', completion: 'Average completion', roles: 'Roles with access', player: 'Course player', exam: 'Assessment', question: 'Question', of: 'of', nextQ: 'Next', prevQ: 'Previous', passed: 'Congratulations! You passed.', failed: 'You did not reach 90%. You can try again.', retry: 'Retry', backToCatalog: 'Back to catalog', passThreshold: 'Minimum to pass: 90%', correctAnswers: 'Correct answers', finishExam: 'Finish and see result', certificate: 'Certificate of completion', awardedTo: 'Awarded to', courseLabel: 'For successfully completing', certId: 'Unique ID', issueDate: 'Issue date', downloadCert: 'Download', printCert: 'Print', upcomingCourses: 'Upcoming courses', activeCourses: 'Active courses', calendarIntro: 'Scheduled courses and assessments', moduleProgress: 'Modules completed', takeExam: 'Take assessment', modules: 'Modules', videoModule: 'Video', textModule: 'Reading', imageModule: 'Infographic', directExam: 'Direct test', courseExam: 'Course approval test', directExamDesc: 'Assess your prior knowledge. If you fail, you must complete the course mandatorily.', courseExamDesc: 'Final course assessment. Pass with 90%.', takeDirectExam: 'Take direct test', takeCourseExam: 'Take final assessment', examLocked: 'Locked', modulesRequired: 'Complete all modules to unlock', directFailed: 'You failed the direct test', directFailedDesc: 'You must now complete all course modules mandatorily. The direct test is locked.', courseExamReadyDesc: 'You have completed all modules. You can now take the final assessment.', moduleComplete: 'Module completed', goToExam: 'Go to assessment', goToCourse: 'Go to course', exitCourse: 'Exit course', exitWarningTitle: 'Are you sure you want to leave?', exitWarningDesc: 'If you leave the course now, you will have to restart the current module from the beginning. Your progress for this module will not be saved.', exitWarningStay: 'Stay and continue', exitWarningLeave: 'Leave anyway', signOut: 'Sign out', loading: 'Loading...', noCourses: 'No courses assigned to your role yet.', newCourse: 'New course', editCourse: 'Edit course', courseEditor: 'Course editor', courseTitle: 'Course title', courseDescription: 'Description', courseCategory: 'Category', courseDuration: 'Duration', courseImage: 'Course image URL', courseIcon: 'Icon', courseAccent: 'Accent color', moduleTitle: 'Module title', moduleType: 'Module type', moduleDuration: 'Module duration', moduleBody: 'Module content', moduleImage: 'Image URL (for image-type modules)', moduleVideo: 'Video URL (for video-type modules)', addModule: 'Add module', addQuestion: 'Add question', questionText: 'Question', options: 'Options (one per line)', correctOption: 'Correct answer index (0-based)', assignToRole: 'Assign to role', assignDeadline: 'Deadline (optional)', addAssignment: 'Assign to another role', save: 'Save course', cancel: 'Cancel', delete: 'Delete', manageCourses: 'Manage courses', manageCourseAction: 'Manage course', manageTeam: 'Team', manageAssignments: 'Assignments', teamMembers: 'Team members', name: 'Name', jobRoleCol: 'Job role', roleCol: 'Role', noTeam: 'No members registered.', assignmentsTitle: 'Course assignments', courseCol: 'Course', assignedRole: 'Assigned role', deadlineCol: 'Deadline', noAssignments: 'No assignments created.', deleteConfirm: 'Are you sure you want to delete this course? This action cannot be undone.', saved: 'Course saved successfully', errorSaving: 'Error saving course', selectCourse: 'Select a course to see details', managePersonnel: 'Personnel management', manageRoles: 'Role management', newRole: 'New role', editRole: 'Edit role', roleName: 'Role name', roleDescription: 'Description', saveRole: 'Save role', newUser: 'New user', editUser: 'Edit user', createUser: 'Create user', deleteUser: 'Delete user', deleteUserConfirm: 'Are you sure you want to delete this user? This action cannot be undone.', deleteRoleConfirm: 'Are you sure you want to delete this role?', noRoles: 'No roles created.', assignedCourses: 'Assigned courses', assignCourse: 'Assign course', removeAssignment: 'Remove assignment', noRoleAssignments: 'This role has no assigned courses.', selectRole: 'Select a role', coursesForRole: 'Courses for this role', addCourse: 'Add course', personName: 'Name', personEmail: 'Email', personPassword: 'Password', personRole: 'User role', saveUser: 'Save user', roleManagement: 'Role management', personnelManagement: 'Personnel management', totalRoles: 'Total roles', totalUsers: 'Total users', backToAdmin: 'Back to dashboard',
  },
};

const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_ES = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
const DAYS_EN = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function App() {
  const { profile, loading } = useAuth();
  const [language, setLanguage] = useState<Language>('ES');
  const [dark, setDark] = useState(false);

  if (loading) return <div className="app-shell" style={{ display: 'grid', placeItems: 'center', height: '100vh' }}><p style={{ color: '#6b7280' }}>{copy[language].loading}</p></div>;
  if (!profile) return <AuthScreen language={language} setLanguage={setLanguage} dark={dark} setDark={setDark} />;
  if (profile.role === 'admin') return <AdminApp profile={profile} language={language} setLanguage={setLanguage} dark={dark} setDark={setDark} />;
  return <EmployeeApp profile={profile} language={language} setLanguage={setLanguage} dark={dark} setDark={setDark} />;
}

// ===================== AUTH SCREEN =====================
function AuthScreen({ language, setLanguage, dark, setDark }: { language: Language; setLanguage: (l: Language) => void; dark: boolean; setDark: (d: boolean) => void }) {
  const { signIn } = useAuth();
  const t = copy[language];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    const { error: err } = await signIn(email, password);
    if (err) setError(err);
    setSubmitting(false);
  };

  return <div className={dark ? 'app-shell dark' : 'app-shell'} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
    <div className="auth-card">
      <div className="auth-top-bar">
        <img src={dark ? '/LOGOTIPO_NEGATIVO.png' : '/LOGOTIPO_POSITIVO.png'} alt="TRIADE" className="auth-logo" />
        <div className="auth-top-actions">
          <button className="language-toggle" onClick={() => setLanguage(language === 'ES' ? 'EN' : 'ES')}><span className={language === 'ES' ? 'selected' : ''}>ES</span><span>/</span><span className={language === 'EN' ? 'selected' : ''}>EN</span></button>
          <button className="icon-button" onClick={() => setDark(!dark)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
        </div>
      </div>
      <h1 className="auth-title">{t.signIn}</h1>
      <p className="auth-subtitle">TRIADE LEARNING</p>
      <div className="auth-form">
        <input className="auth-input" type="email" placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="auth-input" type="password" placeholder={t.password} value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="auth-error"><AlertCircle size={16} />{error}</div>}
        <button className="primary-button auth-submit" onClick={handleSubmit} disabled={submitting}>{t.signIn}</button>
      </div>
    </div>
  </div>;
}

// ===================== EMPLOYEE APP =====================
function EmployeeApp({ profile, language, setLanguage, dark, setDark }: { profile: Profile; language: Language; setLanguage: (l: Language) => void; dark: boolean; setDark: (d: boolean) => void }) {
  const t = copy[language];
  const [view, setView] = useState<View>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState(t.all);
  const [query, setQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<CourseWithRelations | null>(null);
  const [activeCourse, setActiveCourse] = useState<CourseWithRelations | null>(null);
  const [examType, setExamType] = useState<ExamType>('direct');
  const [previewCert, setPreviewCert] = useState<{ title: string; id: string; date: string } | null>(null);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [pendingBack, setPendingBack] = useState<(() => void) | null>(null);
  const [courses, setCourses] = useState<CourseWithRelations[]>([]);
  const [progressMap, setProgressMap] = useState<Map<string, boolean>>(new Map());
  const [examResults, setExamResults] = useState<{ course_id: string; exam_type: ExamType; passed: boolean; direct_failed: boolean }[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const { signOut } = useAuth();

  useEffect(() => {
    (async () => {
      const data = await fetchCoursesForRole(profile.job_role);
      setCourses(data);
      const allModuleIds = data.flatMap((c) => c.modules.map((m) => m.id));
      const pMap = await fetchModuleProgress(profile.id, allModuleIds);
      setProgressMap(pMap);
      const courseIds = data.map((c) => c.id);
      const results = await fetchExamResults(profile.id, courseIds);
      setExamResults(results.map((r) => ({ course_id: r.course_id, exam_type: r.exam_type, passed: r.passed, direct_failed: r.direct_failed })));
      setDataLoading(false);
    })();
  }, [profile.id, profile.job_role]);

  const navigate = (v: View) => { setView(v); setMobileOpen(false); };
  const isFullscreen = view === 'player' || view === 'exam';

  const getCourseState = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return { completedModules: [] as boolean[], directFailed: false, directPassed: false, courseExamPassed: false };
    const completedModules = course.modules.map((m) => progressMap.get(m.id) ?? false);
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
    await markModuleComplete(profile.id, moduleId);
    setProgressMap((prev) => { const n = new Map(prev); n.set(moduleId, true); return n; });
  };

  const handleExamResult = async (courseId: string, type: ExamType, score: number, passed: boolean, directFailed: boolean) => {
    await saveExamResult(profile.id, courseId, type, score, passed, directFailed);
    setExamResults((prev) => [...prev, { course_id: courseId, exam_type: type, passed, direct_failed: directFailed }]);
  };

  const openPlayer = (course: CourseWithRelations) => { setActiveCourse(course); setView('player'); setMobileOpen(false); setSelectedCourse(null); };
  const openExam = (course: CourseWithRelations, type: ExamType) => { setActiveCourse(course); setExamType(type); setView('exam'); setMobileOpen(false); setSelectedCourse(null); };
  const requestExit = (onConfirm: () => void) => { setPendingBack(() => onConfirm); setShowExitWarning(true); };
  const confirmExit = () => { setShowExitWarning(false); if (pendingBack) pendingBack(); setPendingBack(null); };

  const breadcrumbLabel = () => ({ dashboard: t.dashboard, catalog: t.catalog, courses: t.catalog, certificates: t.certificates, admin: t.adminPanel, calendar: t.calendar, player: t.player, exam: t.exam, 'course-editor': '', team: '', assignments: '', personnel: '', roles: '', 'role-detail': '' })[view] ?? '';

  const completedCourses = courses.filter((c) => getCourseState(c.id).courseExamPassed);

  if (dataLoading) return <div className={dark ? 'app-shell dark' : 'app-shell'} style={{ display: 'grid', placeItems: 'center', height: '100vh' }}><p style={{ color: '#6b7280' }}>{t.loading}</p></div>;

  return <div className={dark ? 'app-shell dark' : 'app-shell'}>
    {!isFullscreen && <aside className={mobileOpen ? 'sidebar open' : 'sidebar'}>
      <div className="brand"><img src={dark ? '/LOGOTIPO_NEGATIVO.png' : '/LOGOTIPO_POSITIVO.png'} alt="TRIADE" /><button className="close-menu" onClick={() => setMobileOpen(false)}><X size={20} /></button></div>
      <div className="workspace-label">TRIADE LEARNING</div>
      <nav>
        <NavItem icon={<LayoutDashboard size={19} />} label={t.dashboard} active={view === 'dashboard'} onClick={() => navigate('dashboard')} />
        <NavItem icon={<BookOpen size={19} />} label={t.catalog} active={view === 'catalog'} onClick={() => navigate('catalog')} />
        <NavItem icon={<CalendarDays size={19} />} label={t.calendar} active={view === 'calendar'} onClick={() => navigate('calendar')} />
        <NavItem icon={<Award size={19} />} label={t.certificates} active={view === 'certificates'} onClick={() => navigate('certificates')} />
      </nav>
      <div className="sidebar-bottom">
        <div className="profile-mini"><div className="avatar">{profile.full_name.slice(0, 2).toUpperCase()}</div><div><strong>{profile.full_name}</strong><span>{profile.job_role}</span></div></div>
        <button className="signout-button" onClick={signOut}>{t.signOut}</button>
      </div>
    </aside>}
    <main className={isFullscreen ? 'main-content fullscreen' : 'main-content'}>
      <header className="topbar">
        <button className="menu-button" onClick={() => setMobileOpen(true)}><Menu size={21} /></button>
        <div className="breadcrumb">TRIADE <ChevronRight size={14} /> <span>{breadcrumbLabel()}</span></div>
        <div className="top-actions">
          <button className="language-toggle" onClick={() => setLanguage(language === 'ES' ? 'EN' : 'ES')}><span className={language === 'ES' ? 'selected' : ''}>ES</span><span>/</span><span className={language === 'EN' ? 'selected' : ''}>EN</span></button>
          <button className="icon-button" onClick={() => setDark(!dark)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          <div className="avatar avatar-small">{profile.full_name.slice(0, 2).toUpperCase()}</div>
        </div>
      </header>
      {view === 'dashboard' && <Dashboard t={t} navigate={navigate} courses={courses} getCourseState={getCourseState} onSelect={setSelectedCourse} profile={profile} />}
      {view === 'catalog' && <Catalog t={t} filter={filter} setFilter={setFilter} query={query} setQuery={setQuery} courses={courses} getCourseState={getCourseState} onSelect={setSelectedCourse} jobRole={profile.job_role} />}
      {view === 'calendar' && <CalendarView t={t} language={language} courses={courses} onSelect={setSelectedCourse} />}
      {view === 'certificates' && <Certificates t={t} completedCourses={completedCourses} onPreview={setPreviewCert} />}
      {view === 'player' && activeCourse && <CoursePlayer t={t} course={activeCourse} courseState={getCourseState(activeCourse.id)} onBack={() => requestExit(() => navigate('catalog'))} onExam={openExam} onMarkComplete={handleMarkComplete} />}
      {view === 'exam' && activeCourse && <Exam t={t} course={activeCourse} examType={examType} courseState={getCourseState(activeCourse.id)} onBack={() => requestExit(() => navigate('catalog'))} onBackToCourse={() => openPlayer(activeCourse)} onResult={handleExamResult} />}
    </main>
    {selectedCourse && <CourseModal course={selectedCourse} t={t} courseState={getCourseState(selectedCourse.id)} onClose={() => setSelectedCourse(null)} onOpenPlayer={openPlayer} onOpenExam={openExam} />}
    {previewCert && <CertificatePreview t={t} cert={previewCert} profileName={profile.full_name} onClose={() => setPreviewCert(null)} />}
    {showExitWarning && <ExitWarningModal t={t} onConfirm={confirmExit} onCancel={() => setShowExitWarning(false)} />}
  </div>;
}

// ===================== ADMIN APP =====================
function AdminApp({ profile, language, setLanguage, dark, setDark }: { profile: Profile; language: Language; setLanguage: (l: Language) => void; dark: boolean; setDark: (d: boolean) => void }) {
  const t = copy[language];
  const at = adminStringsES;
  const [tab, setTab] = useState<AdminTab>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AdminData | null>(null);
  const { signOut } = useAuth();

  const refreshAll = async () => {
    const [
      courses, team, jobRoles, departments, userCourseReqs,
      moduleProgress, examAttempts, certificates, roleCertifications,
      notifications, feedback, badges, userBadges, settings, auditLogs,
    ] = await Promise.all([
      fetchAllCourses(), fetchAllProfiles(), fetchJobRoles(), fetchDepartments(),
      fetchUserCourseRequirements(), fetchAllModuleProgress(), fetchAllExamAttempts(),
      fetchAllCertificates(), fetchRoleCertifications(), fetchAllNotifications(),
      fetchAllFeedback(), fetchBadges(), fetchUserBadges(), fetchSystemSettings(), fetchAuditLogs(),
    ]);
    setData({
      courses, team: team as Profile[], jobRoles, departments,
      userCourseReqs, moduleProgress, examAttempts, certificates,
      roleCertifications, notifications, feedback, badges, userBadges, settings, auditLogs,
    });
  };

  useEffect(() => {
    (async () => {
      await refreshAll();
      setLoading(false);
    })();
  }, []);

  const navigate = (v: string) => { setTab(v as AdminTab); setMobileOpen(false); };
  const breadcrumbLabel = () => {
    const labels: Record<string, string> = {
      dashboard: at.dashboard, personnel: at.personnel, courses: at.courses,
      certifications: at.certifications, 'auto-assign': at.autoAssign, feedback: at.feedback,
      gamification: at.gamification, notifications: at.notifications, reports: at.reports,
      settings: at.settings, audit: at.audit,
    };
    return labels[tab] ?? '';
  };

  if (loading || !data) return <div className={dark ? 'app-shell dark' : 'app-shell'} style={{ display: 'grid', placeItems: 'center', height: '100vh' }}><p style={{ color: '#6b7280' }}>{t.loading}</p></div>;

  const navItems: { key: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
    { key: 'dashboard', label: at.dashboard, icon: LayoutDashboard },
    { key: 'personnel', label: at.personnel, icon: Users },
    { key: 'courses', label: at.courses, icon: BookOpen },
    { key: 'certifications', label: at.certifications, icon: Award },
    { key: 'auto-assign', label: at.autoAssign, icon: Zap },
    { key: 'feedback', label: at.feedback, icon: Star },
    { key: 'gamification', label: at.gamification, icon: Award },
    { key: 'notifications', label: at.notifications, icon: Bell },
    { key: 'reports', label: at.reports, icon: BarChart3 },
    { key: 'settings', label: at.settings, icon: Settings },
    { key: 'audit', label: at.audit, icon: History },
  ];

  return <div className={dark ? 'app-shell dark' : 'app-shell'}>
    <aside className={mobileOpen ? 'sidebar open' : 'sidebar'}>
      <div className="brand"><img src={dark ? '/LOGOTIPO_NEGATIVO.png' : '/LOGOTIPO_POSITIVO.png'} alt="TRIADE" /><button className="close-menu" onClick={() => setMobileOpen(false)}><X size={20} /></button></div>
      <div className="workspace-label">TRIADE ADMIN</div>
      <nav className="admin-nav-scroll">
        {navItems.map((item) => {
          const Icon = item.icon;
          return <button key={item.key} className={tab === item.key ? 'nav-item active' : 'nav-item'} onClick={() => navigate(item.key)}><Icon size={19} /><span>{item.label}</span>{tab === item.key && <span className="active-dot" />}</button>;
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="profile-mini"><div className="avatar">{profile.full_name.slice(0, 2).toUpperCase()}</div><div><strong>{profile.full_name}</strong><span>{t.admin}</span></div></div>
        <button className="signout-button" onClick={signOut}>{t.signOut}</button>
      </div>
    </aside>
    <main className="main-content">
      <header className="topbar">
        <button className="menu-button" onClick={() => setMobileOpen(true)}><Menu size={21} /></button>
        <div className="breadcrumb">TRIADE <ChevronRight size={14} /> <span>{breadcrumbLabel()}</span></div>
        <div className="top-actions">
          <button className="language-toggle" onClick={() => setLanguage(language === 'ES' ? 'EN' : 'ES')}><span className={language === 'ES' ? 'selected' : ''}>ES</span><span>/</span><span className={language === 'EN' ? 'selected' : ''}>EN</span></button>
          <button className="icon-button" onClick={() => setDark(!dark)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          <div className="avatar avatar-small">{profile.full_name.slice(0, 2).toUpperCase()}</div>
        </div>
      </header>
      {tab === 'dashboard' && <DashboardModule t={at} data={data} onNavigate={navigate} />}
      {tab === 'personnel' && <PersonnelModule t={at} team={data.team} jobRoles={data.jobRoles} departments={data.departments} courses={data.courses} onRefresh={refreshAll} />}
      {tab === 'courses' && <CoursesModule t={at} courses={data.courses} jobRoles={data.jobRoles} profile={profile} onRefresh={refreshAll} />}
      {tab === 'certifications' && <CertificationsModule t={at} data={data} />}
      {tab === 'auto-assign' && <AutoAssignModule t={at} data={data} onRefresh={refreshAll} />}
      {tab === 'feedback' && <FeedbackModule t={at} data={data} />}
      {tab === 'gamification' && <GamificationModule t={at} data={data} onRefresh={refreshAll} />}
      {tab === 'notifications' && <NotificationsModule t={at} data={data} onRefresh={refreshAll} />}
      {tab === 'reports' && <ReportsModule t={at} data={data} />}
      {tab === 'settings' && <SettingsModule t={at} data={data} onRefresh={refreshAll} />}
      {tab === 'audit' && <AuditModule t={at} data={data} />}
    </main>
  </div>;
}

// ===================== SHARED COMPONENTS =====================
function NavItem({ icon, label, active, onClick }: { icon: ReactNode; label: string; active: boolean; onClick: () => void }) {
  return <button className={active ? 'nav-item active' : 'nav-item'} onClick={onClick}>{icon}<span>{label}</span>{active && <span className="active-dot" />}</button>;
}
function StatCard({ icon, value, label, tone }: { icon: ReactNode; value: string; label: string; tone: string }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div><strong>{value}</strong><span>{label}</span></div><span className="stat-trend">↗</span></div>;
}
function ExitWarningModal({ t, onConfirm, onCancel }: { t: typeof copy.ES; onConfirm: () => void; onCancel: () => void }) {
  return createPortal(<div className="modal-backdrop" onClick={onCancel}><div className="exit-warning-modal" onClick={(e) => e.stopPropagation()}>
    <div className="exit-warning-icon"><AlertTriangle size={40} /></div>
    <h2>{t.exitWarningTitle}</h2><p>{t.exitWarningDesc}</p>
    <div className="exit-warning-actions"><button className="outline-button" onClick={onCancel}>{t.exitWarningStay}</button><button className="primary-button exit-confirm" onClick={onConfirm}>{t.exitWarningLeave}</button></div>
  </div></div>, document.body);
}
function DeleteConfirmModal({ t, title, onConfirm, onCancel }: { t: typeof copy.ES; title?: string; onConfirm: () => void; onCancel: () => void }) {
  return createPortal(<div className="modal-backdrop" onClick={onCancel}><div className="exit-warning-modal" onClick={(e) => e.stopPropagation()}>
    <div className="exit-warning-icon"><Trash2 size={40} /></div>
    <h2>{title ?? t.deleteConfirm}</h2>
    <div className="exit-warning-actions"><button className="outline-button" onClick={onCancel}>{t.cancel}</button><button className="primary-button exit-confirm" onClick={onConfirm}>{t.delete}</button></div>
  </div></div>, document.body);
}

// ===================== DASHBOARD =====================
function Dashboard({ t, navigate, courses, getCourseState, onSelect, profile }: { t: typeof copy.ES; navigate: (v: View) => void; courses: CourseWithRelations[]; getCourseState: (id: string) => { completedModules: boolean[]; directFailed: boolean; directPassed: boolean; courseExamPassed: boolean }; onSelect: (c: CourseWithRelations) => void; profile: Profile }) {
  const inProgress = courses.filter((c) => { const s = getCourseState(c.id); return s.completedModules.some(Boolean) && !s.courseExamPassed; });
  const completed = courses.filter((c) => getCourseState(c.id).courseExamPassed);
  const overallProgress = courses.length > 0 ? Math.round((completed.length / courses.length) * 100) : 0;

  return <div className="page animate-in">
    <div className="page-heading"><div><p className="eyebrow">MI ESPACIO DE APRENDIZAJE</p><h1>{t.welcome}, {profile.full_name.split(' ')[0]}</h1><p className="muted">{t.subtitle}</p></div><button className="primary-button" onClick={() => navigate('catalog')}><BookOpen size={18} />{t.catalog}<ArrowRight size={17} /></button></div>
    <section className="stats-grid">
      <StatCard icon={<BookOpen />} value={String(courses.length)} label={t.assigned} tone="g1" />
      <StatCard icon={<BarChart3 />} value={`${overallProgress}%`} label={t.progress} tone="g2" />
      <StatCard icon={<Award />} value={String(completed.length)} label={t.certificatesStat} tone="g3" />
      <StatCard icon={<Clock3 />} value="4.5h" label={t.hours} tone="g4" />
    </section>
    {courses.length === 0 ? <div className="empty-state"><BookOpen size={30} /><h3>{t.noCourses}</h3></div> : <>
    <div className="content-grid">
      <section className="section-card learning-card">
        <div className="section-title"><div><h2>{t.continue}</h2><p className="muted">Retoma donde lo dejaste.</p></div><button className="text-button" onClick={() => navigate('catalog')}>{t.viewAll}<ArrowRight size={15} /></button></div>
        {inProgress.length > 0 ? inProgress.slice(0, 3).map((c) => <CourseRow key={c.id} course={c} t={t} getCourseState={getCourseState} onSelect={onSelect} />) : <p className="muted" style={{ padding: '20px 0' }}>{t.selectCourse}</p>}
      </section>
      <section className="section-card deadline-card"><div className="section-title"><div><h2>{t.deadline}</h2><p className="muted">Mantente al día.</p></div><Clock3 size={18} className="section-icon" /></div>
        {courses.filter((c) => c.assignments.some((a) => a.completion_deadline_days)).slice(0, 3).map((c) => { const a = c.assignments.find((a) => a.completion_deadline_days); const dl = a ? new Date(Date.now() + (a.completion_deadline_days ?? 0) * 86400000).toISOString() : ''; const d = new Date(dl); return <div key={c.id} className="deadline-item"><div className="date-badge"><strong>{isNaN(d.getDate()) ? '--' : d.getDate()}</strong><span>{isNaN(d.getMonth()) ? '---' : (copy as any).es_months?.[d.getMonth()] ?? MONTHS_ES[d.getMonth()].slice(0, 3).toUpperCase()}</span></div><div><strong>{c.title}</strong><p>{c.category}</p></div><ChevronRight size={17} /></div>; })}
        <button className="outline-button" onClick={() => navigate('calendar')}>{t.calendar}</button>
      </section>
    </div>
    </>}
  </div>;
}

function CourseRow({ course, t, getCourseState, onSelect }: { course: CourseWithRelations; t: typeof copy.ES; getCourseState: (id: string) => { completedModules: boolean[] }; onSelect: (c: CourseWithRelations) => void }) {
  const Icon = getIcon(course.icon_name);
  const state = getCourseState(course.id);
  const completedCount = state.completedModules.filter(Boolean).length;
  const progress = course.modules.length > 0 ? Math.round((completedCount / course.modules.length) * 100) : 0;
  return <button className="course-row" onClick={() => onSelect(course)}><div className={`course-icon ${course.accent}`}><Icon size={24} /></div><div className="course-row-info"><strong>{course.title}</strong><span><Clock3 size={14} />{course.duration}<i />{course.category}</span><div className="mini-progress"><span style={{ width: `${progress}%` }} /></div></div><div className="course-percent">{progress}%<ChevronRight size={17} /></div></button>;
}

// ===================== CATALOG =====================
function Catalog({ t, filter, setFilter, query, setQuery, courses, getCourseState, onSelect, jobRole }: { t: typeof copy.ES; filter: string; setFilter: (v: string) => void; query: string; setQuery: (v: string) => void; courses: CourseWithRelations[]; getCourseState: (id: string) => { completedModules: boolean[]; directFailed: boolean; directPassed: boolean; courseExamPassed: boolean }; onSelect: (c: CourseWithRelations) => void; jobRole: string }) {
  const filters = [t.all, t.inProgress, t.notStarted, t.completed];
  const visible = courses.filter((c) => {
    const state = getCourseState(c.id);
    const allDone = state.completedModules.every(Boolean) && state.completedModules.length > 0;
    const isCompleted = state.courseExamPassed;
    const isInProgress = state.completedModules.some(Boolean) && !isCompleted;
    const isNotStarted = !state.completedModules.some(Boolean) && !isCompleted;
    const matchesFilter = filter === t.all || (filter === t.completed && isCompleted) || (filter === t.inProgress && isInProgress) || (filter === t.notStarted && isNotStarted);
    return matchesFilter && c.title.toLowerCase().includes(query.toLowerCase());
  });

  return <div className="page animate-in">
    <div className="page-heading"><div><p className="eyebrow">FORMACIÓN POR CARGO</p><h1>{t.catalog}</h1><p className="muted">{t.catalogIntro} · <strong className="role-tag">{jobRole}</strong></p></div></div>
    <div className="catalog-toolbar"><div className="search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} /></div><div className="filter-tabs">{filters.map((f) => <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>)}</div></div>
    {visible.length === 0 ? <div className="empty-state"><Search size={30} /><h3>{courses.length === 0 ? t.noCourses : t.empty}</h3></div> :
    <div className="catalog-grid">{visible.map((c) => <CourseCard key={c.id} course={c} t={t} getCourseState={getCourseState} onSelect={onSelect} />)}</div>}
  </div>;
}

function CourseCard({ course, t, getCourseState, onSelect }: { course: CourseWithRelations; t: typeof copy.ES; getCourseState: (id: string) => { completedModules: boolean[]; courseExamPassed: boolean }; onSelect: (c: CourseWithRelations) => void }) {
  const Icon = getIcon(course.icon_name);
  const state = getCourseState(course.id);
  const completedCount = state.completedModules.filter(Boolean).length;
  const progress = course.modules.length > 0 ? Math.round((completedCount / course.modules.length) * 100) : 0;
  const status = state.courseExamPassed ? t.completed : progress > 0 ? t.inProgress : t.notStarted;
  const statusClass = state.courseExamPassed ? 'status-completado' : progress > 0 ? 'status-en-progreso' : 'status-no-iniciado';
  return <article className="course-card">
    <div className={`course-cover ${course.accent}`} style={{ backgroundImage: `url(${course.image_url})` }}>
      <div className="cover-overlay" /><div className="cover-icon"><Icon size={22} /></div><span className="cover-category">{course.category}</span>
      <button className="cover-play" onClick={() => onSelect(course)}><Play size={18} fill="currentColor" /></button>
    </div>
    <div className="course-card-body">
      <div className="course-meta"><span><Clock3 size={14} />{course.duration}</span><span className={`status ${statusClass}`}>{status}</span></div>
      <h3>{course.title}</h3><p>{course.description}</p>
      <div className="course-card-footer"><div className="card-progress"><div className="progress-label"><span>{progress > 0 ? `${progress}% completado` : t.notStarted}</span><strong>{progress}%</strong></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div><button className="card-arrow" onClick={() => onSelect(course)}><ArrowRight size={18} /></button></div>
    </div>
  </article>;
}

// ===================== CALENDAR =====================
function CalendarView({ t, language, courses, onSelect }: { t: typeof copy.ES; language: Language; courses: CourseWithRelations[]; onSelect: (c: CourseWithRelations) => void }) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const months = language === 'ES' ? MONTHS_ES : MONTHS_EN;
  const days = language === 'ES' ? DAYS_ES : DAYS_EN;
  const year = new Date().getFullYear();
  const firstDay = new Date(year, currentMonth, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();
  const eventsByDay: Record<number, CourseWithRelations[]> = {};
  courses.forEach((c) => { c.assignments.forEach((a) => { if (a.completion_deadline_days) { const d = new Date(Date.now() + a.completion_deadline_days * 86400000); if (d.getMonth() === currentMonth && d.getFullYear() === year) { const day = d.getDate(); if (!eventsByDay[day]) eventsByDay[day] = []; eventsByDay[day].push(c); } } }); });
  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return <div className="page animate-in"><div className="page-heading"><div><p className="eyebrow">AGENDA DE APRENDIZAJE</p><h1>{t.calendar}</h1><p className="muted">{t.calendarIntro}</p></div></div>
    <div className="calendar-layout">
      <div className="section-card calendar-card">
        <div className="calendar-header"><button className="cal-nav" onClick={() => setCurrentMonth((currentMonth + 11) % 12)}><ChevronLeft size={18} /></button><strong>{months[currentMonth]} {year}</strong><button className="cal-nav" onClick={() => setCurrentMonth((currentMonth + 1) % 12)}><ChevronRight size={18} /></button></div>
        <div className="calendar-grid">{days.map((d) => <div key={d} className="cal-day-header">{d}</div>)}{cells.map((day, i) => <div key={i} className={day ? 'cal-day' : 'cal-day empty'}>{day && <><span className="cal-day-num">{day}</span>{eventsByDay[day]?.map((c) => { const Icon = getIcon(c.icon_name); return <button key={c.id} className={`cal-event ${c.accent}`} onClick={() => onSelect(c)}><span><Icon size={10} /><i />{c.title}</span></button>; })}</>}</div>)}</div>
      </div>
      <div className="section-card calendar-sidebar"><div className="section-title"><div><h2>{t.upcomingCourses}</h2><p className="muted">{t.activeCourses}</p></div></div>
        {courses.filter((c) => c.assignments.some((a) => a.completion_deadline_days)).sort((a, b) => (a.assignments[0]?.completion_deadline_days ?? 0) - (b.assignments[0]?.completion_deadline_days ?? 0)).slice(0, 5).map((c) => { const Icon = getIcon(c.icon_name); const dl = c.assignments.find((a) => a.completion_deadline_days) ? new Date(Date.now() + (c.assignments.find((a) => a.completion_deadline_days)?.completion_deadline_days ?? 0) * 86400000).toLocaleDateString() : ''; return <button key={c.id} className="upcoming-item" onClick={() => onSelect(c)}><div className={`course-icon ${c.accent}`}><Icon size={24} /></div><div><strong>{c.title}</strong><span><CalendarDays size={13} />{dl}</span></div><ChevronRight size={16} /></button>; })}
      </div>
    </div>
  </div>;
}

// ===================== CERTIFICATES =====================
function Certificates({ t, completedCourses, onPreview }: { t: typeof copy.ES; completedCourses: CourseWithRelations[]; onPreview: (c: { title: string; id: string; date: string }) => void }) {
  return <div className="page animate-in"><div className="page-heading"><div><p className="eyebrow">LOGROS ACADÉMICOS</p><h1>{t.certificates}</h1><p className="muted">Tus certificaciones están listas para compartir.</p></div></div>
    <div className="certificate-banner"><div className="banner-seal"><Award size={31} /></div><div><strong>{completedCourses.length} certificaciones obtenidas</strong><span>Has completado cursos de tu ruta anual.</span></div><div className="banner-line" /><div className="banner-stat"><strong>{completedCourses.length}</strong><span>cursos certificados</span></div></div>
    {completedCourses.length === 0 ? <div className="empty-state"><Award size={30} /><h3>{t.noCourses}</h3></div> :
    <div className="certificate-grid">{completedCourses.map((c, i) => <article className="certificate-card" key={c.id}><div className="certificate-art"><div className="certificate-mark"><Award size={26} /></div><span>TRIADE</span><small>{t.certificate}</small><strong>{c.title}</strong><em>{t.awardedTo}</em><div className="certificate-art-footer"><span>TRD-{new Date().getFullYear()}-{String(i + 1).padStart(5, '0')}</span><span>{new Date().toLocaleDateString()}</span></div></div><div className="certificate-actions"><button onClick={() => onPreview({ title: c.title, id: `TRD-${new Date().getFullYear()}-${String(i + 1).padStart(5, '0')}`, date: new Date().toLocaleDateString() })}><FileText size={16} />{t.seeCertificate}</button><button><Download size={16} />{t.downloadCert}</button></div></article>)}</div>}
  </div>;
}

function CertificatePreview({ t, cert, profileName, onClose }: { t: typeof copy.ES; cert: { title: string; id: string; date: string }; profileName: string; onClose: () => void }) {
  return createPortal(<div className="modal-backdrop cert-backdrop" onClick={onClose}><div className="cert-preview-modal" onClick={(e) => e.stopPropagation()}>
    <button className="modal-close cert-modal-close" onClick={onClose}><X size={19} /></button>
    <div className="cert-preview-paper"><div className="cert-border"><div className="cert-border-inner">
      <div className="cert-header"><img src="/LOGO_POSITIVO.png" alt="TRIADE" className="cert-logo" /><span className="cert-company">TRIADE LEARNING</span></div>
      <div className="cert-seal"><Award size={40} /></div>
      <small className="cert-label">{t.certificate}</small><p className="cert-presented">{t.awardedTo}</p><h2 className="cert-name">{profileName}</h2>
      <p className="cert-course-label">{t.courseLabel}</p><h3 className="cert-course-title">{cert.title}</h3>
      <div className="cert-footer"><div className="cert-footer-item"><span className="cert-footer-label">{t.certId}</span><strong>{cert.id}</strong></div><div className="cert-footer-divider" /><div className="cert-footer-item"><span className="cert-footer-label">{t.issueDate}</span><strong>{cert.date}</strong></div></div>
    </div></div></div>
    <div className="cert-preview-actions"><button className="primary-button"><Download size={17} />{t.downloadCert}</button><button className="outline-button"><FileText size={17} />{t.printCert}</button></div>
  </div></div>, document.body);
}

// ===================== COURSE MODAL =====================
function CourseModal({ course, t, courseState, onClose, onOpenPlayer, onOpenExam }: { course: CourseWithRelations; t: typeof copy.ES; courseState: { completedModules: boolean[]; directFailed: boolean; directPassed: boolean; courseExamPassed: boolean }; onClose: () => void; onOpenPlayer: (c: CourseWithRelations) => void; onOpenExam: (c: CourseWithRelations, type: ExamType) => void }) {
  const Icon = getIcon(course.icon_name);
  const completedCount = courseState.completedModules.filter(Boolean).length;
  const allModulesComplete = courseState.completedModules.length > 0 && courseState.completedModules.every(Boolean);
  const courseExamAvailable = courseState.directPassed || (courseState.directFailed && allModulesComplete) || (allModulesComplete && !courseState.directFailed);
  const progress = course.modules.length > 0 ? Math.round((completedCount / course.modules.length) * 100) : 0;

  return createPortal(<div className="modal-backdrop" onClick={onClose}><div className="course-modal" onClick={(e) => e.stopPropagation()}>
    <button className="modal-close" onClick={onClose}><X size={19} /></button>
    <div className={`modal-hero ${course.accent}`} style={{ backgroundImage: `url(${course.image_url})` }}><div className="modal-hero-overlay" /><div className="cover-icon"><Icon size={22} /></div><span className="modal-hero-cat">{course.category}</span></div>
    <div className="modal-body">
      <div className="course-meta"><span><Clock3 size={14} />{course.duration}</span></div>
      <h2>{course.title}</h2><p>{course.description}</p>
      <div className="module-progress-bar"><div className="progress-label"><span>{completedCount} de {course.modules.length} {t.modules}</span><strong>{progress}%</strong></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>
      <div className="module-list">{course.modules.map((m, i) => <div key={m.id}><span className={courseState.completedModules[i] ? 'module-check' : 'module-check locked'}>{courseState.completedModules[i] ? <Check size={14} /> : <LockKeyhole size={13} />}</span><span><strong>{m.title}</strong><small>{m.duration} · {m.type === 'video' ? t.videoModule : m.type === 'image' ? t.imageModule : t.textModule}</small></span></div>)}</div>
      <div className="exam-section">
        <div className="exam-type-card"><div className="exam-type-header"><div className="exam-type-icon direct"><ShieldCheck size={18} /></div><div><strong>{t.directExam}</strong><small>{t.directExamDesc}</small></div></div>
          {courseState.directPassed ? <span className="exam-badge passed"><Check size={14} />Aprobada</span> : courseState.directFailed ? <span className="exam-badge locked"><LockKeyhole size={14} />{t.examLocked}</span> : <button className="primary-button exam-action" onClick={() => onOpenExam(course, 'direct')}><Play size={15} />{t.takeDirectExam}</button>}
        </div>
        <div className="exam-type-card"><div className="exam-type-header"><div className="exam-type-icon course"><Award size={18} /></div><div><strong>{t.courseExam}</strong><small>{t.courseExamDesc}</small></div></div>
          {courseState.courseExamPassed ? <span className="exam-badge passed"><Check size={14} />Aprobada</span> : courseExamAvailable ? <button className="primary-button exam-action" onClick={() => onOpenExam(course, 'course')}><Play size={15} />{t.takeCourseExam}</button> : <span className="exam-badge locked"><LockKeyhole size={14} />{t.modulesRequired}</span>}
        </div>
      </div>
      <button className="primary-button modal-action" onClick={() => onOpenPlayer(course)}><Play size={17} />{progress > 0 ? t.resume : t.start}</button>
    </div>
  </div></div>, document.body);
}

// ===================== COURSE PLAYER =====================
function CoursePlayer({ t, course, courseState, onBack, onExam, onMarkComplete }: { t: typeof copy.ES; course: CourseWithRelations; courseState: { completedModules: boolean[] }; onBack: () => void; onExam: (c: CourseWithRelations, type: ExamType) => void; onMarkComplete: (moduleId: string) => void }) {
  const [moduleIdx, setModuleIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const current = course.modules[moduleIdx];
  if (!current) return <div className="page animate-in player-page"><div className="player-header"><button className="back-button" onClick={onBack}><ArrowLeft size={18} />{t.exitCourse}</button></div><p className="muted" style={{ padding: 40 }}>{t.noCourses}</p></div>;
  const moduleTypeIcon = current.type === 'video' ? <Video size={15} /> : current.type === 'image' ? <ImageIcon size={15} /> : <FileText size={15} />;
  const moduleTypeLabel = current.type === 'video' ? t.videoModule : current.type === 'image' ? t.imageModule : t.textModule;
  const allModulesComplete = courseState.completedModules.length > 0 && courseState.completedModules.every(Boolean);
  const currentModuleComplete = courseState.completedModules[moduleIdx] ?? false;
  const Icon = getIcon(course.icon_name);

  return <div className="page animate-in player-page">
    <div className="player-header"><button className="back-button" onClick={onBack}><ArrowLeft size={18} />{t.exitCourse}</button><div className="player-course-info"><span className={`course-icon-sm ${course.accent}`}><Icon size={18} /></span><div><strong>{course.title}</strong><small>{course.category} · {course.duration}</small></div></div></div>
    <div className="player-layout">
      <div className="player-main"><div className="player-content">
        {current.type === 'video' && (current.video_url ? <div className="player-video"><video src={current.video_url} controls className="player-video-el" />{current.body && <div className="player-text"><div className="player-module-tag">{moduleTypeIcon}{moduleTypeLabel} · {current.duration}</div><h2>{current.title}</h2><p>{current.body}</p></div>}</div> : <div className="player-video"><div className="video-poster" style={{ backgroundImage: `url(${course.image_url})` }}><button className="video-play-btn" onClick={() => setPlaying(!playing)}>{playing ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}</button></div><div className="video-controls"><span className="video-time">0:00 / {current.duration}</span><div className="video-bar"><span style={{ width: playing ? '35%' : '0%' }} /></div></div></div>)}
        {current.type === 'image' && current.image_url && <div className="player-image"><img src={current.image_url} alt={current.title} /></div>}
        {current.type === 'text' && <div className="player-text-icon"><FileText size={48} /></div>}
        <div className="player-text"><div className="player-module-tag">{moduleTypeIcon}{moduleTypeLabel} · {current.duration}</div><h2>{current.title}</h2><p>{current.body}</p></div>
        <div className="player-nav-buttons">
          {moduleIdx > 0 && <button className="outline-button player-prev" onClick={() => setModuleIdx(moduleIdx - 1)}><ChevronLeft size={16} />{t.prevQ}</button>}
          {moduleIdx < course.modules.length - 1 ? <button className="primary-button player-next" onClick={() => { if (!currentModuleComplete) onMarkComplete(current.id); setModuleIdx(moduleIdx + 1); }}>{t.nextQ}<ChevronRight size={16} /></button> : <button className="primary-button player-next" onClick={() => { if (!currentModuleComplete) onMarkComplete(current.id); onExam(course, 'course'); }}><Award size={16} />{t.takeExam}</button>}
        </div>
        {currentModuleComplete && <div className="module-complete-banner"><Check size={16} />{t.moduleComplete}</div>}
      </div></div>
      <aside className="player-sidebar">
        <div className="section-title"><div><h2>{t.modules}</h2><p className="muted">{courseState.completedModules.filter(Boolean).length} / {course.modules.length} {t.moduleProgress.toLowerCase()}</p></div></div>
        <div className="player-module-list">{course.modules.map((m, i) => <button key={m.id} className={i === moduleIdx ? 'player-module-item active' : 'player-module-item'} onClick={() => setModuleIdx(i)}><span className={courseState.completedModules[i] ? 'module-check' : i === moduleIdx ? 'module-check current' : 'module-check locked'}>{courseState.completedModules[i] ? <Check size={13} /> : i === moduleIdx ? <Play size={11} fill="currentColor" /> : <LockKeyhole size={12} />}</span><span><strong>{m.title}</strong><small>{m.duration}</small></span>{i === moduleIdx && <span className="current-dot" />}</button>)}</div>
        {allModulesComplete && <div className="exam-ready-banner"><Award size={16} /><span>{t.courseExamReadyDesc}</span><button className="primary-button" onClick={() => onExam(course, 'course')}>{t.goToExam}</button></div>}
      </aside>
    </div>
  </div>;
}

// ===================== EXAM =====================
function Exam({ t, course, examType, courseState, onBack, onBackToCourse, onResult }: { t: typeof copy.ES; course: CourseWithRelations; examType: ExamType; courseState: { completedModules: boolean[]; directFailed: boolean; directPassed: boolean; courseExamPassed: boolean }; onBack: () => void; onBackToCourse: () => void; onResult: (courseId: string, type: ExamType, score: number, passed: boolean, directFailed: boolean) => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(course.exam_questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; correct: number; total: number; passed: boolean } | null>(null);
  const questions = course.exam_questions;
  if (questions.length === 0) return <div className="page animate-in"><p className="muted" style={{ padding: 40 }}>{t.noCourses}</p></div>;
  const q = questions[currentQ];
  const answered = answers[currentQ] !== -1;
  const allAnswered = answers.every((a) => a !== -1);
  const progress = ((currentQ + 1) / questions.length) * 100;
  const examTitle = examType === 'direct' ? t.directExam : t.courseExam;
  const examDesc = examType === 'direct' ? t.directExamDesc : t.courseExamDesc;
  const Icon = getIcon(course.icon_name);

  const handleSubmit = () => {
    const correct = answers.reduce((acc, ans, i) => ans === questions[i].correct_index ? acc + 1 : acc, 0);
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 90;
    const directFailed = examType === 'direct' && !passed;
    setResult({ score, correct, total: questions.length, passed });
    setSubmitted(true);
    onResult(course.id, examType, score, passed, directFailed);
  };

  if (submitted && result) {
    const isDirectFailed = examType === 'direct' && !result.passed;
    return <div className="page animate-in"><div className="exam-result">
      <div className={`exam-result-icon ${result.passed ? 'passed' : 'failed'}`}>{result.passed ? <Award size={48} /> : <AlertCircle size={48} />}</div>
      <h1>{result.passed ? t.passed : isDirectFailed ? t.directFailed : t.failed}</h1>
      <p className="muted">{result.passed ? t.certificate : isDirectFailed ? t.directFailedDesc : t.retry}</p>
      <div className="exam-score-display"><div className="score-circle"><strong>{result.score}%</strong></div><div className="score-details"><div><span>{t.correctAnswers}</span><strong>{result.correct} / {result.total}</strong></div><div><span>{t.passThreshold}</span><strong>90%</strong></div></div></div>
      <div className="exam-result-actions">
        {result.passed ? <button className="primary-button" onClick={onBack}><Award size={17} />{t.backToCatalog}</button> : isDirectFailed ? <button className="primary-button" onClick={onBackToCourse}><BookOpen size={17} />{t.goToCourse}</button> : <button className="primary-button" onClick={() => { setAnswers(Array(questions.length).fill(-1)); setCurrentQ(0); setSubmitted(false); setResult(null); }}><RotateCcw size={17} />{t.retry}</button>}
        <button className="outline-button" onClick={onBack}>{t.backToCatalog}</button>
      </div>
    </div></div>;
  }

  return <div className="page animate-in exam-page">
    <div className="player-header"><button className="back-button" onClick={onBack}><ArrowLeft size={18} />{t.exitCourse}</button><div className="player-course-info"><span className={`course-icon-sm ${course.accent}`}><Icon size={18} /></span><div><strong>{course.title}</strong><small>{examTitle}</small></div></div></div>
    <div className="exam-layout">
      <div className="exam-main">
        <div className="exam-type-banner"><div className={`exam-type-icon ${examType}`}>{examType === 'direct' ? <ShieldCheck size={18} /> : <Award size={18} />}</div><div><strong>{examTitle}</strong><small>{examDesc}</small></div></div>
        <div className="exam-progress-bar"><div className="exam-progress-info"><span>{t.question} {currentQ + 1} {t.of} {questions.length}</span><span>{Math.round(progress)}%</span></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>
        <div className="exam-question-card"><h2>{q.question}</h2><div className="exam-options">{q.options.map((opt, i) => <button key={i} className={answers[currentQ] === i ? 'exam-option selected' : 'exam-option'} onClick={() => { const n = [...answers]; n[currentQ] = i; setAnswers(n); }}><span className="option-letter">{String.fromCharCode(65 + i)}</span><span>{opt}</span>{answers[currentQ] === i && <Check size={18} />}</button>)}</div></div>
        <div className="exam-nav">{currentQ > 0 && <button className="outline-button" onClick={() => setCurrentQ(currentQ - 1)}><ChevronLeft size={16} />{t.prevQ}</button>}{currentQ < questions.length - 1 ? <button className="primary-button" disabled={!answered} onClick={() => setCurrentQ(currentQ + 1)}>{t.nextQ}<ChevronRight size={16} /></button> : <button className="primary-button" disabled={!allAnswered} onClick={handleSubmit}>{t.finishExam}<Check size={16} /></button>}</div>
      </div>
      <aside className="exam-sidebar"><div className="section-title"><div><h2>{t.question}s</h2><p className="muted">{answers.filter((a) => a !== -1).length} / {questions.length}</p></div></div><div className="exam-questions-grid">{questions.map((_, i) => <button key={i} className={i === currentQ ? 'exam-q-dot current' : answers[i] !== -1 ? 'exam-q-dot answered' : 'exam-q-dot'} onClick={() => setCurrentQ(i)}>{i + 1}</button>)}</div><div className="exam-pass-info"><AlertCircle size={15} /><span>{t.passThreshold}</span></div></aside>
    </div>
  </div>;
}


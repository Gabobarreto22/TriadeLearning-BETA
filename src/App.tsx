import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, Award, BarChart3, BookOpen, CalendarDays, Check, ChevronLeft, ChevronRight, CircleHelp, Clock3, Download, FileText, Image as ImageIcon, LayoutDashboard, LockKeyhole, Menu, Moon, Pause, Play, Plus, RotateCcw, Search, Settings, ShieldCheck, Sun, Trash2, Users, Video, X,
} from 'lucide-react';
import { useAuth } from './lib/auth';
import { supabase, type Profile, type CourseWithRelations, type Module, type ExamQuestion, type JobRole } from './lib/supabase';
import {
  fetchCoursesForRole, fetchAllCourses, fetchModuleProgress, fetchExamResults,
  markModuleComplete, saveExamResult, createCourse, deleteCourse, fetchAllProfiles,
  fetchJobRoles, createJobRole, updateJobRole, deleteJobRole,
  updateProfile, deleteProfile,
  fetchAssignmentsByRole, assignCourseToRole, removeAssignment,
} from './lib/data';
import { getIcon, availableIcons, availableAccents } from './lib/icons';

type Language = 'ES' | 'EN';
type View = 'dashboard' | 'catalog' | 'certificates' | 'admin' | 'calendar' | 'player' | 'exam' | 'courses' | 'course-editor' | 'team' | 'assignments' | 'roles' | 'personnel' | 'role-detail';
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
  const [view, setView] = useState<View>('admin');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [courses, setCourses] = useState<CourseWithRelations[]>([]);
  const [team, setTeam] = useState<Profile[]>([]);
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<CourseWithRelations | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteUserConfirm, setDeleteUserConfirm] = useState<string | null>(null);
  const [deleteRoleConfirm, setDeleteRoleConfirm] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<JobRole | null>(null);
  const [selectedRoleForDetail, setSelectedRoleForDetail] = useState<JobRole | null>(null);
  const { signOut } = useAuth();

  const refreshAll = async () => {
    const [courseData, teamData, roleData] = await Promise.all([fetchAllCourses(), fetchAllProfiles(), fetchJobRoles()]);
    setCourses(courseData);
    setTeam(teamData as Profile[]);
    setJobRoles(roleData);
  };

  useEffect(() => {
    (async () => {
      await refreshAll();
      setLoading(false);
    })();
  }, []);

  const refreshCourses = async () => { const data = await fetchAllCourses(); setCourses(data); };
  const refreshTeam = async () => { const data = await fetchAllProfiles(); setTeam(data as Profile[]); };
  const refreshRoles = async () => { const data = await fetchJobRoles(); setJobRoles(data); };

  const navigate = (v: View) => { setView(v); setMobileOpen(false); };
  const breadcrumbLabel = () => {
    const labels: Record<string, string> = {
      admin: t.adminPanel, 'course-editor': t.courseEditor, team: t.manageTeam,
      assignments: t.manageAssignments, roles: t.manageRoles, personnel: t.managePersonnel,
      'role-detail': t.roleManagement, dashboard: '', catalog: '', certificates: '', calendar: '', player: '', exam: '',
    };
    return labels[view] ?? '';
  };

  if (loading) return <div className={dark ? 'app-shell dark' : 'app-shell'} style={{ display: 'grid', placeItems: 'center', height: '100vh' }}><p style={{ color: '#6b7280' }}>{t.loading}</p></div>;

  return <div className={dark ? 'app-shell dark' : 'app-shell'}>
    <aside className={mobileOpen ? 'sidebar open' : 'sidebar'}>
      <div className="brand"><img src={dark ? '/LOGOTIPO_NEGATIVO.png' : '/LOGOTIPO_POSITIVO.png'} alt="TRIADE" /><button className="close-menu" onClick={() => setMobileOpen(false)}><X size={20} /></button></div>
      <div className="workspace-label">TRIADE ADMIN</div>
      <nav>
        <NavItem icon={<LayoutDashboard size={19} />} label={t.adminPanel} active={view === 'admin'} onClick={() => navigate('admin')} />
        <NavItem icon={<BookOpen size={19} />} label={t.manageCourses} active={view === 'courses' || view === 'course-editor'} onClick={() => { setEditingCourse(null); navigate('courses'); }} />
        <NavItem icon={<Users size={19} />} label={t.managePersonnel} active={view === 'personnel'} onClick={() => navigate('personnel')} />
        <NavItem icon={<ShieldCheck size={19} />} label={t.manageRoles} active={view === 'roles' || view === 'role-detail'} onClick={() => { setSelectedRoleForDetail(null); navigate('roles'); }} />
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
      {view === 'admin' && <AdminDashboard t={t} courses={courses} team={team} jobRoles={jobRoles} onNewCourse={() => { setEditingCourse(null); navigate('courses'); }} onEditCourse={(c) => { setEditingCourse(c); navigate('courses'); }} onDeleteCourse={(id) => setDeleteConfirm(id)} onManagePersonnel={() => navigate('personnel')} onManageRoles={() => navigate('roles')} />}
      {view === 'courses' && <CourseManagement t={t} courses={courses} onNewCourse={() => { setEditingCourse(null); navigate('course-editor'); }} onEditCourse={(c) => { setEditingCourse(c); navigate('course-editor'); }} onDeleteCourse={(id) => setDeleteConfirm(id)} />}
      {view === 'course-editor' && <CourseEditor t={t} profile={profile} jobRoles={jobRoles} existingCourse={editingCourse} onSaved={async () => { await refreshCourses(); navigate('courses'); }} onCancel={() => navigate('courses')} />}
      {view === 'personnel' && <PersonnelManagement t={t} team={team} jobRoles={jobRoles} onRefresh={refreshTeam} onDeleteUser={(id) => setDeleteUserConfirm(id)} />}
      {view === 'roles' && <RoleManagement t={t} jobRoles={jobRoles} courses={courses} onRefresh={refreshRoles} onEditRole={(r) => setEditingRole(r)} onDeleteRole={(id) => setDeleteRoleConfirm(id)} onRoleDetail={(r) => { setSelectedRoleForDetail(r); navigate('role-detail'); }} />}
      {view === 'role-detail' && selectedRoleForDetail && <RoleDetail t={t} role={selectedRoleForDetail} courses={courses} onBack={() => navigate('roles')} onRefresh={refreshRoles} />}
      {deleteConfirm && <DeleteConfirmModal t={t} onConfirm={async () => { await deleteCourse(deleteConfirm); setDeleteConfirm(null); await refreshCourses(); }} onCancel={() => setDeleteConfirm(null)} />}
      {deleteUserConfirm && <DeleteConfirmModal t={t} title={t.deleteUserConfirm} onConfirm={async () => { await deleteProfile(deleteUserConfirm); setDeleteUserConfirm(null); await refreshTeam(); }} onCancel={() => setDeleteUserConfirm(null)} />}
      {deleteRoleConfirm && <DeleteConfirmModal t={t} title={t.deleteRoleConfirm} onConfirm={async () => { await deleteJobRole(deleteRoleConfirm); setDeleteRoleConfirm(null); await refreshRoles(); }} onCancel={() => setDeleteRoleConfirm(null)} />}
      {editingRole && <RoleEditorModal t={t} existingRole={editingRole} onClose={() => setEditingRole(null)} onSaved={async () => { setEditingRole(null); await refreshRoles(); }} />}
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
        {courses.filter((c) => c.assignments.some((a) => a.deadline)).slice(0, 3).map((c) => { const a = c.assignments.find((a) => a.deadline); const dl = a?.deadline ?? ''; const d = new Date(dl); return <div key={c.id} className="deadline-item"><div className="date-badge"><strong>{isNaN(d.getDate()) ? '--' : d.getDate()}</strong><span>{isNaN(d.getMonth()) ? '---' : (copy as any).es_months?.[d.getMonth()] ?? MONTHS_ES[d.getMonth()].slice(0, 3).toUpperCase()}</span></div><div><strong>{c.title}</strong><p>{c.category}</p></div><ChevronRight size={17} /></div>; })}
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
  courses.forEach((c) => { c.assignments.forEach((a) => { if (a.deadline) { const d = new Date(a.deadline); if (d.getMonth() === currentMonth && d.getFullYear() === year) { const day = d.getDate(); if (!eventsByDay[day]) eventsByDay[day] = []; eventsByDay[day].push(c); } } }); });
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
        {courses.filter((c) => c.assignments.some((a) => a.deadline && new Date(a.deadline) >= new Date())).sort((a, b) => (a.assignments[0]?.deadline ?? '').localeCompare(b.assignments[0]?.deadline ?? '')).slice(0, 5).map((c) => { const Icon = getIcon(c.icon_name); const dl = c.assignments.find((a) => a.deadline)?.deadline ?? ''; return <button key={c.id} className="upcoming-item" onClick={() => onSelect(c)}><div className={`course-icon ${c.accent}`}><Icon size={24} /></div><div><strong>{c.title}</strong><span><CalendarDays size={13} />{dl}</span></div><ChevronRight size={16} /></button>; })}
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

// ===================== ADMIN DASHBOARD =====================
function AdminDashboard({ t, courses, team, jobRoles, onNewCourse, onEditCourse, onDeleteCourse, onManagePersonnel, onManageRoles }: { t: typeof copy.ES; courses: CourseWithRelations[]; team: Profile[]; jobRoles: JobRole[]; onNewCourse: () => void; onEditCourse: (c: CourseWithRelations) => void; onDeleteCourse: (id: string) => void; onManagePersonnel: () => void; onManageRoles: () => void }) {
  const totalAssignments = courses.reduce((acc, c) => acc + c.assignments.length, 0);
  return <div className="page animate-in">
    <div className="page-heading"><div><p className="eyebrow">CENTRO DE CONTROL</p><h1>{t.adminPanel}</h1><p className="muted">{t.adminIntro}</p></div></div>
    <section className="stats-grid">
      <StatCard icon={<BookOpen />} value={String(courses.length)} label={t.manageCourses} tone="g1" />
      <StatCard icon={<Users />} value={String(team.length)} label={t.totalUsers} tone="g2" />
      <StatCard icon={<ShieldCheck />} value={String(jobRoles.length)} label={t.totalRoles} tone="g4" />
      <StatCard icon={<Settings />} value={String(totalAssignments)} label={t.manageAssignments} tone="g3" />
    </section>
    <div className="admin-dashboard-stack">
      <div className="section-card admin-card-primary"><div className="section-title"><div><h2>{t.manageCourses}</h2><p className="muted">{courses.length} {t.modules.toLowerCase()}</p></div><button className="primary-button" style={{ minHeight: 40, padding: '10px 14px', fontSize: 11 }} onClick={onNewCourse}><BookOpen size={15} />{t.manageCourseAction}</button></div>
        {courses.length === 0 ? <p className="muted" style={{ padding: '20px 0' }}>{t.noCourses}</p> :
        courses.map((c) => { const Icon = getIcon(c.icon_name); return <div key={c.id} className="admin-course-row"><div className={`course-icon ${c.accent}`}><Icon size={20} /></div><div><strong>{c.title}</strong><small>{c.modules.length} {t.modules} · {c.assignments.length} {t.assignedRole}s</small></div><div className="admin-course-actions"><button className="icon-button" onClick={() => onEditCourse(c)}><Settings size={16} /></button><button className="icon-button" onClick={() => onDeleteCourse(c.id)}><Trash2 size={16} /></button></div></div>; })}
      </div>
      <div className="admin-two-up">
        <div className="section-card"><div className="section-title"><div><h2>{t.managePersonnel}</h2><p className="muted">{team.length} {t.teamMembers.toLowerCase()}</p></div><button className="primary-button" style={{ minHeight: 40, padding: '10px 14px', fontSize: 11 }} onClick={onManagePersonnel}><Users size={15} />{t.managePersonnel}</button></div>
          {team.length === 0 ? <p className="muted" style={{ padding: '20px 0' }}>{t.noTeam}</p> :
          team.slice(0, 6).map((m) => <div key={m.id} className="admin-team-row"><div className="avatar avatar-small">{m.full_name.slice(0, 2).toUpperCase()}</div><div><strong>{m.full_name}</strong><small>{m.job_role} · {m.role === 'admin' ? t.admin : t.employee}</small></div></div>)}
        </div>
        <div className="section-card"><div className="section-title"><div><h2>{t.manageRoles}</h2><p className="muted">{jobRoles.length} {t.totalRoles.toLowerCase()}</p></div><button className="primary-button" style={{ minHeight: 40, padding: '10px 14px', fontSize: 11 }} onClick={onManageRoles}><ShieldCheck size={15} />{t.manageRoles}</button></div>
          {jobRoles.length === 0 ? <p className="muted" style={{ padding: '20px 0' }}>{t.noRoles}</p> :
          jobRoles.slice(0, 6).map((r) => <div key={r.id} className="admin-team-row"><div className="avatar avatar-small"><ShieldCheck size={16} /></div><div><strong>{r.name}</strong><small>{r.description}</small></div></div>)}
        </div>
      </div>
    </div>
  </div>;
}

// ===================== COURSE MANAGEMENT =====================
function CourseManagement({ t, courses, onNewCourse, onEditCourse, onDeleteCourse }: { t: typeof copy.ES; courses: CourseWithRelations[]; onNewCourse: () => void; onEditCourse: (c: CourseWithRelations) => void; onDeleteCourse: (id: string) => void }) {
  return <div className="page animate-in">
    <div className="page-heading">
      <div>
        <p className="eyebrow">GESTIÓN DE CURSOS</p>
        <h1>{t.manageCourses}</h1>
        <p className="muted">{courses.length} cursos registrados</p>
      </div>
      <button className="primary-button" onClick={onNewCourse}><Plus size={18} />{t.newCourse}</button>
    </div>

    <div className="section-card">
      {courses.length === 0 ? (
        <div className="empty-state"><BookOpen size={30} /><h3>{t.noCourses}</h3><button className="primary-button" onClick={onNewCourse} style={{ marginTop: 16 }}><Plus size={18} />{t.newCourse}</button></div>
      ) : (
        <div className="admin-list-stack">
          {courses.map((course) => {
            const Icon = getIcon(course.icon_name);
            return <div key={course.id} className="admin-course-row">
              <div className={`course-icon ${course.accent}`}><Icon size={20} /></div>
              <div className="course-row-info">
                <strong>{course.title}</strong>
                <small>{course.category} · {course.modules.length} {t.modules} · {course.assignments.length} {t.assignedRole}s</small>
              </div>
              <div className="admin-course-actions">
                <button className="icon-button" onClick={() => onEditCourse(course)}><Settings size={16} /></button>
                <button className="icon-button" onClick={() => onDeleteCourse(course.id)}><Trash2 size={16} /></button>
              </div>
            </div>;
          })}
        </div>
      )}
    </div>
  </div>;
}

// ===================== COURSE EDITOR =====================
type EditModule = { title: string; type: 'video' | 'text' | 'image'; duration: string; body: string; image_url: string; video_url: string };
type EditQuestion = { question: string; options: string; correct_index: number };
type EditAssignment = { job_role: string; deadline: string };

function CourseEditor({ t, profile, jobRoles, existingCourse, onSaved, onCancel }: { t: typeof copy.ES; profile: Profile; jobRoles: JobRole[]; existingCourse: CourseWithRelations | null; onSaved: () => void; onCancel: () => void }) {
  const [title, setTitle] = useState(existingCourse?.title ?? '');
  const [description, setDescription] = useState(existingCourse?.description ?? '');
  const [category, setCategory] = useState(existingCourse?.category ?? '');
  const [duration, setDuration] = useState(existingCourse?.duration ?? '');
  const [imageUrl, setImageUrl] = useState(existingCourse?.image_url ?? '');
  const [iconName, setIconName] = useState(existingCourse?.icon_name ?? 'BookOpen');
  const [accent, setAccent] = useState(existingCourse?.accent ?? 'gray-1');
  const [modules, setModules] = useState<EditModule[]>(existingCourse?.modules.map((m) => ({ title: m.title, type: m.type, duration: m.duration, body: m.body, image_url: m.image_url ?? '', video_url: m.video_url ?? '' })) ?? [{ title: '', type: 'text', duration: '', body: '', image_url: '', video_url: '' }]);
  const [questions, setQuestions] = useState<EditQuestion[]>(existingCourse?.exam_questions.map((q) => ({ question: q.question, options: q.options.join('\n'), correct_index: q.correct_index })) ?? []);
  const [assignments, setAssignments] = useState<EditAssignment[]>(existingCourse?.assignments.map((a) => ({ job_role: a.job_role, deadline: a.deadline ?? '' })) ?? [{ job_role: '', deadline: '' }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true); setError(null);
    const courseData = { title, description, category, duration, image_url: imageUrl, accent, icon_name: iconName };
    const moduleData = modules.filter((m) => m.title).map((m) => ({ title: m.title, type: m.type, duration: m.duration, body: m.body, image_url: m.type === 'image' ? m.image_url : null, video_url: m.type === 'video' ? m.video_url : null }));
    const questionData = questions.filter((q) => q.question).map((q) => ({ question: q.question, options: q.options.split('\n').filter(Boolean), correct_index: q.correct_index }));
    const assignmentData = assignments.filter((a) => a.job_role).map((a) => ({ job_role: a.job_role, deadline: a.deadline || null }));

    if (existingCourse) {
      const { error: uErr } = await supabase.from('courses').update(courseData).eq('id', existingCourse.id);
      if (uErr) { setError(uErr.message); setSaving(false); return; }
      await supabase.from('modules').delete().eq('course_id', existingCourse.id);
      await supabase.from('exam_questions').delete().eq('course_id', existingCourse.id);
      await supabase.from('course_assignments').delete().eq('course_id', existingCourse.id);
      if (moduleData.length > 0) await supabase.from('modules').insert(moduleData.map((m, i) => ({ ...m, course_id: existingCourse.id, order_index: i })));
      if (questionData.length > 0) await supabase.from('exam_questions').insert(questionData.map((q, i) => ({ ...q, course_id: existingCourse.id, order_index: i })));
      if (assignmentData.length > 0) await supabase.from('course_assignments').insert(assignmentData.map((a) => ({ ...a, course_id: existingCourse.id })));
      setSaving(false); onSaved();
    } else {
      const { error } = await createCourse(courseData, moduleData.map((m, i) => ({ ...m, order_index: i })), questionData.map((q, i) => ({ ...q, order_index: i })), assignmentData, profile.id);
      if (error) { setError(error); setSaving(false); return; }
      setSaving(false); onSaved();
    }
  };

  return <div className="page animate-in">
    <div className="page-heading"><div><p className="eyebrow">{existingCourse ? t.editCourse : t.newCourse}</p><h1>{t.courseEditor}</h1></div></div>
    <div className="editor-actions-row">
      <button className="outline-button editor-cancel-button" onClick={onCancel}>{t.cancel}</button>
      <button className="primary-button editor-save-button" onClick={handleSave} disabled={saving}>{saving ? t.loading : t.save}</button>
    </div>
    {error && <div className="auth-error" style={{ marginBottom: 16 }}><AlertCircle size={16} />{error}</div>}
    <div className="editor-section">
      <h2>{t.courseTitle}</h2>
      <div className="editor-grid">
        <div className="editor-input-block">
          <label>{t.courseTitle}</label>
          <input className="auth-input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="editor-input-block">
          <label>{t.courseDescription}</label>
          <input className="auth-input" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="editor-input-block">
          <label>{t.courseCategory}</label>
          <input className="auth-input" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div className="editor-input-block">
          <label>{t.courseDuration}</label>
          <input className="auth-input" value={duration} onChange={(e) => setDuration(e.target.value)} />
        </div>
        <div className="editor-input-block">
          <label>{t.courseImage}</label>
          <input className="auth-input" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>
        <div className="editor-input-block">
          <label>{t.courseIcon}</label>
          <select className="auth-input" value={iconName} onChange={(e) => setIconName(e.target.value)}>{availableIcons.map((i) => <option key={i} value={i}>{i}</option>)}</select>
        </div>
        <div className="editor-input-block editor-input-block-full">
          <label>{t.courseAccent}</label>
          <select className="auth-input" value={accent} onChange={(e) => setAccent(e.target.value)}>{availableAccents.map((a) => <option key={a} value={a}>{a}</option>)}</select>
        </div>
      </div>
    </div>
    <div className="editor-section">
      <div className="section-title"><div><h2>{t.modules}</h2></div><button className="outline-button" onClick={() => setModules([...modules, { title: '', type: 'text', duration: '', body: '', image_url: '', video_url: '' }])}><Plus size={16} />{t.addModule}</button></div>
      {modules.map((m, i) => <div key={i} className="editor-module-card">
        <div className="editor-module-header"><strong>Módulo {i + 1}</strong>{modules.length > 1 && <button className="icon-button" onClick={() => setModules(modules.filter((_, idx) => idx !== i))}><Trash2 size={16} /></button>}</div>
        <input className="auth-input" placeholder={t.moduleTitle} value={m.title} onChange={(e) => { const n = [...modules]; n[i] = { ...m, title: e.target.value }; setModules(n); }} />
        <div className="editor-select-row"><label>{t.moduleType}</label><select className="auth-input" value={m.type} onChange={(e) => { const n = [...modules]; n[i] = { ...m, type: e.target.value as 'video' | 'text' | 'image' }; setModules(n); }}><option value="text">{t.textModule}</option><option value="video">{t.videoModule}</option><option value="image">{t.imageModule}</option></select></div>
        <input className="auth-input" placeholder={t.moduleDuration} value={m.duration} onChange={(e) => { const n = [...modules]; n[i] = { ...m, duration: e.target.value }; setModules(n); }} />
        <textarea className="auth-input" placeholder={t.moduleBody} value={m.body} onChange={(e) => { const n = [...modules]; n[i] = { ...m, body: e.target.value }; setModules(n); }} rows={3} />
        {m.type === 'image' && <input className="auth-input" placeholder={t.moduleImage} value={m.image_url} onChange={(e) => { const n = [...modules]; n[i] = { ...m, image_url: e.target.value }; setModules(n); }} />}
        {m.type === 'video' && <input className="auth-input" placeholder={t.moduleVideo} value={m.video_url} onChange={(e) => { const n = [...modules]; n[i] = { ...m, video_url: e.target.value }; setModules(n); }} />}
      </div>)}
    </div>
    <div className="editor-section">
      <div className="section-title"><div><h2>{t.exam}</h2></div><button className="outline-button" onClick={() => setQuestions([...questions, { question: '', options: '', correct_index: 0 }])}><Plus size={16} />{t.addQuestion}</button></div>
      {questions.map((q, i) => <div key={i} className="editor-module-card">
        <div className="editor-module-header"><strong>{t.question} {i + 1}</strong>{questions.length > 1 && <button className="icon-button" onClick={() => setQuestions(questions.filter((_, idx) => idx !== i))}><Trash2 size={16} /></button>}</div>
        <input className="auth-input" placeholder={t.questionText} value={q.question} onChange={(e) => { const n = [...questions]; n[i] = { ...q, question: e.target.value }; setQuestions(n); }} />
        <textarea className="auth-input" placeholder={t.options} value={q.options} onChange={(e) => { const n = [...questions]; n[i] = { ...q, options: e.target.value }; setQuestions(n); }} rows={4} />
        <input className="auth-input" type="number" min={0} placeholder={t.correctOption} value={q.correct_index} onChange={(e) => { const n = [...questions]; n[i] = { ...q, correct_index: parseInt(e.target.value) || 0 }; setQuestions(n); }} />
      </div>)}
    </div>
    <div className="editor-section">
      <div className="section-title"><div><h2>{t.manageAssignments}</h2></div><button className="outline-button" onClick={() => setAssignments([...assignments, { job_role: '', deadline: '' }])}><Plus size={16} />{t.addAssignment}</button></div>
      {assignments.map((a, i) => <div key={i} className="editor-assignment-row">
        <select className="auth-input" value={a.job_role} onChange={(e) => { const n = [...assignments]; n[i] = { ...a, job_role: e.target.value }; setAssignments(n); }}>
          <option value="">{t.selectRole}</option>
          {jobRoles.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
        </select>
        <input className="auth-input" type="date" value={a.deadline} onChange={(e) => { const n = [...assignments]; n[i] = { ...a, deadline: e.target.value }; setAssignments(n); }} />
        {assignments.length > 1 && <button className="icon-button" onClick={() => setAssignments(assignments.filter((_, idx) => idx !== i))}><Trash2 size={16} /></button>}
      </div>)}
    </div>
  </div>;
}

// ===================== PERSONNEL MANAGEMENT =====================
function PersonnelManagement({ t, team, jobRoles, onRefresh, onDeleteUser }: { t: typeof copy.ES; team: Profile[]; jobRoles: JobRole[]; onRefresh: () => void; onDeleteUser: (id: string) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [role, setRole] = useState<'employee' | 'admin'>('employee');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => { setName(''); setEmail(''); setPassword(''); setJobRole(''); setRole('employee'); setError(null); setEditingUser(null); setShowForm(false); };

  const handleSubmit = async () => {
    setError(null);
    if (!name || !email || !jobRole) { setError(language_ES(t)); return; }
    setSaving(true);
    if (editingUser) {
      const { error: err } = await updateProfile(editingUser.id, { full_name: name, job_role: jobRole, role });
      if (err) { setError(err); setSaving(false); return; }
    } else {
      if (!password) { setError(t.personPassword); setSaving(false); return; }
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` },
        body: JSON.stringify({ email, password, full_name: name, job_role: jobRole, role }),
      });
      const result = await response.json();
      if (!response.ok || result.error) { setError(result.error ?? 'Error'); setSaving(false); return; }
    }
    setSaving(false);
    resetForm();
    onRefresh();
  };

  const startEdit = (p: Profile) => {
    setEditingUser(p);
    setName(p.full_name);
    setEmail(p.email ?? '');
    setPassword('');
    setJobRole(p.job_role);
    setRole(p.role);
    setShowForm(true);
  };

  return <div className="page animate-in">
    <div className="page-heading"><div><p className="eyebrow">GESTIÓN DE PERSONAL</p><h1>{t.managePersonnel}</h1><p className="muted">{team.length} {t.teamMembers.toLowerCase()}</p></div><button className="primary-button" onClick={() => { resetForm(); setShowForm(true); }}><Plus size={18} />{t.newUser}</button></div>
    {showForm && createPortal(<div className="modal-backdrop" onClick={resetForm}><div className="course-modal" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={resetForm}><X size={19} /></button>
      <div className="modal-body">
        <h2>{editingUser ? t.editUser : t.newUser}</h2>
        {error && <div className="auth-error" style={{ marginBottom: 12 }}><AlertCircle size={16} />{error}</div>}
        <div className="modal-form-grid" style={{ marginTop: 10 }}>
          <div className="field-group"><label>{t.personName}</label><input className="auth-input" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="field-group"><label>{t.personEmail}</label><input className="auth-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!!editingUser} /></div>
          {!editingUser && <div className="field-group"><label>{t.personPassword}</label><input className="auth-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>}
          <div className="field-group"><label>{t.selectRole}</label><select className="auth-input" value={jobRole} onChange={(e) => setJobRole(e.target.value)}>
            <option value="">{t.selectRole}</option>
            {jobRoles.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
          </select></div>
          <div className="field-group field-group-full"><label>{t.role}</label><div className="auth-role-select">
            <button className={role === 'employee' ? 'active' : ''} onClick={() => setRole('employee')}><Users size={16} />{t.employee}</button>
            <button className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')}><Settings size={16} />{t.admin}</button>
          </div></div>
        </div>
        <div className="form-actions-row" style={{ marginTop: 4 }}>
          <button className="outline-button" onClick={resetForm}>{t.cancel}</button>
          <button className="primary-button" onClick={handleSubmit} disabled={saving}>{saving ? t.loading : t.saveUser}</button>
        </div>
      </div>
    </div></div>, document.body)}
    <div className="section-card">
      {team.length === 0 ? <p className="muted" style={{ padding: '20px 0' }}>{t.noTeam}</p> :
      <div className="team-table">{team.map((m) => <div key={m.id} className="admin-team-row">
        <div className="avatar avatar-small">{m.full_name.slice(0, 2).toUpperCase()}</div>
        <div><strong>{m.full_name}</strong><small>{m.job_role}</small></div>
        <span className={`team-role-badge ${m.role}`}>{m.role === 'admin' ? t.admin : t.employee}</span>
        <div className="admin-course-actions">
          <button className="icon-button" onClick={() => startEdit(m)}><Settings size={16} /></button>
          <button className="icon-button" onClick={() => onDeleteUser(m.id)}><Trash2 size={16} /></button>
        </div>
      </div>)}</div>}
    </div>
  </div>;
}

function language_ES(t: typeof copy.ES) { return t.name + ' / ' + t.personEmail; }

// ===================== ROLE MANAGEMENT =====================
function RoleManagement({ t, jobRoles, courses, onRefresh, onEditRole, onDeleteRole, onRoleDetail }: { t: typeof copy.ES; jobRoles: JobRole[]; courses: CourseWithRelations[]; onRefresh: () => void; onEditRole: (r: JobRole) => void; onDeleteRole: (id: string) => void; onRoleDetail: (r: JobRole) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name) { setError(t.roleName); return; }
    setSaving(true);
    const { error: err } = await createJobRole(name, description);
    if (err) { setError(err); setSaving(false); return; }
    setSaving(false); setName(''); setDescription(''); setShowForm(false); setError(null);
    onRefresh();
  };

  const getCourseCount = (roleName: string) => courses.reduce((acc, c) => acc + c.assignments.filter((a) => a.job_role === roleName).length, 0);

  return <div className="page animate-in">
    <div className="page-heading"><div><p className="eyebrow">GESTIÓN DE CARGOS</p><h1>{t.manageRoles}</h1><p className="muted">{jobRoles.length} {t.totalRoles.toLowerCase()}</p></div><button className="primary-button" onClick={() => setShowForm(true)}><Plus size={18} />{t.newRole}</button></div>
    {showForm && createPortal(<div className="modal-backdrop" onClick={() => setShowForm(false)}><div className="course-modal" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setShowForm(false)}><X size={19} /></button>
      <div className="modal-body">
        <h2>{t.newRole}</h2>
        {error && <div className="auth-error" style={{ marginBottom: 12 }}><AlertCircle size={16} />{error}</div>}
        <div className="modal-form-grid" style={{ marginTop: 10 }}>
          <div className="field-group field-group-full"><label>{t.roleName}</label><input className="auth-input" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="field-group field-group-full"><label>{t.roleDescription}</label><input className="auth-input" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        </div>
        <div className="form-actions-row" style={{ marginTop: 4 }}>
          <button className="outline-button" onClick={() => setShowForm(false)}>{t.cancel}</button>
          <button className="primary-button" onClick={handleSubmit} disabled={saving}>{saving ? t.loading : t.saveRole}</button>
        </div>
      </div>
    </div></div>, document.body)}
    <div className="section-card">
      {jobRoles.length === 0 ? (
        <div className="empty-state"><ShieldCheck size={30} /><h3>{t.noRoles}</h3><button className="primary-button" onClick={() => setShowForm(true)} style={{ marginTop: 16 }}><Plus size={18} />{t.newRole}</button></div>
      ) : (
        <div className="team-table">{jobRoles.map((r) => <div key={r.id} className="admin-team-row">
          <div className="avatar avatar-small"><ShieldCheck size={16} /></div>
          <div><strong>{r.name}</strong><small>{r.description || '—'}</small></div>
          <span className="team-role-badge">{getCourseCount(r.name)} {t.assignedCourses.toLowerCase()}</span>
          <div className="admin-course-actions">
            <button className="icon-button" onClick={() => onRoleDetail(r)}><BookOpen size={16} /></button>
            <button className="icon-button" onClick={() => onEditRole(r)}><Settings size={16} /></button>
            <button className="icon-button" onClick={() => onDeleteRole(r.id)}><Trash2 size={16} /></button>
          </div>
        </div>)}</div>
      )}
    </div>
  </div>;
}

// ===================== ROLE EDITOR MODAL =====================
function RoleEditorModal({ t, existingRole, onClose, onSaved }: { t: typeof copy.ES; existingRole: JobRole; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(existingRole.name);
  const [description, setDescription] = useState(existingRole.description);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    const { error: err } = await updateJobRole(existingRole.id, name, description);
    if (err) { setError(err); setSaving(false); return; }
    setSaving(false); onSaved();
  };

  return createPortal(<div className="modal-backdrop" onClick={onClose}><div className="course-modal" onClick={(e) => e.stopPropagation()}>
    <button className="modal-close" onClick={onClose}><X size={19} /></button>
    <div className="modal-body">
      <h2>{t.editRole}</h2>
      {error && <div className="auth-error" style={{ marginBottom: 12 }}><AlertCircle size={16} />{error}</div>}
      <div className="modal-form-grid">
        <div className="field-group field-group-full"><label>{t.roleName}</label><input className="auth-input" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="field-group field-group-full"><label>{t.roleDescription}</label><input className="auth-input" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
      </div>
      <div className="form-actions-row">
        <button className="outline-button" onClick={onClose}>{t.cancel}</button>
        <button className="primary-button" onClick={handleSave} disabled={saving}>{saving ? t.loading : t.saveRole}</button>
      </div>
    </div>
  </div></div>, document.body);
}

// ===================== ROLE DETAIL (assign courses to role) =====================
function RoleDetail({ t, role, courses, onBack, onRefresh }: { t: typeof copy.ES; role: JobRole; courses: CourseWithRelations[]; onBack: () => void; onRefresh: () => void }) {
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const assignedCourses = courses.filter((c) => c.assignments.some((a) => a.job_role === role.name));
  const unassignedCourses = courses.filter((c) => !c.assignments.some((a) => a.job_role === role.name));

  const handleAssign = async () => {
    if (!selectedCourseId) { setError(t.selectCourse); return; }
    setSaving(true);
    const { error: err } = await assignCourseToRole(selectedCourseId, role.name, deadline || null);
    if (err) { setError(err); setSaving(false); return; }
    setSaving(false); setSelectedCourseId(''); setDeadline(''); setError(null);
    onRefresh();
  };

  const handleRemove = async (assignmentId: string) => {
    await removeAssignment(assignmentId);
    onRefresh();
  };

  return <div className="page animate-in">
    <div className="page-heading"><div><p className="eyebrow">{t.roleManagement}</p><h1>{role.name}</h1><p className="muted">{role.description}</p></div><button className="outline-button" onClick={onBack}><ArrowLeft size={18} />{t.backToAdmin}</button></div>
    <div className="admin-grid">
      <div className="section-card">
        <div className="section-title"><div><h2>{t.assignedCourses}</h2><p className="muted">{assignedCourses.length} {t.modules.toLowerCase()}</p></div></div>
        {assignedCourses.length === 0 ? <p className="muted" style={{ padding: '20px 0' }}>{t.noRoleAssignments}</p> :
        assignedCourses.map((c) => { const Icon = getIcon(c.icon_name); const assignment = c.assignments.find((a) => a.job_role === role.name); return <div key={c.id} className="admin-course-row"><div className={`course-icon ${c.accent}`}><Icon size={20} /></div><div><strong>{c.title}</strong><small>{c.modules.length} {t.modules}{assignment?.deadline ? ` · ${t.deadlineCol}: ${assignment.deadline}` : ''}</small></div><div className="admin-course-actions"><button className="icon-button" onClick={() => assignment && handleRemove(assignment.id)}><Trash2 size={16} /></button></div></div>; })}
      </div>
      <div className="section-card">
        <div className="section-title"><div><h2>{t.assignCourse}</h2></div></div>
        {error && <div className="auth-error" style={{ marginBottom: 12 }}><AlertCircle size={16} />{error}</div>}
        {unassignedCourses.length === 0 && courses.length > 0 ? <p className="muted" style={{ padding: '20px 0' }}>{t.noCourses}</p> :
        <div className="editor-grid">
          <select className="auth-input" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
            <option value="">{t.selectCourse}</option>
            {unassignedCourses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <input className="auth-input" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>}
        <div style={{ marginTop: 12 }}>
          <button className="primary-button" onClick={handleAssign} disabled={saving || !selectedCourseId}><Plus size={16} />{t.addCourse}</button>
        </div>
      </div>
    </div>
  </div>;
}

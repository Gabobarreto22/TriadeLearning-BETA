import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, Award, BarChart3, Bell, BookOpen, CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Download, FileText, Image as ImageIcon, LayoutDashboard, LockKeyhole, Menu, Moon, Pause, Play, Plus, RotateCcw, Search, Settings, ShieldCheck, Star, Sun, Trash2, Users, Video, Volume2, VolumeX, X, Zap, History, Trophy, User,
} from 'lucide-react';
import { useAuth } from './lib/auth';
import { useToast } from './lib/toast';
import { supabase, type Profile, type CourseWithRelations, type JobRole } from './lib/supabase';
import {
  fetchCoursesForRole, fetchAllCourses, fetchModuleProgress, fetchExamResults,
  markModuleComplete, saveExamResult, ensureUserCourseRequirement,
  fetchAllProfiles, fetchJobRoles, fetchDepartments,
  fetchUserCourseRequirements, fetchAllModuleProgress, fetchAllExamAttempts,
  fetchAllCertificates, fetchRoleCertifications, fetchAllNotifications,
  fetchAllFeedback, fetchBadges, fetchUserBadges, fetchSystemSettings, fetchAuditLogs,
  fetchUserCourseRequirementsForUser, saveCourseFeedback,
} from './lib/data';
import { getIcon, availableIcons, availableAccents } from './lib/icons';
import { PersonnelModule } from '@/components/admin/PersonnelModule';
import { CoursesModule } from '@/components/admin/CoursesModule';
import { DashboardModule, CertificationsModule, FeedbackModule, NotificationsModule, ReportsModule, SettingsModule, AuditModule } from '@/components/admin/IndependentModules';
import { DocumentationModule } from '@/components/admin/DocumentationModule';
import { HelpButton } from '@/components/admin/HelpButton';
import { docSummaryMap } from '@/lib/docs';
import { adminStringsES } from '@/components/admin/strings';
import type { AdminData, AdminView } from '@/components/admin/types';
import { EmployeeNotifications, EmployeeGamification, EmployeeCertifications, EmployeeProfile, CourseFeedbackModal, type EmployeeStrings } from '@/components/employee/EmployeeModules';
import { PaginatedList } from '@/components/PaginatedList';

type Language = 'ES' | 'EN';
type View = 'dashboard' | 'catalog' | 'certificates' | 'calendar' | 'player' | 'exam' | 'notifications' | 'gamification' | 'profile';
type AdminTab = 'dashboard' | 'personnel' | 'courses' | 'certifications' | 'feedback' | 'notifications' | 'reports' | 'settings' | 'audit' | 'documentation';
type ExamType = 'direct' | 'course' | 'module';

type YouTubePlayerApi = {
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  destroy: () => void;
  getIframe: () => HTMLIFrameElement;
};

type YouTubeApi = {
  PlayerState: { PLAYING: number; ENDED: number };
  Player: new (element: HTMLElement, options: {
    videoId: string;
    playerVars: Record<string, number | string>;
    events: {
      onReady: (event: { target: YouTubePlayerApi }) => void;
      onStateChange: (event: { data: number }) => void;
    };
  }) => YouTubePlayerApi;
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiLoad: Promise<void> | undefined;

function loadYouTubeIframeApi() {
  if (window.YT?.Player) return Promise.resolve();
  if (youtubeApiLoad) return youtubeApiLoad;

  youtubeApiLoad = new Promise<void>((resolve, reject) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve();
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.onerror = () => reject(new Error('No se pudo cargar el reproductor de YouTube'));
    document.head.appendChild(script);
  });

  return youtubeApiLoad;
}

const copy = {
  ES: {
    signIn: 'Iniciar sesión', signUp: 'Crear cuenta', email: 'Correo electrónico', password: 'Contraseña', fullName: 'Nombre completo', jobRole: 'Cargo', role: 'Rol', employee: 'Empleado', admin: 'Administrador', welcome: 'Buenos días', subtitle: 'Aquí tienes un resumen de tu aprendizaje.', dashboard: 'Panel principal', catalog: 'Catálogo de cursos', certificates: 'Mis certificados', adminPanel: 'Administración', calendar: 'Calendario', assigned: 'Cursos asignados', progress: 'Progreso total', certificatesStat: 'Certificados', hours: 'Horas de aprendizaje', continue: 'Continúa aprendiendo', viewAll: 'Ver todos', deadline: 'Próximas fechas', seeCertificate: 'Ver certificado', catalogIntro: 'Formación seleccionada para tu cargo', search: 'Buscar cursos', all: 'Todos', completed: 'Completados', inProgress: 'En progreso', notStarted: 'No iniciados', roleTag: 'Técnico de Mantenimiento', start: 'Comenzar curso', resume: 'Continuar curso', empty: 'No hay cursos con este filtro.', adminIntro: 'Gestiona el aprendizaje de tu organización.', team: 'Equipo activo', completion: 'Completación promedio', roles: 'Cargos con acceso', player: 'Reproductor del curso', exam: 'Evaluación', question: 'Pregunta', of: 'de', nextQ: 'Siguiente', prevQ: 'Anterior', passed: '¡Felicitaciones! Has aprobado.', failed: 'No has alcanzado el 90%. Puedes volver a intentarlo.', retry: 'Reintentar', backToCatalog: 'Volver al catálogo', passThreshold: 'Mínimo para aprobar: 90%', correctAnswers: 'Respuestas correctas', finishExam: 'Finalizar y ver resultado', certificate: 'Certificado de finalización', awardedTo: 'Otorgado a', courseLabel: 'Por completar satisfactoriamente', certId: 'Identificación única', issueDate: 'Fecha de emisión', downloadCert: 'Descargar', printCert: 'Imprimir', upcomingCourses: 'Cursos próximos', activeCourses: 'Cursos activos', calendarIntro: 'Cursos y evaluaciones programados', moduleProgress: 'Módulos completados', takeExam: 'Realizar evaluación', modules: 'Módulos', videoModule: 'Video', textModule: 'Lectura', imageModule: 'Infografía', directExam: 'Prueba directa', courseExam: 'Prueba de aprobación', directExamDesc: 'Evalúa tu conocimiento previo. Si repruebas, deberás completar el curso obligatoriamente.', courseExamDesc: 'Evaluación final del curso. Se aprueba con 90%.', takeDirectExam: 'Realizar prueba directa', takeCourseExam: 'Realizar prueba de aprobación', examLocked: 'Bloqueada', modulesRequired: 'Completa todos los módulos para desbloquear', directFailed: 'Has reprobado la prueba directa', directFailedDesc: 'Ahora debes completar todos los módulos del curso obligatoriamente. La prueba directa queda bloqueada.', courseExamReadyDesc: 'Has completado todos los módulos. Ya puedes realizar la evaluación final.', moduleComplete: 'Módulo completado', goToExam: 'Ir a la evaluación', goToCourse: 'Ir al curso', exitCourse: 'Salir del curso', exitWarningTitle: '¿Seguro que deseas salir?', exitWarningDesc: 'Si abandonas el curso ahora, deberás repetir el módulo actual desde el principio. Tu progreso no se guardará para este módulo.', exitWarningStay: 'Quedarme y continuar', exitWarningLeave: 'Salir de todos modos', signOut: 'Cerrar sesión', loading: 'Cargando...', noCourses: 'Aún no tienes cursos asignados para tu cargo.', newCourse: 'Nuevo curso', editCourse: 'Editar curso', courseEditor: 'Editor de curso', courseTitle: 'Título del curso', courseDescription: 'Descripción', courseCategory: 'Categoría', courseDuration: 'Duración', courseImage: 'URL de imagen del curso', courseIcon: 'Ícono', courseAccent: 'Color de acento', moduleTitle: 'Título del módulo', moduleType: 'Tipo de módulo', moduleDuration: 'Duración del módulo', moduleBody: 'Contenido del módulo', moduleImage: 'URL de imagen (para módulos tipo imagen)', moduleVideo: 'URL de video (para módulos tipo video)', addModule: 'Agregar módulo', addQuestion: 'Agregar pregunta', questionText: 'Pregunta', options: 'Opciones (una por línea)', correctOption: 'Índice de respuesta correcta (0-based)', assignToRole: 'Asignar a cargo', assignDeadline: 'Fecha límite (opcional)', addAssignment: 'Asignar a otro cargo', save: 'Guardar curso', cancel: 'Cancelar', delete: 'Eliminar', manageCourses: 'Gestionar cursos', manageCourseAction: 'Gestionar curso', manageTeam: 'Equipo', manageAssignments: 'Asignaciones', teamMembers: 'Miembros del equipo', name: 'Nombre', jobRoleCol: 'Cargo', roleCol: 'Rol', noTeam: 'No hay miembros registrados.', assignmentsTitle: 'Asignaciones de cursos', courseCol: 'Curso', assignedRole: 'Cargo asignado', deadlineCol: 'Fecha límite', noAssignments: 'No hay asignaciones creadas.', deleteConfirm: '¿Seguro que deseas eliminar este curso? Esta acción no se puede deshacer.', saved: 'Curso guardado correctamente', errorSaving: 'Error al guardar el curso', selectCourse: 'Selecciona un curso para ver los detalles', managePersonnel: 'Gestión de personal', manageRoles: 'Gestión de cargos', newRole: 'Nuevo cargo', editRole: 'Editar cargo', roleName: 'Nombre del cargo', roleDescription: 'Descripción', saveRole: 'Guardar cargo', newUser: 'Nuevo usuario', editUser: 'Editar usuario', createUser: 'Crear usuario', deleteUser: 'Eliminar usuario', deleteUserConfirm: '¿Seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.', deleteRoleConfirm: '¿Seguro que deseas eliminar este cargo?', noRoles: 'No hay cargos creados.', assignedCourses: 'Cursos asignados', assignCourse: 'Asignar curso', removeAssignment: 'Quitar asignación', noRoleAssignments: 'Este cargo no tiene cursos asignados.', selectRole: 'Selecciona un cargo', coursesForRole: 'Cursos para este cargo', addCourse: 'Agregar curso', personName: 'Nombre', personEmail: 'Correo electrónico', personPassword: 'Contraseña', personRole: 'Rol del usuario', saveUser: 'Guardar usuario', roleManagement: 'Gestión de cargos', personnelManagement: 'Gestión de personal', totalRoles: 'Cargos totales', totalUsers: 'Usuarios totales', backToAdmin: 'Volver al panel',
    notifications: 'Notificaciones', noNotifications: 'No hay notificaciones', markAllRead: 'Marcar todas como leídas', gamification: 'Gamificación', myProfile: 'Mi perfil', roleCertification: 'Certificación de cargo', noCertificates: 'No tienes certificados aún', noRoleCerts: 'No tienes certificaciones de cargo', noBadges: 'Aún no has ganado insignias', pointsAccumulated: 'Puntos acumulados', badgesEarned: 'Insignias obtenidas', nextBadges: 'Próximas insignias', questionBreakdown: 'Desglose de preguntas', correctQuestion: 'Correcta', incorrectQuestion: 'Incorrecta', selectedAnswer: 'Tu respuesta', correctAnswer: 'Respuesta correcta', noAnswer: 'Sin responder', personalInfo: 'Información personal', jobHistory: 'Historial de cargos', editProfile: 'Editar perfil', saveProfile: 'Guardar perfil', hireDate: 'Fecha de ingreso', currentRoleSince: 'En cargo desde', changePassword: 'Cambiar contraseña', newPassword: 'Nueva contraseña', confirmPassword: 'Confirmar contraseña', updatePassword: 'Actualizar contraseña', passwordChanged: 'Contraseña actualizada correctamente', passwordMismatch: 'Las contraseñas no coinciden', passwordTooShort: 'La contraseña debe tener al menos 6 caracteres', stats: 'Estadísticas', coursesCompleted: 'Cursos completados', coursesInProgress: 'Cursos en progreso', totalPoints: 'Puntos totales', certifiedRole: 'Cargo certificado', certifiedOn: 'Certificado el', expiresOn: 'Expira el', valid: 'Vigente', expired: 'Expirado', noJobHistory: 'No hay historial de cargos', startDate: 'Fecha de inicio', endDate: 'Fecha de fin', reason: 'Razón', currentRole: 'Cargo actual', verifyCert: 'Verificar', certNumber: 'Número de certificado', issuedOn: 'Emitido el', viewBadge: 'Ver insignia', locked: 'Bloqueada', recentActivity: 'Actividad reciente', unread: 'sin leer', profileUpdated: 'Perfil actualizado correctamente', errorUpdating: 'Error al actualizar el perfil', allBadges: 'Todas las insignias', earnedBadges: 'Insignias obtenidas', availableBadges: 'Insignias disponibles', badgePoints: 'Puntos de insignia', badgeCategory: 'Categoría de insignia', earnedOn: 'Obtenida el',
  },
  EN: {
    signIn: 'Sign in', signUp: 'Sign up', email: 'Email', password: 'Password', fullName: 'Full name', jobRole: 'Job role', role: 'Role', employee: 'Employee', admin: 'Administrator', welcome: 'Good morning', subtitle: 'Here is a summary of your learning.', dashboard: 'Dashboard', catalog: 'Course catalog', certificates: 'My certificates', adminPanel: 'Administration', calendar: 'Calendar', assigned: 'Assigned courses', progress: 'Overall progress', certificatesStat: 'Certificates', hours: 'Learning hours', continue: 'Continue learning', viewAll: 'View all', deadline: 'Upcoming dates', seeCertificate: 'View certificate', catalogIntro: 'Learning selected for your role', search: 'Search courses', all: 'All', completed: 'Completed', inProgress: 'In progress', notStarted: 'Not started', roleTag: 'Maintenance Technician', start: 'Start course', resume: 'Continue course', empty: 'No courses match this filter.', adminIntro: 'Manage learning across your organization.', team: 'Active team', completion: 'Average completion', roles: 'Roles with access', player: 'Course player', exam: 'Assessment', question: 'Question', of: 'of', nextQ: 'Next', prevQ: 'Previous', passed: 'Congratulations! You passed.', failed: 'You did not reach 90%. You can try again.', retry: 'Retry', backToCatalog: 'Back to catalog', passThreshold: 'Minimum to pass: 90%', correctAnswers: 'Correct answers', finishExam: 'Finish and see result', certificate: 'Certificate of completion', awardedTo: 'Awarded to', courseLabel: 'For successfully completing', certId: 'Unique ID', issueDate: 'Issue date', downloadCert: 'Download', printCert: 'Print', upcomingCourses: 'Upcoming courses', activeCourses: 'Active courses', calendarIntro: 'Scheduled courses and assessments', moduleProgress: 'Modules completed', takeExam: 'Take assessment', modules: 'Modules', videoModule: 'Video', textModule: 'Reading', imageModule: 'Infographic', directExam: 'Direct test', courseExam: 'Course approval test', directExamDesc: 'Assess your prior knowledge. If you fail, you must complete the course mandatorily.', courseExamDesc: 'Final course assessment. Pass with 90%.', takeDirectExam: 'Take direct test', takeCourseExam: 'Take final assessment', examLocked: 'Locked', modulesRequired: 'Complete all modules to unlock', directFailed: 'You failed the direct test', directFailedDesc: 'You must now complete all course modules mandatorily. The direct test is locked.', courseExamReadyDesc: 'You have completed all modules. You can now take the final assessment.', moduleComplete: 'Module completed', goToExam: 'Go to assessment', goToCourse: 'Go to course', exitCourse: 'Exit course', exitWarningTitle: 'Are you sure you want to leave?', exitWarningDesc: 'If you leave the course now, you will have to restart the current module from the beginning. Your progress for this module will not be saved.', exitWarningStay: 'Stay and continue', exitWarningLeave: 'Leave anyway', signOut: 'Sign out', loading: 'Loading...', noCourses: 'No courses assigned to your role yet.', newCourse: 'New course', editCourse: 'Edit course', courseEditor: 'Course editor', courseTitle: 'Course title', courseDescription: 'Description', courseCategory: 'Category', courseDuration: 'Duration', courseImage: 'Course image URL', courseIcon: 'Icon', courseAccent: 'Accent color', moduleTitle: 'Module title', moduleType: 'Module type', moduleDuration: 'Module duration', moduleBody: 'Module content', moduleImage: 'Image URL (for image-type modules)', moduleVideo: 'Video URL (for video-type modules)', addModule: 'Add module', addQuestion: 'Add question', questionText: 'Question', options: 'Options (one per line)', correctOption: 'Correct answer index (0-based)', assignToRole: 'Assign to role', assignDeadline: 'Deadline (optional)', addAssignment: 'Assign to another role', save: 'Save course', cancel: 'Cancel', delete: 'Delete', manageCourses: 'Manage courses', manageCourseAction: 'Manage course', manageTeam: 'Team', manageAssignments: 'Assignments', teamMembers: 'Team members', name: 'Name', jobRoleCol: 'Job role', roleCol: 'Role', noTeam: 'No members registered.', assignmentsTitle: 'Course assignments', courseCol: 'Course', assignedRole: 'Assigned role', deadlineCol: 'Deadline', noAssignments: 'No assignments created.', deleteConfirm: 'Are you sure you want to delete this course? This action cannot be undone.', saved: 'Course saved successfully', errorSaving: 'Error saving course', selectCourse: 'Select a course to see details', managePersonnel: 'Personnel management', manageRoles: 'Role management', newRole: 'New role', editRole: 'Edit role', roleName: 'Role name', roleDescription: 'Description', saveRole: 'Save role', newUser: 'New user', editUser: 'Edit user', createUser: 'Create user', deleteUser: 'Delete user', deleteUserConfirm: 'Are you sure you want to delete this user? This action cannot be undone.', deleteRoleConfirm: 'Are you sure you want to delete this role?', noRoles: 'No roles created.', assignedCourses: 'Assigned courses', assignCourse: 'Assign course', removeAssignment: 'Remove assignment', noRoleAssignments: 'This role has no assigned courses.', selectRole: 'Select a role', coursesForRole: 'Courses for this role', addCourse: 'Add course', personName: 'Name', personEmail: 'Email', personPassword: 'Password', personRole: 'User role', saveUser: 'Save user', roleManagement: 'Role management', personnelManagement: 'Personnel management', totalRoles: 'Total roles', totalUsers: 'Total users', backToAdmin: 'Back to dashboard',
    notifications: 'Notifications', noNotifications: 'No notifications', markAllRead: 'Mark all as read', gamification: 'Gamification', myProfile: 'My profile', roleCertification: 'Role certification', noCertificates: 'No certificates yet', noRoleCerts: 'No role certifications', noBadges: 'No badges earned yet', pointsAccumulated: 'Points accumulated', badgesEarned: 'Badges earned', nextBadges: 'Next badges', questionBreakdown: 'Question breakdown', correctQuestion: 'Correct', incorrectQuestion: 'Incorrect', selectedAnswer: 'Your answer', correctAnswer: 'Correct answer', noAnswer: 'Not answered', personalInfo: 'Personal information', jobHistory: 'Job history', editProfile: 'Edit profile', saveProfile: 'Save profile', hireDate: 'Hire date', currentRoleSince: 'Current role since', changePassword: 'Change password', newPassword: 'New password', confirmPassword: 'Confirm password', updatePassword: 'Update password', passwordChanged: 'Password changed successfully', passwordMismatch: 'Passwords do not match', passwordTooShort: 'Password must be at least 6 characters', stats: 'Statistics', coursesCompleted: 'Courses completed', coursesInProgress: 'Courses in progress', totalPoints: 'Total points', certifiedRole: 'Certified role', certifiedOn: 'Certified on', expiresOn: 'Expires on', valid: 'Valid', expired: 'Expired', noJobHistory: 'No job history', startDate: 'Start date', endDate: 'End date', reason: 'Reason', currentRole: 'Current role', verifyCert: 'Verify', certNumber: 'Certificate number', issuedOn: 'Issued on', viewBadge: 'View badge', locked: 'Locked', recentActivity: 'Recent activity', unread: 'unread', profileUpdated: 'Profile updated successfully', errorUpdating: 'Error updating profile', allBadges: 'All badges', earnedBadges: 'Earned badges', availableBadges: 'Available badges', badgePoints: 'Badge points', badgeCategory: 'Badge category', earnedOn: 'Earned on',
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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

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
  const [feedbackCourse, setFeedbackCourse] = useState<CourseWithRelations | null>(null);
  const [pendingBack, setPendingBack] = useState<(() => void) | null>(null);
  const [courses, setCourses] = useState<CourseWithRelations[]>([]);
  const [progressMap, setProgressMap] = useState<Map<string, boolean>>(new Map());
  const [passedModuleExams, setPassedModuleExams] = useState<Record<string, Record<string, boolean>>>({});
  const [examResults, setExamResults] = useState<{ course_id: string; exam_type: ExamType; passed: boolean; direct_failed: boolean }[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { signOut } = useAuth();
  const { toast, withLoading } = useToast();

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

  const navigate = (v: View) => { setView(v); setMobileOpen(false); };
  const isFullscreen = view === 'player' || view === 'exam';

  const getCourseState = (courseId: string) => {
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

  const [courseReqMap, setCourseReqMap] = useState<Record<string, string>>({});

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

  const openPlayer = async (course: CourseWithRelations, moduleId?: string) => {
    const { req, error } = await ensureUserCourseRequirement(profile.id, course.id, profile.job_role_id ?? '');
    if (error || !req) { toast('No se pudo abrir el curso', 'error'); return; }
    setCourseReqMap((prev) => ({ ...prev, [course.id]: req.id }));
    setActiveCourse(course); setActiveModuleId(moduleId ?? null); setView('player'); setMobileOpen(false); setSelectedCourse(null);
  };
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  const goToNextModule = (course: CourseWithRelations, currentModuleId?: string) => {
    const moduleIndex = currentModuleId ? course.modules.findIndex((m) => m.id === currentModuleId) : -1;
    const nextModule = moduleIndex >= 0 ? course.modules[moduleIndex + 1] : null;
    if (nextModule) {
      openPlayer(course, nextModule.id);
      return;
    }
    setActiveCourse(course); setActiveModuleId(null); setView('player');
  };

  const openExam = async (course: CourseWithRelations, type: ExamType, moduleId?: string) => {
    const { req, error } = await ensureUserCourseRequirement(profile.id, course.id, profile.job_role_id ?? '');
    if (error || !req) { toast('No se pudo abrir la evaluación', 'error'); return; }
    setCourseReqMap((prev) => ({ ...prev, [course.id]: req.id }));
    setActiveCourse(course); setExamType(type); setActiveModuleId(moduleId ?? null); setView('exam'); setMobileOpen(false); setSelectedCourse(null);
  };
  const requestExit = (onConfirm: () => void) => { setPendingBack(() => onConfirm); setShowExitWarning(true); };
  const confirmExit = () => { setShowExitWarning(false); if (pendingBack) pendingBack(); setPendingBack(null); };

  const breadcrumbLabel = () => ({ dashboard: t.dashboard, catalog: t.catalog, courses: t.catalog, certificates: t.certificates, admin: t.adminPanel, calendar: t.calendar, player: t.player, exam: t.exam, notifications: t.notifications, gamification: t.gamification, profile: t.myProfile, 'course-editor': '', team: '', assignments: '', personnel: '', roles: '', 'role-detail': '' })[view] ?? '';

  const completedCourses = courses.filter((c) => getCourseState(c.id).courseExamPassed);
  const inProgressCourses = courses.filter((c) => { const s = getCourseState(c.id); return s.completedModules.some(Boolean) && !s.courseExamPassed; });

  const empStrings: EmployeeStrings = {
    notifications: t.notifications, noNotifications: t.noNotifications, markAllRead: t.markAllRead,
    gamification: t.gamification, myProfile: t.myProfile, certifications: t.certificates, roleCertification: t.roleCertification,
    noCertificates: t.noCertificates, noRoleCerts: t.noRoleCerts, noBadges: t.noBadges,
    pointsAccumulated: t.pointsAccumulated, badgesEarned: t.badgesEarned, nextBadges: t.nextBadges,
    personalInfo: t.personalInfo, jobHistory: t.jobHistory, editProfile: t.editProfile, saveProfile: t.saveProfile,
    fullName: t.fullName, email: t.email, jobRole: t.jobRole, hireDate: t.hireDate, currentRoleSince: t.currentRoleSince,
    changePassword: t.changePassword, newPassword: t.newPassword, confirmPassword: t.confirmPassword,
    updatePassword: t.updatePassword, passwordChanged: t.passwordChanged, passwordMismatch: t.passwordMismatch,
    passwordTooShort: t.passwordTooShort, stats: t.stats, coursesCompleted: t.coursesCompleted,
    coursesInProgress: t.coursesInProgress, totalPoints: t.totalPoints, certifiedRole: t.certifiedRole,
    certifiedOn: t.certifiedOn, expiresOn: t.expiresOn, valid: t.valid, expired: t.expired,
    noJobHistory: t.noJobHistory, startDate: t.startDate, endDate: t.endDate, reason: t.reason,
    currentRole: t.currentRole, downloadCert: t.downloadCert, verifyCert: t.verifyCert,
    certNumber: t.certNumber, issuedOn: t.issuedOn, courseLabel: t.courseLabel, viewBadge: t.viewBadge,
    locked: t.locked, recentActivity: t.recentActivity, viewAll: t.viewAll, unread: t.unread,
    loading: t.loading, profileUpdated: t.profileUpdated, errorUpdating: t.errorUpdating,
    allBadges: t.allBadges, earnedBadges: t.earnedBadges, availableBadges: t.availableBadges,
    badgePoints: t.badgePoints, badgeCategory: t.badgeCategory, earnedOn: t.earnedOn,
    awardedTo: t.awardedTo,
  };

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
        <div className="nav-divider" />
        <NavItem icon={<Bell size={19} />} label={t.notifications} active={view === 'notifications'} onClick={() => navigate('notifications')} />
        <NavItem icon={<User size={19} />} label={t.myProfile} active={view === 'profile'} onClick={() => navigate('profile')} />
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
      {view === 'player' && activeCourse && <CoursePlayer t={t} course={activeCourse} initialModuleId={activeModuleId ?? undefined} courseState={getCourseState(activeCourse.id)} onBack={() => requestExit(() => navigate('catalog'))} onExam={openExam} onMarkComplete={handleMarkComplete} />}
      {view === 'exam' && activeCourse && <Exam t={t} course={activeCourse} examType={examType} moduleId={activeModuleId ?? undefined} courseState={getCourseState(activeCourse.id)} onBack={() => requestExit(() => navigate('catalog'))} onBackToCourse={() => openPlayer(activeCourse, activeModuleId ?? undefined)} onResult={handleExamResult} onPass={() => setFeedbackCourse(activeCourse)} onNextModule={goToNextModule} />}
      {view === 'notifications' && <EmployeeNotifications userId={profile.id} t={empStrings} />}
      {view === 'gamification' && <EmployeeGamification userId={profile.id} t={empStrings} completedCount={completedCourses.length} inProgressCount={inProgressCourses.length} />}
      {view === 'profile' && <EmployeeProfile profile={profile} t={empStrings} />}
    </main>
    {selectedCourse && <CourseModal course={selectedCourse} t={t} courseState={getCourseState(selectedCourse.id)} onClose={() => setSelectedCourse(null)} onOpenPlayer={openPlayer} onOpenExam={openExam} />}
    {previewCert && <CertificatePreview t={t} cert={previewCert} profileName={profile.full_name} onClose={() => setPreviewCert(null)} />}
    {showExitWarning && <ExitWarningModal t={t} onConfirm={confirmExit} onCancel={() => setShowExitWarning(false)} />}
    {feedbackCourse && <CourseFeedbackModal courseTitle={feedbackCourse.title} t={empStrings} onSave={handleFeedbackSave} onClose={() => setFeedbackCourse(null)} />}
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
  const courseEditorLeaveGuardRef = useRef<(() => boolean) | null>(null);
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

  const navigate = (v: string) => {
    if (courseEditorLeaveGuardRef.current && !courseEditorLeaveGuardRef.current()) return;
    setTab(v as AdminTab);
    setMobileOpen(false);
  };
  const navigateDoc = (docId: string) => {
    setTab('documentation');
    setMobileOpen(false);
    setTimeout(() => {
      const event = new CustomEvent('docs:navigate', { detail: docId });
      window.dispatchEvent(event);
    }, 50);
  };
  const registerCourseEditorLeaveGuard = (guard: (() => boolean) | null) => {
    courseEditorLeaveGuardRef.current = guard;
  };
  const breadcrumbLabel = () => {
    const labels: Record<string, string> = {
      dashboard: at.dashboard, personnel: at.personnel, courses: at.courses,
      certifications: at.certifications, feedback: at.feedback,
      notifications: at.notifications, reports: at.reports,
      settings: at.settings, audit: at.audit,
      documentation: at.documentation,
    };
    return labels[tab] ?? '';
  };

  if (loading || !data) return <div className={dark ? 'app-shell dark' : 'app-shell'} style={{ display: 'grid', placeItems: 'center', height: '100vh' }}><p style={{ color: '#6b7280' }}>{t.loading}</p></div>;

  const navItems: { key: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
    { key: 'dashboard', label: at.dashboard, icon: LayoutDashboard },
    { key: 'personnel', label: at.personnel, icon: Users },
    { key: 'courses', label: at.courses, icon: BookOpen },
    { key: 'certifications', label: at.certifications, icon: Award },
    { key: 'feedback', label: at.feedback, icon: Star },
    { key: 'notifications', label: at.notifications, icon: Bell },
    { key: 'reports', label: at.reports, icon: BarChart3 },
    { key: 'settings', label: at.settings, icon: Settings },
    { key: 'audit', label: at.audit, icon: History },
    { key: 'documentation', label: at.documentation, icon: FileText },
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
          {tab !== 'documentation' && docSummaryMap[tab] && <HelpButton summary={docSummaryMap[tab]} docId={tab} onNavigateDoc={navigateDoc} />}
          <button className="language-toggle" onClick={() => setLanguage(language === 'ES' ? 'EN' : 'ES')}><span className={language === 'ES' ? 'selected' : ''}>ES</span><span>/</span><span className={language === 'EN' ? 'selected' : ''}>EN</span></button>
          <button className="icon-button" onClick={() => setDark(!dark)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          <div className="avatar avatar-small">{profile.full_name.slice(0, 2).toUpperCase()}</div>
        </div>
      </header>
      {tab === 'dashboard' && <DashboardModule t={at} data={data} onNavigate={navigate} />}
      {tab === 'personnel' && <PersonnelModule t={at} team={data.team} jobRoles={data.jobRoles} departments={data.departments} courses={data.courses} onRefresh={refreshAll} />}
      {tab === 'courses' && <CoursesModule t={at} courses={data.courses} jobRoles={data.jobRoles} departments={data.departments} profile={profile} onRefresh={refreshAll} onLeaveGuardChange={registerCourseEditorLeaveGuard} />}
      {tab === 'certifications' && <CertificationsModule t={at} data={data} />}
      {tab === 'feedback' && <FeedbackModule t={at} data={data} />}
      {tab === 'notifications' && <NotificationsModule t={at} data={data} onRefresh={refreshAll} />}
      {tab === 'reports' && <ReportsModule t={at} data={data} />}
      {tab === 'settings' && <SettingsModule t={at} data={data} onRefresh={refreshAll} />}
      {tab === 'audit' && <AuditModule t={at} data={data} />}
      {tab === 'documentation' && <DocumentationModule t={at} />}
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
    <PaginatedList key={`${filter}-${query}`} items={visible}>{(pageCourses) => <div className="catalog-grid">{pageCourses.map((c) => <CourseCard key={c.id} course={c} t={t} getCourseState={getCourseState} onSelect={onSelect} />)}</div>}</PaginatedList>}
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
  courses.forEach((c) => {
    const hasDeadline = c.assignments.some((a) => a.completion_deadline_days);
    if (!hasDeadline) return;
    const a = c.assignments.find((a) => a.completion_deadline_days);
    if (!a?.completion_deadline_days) return;
    const d = new Date(Date.now() + a.completion_deadline_days * 86400000);
    if (d.getMonth() === currentMonth && d.getFullYear() === year) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      if (!eventsByDay[day].some((existing) => existing.id === c.id)) eventsByDay[day].push(c);
    }
  });
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
    <PaginatedList items={completedCourses}>{(pageCourses, firstItemIndex) => <div className="certificate-grid">{pageCourses.map((c, i) => <article className="certificate-card" key={c.id}><div className="certificate-art"><div className="certificate-mark"><Award size={26} /></div><span>TRIADE</span><small>{t.certificate}</small><strong>{c.title}</strong><em>{t.awardedTo}</em><div className="certificate-art-footer"><span>TRD-{new Date().getFullYear()}-{String(firstItemIndex + i + 1).padStart(5, '0')}</span><span>{new Date().toLocaleDateString()}</span></div></div><div className="certificate-actions"><button onClick={() => onPreview({ title: c.title, id: `TRD-${new Date().getFullYear()}-${String(firstItemIndex + i + 1).padStart(5, '0')}`, date: new Date().toLocaleDateString() })}><FileText size={16} />{t.seeCertificate}</button><button><Download size={16} />{t.downloadCert}</button></div></article>)}</div>}</PaginatedList>}
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
      <PaginatedList items={course.modules}>{(pageModules, firstModuleIndex) => <div className="module-list">{pageModules.map((m, i) => <div key={m.id}><span className={courseState.completedModules[firstModuleIndex + i] ? 'module-check' : 'module-check locked'}>{courseState.completedModules[firstModuleIndex + i] ? <Check size={14} /> : <LockKeyhole size={13} />}</span><span><strong>{m.title}</strong><small>{m.duration} · {m.type === 'video' ? t.videoModule : m.type === 'image' ? t.imageModule : t.textModule}</small></span></div>)}</div>}</PaginatedList>
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
function YouTubeCoursePlayer({ embedUrl, title, onEnded }: { embedUrl: string; title: string; onEnded: () => void }) {
  const playerTargetRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayerApi | null>(null);
  const onEndedRef = useRef(onEnded);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  onEndedRef.current = onEnded;

  useEffect(() => {
    let cancelled = false;
    const videoId = new URL(embedUrl).pathname.split('/').filter(Boolean).at(-1);
    if (!videoId || !playerTargetRef.current) return;

    loadYouTubeIframeApi().then(() => {
      if (cancelled || !playerTargetRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(playerTargetRef.current, {
        videoId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            event.target.getIframe().classList.add('player-video-el', 'youtube-player-iframe');
            setReady(true);
          },
          onStateChange: (event) => {
            if (event.data === window.YT?.PlayerState.PLAYING) setPlaying(true);
            if (event.data === window.YT?.PlayerState.ENDED) {
              setPlaying(false);
              onEndedRef.current();
            }
            if (event.data === 2) setPlaying(false);
          },
        },
      });
    }).catch(() => setReady(false));

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [embedUrl]);

  const sendCommand = (func: 'playVideo' | 'pauseVideo' | 'setVolume' | 'mute' | 'unMute', args: number[] = []) => {
    const player = playerRef.current;
    if (!player) return;
    if (func === 'setVolume') player.setVolume(args[0] ?? 100);
    else if (func === 'mute' || func === 'unMute') player[func]();
    else player[func]();
  };

  const togglePlayback = () => {
    sendCommand(playing ? 'pauseVideo' : 'playVideo');
  };

  return <div className="player-video player-video-external">
    <div className="youtube-player-stage">
      <div ref={playerTargetRef} title={title} />
      <div className="youtube-player-overlay">
        {!playing && <button className="youtube-player-start" onClick={togglePlayback} disabled={!ready} aria-label="Reproducir video"><Play size={30} fill="currentColor" /></button>}
        <div className="youtube-player-controls">
          <button className="youtube-player-control" onClick={togglePlayback} disabled={!ready} aria-label={playing ? 'Pausar video' : 'Reproducir video'} title={playing ? 'Pausar' : 'Reproducir'}>
            {playing ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" />}
          </button>
          {volume === 0 ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
          <input type="range" min="0" max="100" value={volume} aria-label="Volumen" disabled={!ready} onChange={(event) => {
            const nextVolume = Number(event.target.value);
            setVolume(nextVolume);
            sendCommand('setVolume', [nextVolume]);
            if (nextVolume === 0) sendCommand('mute');
            else sendCommand('unMute');
          }} />
        </div>
      </div>
    </div>
  </div>;
}

function VimeoCoursePlayer({ embedUrl, title, onEnded }: { embedUrl: string; title: string; onEnded: () => void }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const onEndedRef = useRef(onEnded);
  const playerId = useRef(`vimeo-player-${Math.random().toString(36).slice(2)}`);
  onEndedRef.current = onEnded;
  const playerUrl = new URL(embedUrl);
  playerUrl.searchParams.set('api', '1');
  playerUrl.searchParams.set('player_id', playerId.current);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://player.vimeo.com' || event.source !== iframeRef.current?.contentWindow) return;
      let data: { event?: string };
      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) as { event?: string } : event.data;
      } catch {
        return;
      }
      if (data.event === 'ended') onEndedRef.current();
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return <div className="player-video player-video-external"><iframe ref={iframeRef} className="player-video-el" src={playerUrl.toString()} title={title} allow="encrypted-media" referrerPolicy="strict-origin-when-cross-origin" onLoad={() => iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ method: 'addEventListener', value: 'ended', player_id: playerId.current }), 'https://player.vimeo.com')} /></div>;
}

function PdfPlayer({ src, title, onEnded }: { src: string; title: string; onEnded: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadingTaskRef = useRef<import('pdfjs-dist').PDFDocumentLoadingTask | null>(null);
  const documentRef = useRef<import('pdfjs-dist').PDFDocumentProxy | null>(null);
  const onEndedRef = useRef(onEnded);
  const notifiedLastPageRef = useRef(0);
  const [pdfDocument, setPdfDocument] = useState<import('pdfjs-dist').PDFDocumentProxy | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [stageWidth, setStageWidth] = useState(0);
  const [pageReady, setPageReady] = useState(false);
  const [loadError, setLoadError] = useState('');
  onEndedRef.current = onEnded;

  useEffect(() => {
    let cancelled = false;
    const loadPdf = async () => {
      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
        const loadingTask = pdfjs.getDocument({
          url: src,
          rangeChunkSize: 65536,
          disableStream: true,
          disableAutoFetch: true,
        });
        loadingTaskRef.current = loadingTask;
        const pdf = await loadingTask.promise;
        if (cancelled) {
          await pdf.destroy();
          return;
        }
        documentRef.current = pdf;
        setPageCount(pdf.numPages);
        setPdfDocument(pdf);
      } catch (error) {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : 'No se pudo cargar el PDF.');
      }
    };
    void loadPdf();
    return () => {
      cancelled = true;
      documentRef.current = null;
      const loadingTask = loadingTaskRef.current;
      loadingTaskRef.current = null;
      if (loadingTask) void loadingTask.destroy();
    };
  }, [src]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(() => setStageWidth(stage.clientWidth));
    observer.observe(stage);
    setStageWidth(stage.clientWidth);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const pdf = pdfDocument;
    const canvas = canvasRef.current;
    if (!pdf || !canvas || !stageWidth) return;
    let cancelled = false;
    let renderTask: import('pdfjs-dist').RenderTask | undefined;
    setPageReady(false);
    const renderPage = async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        if (cancelled) return;
        const baseViewport = page.getViewport({ scale: 1 });
        const fitScale = Math.min(1.5, Math.max(0.1, (stageWidth - 32) / baseViewport.width));
        const viewport = page.getViewport({ scale: fitScale });
        const outputScale = Math.min(window.devicePixelRatio || 1, 2);
        const context = canvas.getContext('2d');
        if (!context) throw new Error('El navegador no pudo preparar la página PDF.');
        canvas.width = Math.ceil(viewport.width * outputScale);
        canvas.height = Math.ceil(viewport.height * outputScale);
        canvas.style.width = `${Math.ceil(viewport.width)}px`;
        canvas.style.height = `${Math.ceil(viewport.height)}px`;
        renderTask = page.render({
          canvasContext: context,
          viewport,
          transform: outputScale === 1 ? undefined : [outputScale, 0, 0, outputScale, 0, 0],
        });
        await renderTask.promise;
        if (cancelled) return;
        setPageReady(true);
        if (pageNumber === pdf.numPages && notifiedLastPageRef.current !== pdf.numPages) {
          notifiedLastPageRef.current = pdf.numPages;
          onEndedRef.current();
        }
      } catch (error) {
        if (!cancelled && !(error instanceof Error && error.name === 'RenderingCancelledException')) {
          setLoadError(error instanceof Error ? error.message : 'No se pudo mostrar esta página PDF.');
        }
      }
    };
    void renderPage();
    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [pdfDocument, pageNumber, stageWidth]);

  return <div className="player-pdf">
    <div ref={stageRef} className="player-pdf-stage">
      <canvas ref={canvasRef} className="player-pdf-page" aria-label={`${title}, página ${pageNumber}`} />
      {!pageReady && !loadError && <div className="player-pdf-status">{pdfDocument ? 'Cargando página...' : 'Cargando PDF...'}</div>}
      {loadError && <div className="player-pdf-status player-pdf-error">No se pudo mostrar el PDF. {loadError}</div>}
    </div>
    {pageCount > 0 && <div className="player-pdf-controls">
      <button className="outline-button" onClick={() => setPageNumber((page) => Math.max(1, page - 1))} disabled={pageNumber <= 1} aria-label="Página anterior"><ChevronLeft size={17} />Anterior</button>
      <span className="player-pdf-count">Página {pageNumber} de {pageCount}</span>
      <button className="outline-button" onClick={() => setPageNumber((page) => Math.min(pageCount, page + 1))} disabled={pageNumber >= pageCount} aria-label="Página siguiente">Siguiente<ChevronRight size={17} /></button>
    </div>}
  </div>;
}

function PowerPointPlayer({ src, title, onEnded }: { src: string; title: string; onEnded: () => void }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<import('@file-viewer/pptx').PptxViewer | null>(null);
  const onEndedRef = useRef(onEnded);
  const endedRef = useRef(false);
  const [slideNumber, setSlideNumber] = useState(1);
  const [slideCount, setSlideCount] = useState(0);
  const [viewerReady, setViewerReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [slideAspectRatio, setSlideAspectRatio] = useState('16 / 9');
  const [loadingStage, setLoadingStage] = useState<'download' | 'render'>('download');
  const [downloadPercent, setDownloadPercent] = useState<number | null>(null);
  const [renderPercent, setRenderPercent] = useState<number | null>(null);
  onEndedRef.current = onEnded;

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    let cancelled = false;
    let renderingComplete = false;
    let slideCountTimer: number | undefined;
    let downloadRequest: XMLHttpRequest | null = null;
    let viewer: import('@file-viewer/pptx').PptxViewer | null = null;
    const downloadPresentation = (url: string) => new Promise<ArrayBuffer>((resolve, reject) => {
      const request = new XMLHttpRequest();
      downloadRequest = request;
      request.open('GET', url);
      request.responseType = 'arraybuffer';
      request.onprogress = (event) => {
        if (!cancelled && event.lengthComputable) setDownloadPercent(Math.round((event.loaded / event.total) * 100));
      };
      request.onload = () => {
        if (request.status >= 200 && request.status < 300) resolve(request.response as ArrayBuffer);
        else reject(new Error(`No se pudo descargar la presentación (${request.status})`));
      };
      request.onerror = () => reject(new Error('Error de red al descargar la presentación.'));
      request.onabort = () => reject(new Error('Se canceló la descarga de la presentación.'));
      request.send();
    });
    const loadPresentation = async () => {
      try {
        setLoadingStage('download');
        const [buffer, { PptxViewer }] = await Promise.all([downloadPresentation(src), import('@file-viewer/pptx')]);
        if (cancelled) return;
        setLoadingStage('render');
        viewer = await PptxViewer.open(buffer, target, {
          fitMode: 'contain',
          lazySlides: true,
          listOptions: { windowed: true, initialSlides: 1, batchSize: 1 },
          onSlideRendered: (slideIndex) => {
            if (!cancelled) setSlideCount((count) => Math.max(count, slideIndex));
          },
          onSlideSize: (size) => {
            if (size.width && size.height && !cancelled) setSlideAspectRatio(`${size.width} / ${size.height}`);
          },
          onProgress: (progress) => {
            if (!cancelled && Number.isFinite(progress)) setRenderPercent(Math.max(0, Math.min(100, Math.round(progress))));
          },
          onRenderComplete: () => {
            renderingComplete = true;
            if (slideCountTimer !== undefined) window.clearInterval(slideCountTimer);
            if (!cancelled && viewer) {
              setSlideCount(viewer.slideCount);
              setLoaded(true);
            }
          },
          onError: (error) => {
            if (!cancelled) setLoadError(error instanceof Error ? error.message : 'No se pudo procesar la presentación.');
          },
        });
        if (cancelled) viewer.destroy();
        else {
          viewerRef.current = viewer;
          setViewerReady(true);
          slideCountTimer = window.setInterval(() => setSlideCount((count) => Math.max(count, viewer?.slideCount ?? 0)), 100);
          if (renderingComplete) {
            window.clearInterval(slideCountTimer);
            setSlideCount(viewer.slideCount);
            setLoaded(true);
          }
        }
      } catch (error) {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : 'No se pudo cargar la presentación.');
      }
    };
    void loadPresentation();
    return () => {
      cancelled = true;
      downloadRequest?.abort();
      if (slideCountTimer !== undefined) window.clearInterval(slideCountTimer);
      viewer?.destroy();
      viewerRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewerReady || !viewer || slideCount === 0) return;
    viewer.content.classList.add('is-presenting');
    viewer.ensureSlideRendered(slideNumber);
    for (const slot of Array.from(viewer.content.children)) {
      if (slot instanceof HTMLElement && slot.classList.contains('flyfish-pptx-slide-slot')) {
        slot.classList.toggle('is-active-slide', Number(slot.dataset.slideNumber) === slideNumber);
      }
    }
    viewer.refreshLayout();
    if (loaded && slideNumber === slideCount && !endedRef.current) {
      endedRef.current = true;
      onEndedRef.current();
    }
  }, [slideCount, slideNumber, loaded, viewerReady]);

  const goToSlide = (nextSlide: number) => {
    if (nextSlide < 1 || nextSlide > slideCount) return;
    setSlideNumber(nextSlide);
  };

  return <div className="player-slides">
    <div className="player-slides-stage" style={{ aspectRatio: slideAspectRatio }}><div ref={targetRef} className="player-slides-renderer" />
      {!slideCount && !loadError && <div className="player-slides-status">{loadingStage === 'download' ? 'Descargando presentación...' : 'Preparando primera diapositiva...'}</div>}
      {loadError && <div className="player-slides-status player-slides-error">{loadError}</div>}
    </div>
    {slideCount > 0 && <div className="player-slides-controls">
      <button className="outline-button" onClick={() => goToSlide(slideNumber - 1)} disabled={slideNumber <= 1} aria-label="Diapositiva anterior"><ChevronLeft size={17} />Anterior</button>
      <span className="player-slides-count">{slideNumber} / {loaded ? slideCount : `${slideCount}+`}</span>
      <button className="outline-button" onClick={() => goToSlide(slideNumber + 1)} disabled={slideNumber >= slideCount && !loaded} aria-label="Diapositiva siguiente">Siguiente<ChevronRight size={17} /></button>
    </div>}
    {!loaded && !loadError && <div className="player-slides-progress">
      <div className="player-slides-progress-track"><span style={{ width: `${loadingStage === 'download' ? downloadPercent ?? 0 : renderPercent ?? 0}%` }} /></div>
      <small>{loadingStage === 'download'
        ? downloadPercent === null ? 'Descargando archivo de presentación' : `Descargando archivo de presentación · ${downloadPercent}%`
        : `Preparando diapositivas · ${slideCount} listas${renderPercent === null ? '' : ` · ${renderPercent}%`}`}</small>
    </div>}
    <span className="sr-only">{title}</span>
  </div>;
}

function UploadedVideoPlayer({ src, title, onEnded }: { src: string; title: string; onEnded: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onEndedRef = useRef(onEnded);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  onEndedRef.current = onEnded;

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => setPlaying(false));
    else video.pause();
  };

  const setVideoVolume = (value: number) => {
    setVolume(value);
    if (!videoRef.current) return;
    videoRef.current.volume = value / 100;
    videoRef.current.muted = value === 0;
  };

  return <div className="player-video player-video-external">
    <div className="youtube-player-stage">
      <video
        ref={videoRef}
        className="custom-player-media"
        src={src}
        title={title}
        playsInline
        disablePictureInPicture
        controlsList="nodownload noplaybackrate"
        tabIndex={-1}
        onCanPlay={() => setReady(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          onEndedRef.current();
        }}
      />
      <div className="youtube-player-overlay">
        {!playing && <button className="youtube-player-start" onClick={togglePlayback} disabled={!ready} aria-label="Reproducir video"><Play size={30} fill="currentColor" /></button>}
        <div className="youtube-player-controls">
          <button className="youtube-player-control" onClick={togglePlayback} disabled={!ready} aria-label={playing ? 'Pausar video' : 'Reproducir video'} title={playing ? 'Pausar' : 'Reproducir'}>
            {playing ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" />}
          </button>
          {volume === 0 ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
          <input type="range" min="0" max="100" value={volume} aria-label="Volumen" disabled={!ready} onChange={(event) => setVideoVolume(Number(event.target.value))} />
        </div>
      </div>
    </div>
  </div>;
}

function CoursePlayer({ t, course, initialModuleId, courseState, onBack, onExam, onMarkComplete }: { t: typeof copy.ES; course: CourseWithRelations; initialModuleId?: string; courseState: { completedModules: boolean[] }; onBack: () => void; onExam: (c: CourseWithRelations, type: ExamType, moduleId?: string) => void; onMarkComplete: (moduleId: string) => void }) {
  const firstIncompleteModuleIdx = courseState.completedModules.findIndex((completed) => !completed);
  const lastUnlockedModuleIdx = firstIncompleteModuleIdx < 0 ? course.modules.length - 1 : firstIncompleteModuleIdx;
  const [moduleIdx, setModuleIdx] = useState(() => {
    if (!initialModuleId) return 0;
    const idx = course.modules.findIndex((m) => m.id === initialModuleId);
    return idx >= 0 && idx <= lastUnlockedModuleIdx ? idx : 0;
  });
  const [playing, setPlaying] = useState(false);
  const [finishedMediaModules, setFinishedMediaModules] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    if (!initialModuleId) return;
    const idx = course.modules.findIndex((m) => m.id === initialModuleId);
    if (idx >= 0 && idx <= lastUnlockedModuleIdx) setModuleIdx(idx);
  }, [course.id, initialModuleId, lastUnlockedModuleIdx]);
  const current = course.modules[moduleIdx];
  if (!current) return <div className="page animate-in player-page"><div className="player-header"><button className="back-button" onClick={onBack}><ArrowLeft size={18} />{t.exitCourse}</button></div><p className="muted" style={{ padding: 40 }}>{t.noCourses}</p></div>;
  const moduleQuestions = course.exam_questions.filter((q) => q.module_id === current.id);
  const moduleExamRequired = moduleQuestions.length > 0;
  const moduleExamPassed = moduleExamRequired && courseState.completedModules[moduleIdx];
  const isVideoModule = current.type === 'video' || current.resource_type === 'video' || /\.(mp4|mov|webm|m4v|avi|mkv|wmv|flv)(\?.*)?$/i.test(current.resource_url ?? '') || /youtube|youtu\.be|vimeo/i.test(current.resource_url ?? '');
  const isImageModule = current.type === 'image' || current.type === 'infographic' || current.resource_type === 'image';
  const imageSource = current.resource_url || current.image_url || '';
  const isPdfModule = (current.type === 'pdf' || current.resource_type === 'pdf' || current.resource_type === 'powerpoint') && !isVideoModule;
  const resourceUrl = current.resource_url ?? '';
  const isPowerPointModule = current.resource_type === 'powerpoint' || /\.pptx?($|\?)/i.test(resourceUrl);
  const requiresMediaCompletion = isVideoModule || isPdfModule;
  const moduleTypeIcon = isVideoModule ? <Video size={15} /> : isImageModule ? <ImageIcon size={15} /> : current.type === 'pdf' || current.resource_type === 'pdf' || current.resource_type === 'powerpoint' ? <FileText size={15} /> : <FileText size={15} />;
  const moduleTypeLabel = isVideoModule ? t.videoModule : isImageModule ? t.imageModule : current.type === 'pdf' || current.resource_type === 'pdf' || current.resource_type === 'powerpoint' ? 'PDF / Presentación' : t.textModule;
  const allModulesComplete = courseState.completedModules.length > 0 && courseState.completedModules.every(Boolean);
  const currentModuleComplete = courseState.completedModules[moduleIdx] ?? false;
  const currentMediaFinished = finishedMediaModules.has(current.id);
  const isModuleUnlocked = (index: number) => index <= lastUnlockedModuleIdx;
  const Icon = getIcon(course.icon_name);
  const videoSource = current.video_url || current.resource_url || '';
  const getYoutubeEmbedUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
      const path = parsed.pathname.replace(/^\//, '');
      const id = parsed.searchParams.get('v') || (host === 'youtu.be' ? path : '');
      if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'www.youtube.com') {
        if (id) return `https://www.youtube.com/embed/${id}`;
        if (/^(embed|shorts|live)/.test(path)) {
          const parts = path.split('/').filter(Boolean);
          const embedId = parts[1] || parts[0];
          if (embedId) return `https://www.youtube.com/embed/${embedId}`;
        }
      }
      if (host === 'youtu.be') {
        const shortId = path.split('/').filter(Boolean)[0];
        if (shortId) return `https://www.youtube.com/embed/${shortId}`;
      }
    } catch {
      // ignorar URLs inválidas
    }
    return '';
  };

  const getVimeoEmbedUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
      const path = parsed.pathname.replace(/^\//, '');
      const id = host.includes('vimeo.com') ? path.split('/').filter(Boolean)[0] : '';
      if (id) return `https://player.vimeo.com/video/${id}`;
    } catch {
      // ignorar URLs inválidas
    }
    return '';
  };

  const youtubeEmbedUrl = getYoutubeEmbedUrl(videoSource);
  const vimeoEmbedUrl = getVimeoEmbedUrl(videoSource);
  const externalVideoEmbedUrl = youtubeEmbedUrl || vimeoEmbedUrl;

  return <div className="page animate-in player-page">
    <div className="player-header"><button className="back-button" onClick={onBack}><ArrowLeft size={18} />{t.exitCourse}</button><div className="player-course-info"><span className={`course-icon-sm ${course.accent}`}><Icon size={18} /></span><div><strong>{course.title}</strong><small>{course.category} · {course.duration}</small></div></div></div>
    <div className="player-layout">
      <div className="player-main"><div className="player-content">
        {isVideoModule && (externalVideoEmbedUrl ? (
          youtubeEmbedUrl ? <YouTubeCoursePlayer key={current.id} embedUrl={youtubeEmbedUrl} title={current.title} onEnded={() => setFinishedMediaModules((modules) => new Set(modules).add(current.id))} /> : vimeoEmbedUrl ? <VimeoCoursePlayer key={current.id} embedUrl={vimeoEmbedUrl} title={current.title} onEnded={() => setFinishedMediaModules((modules) => new Set(modules).add(current.id))} /> : <div className="player-video player-video-external"><iframe className="player-video-el" src={externalVideoEmbedUrl} title={current.title} allow="encrypted-media" referrerPolicy="strict-origin-when-cross-origin" /></div>
        ) : videoSource ? (
          <UploadedVideoPlayer key={current.id} src={videoSource} title={current.title} onEnded={() => setFinishedMediaModules((modules) => new Set(modules).add(current.id))} />
        ) : (
          <div className="player-video player-video-poster"><div className="video-poster" style={{ backgroundImage: `url(${course.image_url})` }}><button className="video-play-btn" onClick={() => setPlaying(!playing)}>{playing ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}</button></div><div className="video-controls"><span className="video-time">0:00 / {current.duration}</span><div className="video-bar"><span style={{ width: playing ? '35%' : '0%' }} /></div></div></div>
        ))}
        {isVideoModule && (current.title || current.body) && <div className="player-text player-video-meta"><div className="player-module-tag">{moduleTypeIcon}{moduleTypeLabel} · {current.duration}</div><h2>{current.title}</h2>{current.body && <p>{current.body}</p>}</div>}
        {!isVideoModule && isImageModule && imageSource && <div className="player-image"><img src={imageSource} alt={current.title} /></div>}
        {!isVideoModule && isPowerPointModule && resourceUrl && <PowerPointPlayer key={current.id} src={resourceUrl} title={current.title} onEnded={() => setFinishedMediaModules((modules) => new Set(modules).add(current.id))} />}
        {!isVideoModule && isPdfModule && !isPowerPointModule && resourceUrl && <PdfPlayer key={current.id} src={resourceUrl} title={current.title} onEnded={() => setFinishedMediaModules((modules) => new Set(modules).add(current.id))} />}
        {!isVideoModule && current.type === 'text' && <div className="player-text-icon"><FileText size={48} /></div>}
        {!isVideoModule && <div className="player-text"><div className="player-module-tag">{moduleTypeIcon}{moduleTypeLabel} · {current.duration}</div><h2>{current.title}</h2><p>{current.body}</p></div>}
        {moduleExamRequired && <div className="module-complete-banner" style={{ marginBottom: 16 }}><Award size={16} />{moduleExamPassed ? 'Examen del módulo aprobado' : 'Debes aprobar el examen del módulo para avanzar'}</div>}
        <div className="player-nav-buttons">
          {moduleIdx > 0 && <button className="outline-button player-prev" onClick={() => setModuleIdx(moduleIdx - 1)}><ChevronLeft size={16} />{t.prevQ}</button>}
          {moduleIdx < course.modules.length - 1 ? <button className="primary-button player-next" disabled={requiresMediaCompletion && !currentMediaFinished} onClick={() => {
            if (requiresMediaCompletion && !currentMediaFinished) return;
            if (moduleExamRequired && !moduleExamPassed) {
              onExam(course, 'module', current.id);
              return;
            }
            if (!currentModuleComplete) onMarkComplete(current.id);
            setModuleIdx(moduleIdx + 1);
          }}>{moduleExamRequired && !moduleExamPassed ? 'Examen del módulo' : t.nextQ}<ChevronRight size={16} /></button> : <button className="primary-button player-next" disabled={requiresMediaCompletion && !currentMediaFinished} onClick={() => {
            if (requiresMediaCompletion && !currentMediaFinished) return;
            if (moduleExamRequired && !moduleExamPassed) {
              onExam(course, 'module', current.id);
              return;
            }
            if (!currentModuleComplete) onMarkComplete(current.id);
            onExam(course, 'course');
          }}><Award size={16} />{t.takeExam}</button>}
        </div>
        {currentModuleComplete && <div className="module-complete-banner"><Check size={16} />{t.moduleComplete}</div>}
      </div></div>
      <aside className="player-sidebar">
        <div className="section-title"><div><h2>{t.modules}</h2><p className="muted">{courseState.completedModules.filter(Boolean).length} / {course.modules.length} {t.moduleProgress.toLowerCase()}</p></div></div>
        <div className="player-module-list">{course.modules.map((m, i) => {
          const unlocked = isModuleUnlocked(i);
          const completed = courseState.completedModules[i] ?? false;
          return <button key={m.id} className={`player-module-item${i === moduleIdx ? ' active' : ''}${!unlocked ? ' locked' : ''}`} onClick={() => unlocked && setModuleIdx(i)} disabled={!unlocked} aria-current={i === moduleIdx ? 'step' : undefined}>
            <span className={completed ? 'module-check' : unlocked ? 'module-check current' : 'module-check locked'}>{completed ? <Check size={13} /> : unlocked ? <Play size={11} fill="currentColor" /> : <LockKeyhole size={12} />}</span>
            <span><strong>{m.title}</strong><small>{m.duration}</small></span>{i === moduleIdx && <span className="current-dot" />}
          </button>;
        })}</div>
        {allModulesComplete && <div className="exam-ready-banner"><Award size={16} /><span>{t.courseExamReadyDesc}</span><button className="primary-button" onClick={() => onExam(course, 'course')}>{t.goToExam}</button></div>}
      </aside>
    </div>
  </div>;
}

// ===================== EXAM =====================
function Exam({ t, course, examType, moduleId, courseState, onBack, onBackToCourse, onResult, onPass, onNextModule }: { t: typeof copy.ES; course: CourseWithRelations; examType: ExamType; moduleId?: string; courseState: { completedModules: boolean[]; directFailed: boolean; directPassed: boolean; courseExamPassed: boolean }; onBack: () => void; onBackToCourse: () => void; onResult: (courseId: string, type: ExamType, score: number, passed: boolean, directFailed: boolean, totalQuestions: number, correctAnswers: number, answers: number[], moduleId?: string) => void; onPass?: () => void; onNextModule?: (course: CourseWithRelations, moduleId?: string) => void }) {
  const moduleQuestions = moduleId ? course.exam_questions.filter((q) => q.module_id === moduleId) : [];
  const questions = examType === 'module' ? moduleQuestions : course.exam_questions.filter((q) => !q.module_id);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; correct: number; total: number; passed: boolean } | null>(null);
  const [reviewed, setReviewed] = useState<Record<number, boolean>>({});
  if (questions.length === 0) return <div className="page animate-in"><p className="muted" style={{ padding: 40 }}>{t.noCourses}</p></div>;
  const q = questions[currentQ];
  const answered = answers[currentQ] !== -1;
  const allAnswered = answers.every((a) => a !== -1);
  const progress = ((currentQ + 1) / questions.length) * 100;
  const examTitle = examType === 'direct' ? t.directExam : examType === 'module' ? `Examen del módulo` : t.courseExam;
  const examDesc = examType === 'direct' ? t.directExamDesc : examType === 'module' ? 'Aprobación requerida para continuar con este módulo.' : t.courseExamDesc;
  const Icon = getIcon(course.icon_name);
  const currentReviewed = !!reviewed[currentQ];

  const handleSubmit = () => {
    const correct = answers.reduce((acc, ans, i) => ans === questions[i].correct_index ? acc + 1 : acc, 0);
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 90;
    const directFailed = examType === 'direct' && !passed;
    setResult({ score, correct, total: questions.length, passed });
    setSubmitted(true);
    onResult(course.id, examType, score, passed, directFailed, questions.length, correct, answers, moduleId);
    if (passed && examType === 'course' && onPass) onPass();
  };

  const handleNext = () => {
    if (!answered) return;
    if (!reviewed[currentQ]) {
      setReviewed((prev) => ({ ...prev, [currentQ]: true }));
      return;
    }
    if (currentQ < questions.length - 1) setCurrentQ((prev) => prev + 1);
  };

  const handleFinish = () => {
    if (!allAnswered) return;
    if (!reviewed[currentQ]) {
      setReviewed((prev) => ({ ...prev, [currentQ]: true }));
      return;
    }
    handleSubmit();
  };

  if (submitted && result) {
    const isDirectFailed = examType === 'direct' && !result.passed;
    return <div className="page animate-in"><div className="exam-result">
      <div className={`exam-result-icon ${result.passed ? 'passed' : 'failed'}`}>{result.passed ? <Award size={48} /> : <AlertCircle size={48} />}</div>
      <h1>{result.passed ? t.passed : isDirectFailed ? t.directFailed : t.failed}</h1>
      <p className="muted">{result.passed ? t.certificate : isDirectFailed ? t.directFailedDesc : t.retry}</p>
      <div className="exam-score-display"><div className="score-circle"><strong>{result.score}%</strong></div><div className="score-details"><div><span>{t.correctAnswers}</span><strong>{result.correct} / {result.total}</strong></div><div><span>{t.passThreshold}</span><strong>90%</strong></div></div></div>
      <div className="exam-breakdown">
        <h3>{t.questionBreakdown}</h3>
        {questions.map((question, i) => {
          const selectedIndex = answers[i];
          const isCorrect = selectedIndex === question.correct_index;
          return <div key={i} className={`exam-breakdown-item ${isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="breakdown-head"><span className="breakdown-index">{i + 1}</span><span className={`breakdown-status ${isCorrect ? 'correct' : 'incorrect'}`}>{isCorrect ? t.correctQuestion : t.incorrectQuestion}</span></div>
            <p className="breakdown-question">{question.question}</p>
            <small>{selectedIndex === -1 ? t.noAnswer : `${t.selectedAnswer}: ${question.options[selectedIndex]}`}</small>
          </div>;
        })}
      </div>
      <div className="exam-result-actions">
        {result.passed && examType === 'module' && moduleId && onNextModule ? (
          <>
            <button className="primary-button" onClick={() => onNextModule(course, moduleId)}><ArrowRight size={17} />Siguiente módulo</button>
            <button className="outline-button" onClick={onBackToCourse}><BookOpen size={17} />Volver al curso</button>
          </>
        ) : result.passed ? (
          <button className="primary-button" onClick={onBack}><Award size={17} />{t.backToCatalog}</button>
        ) : isDirectFailed ? (
          <button className="primary-button" onClick={onBackToCourse}><BookOpen size={17} />{t.goToCourse}</button>
        ) : (
          <button className="primary-button" onClick={() => { setAnswers(Array(questions.length).fill(-1)); setCurrentQ(0); setReviewed({}); setSubmitted(false); setResult(null); }}><RotateCcw size={17} />{t.retry}</button>
        )}
        {!result.passed && <button className="outline-button" onClick={onBack}>{t.backToCatalog}</button>}
      </div>
    </div></div>;
  }

  return <div className="page animate-in exam-page">
    <div className="player-header"><button className="back-button" onClick={onBack}><ArrowLeft size={18} />{t.exitCourse}</button><div className="player-course-info"><span className={`course-icon-sm ${course.accent}`}><Icon size={18} /></span><div><strong>{course.title}</strong><small>{examTitle}</small></div></div></div>
    <div className="exam-layout">
      <div className="exam-main">
        <div className="exam-type-banner"><div className={`exam-type-icon ${examType}`}>{examType === 'direct' ? <ShieldCheck size={18} /> : <Award size={18} />}</div><div><strong>{examTitle}</strong><small>{examDesc}</small></div></div>
        <div className="exam-progress-bar"><div className="exam-progress-info"><span>{t.question} {currentQ + 1} {t.of} {questions.length}</span><span>{Math.round(progress)}%</span></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>
        <div className="exam-question-card"><h2>{q.question}</h2><div className="exam-options">{q.options.map((opt, i) => {
          const isSelected = answers[currentQ] === i;
          const isCorrect = q.correct_index === i;
          const revealAnswer = currentReviewed;
          const optionClassName = [
            'exam-option',
            isSelected ? 'selected' : '',
            revealAnswer && isCorrect && isSelected ? 'correct' : '',
            revealAnswer && isSelected && !isCorrect ? 'incorrect' : '',
          ].filter(Boolean).join(' ');
          return <button key={i} className={optionClassName} onClick={() => { if (currentReviewed) return; const n = [...answers]; n[currentQ] = i; setAnswers(n); }}><span className="option-letter">{String.fromCharCode(65 + i)}</span><span>{opt}</span>{revealAnswer && isCorrect && isSelected && <Check size={18} />}{revealAnswer && isSelected && !isCorrect && <X size={18} />}</button>;
        })}</div></div>
        <div className="exam-nav">{currentQ > 0 && <button className="outline-button" onClick={() => setCurrentQ(currentQ - 1)}><ChevronLeft size={16} />{t.prevQ}</button>}{currentQ < questions.length - 1 ? <button className="primary-button" disabled={!answered} onClick={handleNext}>{t.nextQ}<ChevronRight size={16} /></button> : <button className="primary-button" disabled={!allAnswered} onClick={handleFinish}>{t.finishExam}<Check size={16} /></button>}</div>
      </div>
      <aside className="exam-sidebar"><div className="section-title"><div><h2>{t.question}s</h2><p className="muted">{answers.filter((a) => a !== -1).length} / {questions.length}</p></div></div><div className="exam-questions-grid">{questions.map((_, i) => {
        const status = reviewed[i] ? (answers[i] === questions[i].correct_index ? 'correct' : 'incorrect') : (answers[i] !== -1 ? 'answered' : '');
        return <button key={i} className={['exam-q-dot', i === currentQ ? 'current' : '', status].filter(Boolean).join(' ')} onClick={() => setCurrentQ(i)}>{i + 1}</button>;
      })}</div><div className="exam-pass-info"><AlertCircle size={15} /><span>{t.passThreshold}</span></div></aside>
    </div>
  </div>;
}


export const adminPaths = {
  dashboard: '/dashboard',
  personnel: '/personal',
  courses: '/cursos',
  certifications: '/certificaciones',
  feedback: '/calificaciones',
  notifications: '/notificaciones',
  reports: '/reportes',
  settings: '/configuracion',
  audit: '/auditoria',
  documentation: '/documentacion',
} as const;

export type AdminSection = keyof typeof adminPaths;

export const employeePaths = {
  dashboard: '/dashboard',
  catalog: '/catalogo',
  calendar: '/calendario',
  certificates: '/certificados',
  notifications: '/notificaciones',
  gamification: '/gamificacion',
  profile: '/perfil',
} as const;

export const coursePath = (courseId: string, step: 'reproducir' | 'evaluacion') => `/curso/${courseId}/${step}`;

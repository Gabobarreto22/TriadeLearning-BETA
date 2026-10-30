import type { CourseWithRelations, Profile } from '@/lib/supabase';

export type ExamType = 'direct' | 'course' | 'module';

export type CourseState = {
  completedModules: boolean[];
  directFailed: boolean;
  directPassed: boolean;
  courseExamPassed: boolean;
};

export type CertificatePreviewData = { title: string; id: string; date: string };

export type EmployeeContextValue = {
  profile: Profile;
  courses: CourseWithRelations[];
  completedCourses: CourseWithRelations[];
  inProgressCourses: CourseWithRelations[];
  getCourseState: (courseId: string) => CourseState;
  setSelectedCourse: (course: CourseWithRelations | null) => void;
  setPreviewCert: (cert: CertificatePreviewData | null) => void;
  ensureRequirement: (course: CourseWithRelations) => Promise<boolean>;
  openPlayer: (course: CourseWithRelations, moduleId?: string) => Promise<void>;
  openExam: (course: CourseWithRelations, type: ExamType, moduleId?: string) => Promise<void>;
  goToNextModule: (course: CourseWithRelations, currentModuleId?: string) => void;
  openFeedback: (course: CourseWithRelations) => void;
  requestExit: (onConfirm: () => void) => void;
  handleMarkComplete: (moduleId: string) => Promise<void>;
  handleExamResult: (courseId: string, type: ExamType, score: number, passed: boolean, directFailed: boolean, totalQuestions: number, correctAnswers: number, answers: number[], moduleId?: string) => Promise<void>;
};

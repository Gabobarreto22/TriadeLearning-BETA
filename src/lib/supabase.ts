import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  role: 'employee' | 'admin';
  job_role: string;
  job_role_id: string | null;
  email: string | null;
  avatar_url: string | null;
  hire_date: string | null;
  current_role_since: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Department = {
  id: string;
  name: string;
  code: string;
  description: string;
  manager_id: string | null;
  parent_department_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type JobRole = {
  id: string;
  name: string;
  code: string;
  description: string;
  department_id: string | null;
  salary_grade: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type UserJobRoleHistory = {
  id: string;
  user_id: string;
  job_role_id: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  reason: string | null;
  created_by: string | null;
  created_at: string;
};

export type Course = {
  id: string;
  title: string;
  code: string;
  description: string;
  category: string;
  duration: string;
  estimated_hours: number;
  image_url: string;
  accent: string;
  icon_name: string;
  is_active: boolean;
  is_mandatory_anywhere: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ModuleType = 'text' | 'image' | 'infographic' | 'video' | 'pdf' | 'quiz';

export type Module = {
  id: string;
  course_id: string;
  title: string;
  type: ModuleType;
  duration: string;
  duration_minutes: number;
  body: string;
  image_url: string | null;
  infographic_data: Record<string, unknown> | null;
  video_url: string | null;
  video_duration_seconds: number;
  order_index: number;
  is_required: boolean;
  is_free_preview: boolean;
  created_at: string;
  updated_at: string;
};

export type Resource = {
  id: string;
  module_id: string | null;
  course_id: string | null;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string | null;
  file_size_bytes: number | null;
  order_index: number;
  is_downloadable: boolean;
  created_at: string;
};

export type ExamQuestion = {
  id: string;
  course_id: string;
  module_id: string | null;
  question: string;
  options: string[];
  correct_answer: string | null;
  correct_index: number;
  explanation: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  order_index: number;
  points: number;
  created_at: string;
  updated_at: string;
};

export type CourseAssignment = {
  id: string;
  course_id: string;
  job_role_id: string;
  job_role: string;
  is_mandatory: boolean;
  order_index: number;
  completion_deadline_days: number | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type CoursePrerequisite = {
  id: string;
  course_id: string;
  prerequisite_course_id: string;
  is_mandatory: boolean;
  created_at: string;
};

export type UserCourseRequirement = {
  id: string;
  user_id: string;
  course_id: string;
  job_role_id: string;
  assigned_at: string;
  assigned_by: string | null;
  deadline: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'exempted' | 'cancelled';
  is_mandatory: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  started_at: string | null;
  completed_at: string | null;
  progress_percent: number;
  last_accessed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ModuleProgress = {
  id: string;
  user_id: string;
  module_id: string;
  user_course_requirement_id: string | null;
  completed: boolean;
  completed_at: string | null;
  time_spent_seconds: number;
  last_accessed_at: string | null;
  views_count: number;
  created_at: string;
  updated_at: string;
};

export type ExamAttempt = {
  id: string;
  user_course_requirement_id: string;
  attempt_number: number;
  score: number;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  passed: boolean;
  answers: Record<string, unknown> | null;
  time_spent_seconds: number;
  started_at: string | null;
  completed_at: string | null;
  status: 'in_progress' | 'completed' | 'abandoned';
  created_at: string;
};

export type Certificate = {
  id: string;
  user_course_requirement_id: string;
  certificate_number: string;
  issue_date: string;
  expiry_date: string | null;
  certificate_url: string | null;
  validation_token: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export type RoleCertification = {
  id: string;
  user_id: string;
  job_role_id: string;
  certified_at: string;
  expires_at: string | null;
  certificate_url: string | null;
  requirements_met: Record<string, unknown> | null;
  is_valid: boolean;
  created_at: string;
  updated_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'reminder';
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  read_at: string | null;
  sent_at: string;
  expires_at: string | null;
  metadata: Record<string, unknown> | null;
};

export type CourseFeedback = {
  id: string;
  user_course_requirement_id: string;
  rating: number;
  feedback_text: string | null;
  would_recommend: boolean | null;
  time_commitment_adequate: boolean | null;
  difficulty_level: 'very_easy' | 'easy' | 'medium' | 'hard' | 'very_hard' | null;
  created_at: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  points: number;
  category: string | null;
  criteria: Record<string, unknown> | null;
  created_at: string;
};

export type UserBadge = {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  metadata: Record<string, unknown> | null;
};

export type SystemSetting = {
  id: string;
  key: string;
  value: Record<string, unknown>;
  description: string | null;
  category: string;
  is_public: boolean;
  updated_by: string | null;
  updated_at: string;
  created_at: string;
};

export type AuditLog = {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

export type CourseWithRelations = Course & {
  modules: Module[];
  exam_questions: ExamQuestion[];
  assignments: CourseAssignment[];
  resources: Resource[];
  prerequisites: CoursePrerequisite[];
};

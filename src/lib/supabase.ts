import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  role: 'employee' | 'admin';
  job_role: string;
  avatar_url: string | null;
  created_at: string;
  email?: string | null;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  image_url: string;
  accent: string;
  icon_name: string;
  created_by: string | null;
  created_at: string;
};

export type ModuleType = 'video' | 'text' | 'image';

export type Module = {
  id: string;
  course_id: string;
  title: string;
  type: ModuleType;
  duration: string;
  body: string;
  image_url: string | null;
  video_url: string | null;
  order_index: number;
  created_at: string;
};

export type ExamQuestion = {
  id: string;
  course_id: string;
  question: string;
  options: string[];
  correct_index: number;
  order_index: number;
};

export type CourseAssignment = {
  id: string;
  course_id: string;
  job_role: string;
  deadline: string | null;
  created_at: string;
};

export type ModuleProgress = {
  id: string;
  user_id: string;
  module_id: string;
  completed: boolean;
  completed_at: string | null;
};

export type ExamResult = {
  id: string;
  user_id: string;
  course_id: string;
  exam_type: 'direct' | 'course';
  score: number;
  passed: boolean;
  direct_failed: boolean;
  created_at: string;
};

export type JobRole = {
  id: string;
  name: string;
  description: string;
  created_at: string;
};

export type CourseWithRelations = Course & {
  modules: Module[];
  exam_questions: ExamQuestion[];
  assignments: CourseAssignment[];
};

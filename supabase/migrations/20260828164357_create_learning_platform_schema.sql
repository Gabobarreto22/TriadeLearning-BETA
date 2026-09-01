/*
# TRIADE Learning Platform — Core Schema

## Overview
Two-role learning platform: employees take courses/exams; admins create courses and assign by job role.

## Tables
- profiles (id, full_name, role, job_role, avatar_url, created_at)
- courses (id, title, description, category, duration, image_url, accent, icon_name, created_by, created_at)
- modules (id, course_id, title, type, duration, body, image_url, video_url, order_index, created_at)
- exam_questions (id, course_id, question, options jsonb, correct_index, order_index, created_at)
- course_assignments (id, course_id, job_role, deadline, created_at)
- module_progress (id, user_id, module_id, completed, completed_at, UNIQUE user+module)
- exam_results (id, user_id, course_id, exam_type, score, passed, direct_failed, created_at)

## Security
- RLS on all tables.
- profiles: own read/update; admin read all.
- courses/modules/exam_questions/assignments: admin CRUD; employee read.
- module_progress: own CRUD; admin read all.
- exam_results: own insert/read; admin read all.
*/

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'employee' CHECK (role IN ('employee', 'admin')),
  job_role text NOT NULL DEFAULT '',
  avatar_url text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "admin_select_all_profiles" ON profiles;
CREATE POLICY "admin_select_all_profiles" ON profiles FOR SELECT TO authenticated USING (public.is_admin_user());

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- COURSES
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  duration text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  accent text NOT NULL DEFAULT 'gray-1',
  icon_name text NOT NULL DEFAULT 'BookOpen',
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_courses" ON courses;
CREATE POLICY "read_courses" ON courses FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_courses" ON courses;
CREATE POLICY "admin_insert_courses" ON courses FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "admin_update_courses" ON courses;
CREATE POLICY "admin_update_courses" ON courses FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "admin_delete_courses" ON courses;
CREATE POLICY "admin_delete_courses" ON courses FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- MODULES
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL DEFAULT 'text' CHECK (type IN ('video', 'text', 'image')),
  duration text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  image_url text,
  video_url text,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_modules" ON modules;
CREATE POLICY "read_modules" ON modules FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_modules" ON modules;
CREATE POLICY "admin_insert_modules" ON modules FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "admin_update_modules" ON modules;
CREATE POLICY "admin_update_modules" ON modules FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "admin_delete_modules" ON modules;
CREATE POLICY "admin_delete_modules" ON modules FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE INDEX IF NOT EXISTS idx_modules_course_id ON modules(course_id);

-- EXAM QUESTIONS
CREATE TABLE IF NOT EXISTS exam_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_index int NOT NULL DEFAULT 0,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_exam_questions" ON exam_questions;
CREATE POLICY "read_exam_questions" ON exam_questions FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_exam_questions" ON exam_questions;
CREATE POLICY "admin_insert_exam_questions" ON exam_questions FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "admin_update_exam_questions" ON exam_questions;
CREATE POLICY "admin_update_exam_questions" ON exam_questions FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "admin_delete_exam_questions" ON exam_questions;
CREATE POLICY "admin_delete_exam_questions" ON exam_questions FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE INDEX IF NOT EXISTS idx_exam_questions_course_id ON exam_questions(course_id);

-- COURSE ASSIGNMENTS
CREATE TABLE IF NOT EXISTS course_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  job_role text NOT NULL,
  deadline date,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE course_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_assignments" ON course_assignments;
CREATE POLICY "read_assignments" ON course_assignments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_assignments" ON course_assignments;
CREATE POLICY "admin_insert_assignments" ON course_assignments FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "admin_delete_assignments" ON course_assignments;
CREATE POLICY "admin_delete_assignments" ON course_assignments FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE INDEX IF NOT EXISTS idx_assignments_job_role ON course_assignments(job_role);

-- MODULE PROGRESS
CREATE TABLE IF NOT EXISTS module_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, module_id)
);
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_progress" ON module_progress;
CREATE POLICY "select_own_progress" ON module_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_select_all_progress" ON module_progress;
CREATE POLICY "admin_select_all_progress" ON module_progress FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "insert_own_progress" ON module_progress;
CREATE POLICY "insert_own_progress" ON module_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_progress" ON module_progress;
CREATE POLICY "update_own_progress" ON module_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_progress" ON module_progress;
CREATE POLICY "delete_own_progress" ON module_progress FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_module_progress_user ON module_progress(user_id);

-- EXAM RESULTS
CREATE TABLE IF NOT EXISTS exam_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  exam_type text NOT NULL CHECK (exam_type IN ('direct', 'course')),
  score int NOT NULL DEFAULT 0,
  passed boolean NOT NULL DEFAULT false,
  direct_failed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_exam_results" ON exam_results;
CREATE POLICY "select_own_exam_results" ON exam_results FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_select_all_exam_results" ON exam_results;
CREATE POLICY "admin_select_all_exam_results" ON exam_results FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "insert_own_exam_results" ON exam_results;
CREATE POLICY "insert_own_exam_results" ON exam_results FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_exam_results_user ON exam_results(user_id);
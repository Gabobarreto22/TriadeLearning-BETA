/*
# Fix RLS policies — Missing CRUD policies on 7 tables

## Problem
Several tables have RLS enabled but are missing INSERT/UPDATE/DELETE/SELECT policies,
causing "new row violates row-level security policy" errors when admins try to
manage data through the admin interface.

## Tables fixed
1. course_assignments — missing INSERT, DELETE, SELECT
2. course_prerequisites — missing all 4 (INSERT, UPDATE, DELETE, SELECT)
3. exam_questions — missing all 4 (INSERT, UPDATE, DELETE, SELECT)
4. role_certifications — missing all 4 (INSERT, UPDATE, DELETE, SELECT)
5. user_job_roles_history — missing all 4 (INSERT, UPDATE, DELETE, SELECT)
6. audit_logs — missing INSERT, UPDATE, DELETE
7. exam_results — missing UPDATE, DELETE (admin management)
*/

-- ============================================================
-- 1. course_assignments: Add INSERT, DELETE, SELECT policies for admins
-- ============================================================
CREATE POLICY "admin_select_assignments" ON course_assignments
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "admin_insert_assignments" ON course_assignments
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "admin_delete_assignments" ON course_assignments
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============================================================
-- 2. course_prerequisites: Add all 4 policies for admins + SELECT for all
-- ============================================================
CREATE POLICY "admin_select_prerequisites" ON course_prerequisites
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "admin_insert_prerequisites" ON course_prerequisites
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "admin_update_prerequisites" ON course_prerequisites
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "admin_delete_prerequisites" ON course_prerequisites
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============================================================
-- 3. exam_questions: Add all 4 policies for admins + SELECT for all
-- ============================================================
CREATE POLICY "admin_select_exam_questions" ON exam_questions
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "admin_insert_exam_questions" ON exam_questions
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "admin_update_exam_questions" ON exam_questions
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "admin_delete_exam_questions" ON exam_questions
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============================================================
-- 4. role_certifications: Add all 4 policies for admins
-- ============================================================
CREATE POLICY "admin_select_role_certs" ON role_certifications
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "admin_insert_role_certs" ON role_certifications
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "admin_update_role_certs" ON role_certifications
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "admin_delete_role_certs" ON role_certifications
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============================================================
-- 5. user_job_roles_history: Add all 4 policies for admins
-- ============================================================
CREATE POLICY "admin_select_job_history" ON user_job_roles_history
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "admin_insert_job_history" ON user_job_roles_history
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "admin_update_job_history" ON user_job_roles_history
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "admin_delete_job_history" ON user_job_roles_history
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============================================================
-- 6. audit_logs: Add INSERT, UPDATE, DELETE for admins
-- ============================================================
CREATE POLICY "admin_insert_audit_logs" ON audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "admin_update_audit_logs" ON audit_logs
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "admin_delete_audit_logs" ON audit_logs
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============================================================
-- 7. exam_results: Add UPDATE, DELETE for admins
-- ============================================================
CREATE POLICY "admin_update_exam_results" ON exam_results
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "admin_delete_exam_results" ON exam_results
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

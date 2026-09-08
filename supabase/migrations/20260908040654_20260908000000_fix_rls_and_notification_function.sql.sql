/*
# Fix RLS policies and add admin notification function

## Problem
1. `notifications` has a single `FOR ALL` policy scoped to `user_id = auth.uid()`,
   which blocks admins from creating notifications for other users.
2. `exam_attempts` has no UPDATE or DELETE policies.
3. `role_certifications` has a `USING (true)` SELECT policy exposing all data.
4. `course_assignments` has a `USING (true)` SELECT policy exposing all data.
5. `course_prerequisites` has a `USING (true)` SELECT policy exposing all data.

## Changes
1. Replace broad `FOR ALL` on notifications with per-verb policies + SECURITY DEFINER function.
2. Add admin UPDATE/DELETE on exam_attempts.
3. Scope role_certifications SELECT to own user.
4. Scope course_assignments SELECT to user's job role.
5. Scope course_prerequisites SELECT to courses assigned to user's job role.
*/

-- ============================================================
-- 1. NOTIFICATIONS: Replace broad FOR ALL with per-verb policies
-- ============================================================
DROP POLICY IF EXISTS "Usuarios ven sus notificaciones" ON notifications;

CREATE POLICY "users_select_own_notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "users_update_own_notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_delete_own_notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "users_insert_own_notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "admin_select_all_notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (public.is_admin_user());

CREATE POLICY "admin_delete_any_notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (public.is_admin_user());

-- ============================================================
-- 1b. create_notification SECURITY DEFINER function
-- ============================================================
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id uuid,
  p_title text,
  p_message text,
  p_type text DEFAULT 'info',
  p_link text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;
  INSERT INTO notifications (user_id, type, title, message, link, is_read, sent_at)
  VALUES (p_user_id, p_type, p_title, p_message, p_link, false, now())
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_notification TO authenticated;

-- ============================================================
-- 2. exam_attempts: Add admin UPDATE and DELETE policies
-- ============================================================
DROP POLICY IF EXISTS "admin_update_exam_attempts" ON exam_attempts;
CREATE POLICY "admin_update_exam_attempts"
  ON exam_attempts FOR UPDATE
  TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "admin_delete_exam_attempts" ON exam_attempts;
CREATE POLICY "admin_delete_exam_attempts"
  ON exam_attempts FOR DELETE
  TO authenticated
  USING (public.is_admin_user());

-- ============================================================
-- 3. role_certifications: Replace USING(true) with ownership check
-- ============================================================
DROP POLICY IF EXISTS "users_select_role_certs" ON role_certifications;
CREATE POLICY "users_select_own_role_certs"
  ON role_certifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- 4. course_assignments: Replace USING(true) with job-role-scoped SELECT
-- ============================================================
DROP POLICY IF EXISTS "users_select_own_assignments" ON course_assignments;
CREATE POLICY "users_select_own_role_assignments"
  ON course_assignments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.job_role_id = course_assignments.job_role_id
    )
  );

-- ============================================================
-- 5. course_prerequisites: Replace USING(true) with scoped SELECT
-- ============================================================
DROP POLICY IF EXISTS "users_select_prerequisites" ON course_prerequisites;
CREATE POLICY "users_select_own_prerequisites"
  ON course_prerequisites FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_assignments ca
      INNER JOIN profiles p ON p.id = auth.uid()
      WHERE ca.course_id = course_prerequisites.course_id
        AND ca.job_role_id = p.job_role_id
    )
  );
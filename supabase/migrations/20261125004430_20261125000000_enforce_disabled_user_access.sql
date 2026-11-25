/*
# Enforce disabled user access control without deleting accounts

1. Purpose
- Preserve every employee and administrator record.
- Make the existing `profiles.is_active` flag the authoritative access state.
- Prevent disabled authenticated sessions from reading or changing application data.

2. Schema changes
- `profiles.is_active` is normalized to `true` when it is null, receives a `true` default, and becomes required.
- No users, profiles, courses, assignments, certificates, feedback, or history records are deleted.

3. Security changes
- Update `public.is_admin_user()` so only active administrators are treated as administrators.
- Add `public.is_active_user()`, a SECURITY DEFINER helper that checks the current authenticated profile.
- Add restrictive SELECT, INSERT, UPDATE, and DELETE policies for authenticated users on every application table. These policies require an active profile and therefore apply in addition to existing ownership and administrator policies.
- Grant the helper only to authenticated users; the service role used by the status function remains able to perform the administrative status update.

4. Important notes
- A disabled user remains visible to administrators and can be re-enabled from the personnel filters.
- Existing data and relationships remain intact.
- The frontend and status Edge Function also validate the active state, but these database policies provide the server-side enforcement.
*/

UPDATE public.profiles
SET is_active = true
WHERE is_active IS NULL;

ALTER TABLE public.profiles
  ALTER COLUMN is_active SET DEFAULT true,
  ALTER COLUMN is_active SET NOT NULL;

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
      AND p.is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_active_user()
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
      AND p.is_active = true
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_active_user() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_active_user() TO authenticated;

DROP POLICY IF EXISTS "active_session_only_select" ON public.audit_logs;
CREATE POLICY "active_session_only_select" ON public.audit_logs AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.audit_logs;
CREATE POLICY "active_session_only_insert" ON public.audit_logs AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.audit_logs;
CREATE POLICY "active_session_only_update" ON public.audit_logs AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.audit_logs;
CREATE POLICY "active_session_only_delete" ON public.audit_logs AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());

DROP POLICY IF EXISTS "active_session_only_select" ON public.badges;
CREATE POLICY "active_session_only_select" ON public.badges AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.badges;
CREATE POLICY "active_session_only_insert" ON public.badges AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.badges;
CREATE POLICY "active_session_only_update" ON public.badges AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.badges;
CREATE POLICY "active_session_only_delete" ON public.badges AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());

DROP POLICY IF EXISTS "active_session_only_select" ON public.certificates;
CREATE POLICY "active_session_only_select" ON public.certificates AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.certificates;
CREATE POLICY "active_session_only_insert" ON public.certificates AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.certificates;
CREATE POLICY "active_session_only_update" ON public.certificates AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.certificates;
CREATE POLICY "active_session_only_delete" ON public.certificates AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());

DROP POLICY IF EXISTS "active_session_only_select" ON public.course_assignments;
CREATE POLICY "active_session_only_select" ON public.course_assignments AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.course_assignments;
CREATE POLICY "active_session_only_insert" ON public.course_assignments AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.course_assignments;
CREATE POLICY "active_session_only_update" ON public.course_assignments AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.course_assignments;
CREATE POLICY "active_session_only_delete" ON public.course_assignments AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());

DROP POLICY IF EXISTS "active_session_only_select" ON public.course_feedback;
CREATE POLICY "active_session_only_select" ON public.course_feedback AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.course_feedback;
CREATE POLICY "active_session_only_insert" ON public.course_feedback AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.course_feedback;
CREATE POLICY "active_session_only_update" ON public.course_feedback AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.course_feedback;
CREATE POLICY "active_session_only_delete" ON public.course_feedback AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());

DROP POLICY IF EXISTS "active_session_only_select" ON public.course_prerequisites;
CREATE POLICY "active_session_only_select" ON public.course_prerequisites AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.course_prerequisites;
CREATE POLICY "active_session_only_insert" ON public.course_prerequisites AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.course_prerequisites;
CREATE POLICY "active_session_only_update" ON public.course_prerequisites AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.course_prerequisites;
CREATE POLICY "active_session_only_delete" ON public.course_prerequisites AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());

DROP POLICY IF EXISTS "active_session_only_select" ON public.courses;
CREATE POLICY "active_session_only_select" ON public.courses AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.courses;
CREATE POLICY "active_session_only_insert" ON public.courses AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.courses;
CREATE POLICY "active_session_only_update" ON public.courses AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.courses;
CREATE POLICY "active_session_only_delete" ON public.courses AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());

DROP POLICY IF EXISTS "active_session_only_select" ON public.departments;
CREATE POLICY "active_session_only_select" ON public.departments AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.departments;
CREATE POLICY "active_session_only_insert" ON public.departments AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.departments;
CREATE POLICY "active_session_only_update" ON public.departments AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.departments;
CREATE POLICY "active_session_only_delete" ON public.departments AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());

DROP POLICY IF EXISTS "active_session_only_select" ON public.exam_attempts;
CREATE POLICY "active_session_only_select" ON public.exam_attempts AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.exam_attempts;
CREATE POLICY "active_session_only_insert" ON public.exam_attempts AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.exam_attempts;
CREATE POLICY "active_session_only_update" ON public.exam_attempts AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.exam_attempts;
CREATE POLICY "active_session_only_delete" ON public.exam_attempts AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());

DROP POLICY IF EXISTS "active_session_only_select" ON public.exam_questions;
CREATE POLICY "active_session_only_select" ON public.exam_questions AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.exam_questions;
CREATE POLICY "active_session_only_insert" ON public.exam_questions AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.exam_questions;
CREATE POLICY "active_session_only_update" ON public.exam_questions AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.exam_questions;
CREATE POLICY "active_session_only_delete" ON public.exam_questions AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());

DROP POLICY IF EXISTS "active_session_only_select" ON public.exam_results;
CREATE POLICY "active_session_only_select" ON public.exam_results AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.exam_results;
CREATE POLICY "active_session_only_insert" ON public.exam_results AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.exam_results;
CREATE POLICY "active_session_only_update" ON public.exam_results AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.exam_results;
CREATE POLICY "active_session_only_delete" ON public.exam_results AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());

DROP POLICY IF EXISTS "active_session_only_select" ON public.job_roles;
CREATE POLICY "active_session_only_select" ON public.job_roles AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.job_roles;
CREATE POLICY "active_session_only_insert" ON public.job_roles AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.job_roles;
CREATE POLICY "active_session_only_update" ON public.job_roles AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.job_roles;
CREATE POLICY "active_session_only_delete" ON public.job_roles AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());

DROP POLICY IF EXISTS "active_session_only_select" ON public.learning_sessions;
CREATE POLICY "active_session_only_select" ON public.learning_sessions AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.learning_sessions;
CREATE POLICY "active_session_only_insert" ON public.learning_sessions AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.learning_sessions;
CREATE POLICY "active_session_only_update" ON public.learning_sessions AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.learning_sessions;
CREATE POLICY "active_session_only_delete" ON public.learning_sessions AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());

DROP POLICY IF EXISTS "active_session_only_select" ON public.module_progress;
CREATE POLICY "active_session_only_select" ON public.module_progress AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.module_progress;
CREATE POLICY "active_session_only_insert" ON public.module_progress AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.module_progress;
CREATE POLICY "active_session_only_update" ON public.module_progress AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.module_progress;
CREATE POLICY "active_session_only_delete" ON public.module_progress AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());

DROP POLICY IF EXISTS "active_session_only_select" ON public.modules;
CREATE POLICY "active_session_only_select" ON public.modules AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.modules;
CREATE POLICY "active_session_only_insert" ON public.modules AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.modules;
CREATE POLICY "active_session_only_update" ON public.modules AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.modules;
CREATE POLICY "active_session_only_delete" ON public.modules AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());

DROP POLICY IF EXISTS "active_session_only_select" ON public.notifications;
CREATE POLICY "active_session_only_select" ON public.notifications AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.notifications;
CREATE POLICY "active_session_only_insert" ON public.notifications AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.notifications;
CREATE POLICY "active_session_only_update" ON public.notifications AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.notifications;
CREATE POLICY "active_session_only_delete" ON public.notifications AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());

DROP POLICY IF EXISTS "active_session_only_select" ON public.profiles;
CREATE POLICY "active_session_only_select" ON public.profiles AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.profiles;
CREATE POLICY "active_session_only_insert" ON public.profiles AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.profiles;
CREATE POLICY "active_session_only_update" ON public.profiles AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.profiles;
CREATE POLICY "active_session_only_delete" ON public.profiles AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());

DROP POLICY IF EXISTS "active_session_only_select" ON public.resources;
CREATE POLICY "active_session_only_select" ON public.resources AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.resources;
CREATE POLICY "active_session_only_insert" ON public.resources AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.resources;
CREATE POLICY "active_session_only_update" ON public.resources AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.resources;
CREATE POLICY "active_session_only_delete" ON public.resources AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());

DROP POLICY IF EXISTS "active_session_only_select" ON public.role_certifications;
CREATE POLICY "active_session_only_select" ON public.role_certifications AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.role_certifications;
CREATE POLICY "active_session_only_insert" ON public.role_certifications AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.role_certifications;
CREATE POLICY "active_session_only_update" ON public.role_certifications AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.role_certifications;
CREATE POLICY "active_session_only_delete" ON public.role_certifications AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());

DROP POLICY IF EXISTS "active_session_only_select" ON public.system_settings;
CREATE POLICY "active_session_only_select" ON public.system_settings AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.system_settings;
CREATE POLICY "active_session_only_insert" ON public.system_settings AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.system_settings;
CREATE POLICY "active_session_only_update" ON public.system_settings AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.system_settings;
CREATE POLICY "active_session_only_delete" ON public.system_settings AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());

DROP POLICY IF EXISTS "active_session_only_select" ON public.user_badges;
CREATE POLICY "active_session_only_select" ON public.user_badges AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.user_badges;
CREATE POLICY "active_session_only_insert" ON public.user_badges AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.user_badges;
CREATE POLICY "active_session_only_update" ON public.user_badges AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.user_badges;
CREATE POLICY "active_session_only_delete" ON public.user_badges AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());

DROP POLICY IF EXISTS "active_session_only_select" ON public.user_course_requirements;
CREATE POLICY "active_session_only_select" ON public.user_course_requirements AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.user_course_requirements;
CREATE POLICY "active_session_only_insert" ON public.user_course_requirements AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.user_course_requirements;
CREATE POLICY "active_session_only_update" ON public.user_course_requirements AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.user_course_requirements;
CREATE POLICY "active_session_only_delete" ON public.user_course_requirements AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());

DROP POLICY IF EXISTS "active_session_only_select" ON public.user_job_roles_history;
CREATE POLICY "active_session_only_select" ON public.user_job_roles_history AS RESTRICTIVE FOR SELECT TO authenticated USING (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_insert" ON public.user_job_roles_history;
CREATE POLICY "active_session_only_insert" ON public.user_job_roles_history AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_update" ON public.user_job_roles_history;
CREATE POLICY "active_session_only_update" ON public.user_job_roles_history AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.is_active_user()) WITH CHECK (public.is_active_user());
DROP POLICY IF EXISTS "active_session_only_delete" ON public.user_job_roles_history;
CREATE POLICY "active_session_only_delete" ON public.user_job_roles_history AS RESTRICTIVE FOR DELETE TO authenticated USING (public.is_active_user());
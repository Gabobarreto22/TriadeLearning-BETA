/*
# Fix admin and user SELECT policies for certificates-related tables

## Problem
The admin certification dashboard cannot load certificates because the relevant
Supabase tables do not allow authenticated admins to read the rows they need.
The joins used by the app include `user_course_requirements`, `certificates`, and
`role_certifications`, but the database is missing the proper SELECT policies.

## Changes
1. Allow admins to read all user course requirements.
2. Allow users to read only their own course requirements.
3. Allow admins to read all certificates.
4. Allow users to read only the certificates tied to their own course requirements.
5. Allow admins to read all role certifications.
6. Allow users to read only their own role certifications.
*/

DROP POLICY IF EXISTS "admin_select_all_user_course_requirements" ON user_course_requirements;
CREATE POLICY "admin_select_all_user_course_requirements"
  ON user_course_requirements FOR SELECT
  TO authenticated
  USING (public.is_admin_user());

DROP POLICY IF EXISTS "users_select_own_user_course_requirements" ON user_course_requirements;
CREATE POLICY "users_select_own_user_course_requirements"
  ON user_course_requirements FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_select_all_certificates" ON certificates;
CREATE POLICY "admin_select_all_certificates"
  ON certificates FOR SELECT
  TO authenticated
  USING (public.is_admin_user());

DROP POLICY IF EXISTS "users_select_own_certificates" ON certificates;
CREATE POLICY "users_select_own_certificates"
  ON certificates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM user_course_requirements ucr
      WHERE ucr.id = certificates.user_course_requirement_id
        AND ucr.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "admin_select_all_role_certs" ON role_certifications;
CREATE POLICY "admin_select_all_role_certs"
  ON role_certifications FOR SELECT
  TO authenticated
  USING (public.is_admin_user());

DROP POLICY IF EXISTS "users_select_own_role_certs" ON role_certifications;
CREATE POLICY "users_select_own_role_certs"
  ON role_certifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

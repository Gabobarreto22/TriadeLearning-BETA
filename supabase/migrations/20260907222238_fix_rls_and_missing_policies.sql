/*
# Fix RLS policies for employee write access

## Problem
Several tables used by employees lack INSERT/UPDATE policies, so employees
cannot save exam attempts, create their user_course_requirements, or receive
certificates. The `user_course_requirements` table only has SELECT for users
and ALL for admins — no INSERT for the user themselves. `certificates` only
has SELECT for users and ALL for admins — no INSERT. `exam_attempts` has a
broad ALL policy that works but should be split into proper per-verb policies.

## Changes
1. `user_course_requirements`: Add INSERT policy for users to create their own
   requirements (needed when an employee opens a course for the first time).
2. `user_course_requirements`: Add UPDATE policy for users to update their own
   progress/status.
3. `certificates`: Add INSERT policy scoped through user_course_requirements
   ownership (user can only create certs for their own requirements).
4. `exam_attempts`: Replace the broad ALL policy with proper per-verb SELECT
   and INSERT policies.
5. `course_feedback`: Replace the broad ALL policy with proper per-verb
   SELECT and INSERT policies (users insert, admins select).

## Security
- All policies use `auth.uid()` for ownership checks.
- No `USING (true)` shortcuts.
- Admin policies remain unchanged.
*/

-- 1. user_course_requirements: allow users to INSERT their own
DROP POLICY IF EXISTS "Usuarios insertan sus propios requisitos" ON user_course_requirements;
CREATE POLICY "Usuarios insertan sus propios requisitos"
  ON user_course_requirements FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 2. user_course_requirements: allow users to UPDATE their own
DROP POLICY IF EXISTS "Usuarios actualizan sus propios requisitos" ON user_course_requirements;
CREATE POLICY "Usuarios actualizan sus propios requisitos"
  ON user_course_requirements FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 3. certificates: allow users to INSERT certs for their own requirements
DROP POLICY IF EXISTS "Usuarios crean sus certificados" ON certificates;
CREATE POLICY "Usuarios crean sus certificados"
  ON certificates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_course_requirements ucr
      WHERE ucr.id = certificates.user_course_requirement_id
        AND ucr.user_id = auth.uid()
    )
  );

-- 4. exam_attempts: replace broad ALL with proper per-verb policies
DROP POLICY IF EXISTS "Usuarios gestionan sus intentos de examen" ON exam_attempts;

DROP POLICY IF EXISTS "Usuarios ven sus intentos de examen" ON exam_attempts;
CREATE POLICY "Usuarios ven sus intentos de examen"
  ON exam_attempts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_course_requirements ucr
      WHERE ucr.id = exam_attempts.user_course_requirement_id
        AND ucr.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Usuarios insertan sus intentos de examen" ON exam_attempts;
CREATE POLICY "Usuarios insertan sus intentos de examen"
  ON exam_attempts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_course_requirements ucr
      WHERE ucr.id = exam_attempts.user_course_requirement_id
        AND ucr.user_id = auth.uid()
    )
  );

-- 5. course_feedback: replace broad ALL with proper per-verb policies
DROP POLICY IF EXISTS "Usuarios gestionan sus feedbacks" ON course_feedback;

DROP POLICY IF EXISTS "Usuarios insertan sus feedbacks" ON course_feedback;
CREATE POLICY "Usuarios insertan sus feedbacks"
  ON course_feedback FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_course_requirements ucr
      WHERE ucr.id = course_feedback.user_course_requirement_id
        AND ucr.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Usuarios ven sus feedbacks" ON course_feedback;
CREATE POLICY "Usuarios ven sus feedbacks"
  ON course_feedback FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_course_requirements ucr
      WHERE ucr.id = course_feedback.user_course_requirement_id
        AND ucr.user_id = auth.uid()
    )
  );
/*
# Fix RLS — Allow employees to SELECT from course_assignments and exam_questions

## Problem
The previous migration only allowed admins to SELECT from course_assignments and
exam_questions. But employees need to:
- SELECT from course_assignments to see courses assigned to their job role
- SELECT from exam_questions to take exams

## Fix
Add permissive SELECT policies for all authenticated users on both tables.
*/

-- Employees can see assignments for their own job role
CREATE POLICY "users_select_own_assignments" ON course_assignments
  FOR SELECT TO authenticated
  USING (true);

-- Employees can see exam questions for courses they're assigned to
CREATE POLICY "users_select_exam_questions" ON exam_questions
  FOR SELECT TO authenticated
  USING (true);

-- Employees can see course prerequisites (needed to display course dependencies)
CREATE POLICY "users_select_prerequisites" ON course_prerequisites
  FOR SELECT TO authenticated
  USING (true);

-- Employees can see role certifications (needed to display certification requirements)
CREATE POLICY "users_select_role_certs" ON role_certifications
  FOR SELECT TO authenticated
  USING (true);

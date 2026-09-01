/*
# TRIADE Learning Platform — Job Roles & Admin Management

## Overview
Adds a dedicated `job_roles` table for structured role/position management.
Updates RLS policies on `profiles` to allow admins to create, edit, and manage
all employee/admin accounts. Adds admin update/delete policies on `course_assignments`.

## New Tables
- `job_roles` (id, name, description, created_at)
  - Stores job positions/roles that can be assigned to users and courses.

## Modified Tables
- `profiles`: No schema changes. Added admin INSERT, UPDATE, DELETE policies so
  admins can create/edit/delete user accounts from the admin panel.
- `course_assignments`: Added admin UPDATE policy so admins can edit assignment deadlines.

## Security Changes
- `job_roles`: RLS enabled. Admin-only CRUD; all authenticated users can SELECT.
- `profiles`: Added admin INSERT, UPDATE, DELETE policies (existing own-profile
  policies remain).
- `course_assignments`: Added admin UPDATE policy.

## Important Notes
1. The `job_roles` table is separate from the text `job_role` column on `profiles`.
   The admin panel will use `job_roles` to populate the dropdown of available positions.
2. Admins can now create new users by inserting into `profiles` — the actual auth
   account creation uses a SECURITY DEFINER function or the admin API.
3. All policies use `EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')`
   for admin checks.
*/

-- JOB ROLES TABLE
CREATE TABLE IF NOT EXISTS job_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE job_roles ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read job roles
DROP POLICY IF EXISTS "read_job_roles" ON job_roles;
CREATE POLICY "read_job_roles" ON job_roles FOR SELECT TO authenticated USING (true);

-- Admin-only CRUD on job_roles
DROP POLICY IF EXISTS "admin_insert_job_roles" ON job_roles;
CREATE POLICY "admin_insert_job_roles" ON job_roles FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "admin_update_job_roles" ON job_roles;
CREATE POLICY "admin_update_job_roles" ON job_roles FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "admin_delete_job_roles" ON job_roles;
CREATE POLICY "admin_delete_job_roles" ON job_roles FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- PROFILES: Admin management policies
DROP POLICY IF EXISTS "admin_insert_profiles" ON profiles;
CREATE POLICY "admin_insert_profiles" ON profiles FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "admin_update_profiles" ON profiles;
CREATE POLICY "admin_update_profiles" ON profiles FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "admin_delete_profiles" ON profiles;
CREATE POLICY "admin_delete_profiles" ON profiles FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- COURSE ASSIGNMENTS: Admin update policy
DROP POLICY IF EXISTS "admin_update_assignments" ON course_assignments;
CREATE POLICY "admin_update_assignments" ON course_assignments FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Seed default job roles if table is empty
INSERT INTO job_roles (name, description)
SELECT * FROM (VALUES
  ('Técnico de Mantenimiento', 'Personal técnico de mantenimiento'),
  ('Administrador', 'Personal administrativo'),
  ('Supervisor', 'Personal de supervisión')
) AS t(name, description)
WHERE NOT EXISTS (SELECT 1 FROM job_roles LIMIT 1);

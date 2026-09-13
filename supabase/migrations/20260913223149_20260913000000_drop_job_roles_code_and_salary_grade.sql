/*
# Remove code and salary_grade columns from job_roles

1. Changes
- Drop the `code` column from `job_roles` (was used as a short identifier like "GER-01").
- Drop the `salary_grade` column from `job_roles` (was used for salary tier like "A1").
- These fields are no longer used in the application and are being removed to simplify the data model.

2. Security
- No RLS policy changes. Existing policies on job_roles remain unchanged.

3. Notes
- The columns are dropped with `IF EXISTS` so the migration is safe to re-run.
- No other tables reference these columns.
*/

ALTER TABLE job_roles DROP COLUMN IF EXISTS code;
ALTER TABLE job_roles DROP COLUMN IF EXISTS salary_grade;

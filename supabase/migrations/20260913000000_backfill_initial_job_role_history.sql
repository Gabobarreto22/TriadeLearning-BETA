-- Create the initial history entry for employees created before the history write was added.
INSERT INTO user_job_roles_history (
  user_id,
  job_role_id,
  start_date,
  is_current,
  reason,
  created_by
)
SELECT
  p.id,
  p.job_role_id,
  COALESCE(p.current_role_since, p.hire_date, p.created_at::date, CURRENT_DATE),
  true,
  'Cargo inicial',
  NULL
FROM profiles p
WHERE p.role = 'employee'
  AND p.job_role_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM user_job_roles_history h
    WHERE h.user_id = p.id
  );
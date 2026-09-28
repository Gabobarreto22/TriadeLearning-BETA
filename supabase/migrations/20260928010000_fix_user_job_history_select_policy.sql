DROP POLICY IF EXISTS "users_select_own_job_history" ON public.user_job_roles_history;

CREATE POLICY "users_select_own_job_history"
  ON public.user_job_roles_history FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

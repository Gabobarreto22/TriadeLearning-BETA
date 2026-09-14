-- Keep a complete record of data changes made by authenticated users.
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_select_all_audit_logs" ON audit_logs;
CREATE POLICY "admin_select_all_audit_logs" ON audit_logs
  FOR SELECT TO authenticated
  USING (public.is_admin_user());

CREATE OR REPLACE FUNCTION public.record_audit_log()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  old_row jsonb;
  new_row jsonb;
  entity_id_value uuid;
BEGIN
  IF TG_OP = 'DELETE' THEN
    old_row := to_jsonb(OLD);
    entity_id_value := (old_row ->> 'id')::uuid;
  ELSE
    new_row := to_jsonb(NEW);
    entity_id_value := (new_row ->> 'id')::uuid;
    IF TG_OP = 'UPDATE' THEN
      old_row := to_jsonb(OLD);
    END IF;
  END IF;

  INSERT INTO public.audit_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values,
    created_at
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    entity_id_value,
    old_row,
    new_row,
    now()
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  table_name text;
  tracked_tables text[] := ARRAY[
    'profiles', 'courses', 'modules', 'exam_questions', 'course_assignments',
    'module_progress', 'exam_results', 'job_roles', 'departments',
    'user_job_roles_history', 'user_course_requirements', 'exam_attempts',
    'certificates', 'role_certifications', 'notifications', 'course_feedback',
    'badges', 'user_badges', 'system_settings', 'resources',
    'course_prerequisites'
  ];
BEGIN
  FOREACH table_name IN ARRAY tracked_tables LOOP
    IF to_regclass('public.' || table_name) IS NOT NULL THEN
      EXECUTE format('DROP TRIGGER IF EXISTS audit_%I ON public.%I', table_name, table_name);
      EXECUTE format(
        'CREATE TRIGGER audit_%I AFTER INSERT OR UPDATE OR DELETE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.record_audit_log()',
        table_name,
        table_name
      );
    END IF;
  END LOOP;
END;
$$;
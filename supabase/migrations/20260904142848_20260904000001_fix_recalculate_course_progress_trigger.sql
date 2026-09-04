
CREATE OR REPLACE FUNCTION public.recalculate_course_progress()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  total_modules integer;
  completed_modules integer;
  new_progress integer;
  v_course_id uuid;
BEGIN
  SELECT m.course_id INTO v_course_id
  FROM public.modules m
  WHERE m.id = NEW.module_id;

  SELECT COUNT(*) INTO total_modules
  FROM public.modules m
  WHERE m.course_id = v_course_id;

  SELECT COUNT(*) INTO completed_modules
  FROM public.module_progress mp
  WHERE mp.user_id = NEW.user_id
    AND mp.completed = true
    AND mp.module_id IN (
      SELECT m2.id FROM public.modules m2
      WHERE m2.course_id = v_course_id
    );

  IF total_modules > 0 THEN
    new_progress := (completed_modules * 100) / total_modules;
  ELSE
    new_progress := 0;
  END IF;

  UPDATE public.user_course_requirements
  SET
    progress_percent = new_progress,
    updated_at = now(),
    status = CASE
      WHEN new_progress = 100 THEN 'completed'
      WHEN new_progress > 0 THEN 'in_progress'
      ELSE 'pending'
    END,
    completed_at = CASE
      WHEN new_progress = 100 THEN now()
      ELSE completed_at
    END
  WHERE user_id = NEW.user_id
    AND course_id = v_course_id;

  RETURN NEW;
END;
$function$;

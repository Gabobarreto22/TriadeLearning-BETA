ALTER TABLE IF EXISTS public.exam_results
  ADD COLUMN IF NOT EXISTS module_id uuid NULL REFERENCES public.modules(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_exam_results_module_id
  ON public.exam_results (module_id);

/*
# Create exam_results table

1. New Tables
- `exam_results`: Stores exam results for users, including direct exams and course exams.
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to profiles)
  - `course_id` (uuid, FK to courses)
  - `exam_type` (text: 'direct' or 'course')
  - `score` (int: percentage 0-100)
  - `passed` (boolean)
  - `direct_failed` (boolean: whether a direct exam was failed)
  - `created_at` (timestamptz)

2. Security
- Enable RLS on `exam_results`.
- Users can read their own exam results.
- Users can insert their own exam results.
- Admins can read all exam results.
*/

CREATE TABLE IF NOT EXISTS exam_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  exam_type text NOT NULL DEFAULT 'course',
  score int NOT NULL DEFAULT 0,
  passed boolean NOT NULL DEFAULT false,
  direct_failed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_exam_results" ON exam_results;
CREATE POLICY "select_own_exam_results"
ON exam_results FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_exam_results" ON exam_results;
CREATE POLICY "insert_own_exam_results"
ON exam_results FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_select_all_exam_results" ON exam_results;
CREATE POLICY "admin_select_all_exam_results"
ON exam_results FOR SELECT
TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE INDEX IF NOT EXISTS idx_exam_results_user_id ON exam_results(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_course_id ON exam_results(course_id);

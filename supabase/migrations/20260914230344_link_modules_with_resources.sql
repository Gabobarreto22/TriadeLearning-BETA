/*
# Link modules with resources and add resource_type to modules

1. Changes to `modules` table
- Add `resource_type` column (text, nullable) to store the type of attached resource
  (image, video, pdf, powerpoint). This lets each module have one associated resource.
- Add `resource_url` column (text, nullable) to store the ImageKit URL of the resource.
- Add `resource_file_id` column (text, nullable) to store the ImageKit file ID for deletion.

2. Changes to `resources` table
- The `module_id` column already exists. No schema change needed.
- The existing `resources` table continues to work for course-level resources.

3. Security
- No new tables. RLS already enabled on `modules` and `resources`.
- No policy changes needed — existing policies cover the new columns.

4. Notes
- Each module can now have one attached resource (image, video, PDF, or PowerPoint).
- The resource is stored in ImageKit and the URL is saved on the module row.
- Course-level resources in the `resources` table remain unchanged.
*/

ALTER TABLE modules
  ADD COLUMN IF NOT EXISTS resource_type text,
  ADD COLUMN IF NOT EXISTS resource_url text,
  ADD COLUMN IF NOT EXISTS resource_file_id text;

/*
# Restrict direct profile status changes

1. Purpose
- Keep account activation and disabling inside the authorized status flow.
- Prevent a browser request from changing `profiles.is_active`, role, or other protected profile fields through a broad UPDATE privilege.

2. Security changes
- Remove table-wide UPDATE access on `profiles` from authenticated users.
- Grant UPDATE only for fields used by the personal profile and personnel edit screens.
- The `is_active` field can no longer be changed through the browser Data API. The protected status Edge Function continues to update it with the service role after checking that the caller is an active administrator.

3. Data safety
- No rows or columns are deleted.
- Existing profile data remains unchanged.
*/

REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (full_name, email, cedula, telefono, direccion, avatar_url, job_role_id, current_role_since) ON public.profiles TO authenticated;
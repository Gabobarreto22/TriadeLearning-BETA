
-- Drop existing policies on profiles
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_all_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_admin" ON public.profiles;

-- Admin can read all profiles; users can read their own
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "profiles_select_all_admin"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.is_admin_user());

-- Admin can insert, update, delete profiles
CREATE POLICY "profiles_insert_admin"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_user());

CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE TO authenticated
  USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

CREATE POLICY "profiles_delete_admin"
  ON public.profiles FOR DELETE TO authenticated
  USING (public.is_admin_user());

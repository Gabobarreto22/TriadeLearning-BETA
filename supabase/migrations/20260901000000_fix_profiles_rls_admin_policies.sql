create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

grant execute on function public.is_admin_user() to authenticated;

drop policy if exists "select_own_profile" on public.profiles;
create policy "select_own_profile"
on public.profiles
for select to authenticated
using (auth.uid() = id);

drop policy if exists "admin_select_all_profiles" on public.profiles;
create policy "admin_select_all_profiles"
on public.profiles
for select to authenticated
using (public.is_admin_user());

drop policy if exists "update_own_profile" on public.profiles;
create policy "update_own_profile"
on public.profiles
for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "insert_own_profile" on public.profiles;
create policy "insert_own_profile"
on public.profiles
for insert to authenticated
with check (auth.uid() = id);

drop policy if exists "admin_insert_profiles" on public.profiles;
create policy "admin_insert_profiles"
on public.profiles
for insert to authenticated
with check (public.is_admin_user());

drop policy if exists "admin_update_profiles" on public.profiles;
create policy "admin_update_profiles"
on public.profiles
for update to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "admin_delete_profiles" on public.profiles;
create policy "admin_delete_profiles"
on public.profiles
for delete to authenticated
using (public.is_admin_user());

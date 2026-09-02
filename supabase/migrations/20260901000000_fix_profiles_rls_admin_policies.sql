-- Remove every policy, including policies created with names not tracked here.
do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
  loop
    execute format('drop policy if exists %I on public.profiles', policy_record.policyname);
  end loop;
end
$$;

alter table public.profiles enable row level security;

create policy "profiles_select_own"
on public.profiles
for select to authenticated
using ((select auth.uid()) = id);

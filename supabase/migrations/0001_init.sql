-- Asignly / Focus Desk — core schema
-- Run this in the Supabase SQL editor, or via `supabase db push`.

create extension if not exists "pgcrypto";

create type assignment_status as enum ('todo', 'in_progress', 'completed');
create type assignment_priority as enum ('low', 'medium', 'high');
create type assignment_source as enum ('manual', 'ai_scan');

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
-- No insert/delete policy: profiles are created by the handle_new_user trigger
-- (security definer) and removed via the auth.users cascade.

-- Auto-create a profile row whenever a new auth user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- subjects
-- ---------------------------------------------------------------------------
create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  color text not null default '#6366f1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subjects_user_id_idx on public.subjects (user_id);

alter table public.subjects enable row level security;

create policy "subjects_select_own" on public.subjects
  for select using (auth.uid() = user_id);
create policy "subjects_insert_own" on public.subjects
  for insert with check (auth.uid() = user_id);
create policy "subjects_update_own" on public.subjects
  for update using (auth.uid() = user_id);
create policy "subjects_delete_own" on public.subjects
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- assignments
-- ---------------------------------------------------------------------------
create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject_id uuid references public.subjects (id) on delete set null,
  title text not null,
  description text,
  due_at timestamptz,
  priority assignment_priority not null default 'medium',
  status assignment_status not null default 'todo',
  estimated_minutes integer check (estimated_minutes is null or estimated_minutes > 0),
  progress smallint not null default 0 check (progress between 0 and 100),
  source assignment_source not null default 'manual',
  source_metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index assignments_user_id_idx on public.assignments (user_id);
create index assignments_subject_id_idx on public.assignments (subject_id);
create index assignments_due_at_idx on public.assignments (due_at);
create index assignments_status_idx on public.assignments (status);

alter table public.assignments enable row level security;

create policy "assignments_select_own" on public.assignments
  for select using (auth.uid() = user_id);
create policy "assignments_insert_own" on public.assignments
  for insert with check (auth.uid() = user_id);
create policy "assignments_update_own" on public.assignments
  for update using (auth.uid() = user_id);
create policy "assignments_delete_own" on public.assignments
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- assignment_tasks
-- ---------------------------------------------------------------------------
create table public.assignment_tasks (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments (id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index assignment_tasks_assignment_id_idx on public.assignment_tasks (assignment_id);

alter table public.assignment_tasks enable row level security;

create policy "assignment_tasks_select_own" on public.assignment_tasks
  for select using (
    exists (select 1 from public.assignments a where a.id = assignment_id and a.user_id = auth.uid())
  );
create policy "assignment_tasks_insert_own" on public.assignment_tasks
  for insert with check (
    exists (select 1 from public.assignments a where a.id = assignment_id and a.user_id = auth.uid())
  );
create policy "assignment_tasks_update_own" on public.assignment_tasks
  for update using (
    exists (select 1 from public.assignments a where a.id = assignment_id and a.user_id = auth.uid())
  );
create policy "assignment_tasks_delete_own" on public.assignment_tasks
  for delete using (
    exists (select 1 from public.assignments a where a.id = assignment_id and a.user_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- assignment_attachments
-- ---------------------------------------------------------------------------
create table public.assignment_attachments (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments (id) on delete cascade,
  file_path text not null,
  file_name text not null,
  mime_type text not null,
  created_at timestamptz not null default now()
);

create index assignment_attachments_assignment_id_idx on public.assignment_attachments (assignment_id);

alter table public.assignment_attachments enable row level security;

create policy "assignment_attachments_select_own" on public.assignment_attachments
  for select using (
    exists (select 1 from public.assignments a where a.id = assignment_id and a.user_id = auth.uid())
  );
create policy "assignment_attachments_insert_own" on public.assignment_attachments
  for insert with check (
    exists (select 1 from public.assignments a where a.id = assignment_id and a.user_id = auth.uid())
  );
create policy "assignment_attachments_delete_own" on public.assignment_attachments
  for delete using (
    exists (select 1 from public.assignments a where a.id = assignment_id and a.user_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.subjects
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.assignments
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.assignment_tasks
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- table privileges
-- RLS policies alone aren't enough — Postgres also requires the role to hold
-- the base table privilege before RLS is even evaluated.
-- ---------------------------------------------------------------------------
grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.subjects to authenticated;
grant select, insert, update, delete on public.assignments to authenticated;
grant select, insert, update, delete on public.assignment_tasks to authenticated;
grant select, insert, update, delete on public.assignment_attachments to authenticated;

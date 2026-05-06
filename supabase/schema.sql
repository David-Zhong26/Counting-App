-- 小宝数数 — tasks + daily_counts with Row Level Security
-- Run in Supabase SQL Editor (or migrate via CLI).
--
-- Your existing daily_counts table only had user_id + date + count.
-- The app needs multiple tasks per user, so we add public.tasks and task_id on daily_counts.
-- If you already created daily_counts WITHOUT task_id: run supabase/migrate_existing_daily_counts.sql instead.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tasks (one row per habit / counter)
-- ---------------------------------------------------------------------------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  goal int not null default 50,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_user_id_idx on public.tasks (user_id);

-- ---------------------------------------------------------------------------
-- Daily counts per task (logical calendar date in the user's timezone is stored as date)
-- ---------------------------------------------------------------------------
create table if not exists public.daily_counts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  task_id uuid not null references public.tasks (id) on delete cascade,
  date date not null,
  count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint daily_counts_task_date_unique unique (task_id, date)
);

create index if not exists daily_counts_user_id_idx on public.daily_counts (user_id);
create index if not exists daily_counts_task_id_date_idx on public.daily_counts (task_id, date);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

drop trigger if exists set_daily_counts_updated_at on public.daily_counts;
create trigger set_daily_counts_updated_at
before update on public.daily_counts
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.tasks enable row level security;
alter table public.daily_counts enable row level security;

drop policy if exists "tasks_select_own" on public.tasks;
create policy "tasks_select_own"
on public.tasks for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "tasks_insert_own" on public.tasks;
create policy "tasks_insert_own"
on public.tasks for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "tasks_update_own" on public.tasks;
create policy "tasks_update_own"
on public.tasks for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "tasks_delete_own" on public.tasks;
create policy "tasks_delete_own"
on public.tasks for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "daily_counts_select_own" on public.daily_counts;
create policy "daily_counts_select_own"
on public.daily_counts for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "daily_counts_insert_own" on public.daily_counts;
create policy "daily_counts_insert_own"
on public.daily_counts for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "daily_counts_update_own" on public.daily_counts;
create policy "daily_counts_update_own"
on public.daily_counts for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "daily_counts_delete_own" on public.daily_counts;
create policy "daily_counts_delete_own"
on public.daily_counts for delete
to authenticated
using (auth.uid() = user_id);

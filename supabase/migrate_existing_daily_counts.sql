-- Optional migration if you ALREADY had public.daily_counts with ONLY:
--   id, user_id, date, count, created_at, updated_at
-- and NO tasks table yet.
--
-- Steps:
-- 1) Back up your data.
-- 2) Run schema.sql first to create `tasks` (or create tasks empty).
-- 3) Then run this script to attach legacy rows to a default task per user.
--
-- If your daily_counts is empty, skip this and just use schema.sql.

-- Create one default task per user that had rows but no tasks yet (example).
insert into public.tasks (user_id, name, goal)
select distinct dc.user_id, 'My count', 50
from public.daily_counts dc
where not exists (
  select 1 from public.tasks t where t.user_id = dc.user_id
);

-- If daily_counts already has task_id column, stop here.
-- Otherwise you must ALTER your table — uncomment and adapt:

-- alter table public.daily_counts add column if not exists task_id uuid;
--
-- update public.daily_counts dc
-- set task_id = t.id
-- from public.tasks t
-- where t.user_id = dc.user_id
--   and dc.task_id is null
--   and t.name = 'My count';
--
-- alter table public.daily_counts alter column task_id set not null;
-- alter table public.daily_counts
--   add constraint daily_counts_task_id_fkey
--   foreign key (task_id) references public.tasks(id) on delete cascade;
-- alter table public.daily_counts add constraint daily_counts_task_date_unique unique (task_id, date);

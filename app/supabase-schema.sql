-- FlowDeck — Supabase setup
-- Paste this whole file into the Supabase dashboard: SQL Editor -> New query -> Run.
-- It is safe to run more than once.

-- One row per person. Their whole board is kept as JSON, which keeps sync simple
-- and means adding a feature to the app never needs a database migration.
create table if not exists public.boards (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Row Level Security: without this, any signed-in user could read everyone's tasks.
alter table public.boards enable row level security;

drop policy if exists "own board select" on public.boards;
create policy "own board select" on public.boards
  for select using (auth.uid() = user_id);

drop policy if exists "own board insert" on public.boards;
create policy "own board insert" on public.boards
  for insert with check (auth.uid() = user_id);

drop policy if exists "own board update" on public.boards;
create policy "own board update" on public.boards
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own board delete" on public.boards;
create policy "own board delete" on public.boards
  for delete using (auth.uid() = user_id);

-- Realtime: this is what makes a change on your phone appear on your laptop.
alter publication supabase_realtime add table public.boards;

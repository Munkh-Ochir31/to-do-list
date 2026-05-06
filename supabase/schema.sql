-- Supabase SQL Editor дотор бүхэлд нь run хийнэ үү.
-- Нийтэд нээлттэй (public, auth-гүй) хувилбар. Дараа нь auth нэмэхэд RLS бодлогуудыг өөрчилнө.

-- ── tasks ──────────────────────────────────────────────────────────────────
create table if not exists public.tasks (
  id          bigserial primary key,
  title       text       not null,
  category    text       not null default 'Бусад',
  status      text       not null default 'pending',
  priority    text       not null default 'medium',
  assignee    text       not null default '',
  due_time    text       not null default '',
  notes       text       not null default '',
  created_at  timestamptz not null default now()
);

-- ── statuses ───────────────────────────────────────────────────────────────
-- "sort_order" нь хэрэглэгчийн drag-reorder-ийг хадгалдаг.
create table if not exists public.statuses (
  id          text       primary key,
  label       text       not null,
  color       text       not null,
  bg          text       not null,
  dot         text       not null,
  pulse       boolean    not null default false,
  is_done     boolean    not null default false,
  sort_order  int        not null default 0
);

-- Анхны статус seed (хоосон бол)
insert into public.statuses (id, label, color, bg, dot, pulse, is_done, sort_order)
values
  ('pending',    'Хүлээгдэж буй', '#a3a3a3', '#f5f5f5', '#a3a3a3', false, false, 0),
  ('inprogress', 'Хийгдэж буй',   '#525252', '#e5e5e5', '#525252', true,  false, 1),
  ('washing',    'Угааж байна',    '#1a1a1a', '#d4d4d4', '#1a1a1a', true,  false, 2),
  ('drying',     'Хатааж байна',   '#0a0a0a', '#c4c4c4', '#404040', true,  false, 3),
  ('done',       'Дууссан',        '#ffffff', '#0a0a0a', '#ffffff', false, true,  4)
on conflict (id) do nothing;

-- ── RLS ────────────────────────────────────────────────────────────────────
-- Public нээлттэй: anon-д бүх үйлдлийг зөвшөөрнө.
alter table public.tasks    enable row level security;
alter table public.statuses enable row level security;

drop policy if exists "tasks public all"    on public.tasks;
drop policy if exists "statuses public all" on public.statuses;

create policy "tasks public all"
  on public.tasks
  for all
  to anon, authenticated
  using (true)
  with check (true);

create policy "statuses public all"
  on public.statuses
  for all
  to anon, authenticated
  using (true)
  with check (true);

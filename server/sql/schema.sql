create extension if not exists "pgcrypto";

create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  shields int not null default 1
);

create table if not exists habit_completions (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references habits(id) on delete cascade,
  date date not null,
  completed boolean not null default true,
  unique (habit_id, date)
);

create index if not exists idx_completions_habit_date
  on habit_completions(habit_id, date);

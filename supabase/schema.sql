-- ============================================================
-- Whisker Diary + Spendly — Full Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- FAMILY / MULTI-USER
-- ============================================================
create table if not exists family_members (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null references auth.users(id) on delete cascade,
  member_id    uuid references auth.users(id) on delete set null,
  member_email text not null,
  role         text not null check (role in ('editor', 'viewer')),
  accepted     boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists family_members_owner_idx on family_members(owner_id);
create index if not exists family_members_member_idx on family_members(member_id);

-- ============================================================
-- PETS
-- ============================================================
create table if not exists pets (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  dob        date,
  breed      text,
  color      text,
  gender     text check (gender in ('male', 'female', 'unknown')),
  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists pets_owner_idx on pets(owner_id);

create table if not exists pet_weights (
  id          uuid primary key default gen_random_uuid(),
  pet_id      uuid not null references pets(id) on delete cascade,
  weight_kg   numeric(6,3) not null,
  recorded_at timestamptz not null default now()
);
create index if not exists pet_weights_pet_idx on pet_weights(pet_id);

create table if not exists pet_photos (
  id           uuid primary key default gen_random_uuid(),
  pet_id       uuid not null references pets(id) on delete cascade,
  storage_path text not null,
  caption      text,
  taken_at     timestamptz not null default now()
);
create index if not exists pet_photos_pet_idx on pet_photos(pet_id);

-- ============================================================
-- HEALTH & MEDICAL
-- ============================================================
create table if not exists medications (
  id              uuid primary key default gen_random_uuid(),
  pet_id          uuid not null references pets(id) on delete cascade,
  name            text not null,
  dosage          text not null,
  frequency       text not null check (frequency in ('daily', 'weekly', 'custom')),
  schedule_config jsonb not null default '{}',
  start_date      date not null,
  end_date        date,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);
create index if not exists medications_pet_idx on medications(pet_id);

create table if not exists vaccinations (
  id             uuid primary key default gen_random_uuid(),
  pet_id         uuid not null references pets(id) on delete cascade,
  vaccine_name   text not null,
  administered_at date not null,
  next_due_at    date,
  notes          text,
  created_at     timestamptz not null default now()
);
create index if not exists vaccinations_pet_idx on vaccinations(pet_id);
create index if not exists vaccinations_next_due_idx on vaccinations(next_due_at);

create table if not exists vet_visits (
  id         uuid primary key default gen_random_uuid(),
  pet_id     uuid not null references pets(id) on delete cascade,
  visit_date date not null,
  reason     text not null,
  vet_name   text,
  notes      text,
  cost_bdt   numeric(12,2),
  created_at timestamptz not null default now()
);
create index if not exists vet_visits_pet_idx on vet_visits(pet_id);

-- ============================================================
-- PET NOTES
-- ============================================================
create table if not exists pet_notes (
  id         uuid primary key default gen_random_uuid(),
  pet_id     uuid not null references pets(id) on delete cascade,
  content    text not null,
  created_at timestamptz not null default now()
);
create index if not exists pet_notes_pet_idx on pet_notes(pet_id);

-- ============================================================
-- PET EXPENSES
-- ============================================================
create table if not exists pet_expenses (
  id         uuid primary key default gen_random_uuid(),
  pet_id     uuid not null references pets(id) on delete cascade,
  owner_id   uuid not null references auth.users(id) on delete cascade,
  date       date not null,
  category   text not null check (category in ('food', 'medicine', 'vet', 'accessories', 'other')),
  amount_bdt numeric(12,2) not null,
  notes      text,
  created_at timestamptz not null default now()
);
create index if not exists pet_expenses_pet_idx on pet_expenses(pet_id);
create index if not exists pet_expenses_owner_idx on pet_expenses(owner_id);

-- ============================================================
-- HOME EXPENSES (Spendly)
-- ============================================================
create table if not exists expense_categories (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  color      text not null default '#6366f1',
  icon       text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists expense_categories_owner_idx on expense_categories(owner_id);

create table if not exists home_expenses (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  date        date not null,
  category_id uuid references expense_categories(id) on delete set null,
  amount_bdt  numeric(12,2) not null,
  description text,
  created_at  timestamptz not null default now()
);
create index if not exists home_expenses_owner_idx on home_expenses(owner_id);
create index if not exists home_expenses_date_idx on home_expenses(date);

create table if not exists daily_notes (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references auth.users(id) on delete cascade,
  date       date not null,
  content    text not null,
  created_at timestamptz not null default now(),
  unique(owner_id, date)
);
create index if not exists daily_notes_owner_idx on daily_notes(owner_id);

-- ============================================================
-- REMINDERS & PUSH SUBSCRIPTIONS
-- ============================================================
create table if not exists reminders (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users(id) on delete cascade,
  pet_id        uuid references pets(id) on delete cascade,
  type          text not null check (type in ('medication', 'vaccination', 'birthday', 'custom')),
  title         text not null,
  scheduled_for timestamptz not null,
  repeat_rule   jsonb not null default '{}',
  is_active     boolean not null default true,
  last_sent_at  timestamptz,
  created_at    timestamptz not null default now()
);
create index if not exists reminders_owner_idx on reminders(owner_id);
create index if not exists reminders_scheduled_idx on reminders(scheduled_for);

create table if not exists push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references auth.users(id) on delete cascade,
  endpoint   text not null unique,
  p256dh     text not null,
  auth_key   text not null,
  created_at timestamptz not null default now()
);
create index if not exists push_subscriptions_owner_idx on push_subscriptions(owner_id);

-- ============================================================
-- AUTO-UPDATE updated_at trigger on pets
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists pets_updated_at on pets;
create trigger pets_updated_at
  before update on pets
  for each row execute function update_updated_at();

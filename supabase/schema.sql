-- Doggo Provider Version MVP schema (phase 1)
-- Safe to re-run in Supabase SQL editor (all statements are idempotent).
-- Run ORDER: schema.sql first, then seed.sql.

create extension if not exists "pgcrypto";

-- ── Enum ──────────────────────────────────────────────────────────────────────

do $$
begin
  if not exists (select 1 from pg_type where typname = 'service_type') then
    create type service_type as enum ('walk_checkin', 'inhome_sitting', 'boarding');
  end if;
end$$;

-- ── providers (parent table — must come first) ────────────────────────────────

create table if not exists public.providers (
  id           text        primary key,
  name         text        not null,
  district     text        not null,
  neighborhood text        not null,
  rating       numeric(2,1) not null check (rating >= 0 and rating <= 5),
  review_count integer     not null default 0 check (review_count >= 0),
  price_from   integer     not null check (price_from >= 0),
  price_unit   text        not null check (price_unit in ('per_walk', 'per_visit', 'per_night')),
  blurb        text        not null default '',
  avatar_url   text        not null default '',
  services     service_type[] not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.providers enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'providers' and policyname = 'public_read_providers'
  ) then
    create policy public_read_providers
      on public.providers for select to anon, authenticated using (true);
  end if;
end$$;

-- ── provider_profiles ─────────────────────────────────────────────────────────

create table if not exists public.provider_profiles (
  provider_id       text primary key references public.providers(id) on delete cascade,
  about_title       text not null default '',
  about_heading     text not null default '',
  about_body        text not null default '',
  photo_main_url    text not null default '',
  photo_side_url    text not null default '',
  photo_count_label text not null default '(0 photos)',
  updated_at        timestamptz not null default now()
);

alter table public.provider_profiles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'provider_profiles' and policyname = 'public_read_provider_profiles'
  ) then
    create policy public_read_provider_profiles
      on public.provider_profiles for select to anon, authenticated using (true);
  end if;
end$$;

-- ── provider_experience_items ─────────────────────────────────────────────────

create table if not exists public.provider_experience_items (
  id          text    primary key,
  provider_id text    not null references public.providers(id) on delete cascade,
  category    text    not null check (category in ('care_experience', 'medical_care', 'home_environment')),
  item_text   text    not null,
  sort_order  integer not null default 0
);

create index if not exists idx_provider_experience_provider
  on public.provider_experience_items(provider_id, category, sort_order);

alter table public.provider_experience_items enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'provider_experience_items' and policyname = 'public_read_provider_experience_items'
  ) then
    create policy public_read_provider_experience_items
      on public.provider_experience_items for select to anon, authenticated using (true);
  end if;
end$$;

-- ── provider_pets ─────────────────────────────────────────────────────────────

create table if not exists public.provider_pets (
  id           text    primary key,
  provider_id  text    not null references public.providers(id) on delete cascade,
  name         text    not null,
  breed        text    not null,
  weight_label text    not null,
  age_label    text    not null,
  image_url    text    not null default '',
  sort_order   integer not null default 0
);

create index if not exists idx_provider_pets_provider
  on public.provider_pets(provider_id, sort_order);

alter table public.provider_pets enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'provider_pets' and policyname = 'public_read_provider_pets'
  ) then
    create policy public_read_provider_pets
      on public.provider_pets for select to anon, authenticated using (true);
  end if;
end$$;

-- ── provider_service_offerings ────────────────────────────────────────────────

create table if not exists public.provider_service_offerings (
  id                text         primary key,
  provider_id       text         not null references public.providers(id) on delete cascade,
  service_type      service_type not null,
  title             text         not null,
  short_description text         not null default '',
  price_from        integer      not null check (price_from >= 0),
  price_unit        text         not null check (price_unit in ('per_walk', 'per_visit', 'per_night')),
  sort_order        integer      not null default 0
);

create index if not exists idx_provider_services_provider
  on public.provider_service_offerings(provider_id, sort_order);

alter table public.provider_service_offerings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'provider_service_offerings' and policyname = 'public_read_provider_service_offerings'
  ) then
    create policy public_read_provider_service_offerings
      on public.provider_service_offerings for select to anon, authenticated using (true);
  end if;
end$$;

-- ── provider_reviews ──────────────────────────────────────────────────────────

create table if not exists public.provider_reviews (
  id          text         primary key,
  provider_id text         not null references public.providers(id) on delete cascade,
  author_name text         not null,
  rating      numeric(2,1) not null check (rating >= 0 and rating <= 5),
  review_text text         not null,
  created_at  timestamptz  not null default now()
);

create index if not exists idx_provider_reviews_provider
  on public.provider_reviews(provider_id, created_at desc);

alter table public.provider_reviews enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'provider_reviews' and policyname = 'public_read_provider_reviews'
  ) then
    create policy public_read_provider_reviews
      on public.provider_reviews for select to anon, authenticated using (true);
  end if;
end$$;

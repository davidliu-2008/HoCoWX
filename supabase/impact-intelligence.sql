create extension if not exists pgcrypto;

create table if not exists public.impact_prediction_runs (
  id uuid primary key default gen_random_uuid(),
  run_key text not null unique,
  model_version text not null,
  district_slug text not null,
  county text not null,
  target_date date not null,
  generated_at timestamptz not null,
  sources jsonb not null default '[]'::jsonb,
  weather_snapshot jsonb not null,
  prediction jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists impact_prediction_runs_district_date_idx
  on public.impact_prediction_runs (district_slug, target_date, generated_at desc);

create table if not exists public.impact_outcomes (
  id uuid primary key default gen_random_uuid(),
  district_slug text not null,
  target_date date not null,
  official_outcome text not null check (
    official_outcome in ('normal', 'delay', 'closure', 'early_dismissal', 'modified', 'unknown')
  ),
  source_url text,
  notes text,
  verified_at timestamptz not null default now(),
  unique (district_slug, target_date)
);

alter table public.impact_prediction_runs enable row level security;
alter table public.impact_outcomes enable row level security;

comment on table public.impact_prediction_runs is
  'Versioned weather-impact predictions with the source snapshot used to create each result.';

comment on table public.impact_outcomes is
  'Verified district outcomes used to evaluate and calibrate the impact model.';

create table if not exists public.weather_briefings (
  briefing_date date primary key,
  issued_at timestamptz not null,
  title text not null,
  summary text not null,
  temperature_f numeric,
  precipitation_chance numeric,
  snowfall_inches numeric,
  wind_speed text,
  wind_gust text,
  alerts jsonb not null default '[]'::jsonb,
  prediction_label text not null,
  prediction_risk text not null,
  prediction_confidence integer not null,
  prediction_explanation text not null,
  top_factors jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.weather_briefings enable row level security;

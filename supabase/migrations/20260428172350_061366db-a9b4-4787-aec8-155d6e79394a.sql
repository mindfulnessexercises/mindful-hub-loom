create table public.buzzsprout_episodes (
  id uuid primary key default gen_random_uuid(),
  episode_id text not null unique,
  podcast_id text not null,
  slug text not null,
  title text not null,
  audio_url text,
  artwork_url text,
  published_at timestamptz,
  duration_seconds integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index buzzsprout_episodes_slug_idx on public.buzzsprout_episodes (slug);

alter table public.buzzsprout_episodes enable row level security;

create policy "Buzzsprout episodes are publicly readable"
on public.buzzsprout_episodes
for select
to public
using (true);

create trigger buzzsprout_episodes_updated_at
before update on public.buzzsprout_episodes
for each row execute function public.update_updated_at_column();
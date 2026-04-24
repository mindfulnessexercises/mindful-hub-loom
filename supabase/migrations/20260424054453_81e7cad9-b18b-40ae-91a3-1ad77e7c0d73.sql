create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  props jsonb not null default '{}'::jsonb,
  -- Generated breakdown columns. Pulling these out of `props` lets us index
  -- and group on them without scanning JSONB on every dashboard query.
  cta_location text generated always as (props->>'cta_location') stored,
  category_slug text generated always as (props->>'category_slug') stored,
  cta_destination text generated always as (props->>'cta_destination') stored,
  form_id text generated always as (props->>'form_id') stored,
  occurred_at timestamptz not null default now()
);

-- Hot-path indexes for the dashboard's group-by queries.
create index analytics_events_occurred_at_idx
  on public.analytics_events (occurred_at desc);
create index analytics_events_name_occurred_at_idx
  on public.analytics_events (name, occurred_at desc);
create index analytics_events_location_idx
  on public.analytics_events (cta_location)
  where cta_location is not null;
create index analytics_events_category_idx
  on public.analytics_events (category_slug)
  where category_slug is not null;
create index analytics_events_destination_idx
  on public.analytics_events (cta_destination)
  where cta_destination is not null;

alter table public.analytics_events enable row level security;

-- Anyone (including unauthenticated visitors) can record an event. The
-- dashboard route is public per product decision, so we also allow public
-- read. There is intentionally no UPDATE or DELETE policy — the table is
-- append-only, which protects audit integrity.
create policy "Anyone can insert analytics events"
  on public.analytics_events
  for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can read analytics events"
  on public.analytics_events
  for select
  to anon, authenticated
  using (true);
-- Create public bucket for mirrored WordPress images
insert into storage.buckets (id, name, public)
values ('wp-images', 'wp-images', true)
on conflict (id) do nothing;

-- Public can read images
create policy "Public read wp-images"
on storage.objects for select
using (bucket_id = 'wp-images');

-- Only service role can write/update/delete
create policy "Service role write wp-images"
on storage.objects for insert
to service_role
with check (bucket_id = 'wp-images');

create policy "Service role update wp-images"
on storage.objects for update
to service_role
using (bucket_id = 'wp-images');

create policy "Service role delete wp-images"
on storage.objects for delete
to service_role
using (bucket_id = 'wp-images');

-- Mapping table: original WP URL -> new storage URL
create table public.rehosted_images (
  id uuid primary key default gen_random_uuid(),
  original_url text not null unique,
  storage_path text not null,
  public_url text not null,
  content_type text,
  byte_size integer,
  created_at timestamp with time zone not null default now()
);

create index idx_rehosted_images_original_url on public.rehosted_images (original_url);

alter table public.rehosted_images enable row level security;

create policy "Rehosted images are publicly readable"
on public.rehosted_images for select
using (true);

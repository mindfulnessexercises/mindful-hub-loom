alter table public.buzzsprout_episodes
  add column if not exists description_html text,
  add column if not exists ai_summary text,
  add column if not exists ai_takeaways text[],
  add column if not exists ai_questions text[],
  add column if not exists ai_generated_at timestamptz;
comment on table public.analytics_events is
  'Public, append-only event log for product analytics (CTA clicks, email signups). Open insert + open select are intentional: the site has no auth and the dashboard is public per product decision. No UPDATE or DELETE policies — events are immutable for audit integrity.';
comment on policy "Anyone can insert analytics events" on public.analytics_events is
  'Intentionally open: the website is unauthenticated and trackEvent fires from the browser. Abuse mitigation lives downstream (rate-limiting / cleanup), not in RLS.';
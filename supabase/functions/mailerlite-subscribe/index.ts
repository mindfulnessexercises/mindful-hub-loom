// Pushes a confirmed lead from the site into MailerLite.
//
// This is called AFTER the lead is already saved to `email_leads` (our
// source of truth). MailerLite is a downstream destination — failures here
// must never break the user's success state. The caller fires-and-forgets
// or awaits with try/catch.
//
// Strategy:
//   - Use the v2 Subscribers API (POST /api/subscribers) which upserts on
//     email and lets us set status, group, and custom fields in one call.
//   - All signups go to MAILERLITE_DEFAULT_GROUP_ID (per product decision —
//     "One default group for everyone"), with rich tags so segmentation
//     happens INSIDE MailerLite via groups built on field values.
//   - Status is "active" (per product decision — "Treat all signups as
//     opted-in"). Forms must continue to make this clear in copy.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Payload {
  email: string;
  track?: string;
  surface?: string;
  source_path?: string;
  source_section?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAILERLITE_API = "https://connect.mailerlite.com/api";

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const apiKey = Deno.env.get("MAILERLITE_API_KEY");
  const defaultGroup = Deno.env.get("MAILERLITE_DEFAULT_GROUP_ID");
  if (!apiKey) return json(500, { ok: false, error: "MAILERLITE_API_KEY not configured" });
  if (!defaultGroup)
    return json(500, { ok: false, error: "MAILERLITE_DEFAULT_GROUP_ID not configured" });

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return json(400, { ok: false, error: "invalid_json" });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!email || email.length > 320 || !EMAIL_RE.test(email)) {
    return json(400, { ok: false, error: "invalid_email" });
  }

  // Custom fields — these must exist in MailerLite (Subscribers → Fields).
  // MailerLite silently ignores unknown fields, so missing fields don't
  // break the call; they just won't be stored. We document the field names
  // so the user can create matching fields in MailerLite if they want them.
  //   signup_track, signup_surface, signup_path, signup_section,
  //   utm_source, utm_medium, utm_campaign
  const fields: Record<string, string> = {};
  if (body.track) fields.signup_track = body.track.slice(0, 120);
  if (body.surface) fields.signup_surface = body.surface.slice(0, 120);
  if (body.source_path) fields.signup_path = body.source_path.slice(0, 500);
  if (body.source_section) fields.signup_section = body.source_section.slice(0, 200);
  if (body.utm_source) fields.utm_source = body.utm_source.slice(0, 120);
  if (body.utm_medium) fields.utm_medium = body.utm_medium.slice(0, 120);
  if (body.utm_campaign) fields.utm_campaign = body.utm_campaign.slice(0, 120);

  const payload = {
    email,
    status: "active" as const,
    fields,
    groups: [defaultGroup],
    // Resubscribe = true so previously-unsubscribed addresses can rejoin
    // when they explicitly opt in again via a form.
    resubscribe: true,
  };

  try {
    const res = await fetch(`${MAILERLITE_API}/subscribers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    if (!res.ok) {
      console.error("[mailerlite-subscribe] non-OK", res.status, text);
      return json(502, { ok: false, error: "mailerlite_error", status: res.status, body: text });
    }
    return json(200, { ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error("[mailerlite-subscribe] threw", message);
    return json(500, { ok: false, error: "fetch_failed", message });
  }
});

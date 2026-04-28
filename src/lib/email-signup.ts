// Single integration point for ALL email-capture forms across the site.
//
// Replaces the older single-purpose stub. Persists every submission into
// `email_leads` with full audience-track + surface attribution. Email
// SENDING is intentionally not wired up yet (per product decision —
// "Store in backend only"); when an ESP is connected later, the
// downstream cron / edge function reads `email_leads` and dispatches.
//
// The analytics layer (email_signup_submitted / _succeeded / _failed)
// is fired by the calling component, not here, so each capture surface
// can attach surface-specific props without polluting this module.

import { supabase } from "@/integrations/supabase/client";
import type { EmailCaptureTrack } from "@/lib/email-capture-tracks";

export type CaptureSurface = "inline" | "sticky" | "modal" | "other";

export interface EmailSignupInput {
  email: string;
  track: EmailCaptureTrack;
  surface: CaptureSurface;
  /** Page path the user submitted from (e.g. "/library"). */
  sourcePath?: string;
  /** Component / section identifier (e.g. "homepage_ebook_section"). */
  sourceSection?: string;
  /** Explicit marketing-consent flag. False is allowed; UI may still hide. */
  consent?: boolean;
}

export interface EmailSignupResult {
  ok: true;
  /** Server-issued row id, used for downstream funnel correlation. */
  subscriber_id: string;
}

export class EmailSignupError extends Error {
  /** Stable machine-readable code so analytics can group failures. */
  readonly code: string;
  /** HTTP-style status when known; -1 for client/network errors. */
  readonly status: number;
  constructor(code: string, message: string, status = -1) {
    super(message);
    this.name = "EmailSignupError";
    this.code = code;
    this.status = status;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LEN = 320; // RFC 5321

/** Read UTM tags off the current URL (best-effort; no throw). */
function readUtm(): { utm_source?: string; utm_medium?: string; utm_campaign?: string } {
  if (typeof window === "undefined") return {};
  try {
    const p = new URLSearchParams(window.location.search);
    const out: Record<string, string> = {};
    const src = p.get("utm_source");
    const med = p.get("utm_medium");
    const cmp = p.get("utm_campaign");
    if (src) out.utm_source = src.slice(0, 120);
    if (med) out.utm_medium = med.slice(0, 120);
    if (cmp) out.utm_campaign = cmp.slice(0, 120);
    return out;
  } catch {
    return {};
  }
}

export async function submitEmailSignup(input: EmailSignupInput): Promise<EmailSignupResult> {
  // Client-side validation. Mirrors the DB CHECK constraint so users get a
  // friendly error instead of a generic 4xx.
  const email = (input.email || "").trim().toLowerCase();
  if (!email) throw new EmailSignupError("missing_email", "Email is required.");
  if (email.length > MAX_EMAIL_LEN)
    throw new EmailSignupError("invalid_email", "That email address is too long.");
  if (!EMAIL_RE.test(email))
    throw new EmailSignupError("invalid_email", "Please enter a valid email address.");

  const utm = readUtm();
  const userAgent =
    typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : undefined;

  const { data, error } = await supabase
    .from("email_leads")
    .insert({
      email,
      track: input.track,
      surface: input.surface,
      source_path: input.sourcePath?.slice(0, 500),
      source_section: input.sourceSection?.slice(0, 200),
      consent: !!input.consent,
      ...utm,
      user_agent: userAgent,
    })
    .select("id")
    .single();

  if (error) {
    // Distinguish DB constraint violations (likely bad email) from network /
    // server errors so the analytics funnel can break drop-off down by reason.
    const code = error.code === "23514" ? "invalid_email" : "server_error";
    const status = error.code === "23514" ? 422 : 500;
    throw new EmailSignupError(code, error.message || "Signup failed.", status);
  }
  if (!data?.id) {
    throw new EmailSignupError("server_error", "Signup failed.", 500);
  }

  // Fire-and-forget push to MailerLite. The lead is already safely stored
  // in `email_leads` (our source of truth), so a MailerLite failure must
  // NEVER break the user's success state. We don't await — the user gets
  // their confirmation immediately while the push happens in the background.
  void supabase.functions
    .invoke("mailerlite-subscribe", {
      body: {
        email,
        track: input.track,
        surface: input.surface,
        source_path: input.sourcePath,
        source_section: input.sourceSection,
        ...utm,
      },
    })
    .catch((err) => {
      // Swallow — local lead is already saved. Log for ops visibility.
      // eslint-disable-next-line no-console
      console.warn("[email-signup] mailerlite push failed", err);
    });

  return { ok: true, subscriber_id: data.id };
}

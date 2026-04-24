// Single integration point for the homepage ebook email-capture form.
//
// Today this is a stub that resolves successfully so the analytics pipeline
// (`email_signup_succeeded` / `email_signup_failed`) is wired end-to-end and
// can be measured immediately. When the real backend is connected, swap the
// body of `submitEmailSignup` for the actual POST (e.g. a Lovable Cloud
// Edge Function or a `supabase.functions.invoke("ebook-signup", ...)` call)
// — the analytics layer in `EbookCapture.tsx` does NOT need to change.

export type EmailSignupSource = "homepage_ebook_section";

export interface EmailSignupInput {
  email: string;
  source: EmailSignupSource;
  /** Optional consent flag, e.g. for marketing checkboxes added later. */
  consent?: boolean;
}

export interface EmailSignupResult {
  ok: true;
  /** Server-issued id once the backend is in place; undefined for the stub. */
  subscriber_id?: string;
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

export async function submitEmailSignup(input: EmailSignupInput): Promise<EmailSignupResult> {
  // Client-side validation. Keep in sync with whatever the backend enforces.
  const email = input.email.trim().toLowerCase();
  if (!email) throw new EmailSignupError("missing_email", "Email is required.");
  if (!EMAIL_RE.test(email)) throw new EmailSignupError("invalid_email", "Please enter a valid email address.");

  // TODO(backend): replace this stub with the real call, e.g.
  //   const { data, error } = await supabase.functions.invoke("ebook-signup", {
  //     body: { email, source: input.source, consent: input.consent },
  //   });
  //   if (error) throw new EmailSignupError("network_error", error.message);
  //   if (!data?.ok) throw new EmailSignupError(data?.code ?? "server_error", data?.message ?? "Signup failed", data?.status ?? 500);
  //   return { ok: true, subscriber_id: data.subscriber_id };
  await new Promise((r) => setTimeout(r, 350)); // simulate network latency
  return { ok: true };
}

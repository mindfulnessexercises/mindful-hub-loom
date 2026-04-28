import { useState, type ReactNode } from "react";
import { ArrowRight, Check, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type EmailCaptureTrack,
  getTrackDefinition,
} from "@/lib/email-capture-tracks";
import { trackEvent, trackCtaClick } from "@/lib/analytics";
import {
  submitEmailSignup,
  EmailSignupError,
  type CaptureSurface,
} from "@/lib/email-signup";
import { cn } from "@/lib/utils";

interface InlineEmailCaptureProps {
  /** Which audience-aware copy variant to render. */
  track: EmailCaptureTrack;
  /**
   * Stable analytics location (e.g. "homepage_ebook_section",
   * "library_footer", "audio_library_inline"). Used as `source_section`
   * for both the DB row and analytics events.
   */
  location: string;
  /** Where this surface lives in UX terms — sticky variants pass "sticky". */
  surface?: CaptureSurface;
  /**
   * Visual treatment:
   *   - "card"      → bordered card with full benefits list (homepage)
   *   - "compact"   → headline + form only (sidebars, post footers)
   *   - "on-dark"   → card variant tuned for dark/primary backgrounds
   */
  variant?: "card" | "compact" | "on-dark";
  /** Optional override for the headline (rare — A/B copy tests). */
  headlineOverride?: string;
  /** Optional slot rendered above the form (e.g. ebook cover image). */
  visual?: ReactNode;
  /** Hide the audience eyebrow (useful when the section already labels audience). */
  hideAudience?: boolean;
  /** Hide the secondary CTA (when the surrounding section already has one). */
  hideFollowUp?: boolean;
}

type Status = "idle" | "submitting" | "succeeded" | "failed";

/**
 * Audience-aware email capture form. Single component used everywhere on
 * the site — copy, button label, success message, and the secondary CTA
 * destination are all driven by the `track` prop reading from
 * `TRACK_DEFINITIONS` so we never drift between surfaces.
 *
 * Conversion analytics:
 *   - `email_signup_submitted` on submit (with form_id, track, surface)
 *   - `email_signup_succeeded` on success (with subscriber_id, latency)
 *   - `email_signup_failed`    on error  (with stable error_code)
 *   - `cta_clicked` for the follow-up secondary CTA
 *
 * Persistence: see src/lib/email-signup.ts (writes to email_leads).
 */
export function InlineEmailCapture({
  track,
  location,
  surface = "inline",
  variant = "card",
  headlineOverride,
  visual,
  hideAudience,
  hideFollowUp,
}: InlineEmailCaptureProps) {
  const def = getTrackDefinition(track);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDark = variant === "on-dark";

  // Style tokens swap once based on background. Keeps JSX readable.
  const t = onDark
    ? {
        eyebrow: "text-primary-foreground/60",
        headline: "text-primary-foreground",
        subhead: "text-primary-foreground/80",
        bullet: "text-primary-foreground/90",
        bulletDot: "bg-primary-foreground/30",
        input:
          "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-primary-foreground/30",
        button:
          "bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-md",
        helper: "text-primary-foreground/45",
        followUp: "text-primary-foreground/85 hover:text-primary-foreground",
        success: "text-primary-foreground/90",
      }
    : {
        eyebrow: "text-primary",
        headline: "text-foreground",
        subhead: "text-muted-foreground",
        bullet: "text-foreground/85",
        bulletDot: "bg-primary/40",
        input: "bg-background border-border focus-visible:ring-ring",
        button: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-elevated",
        helper: "text-muted-foreground",
        followUp: "text-primary hover:text-primary/80",
        success: "text-foreground/85",
      };

  const formId = `email_capture_${track}_${location}`;

  return (
    <div
      className={cn(
        variant === "compact" ? "max-w-xl" : "max-w-2xl",
        "w-full",
      )}
      data-track-cta={formId}
      data-track-cta-label={`${def.headline} — ${def.buttonLabel}`}
      data-track-cta-location={location}
    >
      <div className={cn(visual && "grid gap-6 sm:grid-cols-[auto,1fr] sm:items-center")}>
        {visual && <div className="flex justify-center sm:justify-start">{visual}</div>}

        <div>
          {!hideAudience && (
            <p className={cn("text-eyebrow mb-2", t.eyebrow)}>{def.audience}</p>
          )}

          <h3
            className={cn(
              "font-serif mb-2",
              variant === "compact" ? "text-card-heading" : "text-section-heading",
              t.headline,
            )}
          >
            {headlineOverride || def.headline}
          </h3>

          <p className={cn("text-body mb-5 max-w-lg", t.subhead)}>{def.subhead}</p>

          {variant !== "compact" && (
            <ul className="space-y-2 mb-6" role="list">
              {def.benefits.map((b) => (
                <li
                  key={b}
                  className={cn("flex items-start gap-2.5 text-body-sm", t.bullet)}
                >
                  <span
                    className={cn("mt-[7px] h-1.5 w-1.5 rounded-full shrink-0", t.bulletDot)}
                    aria-hidden
                  />
                  {b}
                </li>
              ))}
            </ul>
          )}

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (status === "submitting") return;
              const form = e.currentTarget as HTMLFormElement;
              const input = form.elements.namedItem(`${formId}-email`) as HTMLInputElement | null;
              const email = input?.value?.trim() ?? "";
              const startedAt = performance.now();

              const sourcePath =
                typeof window !== "undefined" ? window.location.pathname : undefined;

              trackEvent("email_signup_submitted", {
                form_id: formId,
                track,
                surface,
                location,
                has_email: !!email,
              });
              setStatus("submitting");
              setErrorMessage(null);

              try {
                const result = await submitEmailSignup({
                  email,
                  track,
                  surface,
                  sourcePath,
                  sourceSection: location,
                  consent: true,
                });
                trackEvent("email_signup_succeeded", {
                  form_id: formId,
                  track,
                  surface,
                  location,
                  duration_ms: Math.round(performance.now() - startedAt),
                  subscriber_id: result.subscriber_id,
                });
                setStatus("succeeded");
                form.reset();
              } catch (err) {
                const code = err instanceof EmailSignupError ? err.code : "unknown_error";
                const httpStatus = err instanceof EmailSignupError ? err.status : -1;
                const message = err instanceof Error ? err.message : "Something went wrong.";
                trackEvent("email_signup_failed", {
                  form_id: formId,
                  track,
                  surface,
                  location,
                  duration_ms: Math.round(performance.now() - startedAt),
                  error_code: code,
                  http_status: httpStatus,
                });
                setErrorMessage(message);
                setStatus("failed");
              }
            }}
            className="flex flex-col sm:flex-row gap-3"
            aria-label={def.headline}
          >
            <label htmlFor={`${formId}-email`} className="sr-only">
              Email address
            </label>
            <Input
              id={`${formId}-email`}
              name={`${formId}-email`}
              type="email"
              placeholder="Your email address"
              autoComplete="email"
              required
              maxLength={320}
              aria-required="true"
              className={cn("min-h-[44px] h-12 flex-1", t.input)}
            />
            <Button
              type="submit"
              disabled={status === "submitting"}
              className={cn(
                "min-h-[44px] h-12 px-6 font-semibold whitespace-nowrap disabled:opacity-70",
                t.button,
              )}
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" aria-hidden />
                  Sending…
                </>
              ) : (
                <>
                  {def.buttonLabel}
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
                </>
              )}
            </Button>
          </form>

          <div className="mt-3 min-h-[1.25rem]" aria-live="polite">
            {status === "succeeded" && (
              <p className={cn("text-caption flex items-center gap-1.5", t.success)}>
                <Check className="h-3.5 w-3.5" aria-hidden />
                {def.successMessage}
              </p>
            )}
            {status === "failed" && errorMessage && (
              <p className="text-caption text-[hsl(var(--destructive-foreground,0_0%_100%))] bg-[hsl(var(--destructive)/0.85)] inline-block px-2.5 py-1 rounded">
                {errorMessage}
              </p>
            )}
          </div>

          <p className={cn("flex items-center gap-1.5 text-caption mt-3", t.helper)}>
            <Lock className="h-3 w-3" aria-hidden />
            No spam. Unsubscribe anytime. We respect your privacy.
          </p>

          {!hideFollowUp && (
            <a
              href={def.followUp.href}
              target={def.followUp.external ? "_blank" : undefined}
              rel={def.followUp.external ? "noopener" : undefined}
              onClick={() =>
                trackCtaClick({
                  cta_label: def.followUp.label,
                  cta_destination: def.followUp.href,
                  cta_location: `${location}_followup`,
                  matched: true,
                })
              }
              className={cn(
                "mt-4 inline-flex items-center gap-1 text-body-sm font-medium underline underline-offset-4 decoration-current/30 transition-colors min-h-[44px]",
                t.followUp,
              )}
            >
              {def.followUp.label}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

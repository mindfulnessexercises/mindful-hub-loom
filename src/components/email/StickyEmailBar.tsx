import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight, Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type EmailCaptureTrack,
  getTrackDefinition,
  pickTrackForPath,
} from "@/lib/email-capture-tracks";
import { trackEvent } from "@/lib/analytics";
import { submitEmailSignup, EmailSignupError } from "@/lib/email-signup";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "sticky_email_bar:dismissed:v1";
const SUCCESS_KEY = "sticky_email_bar:converted:v1";
const SCROLL_TRIGGER = 0.5; // 50% of viewport-adjusted document height

/**
 * Site-wide sticky email capture bar.
 *
 * UX rules:
 *   • Hidden until the visitor scrolls past 50% of the page.
 *   • Track is auto-picked from the current pathname via pickTrackForPath
 *     so /library shows the free-resources offer, /podcast → live_events,
 *     etc. Caller can override with the `track` prop.
 *   • Dismissible — closing it sets sessionStorage so it stays gone for
 *     the rest of the visit (NOT permanent; we want it back next session).
 *   • Successful submit also marks dismissed so we don't pester converted
 *     users in the same session.
 *   • Hidden on routes where it would compete with primary capture (the
 *     homepage already has the EbookCapture block, admin pages, etc.).
 *
 * Mobile UX: the bar collapses to a single line on small screens with a
 * "Get →" button that expands the email input. Keeps tap targets ≥44px.
 */

const HIDE_ON_PATHS = [
  "/", // homepage already has prominent capture
  "/admin",
];

function shouldHideOnPath(path: string): boolean {
  if (HIDE_ON_PATHS.includes(path)) return true;
  return HIDE_ON_PATHS.some((p) => p !== "/" && path.startsWith(p));
}

interface StickyEmailBarProps {
  /** Optional override; otherwise auto-picked from URL. */
  track?: EmailCaptureTrack;
}

export function StickyEmailBar({ track: trackOverride }: StickyEmailBarProps = {}) {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "succeeded" | "failed">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const impressionFiredFor = useRef<string | null>(null);

  // Fresh dismissal check whenever the route changes — sessionStorage
  // dismissal is global for the session, but we still re-evaluate so a
  // first-session user sees the bar again on the next route.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isDismissed =
      sessionStorage.getItem(DISMISS_KEY) === "1" ||
      sessionStorage.getItem(SUCCESS_KEY) === "1";
    setDismissed(isDismissed);
    setVisible(false);
    setExpanded(false);
    setStatus("idle");
    setErrorMessage(null);
  }, [location.pathname]);

  // Scroll trigger — show after the visitor has clearly committed to the page.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (dismissed) return;
    if (shouldHideOnPath(location.pathname)) return;

    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = window.scrollY + window.innerHeight;
      const total = Math.max(doc.scrollHeight, window.innerHeight);
      if (scrolled / total >= SCROLL_TRIGGER) {
        setVisible(true);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed, location.pathname]);

  const track: EmailCaptureTrack =
    trackOverride ?? pickTrackForPath(location.pathname);
  const def = getTrackDefinition(track);

  // Fire one impression per (path, track) so we can compute view→submit rate.
  useEffect(() => {
    if (!visible || dismissed) return;
    const key = `${location.pathname}:${track}`;
    if (impressionFiredFor.current === key) return;
    impressionFiredFor.current = key;
    trackEvent("sticky_email_bar_viewed", {
      track,
      source_path: location.pathname,
    });
  }, [visible, dismissed, location.pathname, track]);

  if (dismissed || !visible || shouldHideOnPath(location.pathname)) return null;

  const formId = `email_capture_${track}_sticky`;

  const onDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
    trackEvent("sticky_email_bar_dismissed", {
      track,
      source_path: location.pathname,
      had_email: false,
    });
  };

  return (
    <div
      role="region"
      aria-label="Subscribe for updates"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.15)]",
        "backdrop-blur-md supports-[backdrop-filter]:bg-background/85",
        "animate-in slide-in-from-bottom-4 fade-in duration-300",
      )}
    >
      <div className="container mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Copy — collapses to single line on mobile, two lines on sm+ */}
          <div className="flex-1 min-w-0">
            <p className="text-eyebrow text-primary leading-tight">{def.audience}</p>
            <p className="text-body-sm font-medium text-foreground leading-snug truncate sm:whitespace-normal">
              {status === "succeeded" ? def.successMessage : def.headline}
            </p>
          </div>

          {/* Form / collapsed CTA */}
          {status !== "succeeded" && (
            <>
              {/* Mobile: single button that expands the input below */}
              {!expanded && (
                <Button
                  type="button"
                  size="sm"
                  className="sm:hidden min-h-[44px] h-11 px-4 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                  onClick={() => setExpanded(true)}
                >
                  {def.buttonLabel}
                  <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
                </Button>
              )}

              {/* sm+: inline form is always visible */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (status === "submitting") return;
                  const form = e.currentTarget as HTMLFormElement;
                  const input = form.elements.namedItem(`${formId}-email`) as HTMLInputElement | null;
                  const email = input?.value?.trim() ?? "";
                  const startedAt = performance.now();

                  trackEvent("email_signup_submitted", {
                    form_id: formId,
                    track,
                    surface: "sticky",
                    location: "sticky_bar",
                    has_email: !!email,
                  });
                  setStatus("submitting");
                  setErrorMessage(null);

                  try {
                    const result = await submitEmailSignup({
                      email,
                      track,
                      surface: "sticky",
                      sourcePath: location.pathname,
                      sourceSection: "sticky_bar",
                      consent: true,
                    });
                    trackEvent("email_signup_succeeded", {
                      form_id: formId,
                      track,
                      surface: "sticky",
                      location: "sticky_bar",
                      duration_ms: Math.round(performance.now() - startedAt),
                      subscriber_id: result.subscriber_id,
                    });
                    setStatus("succeeded");
                    sessionStorage.setItem(SUCCESS_KEY, "1");
                    form.reset();
                  } catch (err) {
                    const code = err instanceof EmailSignupError ? err.code : "unknown_error";
                    const httpStatus = err instanceof EmailSignupError ? err.status : -1;
                    const message = err instanceof Error ? err.message : "Something went wrong.";
                    trackEvent("email_signup_failed", {
                      form_id: formId,
                      track,
                      surface: "sticky",
                      location: "sticky_bar",
                      duration_ms: Math.round(performance.now() - startedAt),
                      error_code: code,
                      http_status: httpStatus,
                    });
                    setErrorMessage(message);
                    setStatus("failed");
                  }
                }}
                className={cn(
                  "items-center gap-2 shrink-0",
                  expanded ? "flex w-full sm:w-auto" : "hidden sm:flex",
                )}
              >
                <label htmlFor={`${formId}-email`} className="sr-only">
                  Email address
                </label>
                <Input
                  id={`${formId}-email`}
                  name={`${formId}-email`}
                  type="email"
                  placeholder="you@email.com"
                  autoComplete="email"
                  required
                  maxLength={320}
                  className="min-h-[44px] h-11 w-full sm:w-64"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={status === "submitting"}
                  className="min-h-[44px] h-11 px-4 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 disabled:opacity-70"
                >
                  {status === "submitting" ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <>
                      {def.buttonLabel}
                      <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
                    </>
                  )}
                </Button>
              </form>
            </>
          )}

          {status === "succeeded" && (
            <a
              href={def.thankYou.ctaHref}
              target={def.thankYou.ctaExternal ? "_blank" : undefined}
              rel={def.thankYou.ctaExternal ? "noopener" : undefined}
              data-track-thankyou={track}
              onClick={() =>
                trackEvent("cta_clicked", {
                  cta_label: def.thankYou.ctaLabel,
                  cta_destination: def.thankYou.ctaHref,
                  cta_location: "sticky_bar_thankyou",
                  matched: true,
                })
              }
              className="inline-flex items-center gap-1.5 min-h-[44px] h-11 px-4 rounded-md bg-primary text-primary-foreground text-body-sm font-semibold hover:bg-primary/90 shrink-0"
            >
              <Check className="h-4 w-4" aria-hidden />
              {def.thankYou.ctaLabel}
            </a>
          )}

          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss subscription bar"
            className="shrink-0 inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {status === "failed" && errorMessage && (
          <p
            className="mt-2 text-caption text-[hsl(var(--destructive-foreground,0_0%_100%))] bg-[hsl(var(--destructive)/0.85)] inline-block px-2.5 py-1 rounded"
            aria-live="polite"
          >
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}

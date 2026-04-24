import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resolveLegacyRedirect } from "@/lib/legacy-redirects";
import { trackEvent } from "@/lib/analytics";

/**
 * Watches every navigation and, if the current pathname looks like a legacy
 * WordPress URL we have a mapping for, redirects to the new equivalent.
 *
 * Internal redirects use `navigate(..., { replace: true })` so the legacy URL
 * doesn't pollute the back-stack. External redirects use
 * `window.location.replace` so the legacy domain takes over from there.
 *
 * This is a soft (JS) redirect — see `legacy-redirects.ts` for the SEO caveat
 * and the long-term plan to mirror the same map in an edge function.
 */
export function useLegacyRedirects() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hit = resolveLegacyRedirect(location.pathname, location.search);
    if (!hit) return;

    // Fire once before the redirect so we can measure how often each rule fires.
    trackEvent("legacy_redirect", {
      from: location.pathname + location.search,
      to: hit.target,
      rule: hit.rule,
      external: hit.external,
    });

    if (hit.external) {
      window.location.replace(hit.target);
    } else {
      navigate(hit.target, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);
}

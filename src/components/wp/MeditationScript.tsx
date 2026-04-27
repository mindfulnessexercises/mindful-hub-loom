import { useState } from "react";
import { Download, FileText, Printer, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

export type MeditationScriptVariant = "inline" | "collapsible" | "card";

interface MeditationScriptProps {
  /** Public URL of the PDF (Lovable Cloud Storage). */
  pdfUrl: string;
  /** Title of the script (usually the meditation title). */
  title: string;
  /** Optional page count to display. */
  pageCount?: number;
  /** Optional readable size, e.g. "1.2 MB". */
  fileSize?: string;
  /** Slug for analytics. */
  meditationId?: string;
  /** How the script renders. Default: "collapsible". */
  variant?: MeditationScriptVariant;
}

/**
 * Renders the printable PDF script for a guided meditation.
 *
 * Three display variants:
 *  - "inline":      always-visible embedded PDF viewer + actions
 *  - "collapsible": download/print card; click to expand inline viewer
 *  - "card":        download/print card only (no viewer)
 *
 * Uses the browser's native PDF viewer via <iframe>, which works on every
 * modern desktop browser and falls back gracefully on iOS/Android (we show
 * a clear "Open PDF" button so mobile users can read it in their device's
 * native PDF reader instead of a janky in-page embed).
 */
export function MeditationScript({
  pdfUrl,
  title,
  pageCount,
  fileSize,
  meditationId,
  variant = "collapsible",
}: MeditationScriptProps) {
  const [expanded, setExpanded] = useState(variant === "inline");

  const fireView = () => {
    trackEvent("script_view", { meditation_id: meditationId, pdf_url: pdfUrl });
  };
  const fireDownload = () => {
    trackEvent("script_download", { meditation_id: meditationId, pdf_url: pdfUrl });
  };
  const firePrint = () => {
    trackEvent("script_print", { meditation_id: meditationId, pdf_url: pdfUrl });
  };

  const handleToggle = () => {
    const next = !expanded;
    setExpanded(next);
    if (next) fireView();
  };

  const handlePrint = () => {
    firePrint();
    const w = window.open(pdfUrl, "_blank", "noopener,noreferrer");
    if (w) {
      w.addEventListener("load", () => {
        try {
          w.focus();
          w.print();
        } catch {
          /* user can print manually */
        }
      });
    }
  };

  const showViewer = variant !== "card" && expanded;

  return (
    <section
      aria-label={`Printable script for ${title}`}
      className="rounded-2xl border border-border bg-card overflow-hidden shadow-[var(--shadow-card)]"
    >
      {/* Header / actions row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 sm:p-6">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <FileText className="h-6 w-6" aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
              Guided Script
            </p>
            <h3 className="font-serif text-lg sm:text-xl text-foreground leading-snug mt-0.5 truncate">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              PDF
              {typeof pageCount === "number" && (
                <>
                  <span className="mx-1.5 opacity-50">·</span>
                  {pageCount} {pageCount === 1 ? "page" : "pages"}
                </>
              )}
              {fileSize && (
                <>
                  <span className="mx-1.5 opacity-50">·</span>
                  {fileSize}
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {variant === "collapsible" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggle}
              className="min-h-[44px]"
              aria-expanded={expanded}
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1.5" />
                  Hide preview
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1.5" />
                  Preview script
                </>
              )}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="min-h-[44px]"
          >
            <Printer className="h-4 w-4 mr-1.5" />
            Print
          </Button>
          <Button asChild size="sm" className="min-h-[44px]">
            <a href={pdfUrl} download onClick={fireDownload}>
              <Download className="h-4 w-4 mr-1.5" />
              Download PDF
            </a>
          </Button>
        </div>
      </div>

      {/* Inline PDF viewer. <object> with <iframe> fallback so the PDF still
          shows when an extension blocks one or the other. The text link below
          is always visible as a final escape hatch. */}
      {showViewer && (
        <div className="border-t border-border bg-muted/30">
          <div className="aspect-[8.5/11] sm:aspect-[8.5/9] w-full bg-background">
            <object
              data={`${pdfUrl}#view=FitH`}
              type="application/pdf"
              className="w-full h-full"
              aria-label={`${title} — script preview`}
            >
              <iframe
                src={`${pdfUrl}#view=FitH`}
                title={`${title} — script preview`}
                className="w-full h-full"
                loading="lazy"
              />
            </object>
          </div>
          <div className="p-3 flex justify-center">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={fireView}
              className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 text-sm font-medium text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Open PDF in new tab
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

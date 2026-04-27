import { useCallback, useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import pdfWorkerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";
import { Download, FileText, Printer, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export type MeditationScriptVariant = "inline" | "collapsible" | "card";

interface PdfCanvasPreviewProps {
  pdfUrl: string;
  title: string;
  onView?: () => void;
}

function PdfCanvasPreview({ pdfUrl, title, onView }: PdfCanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackedRef = useRef(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [renderWidth, setRenderWidth] = useState(720);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const updateWidth = () => {
      const nextWidth = Math.floor(node.getBoundingClientRect().width);
      if (nextWidth > 0) setRenderWidth(Math.min(nextWidth, 920));
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadingTask = pdfjsLib.getDocument({ url: pdfUrl });

    async function renderFirstPage() {
      setStatus("loading");

      try {
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");

        if (!canvas || !context || cancelled) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const cssScale = renderWidth / baseViewport.width;
        const displayViewport = page.getViewport({ scale: cssScale });
        const outputScale = Math.min(window.devicePixelRatio || 1, 2);
        const renderViewport = page.getViewport({ scale: cssScale * outputScale });

        canvas.width = Math.floor(renderViewport.width);
        canvas.height = Math.floor(renderViewport.height);
        canvas.style.width = `${Math.floor(displayViewport.width)}px`;
        canvas.style.height = `${Math.floor(displayViewport.height)}px`;

        const renderTask = page.render({
          canvasContext: context,
          viewport: displayViewport,
          transform: outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined,
        });

        await renderTask.promise;
        if (cancelled) return;

        setPageCount(pdf.numPages);
        setStatus("ready");
        if (!trackedRef.current) {
          trackedRef.current = true;
          onView?.();
        }
        await pdf.destroy();
      } catch (error) {
        if (!cancelled) setStatus("error");
      }
    }

    renderFirstPage();

    return () => {
      cancelled = true;
      void loadingTask.destroy();
    };
  }, [pdfUrl, renderWidth, onView]);

  return (
    <div className="border-t border-border bg-muted/30">
      <div ref={containerRef} className="relative w-full overflow-auto bg-background p-3 sm:p-5">
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 text-sm text-muted-foreground">
            Loading preview…
          </div>
        )}
        {status === "error" && (
          <div className="min-h-[260px] flex items-center justify-center px-4 text-center text-sm text-muted-foreground">
            Preview unavailable in this browser. Open the PDF in a new tab to view it.
          </div>
        )}
        <canvas
          ref={canvasRef}
          aria-label={`${title} — first page preview`}
          className="mx-auto block max-w-full rounded-sm bg-card shadow-[var(--shadow-card)]"
        />
      </div>
      <div className="p-3 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
        <span className="text-xs text-muted-foreground">
          Previewing page 1{pageCount ? ` of ${pageCount}` : ""}
        </span>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onView}
          className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 text-sm font-medium text-primary hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          Open full PDF in new tab
        </a>
      </div>
    </div>
  );
}

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

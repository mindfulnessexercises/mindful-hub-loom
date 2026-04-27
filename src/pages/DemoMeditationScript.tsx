import { useEffect } from "react";
import { MeditationScript } from "@/components/wp/MeditationScript";

/**
 * Side-by-side demo of the MeditationScript display variants.
 * Visit /admin/meditation-script-demo to compare.
 *
 * Uses Mozilla's canonical sample PDF so the demo works without any
 * uploads. Real scripts will live in the `meditation-scripts` Cloud
 * Storage bucket.
 */
const SAMPLE_PDF =
  "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";

export default function DemoMeditationScript() {
  useEffect(() => {
    document.title = "Meditation Script Display Demo";
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex,nofollow");
  }, []);

  return (
    <main className="min-h-screen bg-background">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        <header>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
            Internal preview
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground mt-2">
            Guided meditation script — display options
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Both variants use the same component and the same sample PDF.
            Pick the one that should ship on every meditation page.
          </p>
        </header>

        <section className="space-y-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-primary">
              Option A
            </p>
            <h2 className="font-serif text-2xl text-foreground mt-1">
              Inline preview + download
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              The PDF viewer is always open. Highest engagement, but heavier
              initial load and uses more vertical space on mobile.
            </p>
          </div>
          <MeditationScript
            variant="inline"
            pdfUrl={SAMPLE_PDF}
            title="Body Scan for Beginners"
            pageCount={3}
            fileSize="180 KB"
            meditationId="demo-inline"
          />
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-primary">
              Option B
            </p>
            <h2 className="font-serif text-2xl text-foreground mt-1">
              Collapsible preview
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Compact card by default. Click <em>Preview script</em> to expand
              the viewer inline. Best balance of speed and engagement.
            </p>
          </div>
          <MeditationScript
            variant="collapsible"
            pdfUrl={SAMPLE_PDF}
            title="Body Scan for Beginners"
            pageCount={3}
            fileSize="180 KB"
            meditationId="demo-collapsible"
          />
        </section>

        <section className="space-y-4 opacity-90">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
              For reference
            </p>
            <h2 className="font-serif text-2xl text-foreground mt-1">
              Card only (no preview)
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Simplest option — download/print buttons only.
            </p>
          </div>
          <MeditationScript
            variant="card"
            pdfUrl={SAMPLE_PDF}
            title="Body Scan for Beginners"
            pageCount={3}
            fileSize="180 KB"
            meditationId="demo-card"
          />
        </section>
      </div>
    </main>
  );
}

import { MeditationPlayer } from "@/components/wp/MeditationPlayer";
import portrait from "@/assets/demo-meditation-portrait.jpg";

/**
 * Internal preview page for the new MeditationPlayer component.
 * Visit /admin/meditation-player-demo to compare against the current
 * Elfsight player before rolling out to live posts.
 */
const DemoMeditationPlayer = () => {
  // Public sample MP3 (NASA — short clip) just so play actually works in preview.
  const demoSrc = "https://www.nasa.gov/wp-content/uploads/2015/01/640149main_Computers-are-in-Control.mp3";

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <header>
          <h1 className="text-3xl font-bold mb-2">MeditationPlayer — Preview</h1>
          <p className="text-muted-foreground text-sm">
            Native, themed replacement for Elfsight embeds. This is what would render
            above each guided meditation post once the migration runs.
          </p>
        </header>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            With portrait + speaker + download
          </h2>
          <MeditationPlayer
            src={demoSrc}
            title="The Art of Surrender"
            speaker="Frank Ostaseski"
            portraitUrl={portrait}
            durationSeconds={3328}
            downloadUrl={demoSrc}
            meditationId="demo-art-of-surrender"
          />
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Without portrait (cleaner, for posts without a featured speaker)
          </h2>
          <MeditationPlayer
            src={demoSrc}
            title="Body Scan for Sleep"
            speaker="Sean Fargo"
            durationSeconds={1245}
            downloadUrl={demoSrc}
            meditationId="demo-body-scan"
          />
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Minimal (no speaker, no download — just play)
          </h2>
          <MeditationPlayer
            src={demoSrc}
            title="A Short Pause"
            meditationId="demo-pause"
          />
        </section>

        <footer className="pt-8 border-t border-border text-sm text-muted-foreground">
          <p className="font-semibold mb-2">What's different vs. Elfsight:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Zero third-party scripts (faster page, no Elfsight tracking)</li>
            <li>Themed to the site automatically (no hardcoded teal)</li>
            <li>Skip 15s back / 30s forward — critical for guided audio</li>
            <li>Speed control (0.75× – 1.75×) for pacing preferences</li>
            <li>Native Download button — drives offline use & retention</li>
            <li>Plays tracked in your own analytics (meditation_play / _complete / _download)</li>
            <li>No fake "playlist row" duplicating the same item</li>
          </ul>
        </footer>
      </div>
    </main>
  );
};

export default DemoMeditationPlayer;

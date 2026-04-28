import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, RotateCw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAudioTracking } from "@/hooks/use-audio-tracking";

interface PodcastPlayerProps {
  src: string;
  title: string;
  episodeId?: number;
  /**
   * id of the heading rendered ABOVE this player by the parent page.
   * When provided, the section is `aria-labelledby` that heading instead of
   * carrying its own `aria-label`, so the accessible name comes from visible
   * text (preferred per WCAG 2.4.6).
   */
  headingId?: string;
}

const SPEEDS = [1, 1.25, 1.5, 1.75, 2] as const;
type Speed = (typeof SPEEDS)[number];

const SKIP_BACK_SEC = 15;
const SKIP_FORWARD_SEC = 30;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Native audio player tuned for podcast episodes. Surfaces play/pause,
 * 15s skip, playback speed, scrubber, and volume — wraps a single
 * <audio> element so we keep browser-level features (Media Session, AirPlay,
 * background play) for free.
 *
 * Accessibility
 * -------------
 * - All controls are real <button>s with explicit `aria-label`s and 44px+
 *   tap targets (project Core rule).
 * - Keyboard shortcuts work whenever ANY control inside the player has
 *   focus: Space / K toggles play, ← / J skips back, → / L skips forward,
 *   M toggles mute. Matches YouTube / standard media-player conventions.
 *   We deliberately scope the listener to the section so shortcuts don't
 *   hijack typing elsewhere on the page.
 * - The progress slider exposes a live `aria-valuetext` (e.g.
 *   "1:23 of 15:42") so screen-reader users hear elapsed time as they
 *   scrub, not just a percentage.
 */
export function PodcastPlayer({ src, title, episodeId, headingId }: PodcastPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [speed, setSpeed] = useState<Speed>(1);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  // Unified audio analytics — start + 90% completion (see use-audio-tracking).
  useAudioTracking(audioRef, {
    src,
    title,
    surface: "podcast_player",
    contentId: episodeId,
  });

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setPosition(a.currentTime);
    const onMeta = () => setDuration(a.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
    };
  }, [src]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play();
    else a.pause();
  };

  const skip = (delta: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.min(duration || a.duration || 0, Math.max(0, a.currentTime + delta));
  };

  const cycleSpeed = () => {
    const idx = SPEEDS.indexOf(speed);
    setSpeed(SPEEDS[(idx + 1) % SPEEDS.length]);
  };

  // Keyboard shortcuts — only active when focus is INSIDE the player section,
  // so they never swallow keystrokes a user is typing into a comment field
  // (or, more importantly, the in-page search box) elsewhere on the page.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const onKey = (e: KeyboardEvent) => {
      // Let the focused element handle its own keys first (sliders use
      // arrows, buttons use Space/Enter — overriding those would break them).
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const role = target?.getAttribute("role");
      const isInteractive =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "BUTTON" ||
        role === "slider" ||
        role === "button";

      // Space / K — toggle play. Allowed even on buttons (Space already
      // activates the button) only when the focused button is NOT one of
      // ours that handles its own click — to avoid double-toggling, we let
      // the button's native handler win for Space and only intercept K.
      if (e.key === "k" || e.key === "K") {
        e.preventDefault();
        togglePlay();
        return;
      }
      if (e.key === " " && !isInteractive) {
        e.preventDefault();
        togglePlay();
        return;
      }
      if (e.key === "ArrowLeft" && !isInteractive) {
        e.preventDefault();
        skip(-SKIP_BACK_SEC);
        return;
      }
      if (e.key === "ArrowRight" && !isInteractive) {
        e.preventDefault();
        skip(SKIP_FORWARD_SEC);
        return;
      }
      if (e.key === "j" || e.key === "J") {
        e.preventDefault();
        skip(-SKIP_BACK_SEC);
        return;
      }
      if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        skip(SKIP_FORWARD_SEC);
        return;
      }
      if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        setMuted((m) => !m);
      }
    };
    section.addEventListener("keydown", onKey);
    return () => section.removeEventListener("keydown", onKey);
    // togglePlay / skip read from refs and stable state setters; safe to
    // omit from deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  const progressPercent = duration ? (position / duration) * 100 : 0;
  const progressValueText = duration
    ? `${formatTime(position)} of ${formatTime(duration)}`
    : `${formatTime(position)}`;

  // Section is labelled by parent heading when provided; falls back to a
  // self-contained aria-label so the player remains accessible if dropped
  // into a context that doesn't supply one.
  const sectionLabelProps = headingId
    ? { "aria-labelledby": headingId }
    : { "aria-label": `Audio player for ${title}` };

  return (
    <section
      ref={sectionRef}
      role="region"
      {...sectionLabelProps}
      className="rounded-xl border border-border bg-[hsl(var(--section-emphasis))] shadow-[var(--shadow-card)] p-4 sm:p-5"
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Hidden hint that screen-reader users can hear once focus enters
          the region. Sighted keyboard users discover shortcuts via the
          tooltip-style title attributes on each button. */}
      <p className="sr-only">
        Audio player. Use Space or K to play and pause, Arrow Left or J to
        skip back {SKIP_BACK_SEC} seconds, Arrow Right or L to skip forward
        {" "}{SKIP_FORWARD_SEC} seconds, M to mute.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="lg"
          onClick={togglePlay}
          className={`h-12 w-12 rounded-full p-0 shrink-0 ${focusRing}`}
          aria-label={playing ? `Pause ${title}` : `Play ${title}`}
          aria-pressed={playing}
          title={playing ? "Pause (Space or K)" : "Play (Space or K)"}
        >
          {playing ? <Pause className="h-5 w-5" aria-hidden="true" /> : <Play className="h-5 w-5 ml-0.5" aria-hidden="true" />}
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => skip(-SKIP_BACK_SEC)}
            className={`min-h-[44px] px-3 ${focusRing}`}
            aria-label={`Skip back ${SKIP_BACK_SEC} seconds`}
            title={`Skip back ${SKIP_BACK_SEC}s (Left arrow or J)`}
          >
            <RotateCcw className="h-4 w-4 mr-1" aria-hidden="true" /> {SKIP_BACK_SEC}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => skip(SKIP_FORWARD_SEC)}
            className={`min-h-[44px] px-3 ${focusRing}`}
            aria-label={`Skip forward ${SKIP_FORWARD_SEC} seconds`}
            title={`Skip forward ${SKIP_FORWARD_SEC}s (Right arrow or L)`}
          >
            {SKIP_FORWARD_SEC} <RotateCw className="h-4 w-4 ml-1" aria-hidden="true" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={cycleSpeed}
          className={`min-h-[44px] px-3 font-mono text-xs ${focusRing}`}
          aria-label={`Playback speed ${speed} times. Click to change.`}
          title="Cycle playback speed"
        >
          {speed}×
        </Button>

        <div className="flex-1 min-w-[180px] flex items-center gap-3">
          <span
            className="text-xs font-mono text-muted-foreground tabular-nums w-10 text-right"
            aria-hidden="true"
          >
            {formatTime(position)}
          </span>
          <Slider
            value={[progressPercent]}
            onValueChange={([v]) => {
              if (audioRef.current && duration) {
                audioRef.current.currentTime = (v / 100) * duration;
              }
            }}
            max={100}
            step={0.1}
            aria-label="Seek through episode"
            aria-valuetext={progressValueText}
            className="flex-1"
          />
          <span
            className="text-xs font-mono text-muted-foreground tabular-nums w-10"
            aria-hidden="true"
          >
            {formatTime(duration)}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 w-32">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMuted((m) => !m)}
            className={`h-9 w-9 p-0 shrink-0 ${focusRing}`}
            aria-label={muted ? "Unmute" : "Mute"}
            aria-pressed={muted}
            title={muted ? "Unmute (M)" : "Mute (M)"}
          >
            <Volume2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </Button>
          <Slider
            value={[muted ? 0 : volume * 100]}
            onValueChange={([v]) => {
              setVolume(v / 100);
              if (v > 0 && muted) setMuted(false);
            }}
            max={100}
            step={1}
            aria-label="Volume"
            aria-valuetext={`${Math.round((muted ? 0 : volume) * 100)} percent`}
          />
        </div>
      </div>
    </section>
  );
}

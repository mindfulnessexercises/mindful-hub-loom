import { useEffect, useRef, useState } from "react";
import { Download, Pause, Play, RotateCcw, RotateCw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { trackEvent } from "@/lib/analytics";

interface MeditationPlayerProps {
  src: string;
  title: string;
  speaker?: string;
  portraitUrl?: string;
  /** Duration in seconds. If omitted, derived from MP3 metadata after load. */
  durationSeconds?: number;
  /** Direct URL to a downloadable MP3 (usually same as src). Omit to hide download. */
  downloadUrl?: string;
  /** Slug or ID for analytics. */
  meditationId?: string;
}

const SPEEDS = [1, 1.25, 1.5, 1.75, 0.75] as const;
type Speed = (typeof SPEEDS)[number];

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Branded audio player for guided meditations and talks. Designed to sit
 * ABOVE post content as the page's emotional anchor — large portrait, bold
 * speaker attribution, native HTML5 audio with skip/speed/download controls
 * tuned for long-form spoken content.
 *
 * Replaces third-party Elfsight embeds. Themed via design tokens so it
 * inherits brand colors automatically.
 */
export function MeditationPlayer({
  src,
  title,
  speaker,
  portraitUrl,
  durationSeconds,
  downloadUrl,
  meditationId,
}: MeditationPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(durationSeconds ?? 0);
  const [position, setPosition] = useState(0);
  const [speed, setSpeed] = useState<Speed>(1);
  const [volume, setVolume] = useState(1);
  const startedRef = useRef(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setPosition(a.currentTime);
    const onMeta = () => {
      if (!durationSeconds) setDuration(a.duration || 0);
    };
    const onPlay = () => {
      setPlaying(true);
      if (!startedRef.current) {
        startedRef.current = true;
        trackEvent("meditation_play", { meditation_id: meditationId, src });
      }
    };
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      trackEvent("meditation_complete", { meditation_id: meditationId, src });
    };
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
  }, [src, meditationId, durationSeconds]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play();
    else a.pause();
  };

  const skip = (delta: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.min(duration, Math.max(0, a.currentTime + delta));
  };

  const cycleSpeed = () => {
    const idx = SPEEDS.indexOf(speed);
    setSpeed(SPEEDS[(idx + 1) % SPEEDS.length]);
  };

  const handleDownload = () => {
    trackEvent("meditation_download", { meditation_id: meditationId, src });
  };

  return (
    <section
      aria-label={`Listen to ${title}`}
      className="rounded-2xl overflow-hidden border border-border shadow-[var(--shadow-card)] bg-[hsl(var(--meditation-player-bg,var(--primary)))] text-[hsl(var(--meditation-player-fg,var(--primary-foreground)))]"
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 p-5 sm:p-6">
        {portraitUrl && (
          <div className="shrink-0 mx-auto sm:mx-0">
            <img
              src={portraitUrl}
              alt={speaker ? `Portrait of ${speaker}` : title}
              loading="lazy"
              width={160}
              height={160}
              className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl shadow-lg grayscale"
            />
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col justify-between gap-4">
          <header className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold leading-tight">{title}</h2>
            {speaker && (
              <p className="mt-1 text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase opacity-90">
                {speaker}
                {duration > 0 && (
                  <>
                    <span className="mx-2 opacity-60">·</span>
                    <span className="font-mono normal-case tracking-normal">{formatTime(duration)}</span>
                  </>
                )}
              </p>
            )}
          </header>

          {/* Scrubber */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tabular-nums w-10 text-right opacity-90">
              {formatTime(position)}
            </span>
            <Slider
              value={[duration ? (position / duration) * 100 : 0]}
              onValueChange={([v]) => {
                if (audioRef.current && duration) {
                  audioRef.current.currentTime = (v / 100) * duration;
                }
              }}
              max={100}
              step={0.1}
              aria-label="Seek"
              className="flex-1 [&_[role=slider]]:bg-white [&>span:first-child]:bg-white/20 [&>span:first-child>span]:bg-white"
            />
            <span className="text-xs font-mono tabular-nums w-12 opacity-90">
              {formatTime(duration)}
            </span>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => skip(-15)}
              className="h-10 px-2.5 hover:bg-white/15 text-current"
              aria-label="Skip back 15 seconds"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              <span className="text-xs font-semibold">15</span>
            </Button>

            <Button
              size="lg"
              onClick={togglePlay}
              className="h-14 w-14 rounded-full p-0 shrink-0 bg-white text-[hsl(var(--primary))] hover:bg-white/90 shadow-lg"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => skip(30)}
              className="h-10 px-2.5 hover:bg-white/15 text-current"
              aria-label="Skip forward 30 seconds"
            >
              <span className="text-xs font-semibold">30</span>
              <RotateCw className="h-4 w-4 ml-1" />
            </Button>

            <div className="hidden sm:block w-px h-8 bg-white/20 mx-1" aria-hidden />

            <Button
              variant="ghost"
              size="sm"
              onClick={cycleSpeed}
              className="h-10 px-3 font-mono text-xs hover:bg-white/15 text-current"
              aria-label={`Playback speed ${speed}x. Click to change.`}
            >
              {speed}×
            </Button>

            <div className="hidden md:flex items-center gap-2 w-28 px-2">
              <Volume2 className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
              <Slider
                value={[volume * 100]}
                onValueChange={([v]) => setVolume(v / 100)}
                max={100}
                step={1}
                aria-label="Volume"
                className="[&_[role=slider]]:bg-white [&>span:first-child]:bg-white/20 [&>span:first-child>span]:bg-white"
              />
            </div>

            {downloadUrl && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-10 px-3 hover:bg-white/15 text-current ml-auto"
              >
                <a
                  href={downloadUrl}
                  download
                  onClick={handleDownload}
                  aria-label={`Download ${title} as MP3`}
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  <span className="text-xs font-semibold">Download</span>
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

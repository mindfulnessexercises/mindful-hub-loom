import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, RotateCw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAudioTracking } from "@/hooks/use-audio-tracking";

interface PodcastPlayerProps {
  src: string;
  title: string;
  episodeId?: number;
}

const SPEEDS = [1, 1.25, 1.5, 1.75, 2] as const;
type Speed = (typeof SPEEDS)[number];

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
 */
export function PodcastPlayer({ src, title, episodeId }: PodcastPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [speed, setSpeed] = useState<Speed>(1);
  const [volume, setVolume] = useState(1);

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

  return (
    <section
      aria-label={`Listen to ${title}`}
      className="rounded-xl border border-border bg-[hsl(var(--section-emphasis))] shadow-[var(--shadow-card)] p-4 sm:p-5"
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="lg"
          onClick={togglePlay}
          className="h-12 w-12 rounded-full p-0 shrink-0"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => skip(-15)}
            className="h-9 px-2"
            aria-label="Skip back 15 seconds"
          >
            <RotateCcw className="h-4 w-4 mr-1" /> 15
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => skip(30)}
            className="h-9 px-2"
            aria-label="Skip forward 30 seconds"
          >
            30 <RotateCw className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={cycleSpeed}
          className="h-9 px-2.5 font-mono text-xs"
          aria-label={`Playback speed ${speed}x`}
        >
          {speed}×
        </Button>

        <div className="flex-1 min-w-[180px] flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground tabular-nums w-10 text-right">
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
            className="flex-1"
          />
          <span className="text-xs font-mono text-muted-foreground tabular-nums w-10">
            {formatTime(duration)}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 w-32">
          <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
          <Slider
            value={[volume * 100]}
            onValueChange={([v]) => setVolume(v / 100)}
            max={100}
            step={1}
            aria-label="Volume"
          />
        </div>
      </div>
    </section>
  );
}

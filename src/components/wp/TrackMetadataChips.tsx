import { User, Tag as TagIcon, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import type { TrackMetadata } from "@/lib/track-metadata";

interface TrackMetadataChipsProps {
  meta: TrackMetadata;
  /** Optional source label (e.g. "Meaningful Work") with link target. */
  sourceLabel?: string;
  sourceHref?: string;
  className?: string;
}

/**
 * Compact, scannable metadata strip for an audio/dharma talk track.
 * Shows Speaker, Type, and (optionally) Source so visitors can confirm
 * the context of a recording before pressing play.
 */
export function TrackMetadataChips({
  meta,
  sourceLabel,
  sourceHref,
  className,
}: TrackMetadataChipsProps) {
  const items: Array<{
    icon: typeof User;
    label: string;
    value: string;
    href?: string;
  }> = [];

  if (meta.speaker) {
    items.push({ icon: User, label: "Speaker", value: meta.speaker });
  }
  if (meta.type) {
    items.push({ icon: TagIcon, label: "Type", value: meta.type });
  }
  if (sourceLabel) {
    items.push({
      icon: BookOpen,
      label: "Source",
      value: sourceLabel,
      href: sourceHref,
    });
  }

  if (items.length === 0) return null;

  return (
    <ul
      className={`flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted-foreground ${className ?? ""}`}
      aria-label="Track details"
    >
      {items.map(({ icon: Icon, label, value, href }) => (
        <li key={`${label}-${value}`} className="inline-flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-primary/70" aria-hidden />
          <span className="sr-only">{label}: </span>
          {href ? (
            <Link to={href} className="text-foreground/80 hover:text-primary hover:underline">
              {value}
            </Link>
          ) : (
            <span className="text-foreground/80">{value}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

// Per-post registry mapping WP post slugs → embedded videos.
// Used by WPResolver to inject native React video embeds at the top of
// matching posts. Mirrors the inline-audio-sections pattern.
//
// Population workflow:
//   1. Source of truth: src/data/video-catalog.csv (565 videos)
//   2. Slugs verified against live WP at build time (28 Apr 2026)
//   3. Confidence threshold ≥ 0.65 Jaccard overlap on normalized title tokens
//   4. Add new entries here when WP slugs are renamed or new posts are added
//
// Why a registry (not an automatic title lookup at request time)?
//   • Zero runtime cost on the 99%+ of posts that don't have a video
//   • Hand-curatable — avoids surprise embeds on unrelated posts
//   • Explicit override for the rare case where one post should have multiple
//     videos (Jack Kornfield, Joseph Goldstein guided-meditation hubs)
//
// Each entry's `placement: "top"` means "render above the post content".
// Future placements (`heading-match`, `bottom`) can extend this without
// changing call sites.

import type { VideoProvider } from "./video-catalog";

export interface InlineVideo {
  /** Display title shown above the player. */
  title: string;
  /** Vimeo or YouTube. */
  provider: VideoProvider;
  /** Vimeo numeric id or YouTube 11-char id. */
  id: string;
  /** Vimeo unlisted-video hash (h=...). Required for some private videos. */
  hash?: string;
  /** Duration string ("1:08:56") shown on the lite-embed poster. */
  duration?: string;
  /** Where in the post to render. Only "top" is implemented today. */
  placement?: "top";
}

export const INLINE_VIDEO_POSTS: Record<string, readonly InlineVideo[]> = {
  // Guest Teacher session embedded on the Danny Grieco post.
  "selling-your-mindfulness-teachings-to-organizations-with-danny-grieco": [
    {
      title: "Selling Your Mindfulness Teachings to Organizations — Danny Grieco",
      provider: "vimeo",
      id: "998605085",
      duration: "1:08:56",
    },
  ],

  // Jack Kornfield guided-meditation hub: two complementary practices.
  "guided-meditation-jack-kornfield": [
    {
      title: "Big Sky Guided Meditation by Jack Kornfield",
      provider: "youtube",
      id: "JybkR_Xd7PY",
      duration: "56:15",
    },
    {
      title: "Guided Meditation on Emotions by Jack Kornfield",
      provider: "youtube",
      id: "G36ZCFVysiA",
      duration: "41:31",
    },
  ],

  // Joseph Goldstein metta hub.
  "guided-metta-meditation-with-joseph-goldstein-video": [
    {
      title: "Guided Meditation by Joseph Goldstein",
      provider: "youtube",
      id: "E4OqG4picrI",
      duration: "21:24",
    },
  ],

  // Daily Mindfulness clip on the "taking care" post.
  "taking-care": [
    {
      title: "How to Support Others While Taking Care of Yourself",
      provider: "youtube",
      id: "zkJMS5gJM5o",
      duration: "16:00",
    },
  ],

  // Daily Mindfulness clip on the Gabor Maté "don't push" post.
  "dont-push": [
    {
      title: "Don't Push Away Your Negative Emotions — Gabor Maté",
      provider: "youtube",
      id: "aiW6xPNUW_8",
      duration: "0:44",
    },
  ],

  // 528 Hz solfeggio "miracle tone" healing music post.
  "528hz-miracle-tone": [
    {
      title: "528 Hz Miracle Tone — Healing Frequency",
      provider: "youtube",
      id: "9PRV6w6VJbc",
    },
  ],

  // /how-to-teach-meditation hub: a guest-teacher session that models the
  // craft of teaching meditation in a way that resonates and connects.
  // Replaces the generic "teaching meditation" stock photo at the top of
  // the legacy WP page (stripped in WPResolver for this slug).
  "how-to-teach-meditation": [
    {
      title:
        "Teaching Meditation In A Way That Resonates And Connects — Shawn J Moore",
      provider: "vimeo",
      id: "1085221308",
      duration: "1:58:14",
    },
  ],

  // Brené Brown's iconic TEDxHouston talk — referenced in the post body
  // but never embedded on the legacy WP page. The full talk is the whole
  // point of the article, so we surface it at the top.
  "brene-brown-power-vulnerability": [
    {
      title: "The Power of Vulnerability — Brené Brown (TEDxHouston)",
      provider: "youtube",
      id: "iCvmsMzlF7o",
      duration: "20:19",
    },
  ],
};

/** Look up the inline videos configured for a WP post slug. */
export function getInlineVideos(slug: string | undefined): readonly InlineVideo[] {
  if (!slug) return [];
  return INLINE_VIDEO_POSTS[slug] ?? [];
}

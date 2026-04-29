/**
 * Editorial "best of" set for the Audio Library default view.
 *
 * The library holds 500+ tracks — far too many to render at once. On
 * first load we show ONLY this hand-picked set so the page is scannable
 * in seconds. Visitors who want more either:
 *   1. Click the "Show all N tracks" button (renders the full catalog).
 *   2. Tap a theme chip or run a search (also expands to the full catalog
 *      so chip count badges like "Breath (87)" stay honest).
 *
 * Selection criteria:
 * - Cover the most-searched themes (Anxiety, Sleep, Self-Compassion,
 *   Gratitude, Breath, Loving-Kindness, Stress, Morning, Grief).
 * - Lead with flagship practices visitors recognise by name (RAIN, body
 *   scan, soft-belly, gratitude meditation, sleep meditation).
 * - Mix Sean Fargo originals with named teacher tracks (Tara Brach, Gil
 *   Fronsdal, Joseph Goldstein) so the catalog's depth shows immediately.
 * - Span a range of durations (≤5 min daily anchors → 20+ min long-form).
 *
 * Tracks are matched against `track.src` in AudioLibrary.tsx — keep these
 * URLs in sync with `audio-playlists.ts`. A track listed here that no
 * longer exists in the registry is silently skipped (no crash, just a
 * shorter list). Order in this array = render order.
 */

const AUDIO_BASE =
  "https://glpbynaneshuhmjtbpsa.supabase.co/storage/v1/object/public/meditation-audio";

export const FEATURED_TRACK_SRCS: string[] = [
  // ── Self-Compassion / flagship ───────────────────────────────────────
  `${AUDIO_BASE}/cope-with-difficult-emotions-through-mindfulness/rain-meditation.mp3`,
  `${AUDIO_BASE}/8-self-compassion-exercises/tara-brach-rain-of-compassion.mp3`,
  `${AUDIO_BASE}/self-compassion-pause/self-compassion-meditation.mp3`,

  // ── Anxiety / Stress ─────────────────────────────────────────────────
  `${AUDIO_BASE}/soft-belly/soft-belly-breathing-stress.mp3`,
  `${AUDIO_BASE}/stress-quotes/tara-brach-stress-wakeful-relaxation-and-freedom.mp3`,
  `${AUDIO_BASE}/stress-quotes/relieving-stress.mp3`,

  // ── Sleep ────────────────────────────────────────────────────────────
  `${AUDIO_BASE}/8-sleep-meditations/sleep-10-minutes.mp3`,
  `${AUDIO_BASE}/8-sleep-meditations/sleep-5-minutes.mp3`,

  // ── Body Scan ────────────────────────────────────────────────────────
  `${AUDIO_BASE}/short-body-scan/body-scan-meditation.mp3`,
  `${AUDIO_BASE}/mindfulness-body-scan-for-stress-relief/gil-fronsdal-body-scan.mp3`,

  // ── Breath ───────────────────────────────────────────────────────────
  `${AUDIO_BASE}/10-tips-teaching-mindfulness-of-breathing/mindfulness-of-breathing.mp3`,
  `${AUDIO_BASE}/6-mindful-breathing-exercises/5-minute-breathing.mp3`,
  `${AUDIO_BASE}/10-tips-for-teaching-mindfulness-of-breathing-practices/tara-brach-coming-back-to-the-breath.mp3`,

  // ── Loving-Kindness / Empathy ────────────────────────────────────────
  `${AUDIO_BASE}/empathy-quotes/just-like-me.mp3`,

  // ── Gratitude ────────────────────────────────────────────────────────
  `${AUDIO_BASE}/power-of-gratitude-meditation/gratitude-meditation.mp3`,
  `${AUDIO_BASE}/power-of-gratitude-meditation/tara-brach-gratitude-and-generosity.mp3`,

  // ── Safety & Belonging ───────────────────────────────────────────────
  `${AUDIO_BASE}/visiting-your-safe-place/sensing-into-safety.mp3`,
  `${AUDIO_BASE}/visiting-your-safe-place/guided-visualization-ease-wellbeing.mp3`,

  // ── Presence & Stillness ─────────────────────────────────────────────
  `${AUDIO_BASE}/silence-quotes/grounded-silence.mp3`,
  `${AUDIO_BASE}/kindness-for-your-thinking-mind/three-centers.mp3`,

  // ── Morning anchor ───────────────────────────────────────────────────
  `${AUDIO_BASE}/morning-affirmations/starting-the-day-with-gratitude.mp3`,

  // ── Meaningful Work / micro-meditations for the workday ──────────────
  `${AUDIO_BASE}/meaningful-work-quotes/meeting-3-minutes.mp3`,
  `${AUDIO_BASE}/meaningful-work-quotes/leading-with-purpose.mp3`,

  // ── Self-Worth ───────────────────────────────────────────────────────
  `${AUDIO_BASE}/self-worth-quotes/feeling-worthy.mp3`,
];

/** Quick membership check for use in render loops. */
export const FEATURED_TRACK_SET = new Set<string>(FEATURED_TRACK_SRCS);

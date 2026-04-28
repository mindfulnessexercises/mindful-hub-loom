import type { BuzzsproutEpisodeRecord } from "@/lib/buzzsprout-lookup";

interface Props {
  record: BuzzsproutEpisodeRecord;
  /** When true, renders the show-notes HTML block. Disable on WP posts whose
   *  own `content.rendered` already contains the show notes to avoid dupes. */
  includeShowNotes?: boolean;
}

/**
 * Renders the Buzzsprout-derived editorial sections (AI summary, key
 * takeaways, reflection questions, optional show notes) using the same
 * typography as WP-rendered podcast posts. Reused by:
 *  - BuzzsproutEpisodeFallback (no WP post)
 *  - WPResolver podcast posts (enrichment beneath WP `content.rendered`)
 */
export function BuzzsproutEpisodeSections({
  record,
  includeShowNotes = false,
}: Props) {
  const hasAnything =
    record.aiSummary ||
    (record.aiTakeaways && record.aiTakeaways.length > 0) ||
    (record.aiQuestions && record.aiQuestions.length > 0) ||
    (includeShowNotes && record.descriptionHtml);

  if (!hasAnything) return null;

  return (
    <div className="not-prose space-y-10">
      {record.aiSummary && (
        <section>
          <h2 className="font-serif text-3xl text-foreground mt-12 mb-4">
            About this episode
          </h2>
          <div className="text-foreground/90 leading-[1.75] whitespace-pre-line">
            {record.aiSummary}
          </div>
        </section>
      )}

      {record.aiTakeaways && record.aiTakeaways.length > 0 && (
        <section>
          <h2 className="font-serif text-3xl text-foreground mt-12 mb-4">
            Key takeaways
          </h2>
          <ul className="space-y-2 list-disc pl-6 text-foreground/90 leading-[1.75] marker:text-primary">
            {record.aiTakeaways.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      )}

      {record.aiQuestions && record.aiQuestions.length > 0 && (
        <section>
          <h2 className="font-serif text-3xl text-foreground mt-12 mb-4">
            Reflection questions
          </h2>
          <ul className="space-y-2 list-disc pl-6 text-foreground/90 leading-[1.75] marker:text-primary">
            {record.aiQuestions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </section>
      )}

      {includeShowNotes && record.descriptionHtml && (
        <section>
          <h2 className="font-serif text-3xl text-foreground mt-12 mb-4">
            Show notes
          </h2>
          <div
            className="prose prose-stone max-w-none prose-a:text-primary"
            // Buzzsprout-authored HTML — trusted source.
            dangerouslySetInnerHTML={{ __html: record.descriptionHtml }}
          />
        </section>
      )}
    </div>
  );
}

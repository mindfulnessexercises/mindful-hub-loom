import { WPSeo } from "@/components/wp/WPSeo";

/**
 * Homepage-only SEO surface. Lifted out of `Index.tsx` so that:
 *   1. The keyword/copy strategy lives next to other homepage components.
 *   2. JSON-LD (WebSite + Organization + SearchAction) is colocated with
 *      the meta tags it complements, instead of polluting the page tree.
 *
 * Primary ranking target: "mindfulness exercises".
 * Secondary clusters: free guided meditations, mindfulness scripts,
 * mindfulness affirmations, mindfulness teacher certification.
 *
 * Title is intentionally <60 chars and leads with the head term.
 * Description is <160 chars and front-loads "mindfulness exercises"
 * so the SERP snippet keeps the keyword bolded.
 */
const SITE_URL = "https://mindfulnessexercises.com";

export function HomepageSeo() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Mindfulness Exercises",
        description:
          "Free mindfulness exercises, guided meditations, scripts, worksheets, and APA-approved teacher certification.",
        inLanguage: "en-US",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Mindfulness Exercises",
        url: SITE_URL,
        logo: `${SITE_URL}/icon-512.png`,
        sameAs: [
          "https://www.facebook.com/MindfulnessExercises",
          "https://www.instagram.com/mindfulnessexercises/",
          "https://www.youtube.com/@MindfulnessExercises",
        ],
        founder: {
          "@type": "Person",
          name: "Sean Fargo",
        },
      },
    ],
  };

  return (
    <WPSeo
      title="Mindfulness Exercises — 3,000+ Free Guided Practices & Scripts"
      description="Free mindfulness exercises, guided meditations, scripts, worksheets, and APA-approved teacher certification — trusted by 50,000+ practitioners."
      canonical={SITE_URL + "/"}
      type="website"
      jsonLd={jsonLd}
    />
  );
}

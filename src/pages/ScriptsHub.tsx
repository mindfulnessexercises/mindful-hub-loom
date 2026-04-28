import { FormatHubPage } from "@/components/hubs/FormatHubPage";

export default function ScriptsHub() {
  return (
    <FormatHubPage
      format="scripts"
      alsoShow="teaching"
      intro="Free meditation scripts you can read aloud, adapt, or record. Filter by audience — kids, groups, yoga teachers, therapists — or browse the craft guides on writing and recording your own."
      audiences={["kids", "groups", "yoga-teachers", "therapists"]}
      seoTitle="Free Meditation Scripts — for Therapists, Teachers, Groups & Kids | Mindfulness Exercises"
      seoDescription="12 free meditation scripts: stress, anxiety, sleep, kids, groups, yoga teachers, therapists. Plus guides on how to write and record your own."
      canonical="/meditation-scripts"
    />
  );
}

import { FormatHubPage } from "@/components/hubs/FormatHubPage";

export default function AffirmationsHub() {
  return (
    <FormatHubPage
      format="affirmations"
      alsoShow="chakra"
      intro="Affirmation collections grouped by who they're for and the intention behind them — repeat morning, before sleep, or anytime you need a steadying sentence."
      audiences={["men", "women", "teens", "kids", "work", "anxiety"]}
      seoTitle="Mindfulness Affirmations — By Audience & Intention | Mindfulness Exercises"
      seoDescription="Free positive affirmations for men, women, teens, kids, work, and anxiety — plus morning, gratitude, motivation, self-love, and I AM collections."
      canonical="/affirmations"
    />
  );
}

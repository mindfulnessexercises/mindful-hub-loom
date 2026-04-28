import { describe, expect, it } from "vitest";
import { extractBuzzsproutEmbed } from "@/lib/buzzsprout";

describe("extractBuzzsproutEmbed", () => {
  it("extracts ids from a real Thrive [tcb-script] shortcode with smart-quote entities", () => {
    const html = `[tcb-script src=&#8221;https://www.buzzsprout.com/2555881/episodes/18714235-gratitude-beyond-words.js?container_id=buzzsprout-player-18714235&amp;player=small&#8221; type=&#8221;text/javascript&#8243; charset=&#8221;utf-8&#8243;][/tcb-script]`;
    const r = extractBuzzsproutEmbed(html);
    expect(r).not.toBeNull();
    expect(r!.podcastId).toBe("2555881");
    expect(r!.episodeId).toBe("18714235");
    expect(r!.iframeSrc).toContain("buzzsprout.com/2555881/episodes/18714235");
    expect(r!.iframeSrc).toContain("iframe=true");
  });

  it("handles plain straight-quote variants too", () => {
    const html = `<script src="https://www.buzzsprout.com/12345/episodes/67890-some-slug.js"></script>`;
    const r = extractBuzzsproutEmbed(html);
    expect(r?.podcastId).toBe("12345");
    expect(r?.episodeId).toBe("67890");
  });

  it("handles the older /<podcastId>/<episodeId>-slug.js URL shape", () => {
    const html = `[tcb-script src="https://www.buzzsprout.com/12345/67890-some-slug.js"]`;
    const r = extractBuzzsproutEmbed(html);
    expect(r?.podcastId).toBe("12345");
    expect(r?.episodeId).toBe("67890");
  });

  it("returns null when no Buzzsprout URL is present", () => {
    expect(extractBuzzsproutEmbed("<p>Just some text.</p>")).toBeNull();
    expect(extractBuzzsproutEmbed("")).toBeNull();
  });
});

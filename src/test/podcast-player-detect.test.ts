import { describe, it, expect } from "vitest";
import {
  detectPlayerInHtml,
  detectPlayerInDom,
} from "@/lib/podcast-player-detect";

describe("detectPlayerInHtml", () => {
  it("returns nothing for empty / null input", () => {
    expect(detectPlayerInHtml("")).toEqual([]);
    expect(detectPlayerInHtml(null)).toEqual([]);
    expect(detectPlayerInHtml(undefined)).toEqual([]);
  });

  it("detects a Buzzsprout [tcb-script] shortcode (Thrive-wrapped, entity-encoded)", () => {
    const html =
      "intro [tcb-script src=&#8221;https://www.buzzsprout.com/2555881/episodes/18714235-x.js?container_id=buzzsprout-player-18714235&amp;player=small&#8221;] outro";
    const hits = detectPlayerInHtml(html);
    expect(hits).toHaveLength(1);
    expect(hits[0].provider).toBe("buzzsprout");
    expect(hits[0].source).toBe("shortcode");
  });

  it("detects a Megaphone iframe inside post HTML", () => {
    const html = `<p>x</p><iframe src="https://playlist.megaphone.fm?e=ISSDS3686472019" loading="lazy"></iframe>`;
    const hits = detectPlayerInHtml(html);
    expect(hits.map((h) => h.provider)).toContain("megaphone");
  });

  it("does NOT match generic external Apple / Spotify links (link buttons, not embeds)", () => {
    const html = `
      <a href="https://podcasts.apple.com/us/podcast/x/id1622236300?i=1">Apple</a>
      <a href="https://open.spotify.com/episode/4OSeMBTBeWDpR6feNCk0m5">Spotify</a>
      <a href="http://tun.in/tEWR1L">TuneIn</a>`;
    expect(detectPlayerInHtml(html)).toEqual([]);
  });

  it("detects Apple and Spotify only when the embed URL is used", () => {
    const html = `
      <iframe src="https://embed.podcasts.apple.com/us/podcast/x/id1?i=1"></iframe>
      <iframe src="https://open.spotify.com/embed/episode/abc"></iframe>`;
    const providers = detectPlayerInHtml(html).map((h) => h.provider).sort();
    expect(providers).toEqual(["apple_embed", "spotify_embed"]);
  });

  it("detects a raw <audio> element", () => {
    const html = `<audio src="https://cdn.example.com/x.mp3" controls></audio>`;
    const hits = detectPlayerInHtml(html);
    expect(hits[0].provider).toBe("html5_audio");
    expect(hits[0].source).toBe("audio");
  });

  it("de-duplicates per provider", () => {
    const html = `
      <iframe src="https://playlist.megaphone.fm?e=A"></iframe>
      <iframe src="https://playlist.megaphone.fm?e=B"></iframe>`;
    const hits = detectPlayerInHtml(html);
    expect(hits).toHaveLength(1);
    expect(hits[0].provider).toBe("megaphone");
  });
});

describe("detectPlayerInDom", () => {
  it("returns [] for null root", () => {
    expect(detectPlayerInDom(null)).toEqual([]);
  });

  it("finds Megaphone iframes in the live DOM (Thrive template injection case)", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <p>article body</p>
      <iframe src="https://playlist.megaphone.fm?e=ISSDS3686472019"></iframe>
      <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-X"></iframe>`;
    const hits = detectPlayerInDom(root);
    expect(hits.map((h) => h.provider)).toEqual(["megaphone"]);
    expect(hits[0].source).toBe("iframe");
  });

  it("finds Buzzsprout iframes hydrated at runtime", () => {
    const root = document.createElement("div");
    root.innerHTML = `<iframe src="https://www.buzzsprout.com/2555881/episodes/18714235?iframe=true"></iframe>`;
    const hits = detectPlayerInDom(root);
    expect(hits[0].provider).toBe("buzzsprout");
  });

  it("ignores tracking iframes", () => {
    const root = document.createElement("div");
    root.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-X"></iframe>`;
    expect(detectPlayerInDom(root)).toEqual([]);
  });
});

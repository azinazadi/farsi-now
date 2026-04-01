import { describe, it, expect } from "vitest";
import {
  phrases,
  getPhrase,
  getScorePhrase,
  getPhraseAudioUrl,
  getPhraseAudioSequenceUrls,
} from "../phrases";
import * as fs from "fs";
import * as path from "path";

/**
 * Strip emoji using the same logic as phrases.ts
 * Keep in sync with stripEmoji in phrases.ts
 */
const stripEmoji = (text: string): string =>
  text.replace(
    /[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FEFF}]|[\u200D\uFE0F]|[😊😍😂😈😜😋🤗⚡🌟🌸🚀🐥🐶💪🎉🔥👏🛡️🌠📱☕🗝️🔑💃🍰🧠🖼️😎🦇😳💣👍😏❤️🚨🎬👀]/gu,
    ""
  ).trim();

describe("Phrase audio mapping", () => {
  const allCategories = Object.keys(phrases) as (keyof typeof phrases)[];

  const allPhrases: { category: string; phrase: string }[] = [];
  for (const cat of allCategories) {
    for (const phrase of phrases[cat]) {
      allPhrases.push({ category: cat, phrase });
    }
  }

  it("every category has at least 5 phrases", () => {
    for (const cat of allCategories) {
      expect(phrases[cat].length).toBeGreaterThanOrEqual(5);
    }
  });

  it("getPhrase returns a string from the correct category", () => {
    for (const cat of allCategories) {
      const result = getPhrase(cat);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
      expect(phrases[cat]).toContain(result);
    }
  });

  it("getScorePhrase returns phrases for each star count", () => {
    for (const stars of [0, 1, 2, 3]) {
      const result = getScorePhrase(stars);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    }
  });

  it("stitches a long phrase from multiple exact audio clips", () => {
    expect(getPhraseAudioUrl("سلام! چطوری؟ دلم برات تنگ شده بود 😄❤️")).toBeNull();
    expect(getPhraseAudioSequenceUrls("سلام! چطوری؟ دلم برات تنگ شده بود 😄❤️")).toEqual([
      "/assets/audio/phrases/a3f5bdccd3bd.mp3",
      "/assets/audio/phrases/2af08e961897.mp3",
    ]);
  });

  it("stripEmoji removes all emoji from phrases", () => {
    for (const { phrase } of allPhrases) {
      const clean = stripEmoji(phrase);
      // Should not contain common emoji characters
      expect(clean).not.toMatch(/[😄😍😎😂😏❤️🔥😳😜🧠🎬🚨🌸👀😏]/);
    }
  });

  it("no duplicate phrases within the same category", () => {
    for (const cat of allCategories) {
      const seen = new Set<string>();
      for (const phrase of phrases[cat]) {
        expect(seen.has(phrase)).toBe(false);
        seen.add(phrase);
      }
    }
  });
});

describe("Phrase audio files exist on disk", () => {
  // Read the audioMap from the source file to verify file existence
  const phrasesSource = fs.readFileSync(
    path.resolve(__dirname, "../phrases.ts"),
    "utf-8"
  );

  // Extract all hash values from audioMap
  const hashMatches = phrasesSource.matchAll(/"([a-f0-9]{12})"/g);
  const hashes = new Set<string>();
  for (const match of hashMatches) {
    hashes.add(match[1]);
  }

  it("audioMap has entries", () => {
    expect(hashes.size).toBeGreaterThan(0);
  });

  it("every audioMap hash has a corresponding mp3 file", () => {
    const audioDir = path.resolve(__dirname, "../../../public/assets/audio/phrases");
    const missing: string[] = [];
    for (const hash of hashes) {
      const filePath = path.join(audioDir, `${hash}.mp3`);
      if (!fs.existsSync(filePath)) {
        missing.push(hash);
      }
    }
    expect(missing).toEqual([]);
  });

  it("avoids unsafe tiny partial matches for long phrases", () => {
    expect(getPhraseAudioUrl("به به! اومدی بالاخره، صفا آوردی به دلمون ❤️")).toBeNull();
    expect(getPhraseAudioSequenceUrls("به به! اومدی بالاخره، صفا آوردی به دلمون ❤️")).toEqual([]);
  });
});

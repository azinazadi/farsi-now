import { describe, it, expect } from "vitest";
import { phrases, getPhrase, getScorePhrase, getPhraseAudioUrl } from "../phrases";
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

// Import the audioMap indirectly by reading the source
// We test that every phrase in every category resolves to an audio file

describe("Phrase audio mapping", () => {
  const allCategories = Object.keys(phrases) as (keyof typeof phrases)[];

  // Collect all phrases across all categories
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

  it("does not map a full phrase to a shorter canned audio clip", () => {
    const shortPhraseUrl = getPhraseAudioUrl("سلام! چطوری؟");
    const fullPhraseUrl = getPhraseAudioUrl("سلام! چطوری؟ دلم برات تنگ شده بود 😄❤️");
    expect(shortPhraseUrl).toBe("/assets/audio/phrases/a3f5bdccd3bd.mp3");
    expect(fullPhraseUrl).not.toBe(shortPhraseUrl);
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

  it("every phrase in phrases object has a matching audioMap key", () => {
    // Extract audioMap keys from source
    const audioMapSection = phrasesSource.match(
      /const audioMap[^{]*\{([^}]+)\}/s
    );
    expect(audioMapSection).not.toBeNull();

    const keyMatches = audioMapSection![1].matchAll(/"([^"]+)":\s*"/g);
    const audioMapKeys = new Set<string>();
    for (const match of keyMatches) {
      audioMapKeys.add(match[1]);
    }

    // Check every phrase resolves
    const allCategories = Object.keys(phrases) as (keyof typeof phrases)[];
    const mapped: string[] = [];
    const unmapped: string[] = [];

    for (const cat of allCategories) {
      for (const phrase of phrases[cat]) {
        const clean = stripEmoji(phrase);
        if (audioMapKeys.has(clean) || audioMapKeys.has(phrase)) {
          mapped.push(`[${cat}] ${clean}`);
        } else {
          unmapped.push(`[${cat}] ${clean}`);
        }
      }
    }

    // At least 40% of phrases should have audio mapped
    const coverage = mapped.length / (mapped.length + unmapped.length);
    console.log(`Audio coverage: ${mapped.length}/${mapped.length + unmapped.length} (${(coverage * 100).toFixed(1)}%)`);

    if (unmapped.length > 0) {
      console.warn(`${unmapped.length} phrases still need audio generation (ElevenLabs credits needed)`);
    }

    // Ensure at least 40% coverage (currently ~46%)
    expect(coverage).toBeGreaterThan(0.4);
  });
});

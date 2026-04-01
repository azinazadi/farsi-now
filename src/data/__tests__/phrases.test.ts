import { describe, it, expect } from "vitest";
import {
  phrases,
  getPhrase,
  getScorePhrase,
  getPhraseAudioUrl,
  getPhraseAudioId,
  stripEmoji,
} from "../phrases";
import * as fs from "fs";
import * as path from "path";

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

describe("100% phrase audio coverage", () => {
  const allCategories = Object.keys(phrases) as (keyof typeof phrases)[];
  const audioDir = path.resolve(
    __dirname,
    "../../../public/assets/audio/phrases"
  );

  it("EVERY phrase resolves to a numeric audio ID", () => {
    const missing: string[] = [];
    for (const cat of allCategories) {
      for (const phrase of phrases[cat]) {
        const id = getPhraseAudioId(phrase);
        if (id === null) {
          missing.push(`[${cat}] ${stripEmoji(phrase)}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it("EVERY phrase has a corresponding MP3 file on disk", () => {
    const missing: string[] = [];
    for (const cat of allCategories) {
      for (const phrase of phrases[cat]) {
        const id = getPhraseAudioId(phrase);
        if (id === null) {
          missing.push(`[${cat}] NO ID: ${stripEmoji(phrase)}`);
          continue;
        }
        const filePath = path.join(audioDir, `${id}.mp3`);
        if (!fs.existsSync(filePath)) {
          missing.push(`[${cat}] NO FILE: ${id}.mp3`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it("getPhraseAudioUrl returns a valid path for every phrase", () => {
    const missing: string[] = [];
    for (const cat of allCategories) {
      for (const phrase of phrases[cat]) {
        const url = getPhraseAudioUrl(phrase);
        if (!url) {
          missing.push(`[${cat}] ${stripEmoji(phrase)}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it("total phrase count matches manifest count", () => {
    const uniquePhrases = new Set<string>();
    for (const cat of allCategories) {
      for (const phrase of phrases[cat]) {
        uniquePhrases.add(stripEmoji(phrase).replace(/\s+/g, " ").trim());
      }
    }
    // Every unique phrase must be in the manifest
    const { phraseAudioMap } = require("../phraseAudioManifest");
    for (const clean of uniquePhrases) {
      expect(phraseAudioMap).toHaveProperty(clean);
    }
  });
});

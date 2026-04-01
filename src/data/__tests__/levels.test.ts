import { describe, it, expect } from "vitest";
import { levels, getLevelById, getWordByIndex } from "../levels";

describe("levels data", () => {
  it("has 8 levels", () => {
    expect(levels).toHaveLength(8);
  });

  it("each level has 8 words", () => {
    levels.forEach((level) => {
      expect(level.words).toHaveLength(8);
    });
  });

  it("each word has required fields", () => {
    levels.forEach((level) => {
      level.words.forEach((word) => {
        expect(word.word).toBeTruthy();
        expect(word.english).toBeTruthy();
        expect(word.transliteration).toBeTruthy();
      });
    });
  });

  it("levels have sequential IDs", () => {
    levels.forEach((level, i) => {
      expect(level.id).toBe(i + 1);
    });
  });

  it("getLevelById returns correct level", () => {
    const level = getLevelById(1);
    expect(level?.title).toBe("Greetings");
  });

  it("getLevelById returns undefined for invalid ID", () => {
    expect(getLevelById(99)).toBeUndefined();
  });

  it("getWordByIndex returns correct word", () => {
    const word = getWordByIndex(1, 0);
    expect(word?.word).toBe("سلام");
  });

  it("level 1 uses colloquial Farsi", () => {
    const level = getLevelById(1);
    const words = level!.words.map((w) => w.word);
    expect(words).toContain("آره"); // colloquial for yes
    expect(words).toContain("باشه"); // colloquial for okay
  });

  it("level 5 uses colloquial food words", () => {
    const level = getLevelById(5);
    const words = level!.words.map((w) => w.word);
    expect(words).toContain("نون"); // colloquial for bread (not نان)
    expect(words).toContain("چایی"); // colloquial for tea
  });

  it("level 8 uses colloquial number words", () => {
    const level = getLevelById(8);
    const words = level!.words.map((w) => w.word);
    expect(words).toContain("یه"); // colloquial for one
    expect(words).toContain("چار"); // colloquial for four
  });
});

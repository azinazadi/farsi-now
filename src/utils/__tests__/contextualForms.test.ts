import { describe, it, expect } from "vitest";
import {
  getContextualForm,
  analyzeWord,
  isNonJoining,
  LETTER_COLORS,
  getLetterColor,
} from "../contextualForms";

describe("getContextualForm", () => {
  it("returns correct isolated form for ب", () => {
    expect(getContextualForm("ب", "isolated")).toBe("\uFE8F");
  });

  it("returns correct initial form for ب", () => {
    expect(getContextualForm("ب", "initial")).toBe("\uFE91");
  });

  it("returns correct medial form for ب", () => {
    expect(getContextualForm("ب", "medial")).toBe("\uFE92");
  });

  it("returns correct final form for ب", () => {
    expect(getContextualForm("ب", "final")).toBe("\uFE90");
  });

  it("returns the letter itself for unknown letters", () => {
    expect(getContextualForm("x", "isolated")).toBe("x");
  });

  it("returns correct forms for all 4 positions of ن", () => {
    expect(getContextualForm("ن", "isolated")).toBe("\uFEE5");
    expect(getContextualForm("ن", "initial")).toBe("\uFEE7");
    expect(getContextualForm("ن", "medial")).toBe("\uFEE8");
    expect(getContextualForm("ن", "final")).toBe("\uFEE6");
  });
});

describe("isNonJoining", () => {
  it("identifies non-joining letters", () => {
    const nonJoiners = ["ا", "آ", "د", "ذ", "ر", "ز", "ژ", "و"];
    nonJoiners.forEach((l) => expect(isNonJoining(l)).toBe(true));
  });

  it("identifies joining letters", () => {
    const joiners = ["ب", "پ", "ت", "ث", "ج", "چ", "ح", "خ", "س", "ش"];
    joiners.forEach((l) => expect(isNonJoining(l)).toBe(false));
  });
});

describe("analyzeWord", () => {
  it("analyzes بابا correctly - initial, final, isolated, final", () => {
    const result = analyzeWord("بابا");
    expect(result).toHaveLength(4);
    // ب - initial (starts word, joins next)
    expect(result[0].letter).toBe("ب");
    expect(result[0].position).toBe("initial");
    // ا - final (after joining ب, non-joining so final)
    expect(result[1].letter).toBe("ا");
    expect(result[1].position).toBe("final");
    // ب - isolated (after non-joining ا, but is it initial? Let's check)
    // After non-joining ا, ب starts new group. Not last, so initial.
    expect(result[2].letter).toBe("ب");
    expect(result[2].position).toBe("initial");
    // ا - final
    expect(result[3].letter).toBe("ا");
    expect(result[3].position).toBe("final");
  });

  it("analyzes سلام correctly", () => {
    const result = analyzeWord("سلام");
    expect(result).toHaveLength(4);
    expect(result[0].position).toBe("initial"); // س
    expect(result[1].position).toBe("medial"); // ل
    expect(result[2].position).toBe("final"); // ا (non-joining)
    expect(result[3].position).toBe("isolated"); // م (after non-joining ا, last letter)
  });

  it("analyzes نه correctly - initial, final", () => {
    const result = analyzeWord("نه");
    expect(result).toHaveLength(2);
    expect(result[0].position).toBe("initial");
    expect(result[1].position).toBe("final");
  });

  it("handles single letter word", () => {
    // Not typical but edge case
    const result = analyzeWord("آ");
    expect(result).toHaveLength(1);
    expect(result[0].position).toBe("isolated");
  });

  it("sets joinsNext correctly", () => {
    const result = analyzeWord("بابا");
    expect(result[0].joinsNext).toBe(true); // ب joins next
    expect(result[1].joinsNext).toBe(false); // ا non-joining
    expect(result[2].joinsNext).toBe(true); // ب joins next
    expect(result[3].joinsNext).toBe(false); // ا last letter
  });

  it("handles ZWNJ in تخم‌مرغ", () => {
    const result = analyzeWord("تخم‌مرغ");
    // Should have 6 letters after removing ZWNJ
    expect(result.length).toBe(6);
  });

  it("connector lines only appear between joining letters", () => {
    const result = analyzeWord("بارون");
    // ب joins, ا doesn't, ر doesn't, و doesn't, ن last
    expect(result[0].joinsNext).toBe(true); // ب
    expect(result[1].joinsNext).toBe(false); // ا non-joining
    expect(result[2].joinsNext).toBe(false); // ر non-joining
    expect(result[3].joinsNext).toBe(false); // و non-joining
    expect(result[4].joinsNext).toBe(false); // ن last
  });
});

describe("getLetterColor", () => {
  it("cycles through colors", () => {
    expect(getLetterColor(0)).toBe(LETTER_COLORS[0]);
    expect(getLetterColor(8)).toBe(LETTER_COLORS[0]);
  });
});

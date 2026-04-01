import { describe, it, expect } from "vitest";
import { getTransliteration, allFarsiLetters } from "../transliteration";

describe("getTransliteration", () => {
  it("covers all 32 Farsi letters", () => {
    // 32 base letters (ا and آ both map to alef, plus 31 others = 33 entries but 32 unique letters)
    expect(allFarsiLetters.length).toBeGreaterThanOrEqual(32);
  });

  it("returns correct transliteration for common letters", () => {
    expect(getTransliteration("ب")).toBe("be");
    expect(getTransliteration("ن")).toBe("nun");
    expect(getTransliteration("س")).toBe("sin");
    expect(getTransliteration("م")).toBe("mim");
    expect(getTransliteration("ل")).toBe("laam");
  });

  it("returns correct transliteration for special letters", () => {
    expect(getTransliteration("ع")).toBe("eyn");
    expect(getTransliteration("غ")).toBe("gheyn");
    expect(getTransliteration("خ")).toBe("khe");
    expect(getTransliteration("ق")).toBe("qaaf");
    expect(getTransliteration("ح")).toBe("he");
    expect(getTransliteration("ص")).toBe("saad");
    expect(getTransliteration("ض")).toBe("zaad");
    expect(getTransliteration("ط")).toBe("taa");
    expect(getTransliteration("ظ")).toBe("zaa");
  });

  it("returns correct transliteration for Persian-specific letters", () => {
    expect(getTransliteration("پ")).toBe("pe");
    expect(getTransliteration("چ")).toBe("che");
    expect(getTransliteration("ژ")).toBe("zhe");
    expect(getTransliteration("ک")).toBe("kaaf");
    expect(getTransliteration("گ")).toBe("gaaf");
  });

  it("returns the letter itself for unknown input", () => {
    expect(getTransliteration("x")).toBe("x");
  });

  it("every letter used in levels has a transliteration", () => {
    // All letters that appear in level words should have transliterations
    const testLetters = ["ا", "آ", "ب", "پ", "ت", "ج", "چ", "خ", "د", "ر", "ز", "س", "ش", "ص", "ع", "غ", "ف", "ق", "ک", "گ", "ل", "م", "ن", "و", "ه", "ی"];
    testLetters.forEach((l) => {
      const result = getTransliteration(l);
      expect(result).not.toBe(l); // Should return a name, not the letter itself
    });
  });
});

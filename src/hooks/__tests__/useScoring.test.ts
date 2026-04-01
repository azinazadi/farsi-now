import { describe, it, expect } from "vitest";

// Test the scoring logic directly without hooks
describe("scoring logic", () => {
  const getStars = (overlap: number): number => {
    if (overlap >= 85) return 3;
    if (overlap >= 70) return 2;
    if (overlap >= 50) return 1;
    return 0;
  };

  it("returns 3 stars for >= 85% overlap", () => {
    expect(getStars(85)).toBe(3);
    expect(getStars(100)).toBe(3);
    expect(getStars(90)).toBe(3);
  });

  it("returns 2 stars for >= 70% overlap", () => {
    expect(getStars(70)).toBe(2);
    expect(getStars(84)).toBe(2);
  });

  it("returns 1 star for >= 50% overlap", () => {
    expect(getStars(50)).toBe(1);
    expect(getStars(69)).toBe(1);
  });

  it("returns 0 stars for < 50% overlap", () => {
    expect(getStars(0)).toBe(0);
    expect(getStars(49)).toBe(0);
  });
});

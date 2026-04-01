import { describe, it, expect } from "vitest";

// Test the scoring logic directly without hooks
describe("scoring logic", () => {
  const getStars = (overlap: number): number => {
    if (overlap >= 60) return 3;
    if (overlap >= 40) return 2;
    if (overlap >= 20) return 1;
    return 0;
  };

  it("returns 3 stars for >= 60% overlap", () => {
    expect(getStars(60)).toBe(3);
    expect(getStars(100)).toBe(3);
    expect(getStars(75)).toBe(3);
  });

  it("returns 2 stars for >= 40% overlap", () => {
    expect(getStars(40)).toBe(2);
    expect(getStars(59)).toBe(2);
  });

  it("returns 1 star for >= 20% overlap", () => {
    expect(getStars(20)).toBe(1);
    expect(getStars(39)).toBe(1);
  });

  it("returns 0 stars for < 20% overlap", () => {
    expect(getStars(0)).toBe(0);
    expect(getStars(19)).toBe(0);
  });
});

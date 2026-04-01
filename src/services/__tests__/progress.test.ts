import { describe, it, expect, beforeEach, vi } from "vitest";
import { saveProgress, loadProgress, clearProgress } from "../progress";
import { GameState } from "@/types";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

const mockState: GameState = {
  currentLevel: 1,
  currentWordIndex: 0,
  levels: {
    1: {
      unlocked: true,
      words: { "سلام": { stars: 3, attempts: 1, bestOverlap: 90, completed: true } },
      totalStars: 3,
    },
  },
  xp: 30,
  streak: 1,
  lastPlayedDate: "2024-01-01",
  isMuted: false,
};

describe("progress service", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("saves and loads state correctly", () => {
    saveProgress(mockState);
    const loaded = loadProgress();
    expect(loaded).toEqual(mockState);
  });

  it("returns null when no saved state", () => {
    expect(loadProgress()).toBeNull();
  });

  it("clears progress", () => {
    saveProgress(mockState);
    clearProgress();
    expect(loadProgress()).toBeNull();
  });

  it("handles corrupted data gracefully", () => {
    localStorageMock.setItem("farsi-learn-progress", "not-json{{{");
    expect(loadProgress()).toBeNull();
  });
});

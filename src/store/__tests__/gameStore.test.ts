import { describe, it, expect, beforeEach, vi } from "vitest";
import { useGameStore } from "../gameStore";
import { DEBUG } from "@/config/debug";

// Mock localStorage
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

describe("gameStore", () => {
  beforeEach(() => {
    localStorageMock.clear();
    useGameStore.getState().resetProgress();
  });

  it("initializes with level 1 unlocked", () => {
    expect(useGameStore.getState().isLevelUnlocked(1)).toBe(true);
  });

  it("initializes with other levels locked (when debug off)", () => {
    if (DEBUG.UNLOCK_ALL_LEVELS) return; // skip when debug flag is on
    expect(useGameStore.getState().isLevelUnlocked(2)).toBe(false);
    expect(useGameStore.getState().isLevelUnlocked(8)).toBe(false);
  });

  it("completes a word and records stars", () => {
    useGameStore.getState().completeWord(1, "سلام", 3, 90);
    const wp = useGameStore.getState().getWordProgress(1, "سلام");
    expect(wp.stars).toBe(3);
    expect(wp.bestOverlap).toBe(90);
    expect(wp.completed).toBe(true);
    expect(wp.attempts).toBe(1);
  });

  it("keeps best stars on repeated attempts", () => {
    useGameStore.getState().completeWord(1, "سلام", 3, 90);
    useGameStore.getState().completeWord(1, "سلام", 1, 55);
    const wp = useGameStore.getState().getWordProgress(1, "سلام");
    expect(wp.stars).toBe(3); // keeps best
    expect(wp.attempts).toBe(2);
  });

  it("calculates level total stars", () => {
    useGameStore.getState().completeWord(1, "سلام", 3, 90);
    useGameStore.getState().completeWord(1, "ممنون", 2, 75);
    expect(useGameStore.getState().getLevelStars(1)).toBe(5);
  });

  it("unlocks next level when enough stars earned", () => {
    // Need 12 stars from level 1 to unlock level 2
    const words = ["سلام", "ممنون", "خوبی", "بیا"];
    words.forEach((w) => useGameStore.getState().completeWord(1, w, 3, 90));
    // 4 * 3 = 12 stars
    expect(useGameStore.getState().isLevelUnlocked(2)).toBe(true);
  });

  it("does NOT unlock next level with insufficient stars (when debug off)", () => {
    if (DEBUG.UNLOCK_ALL_LEVELS) return; // skip when debug flag is on
    useGameStore.getState().completeWord(1, "سلام", 3, 90);
    useGameStore.getState().completeWord(1, "ممنون", 3, 90);
    // 6 stars < 12
    expect(useGameStore.getState().isLevelUnlocked(2)).toBe(false);
  });

  it("awards XP on word completion", () => {
    useGameStore.getState().completeWord(1, "سلام", 3, 90);
    expect(useGameStore.getState().xp).toBe(30); // 3 * 10
  });

  it("increments streak on new day", () => {
    expect(useGameStore.getState().streak).toBe(0);
    useGameStore.getState().completeWord(1, "سلام", 1, 55);
    expect(useGameStore.getState().streak).toBe(1);
  });

  it("toggles mute", () => {
    expect(useGameStore.getState().isMuted).toBe(false);
    useGameStore.getState().toggleMute();
    expect(useGameStore.getState().isMuted).toBe(true);
    useGameStore.getState().toggleMute();
    expect(useGameStore.getState().isMuted).toBe(false);
  });

  it("nextWord advances word index within level", () => {
    useGameStore.getState().setCurrentLevel(1);
    expect(useGameStore.getState().currentWordIndex).toBe(0);
    const hasMore = useGameStore.getState().nextWord();
    expect(hasMore).toBe(true);
    expect(useGameStore.getState().currentWordIndex).toBe(1);
  });

  it("nextWord returns false at end of level", () => {
    useGameStore.getState().setCurrentLevel(1);
    // Level 1 has 8 words, advance to last
    for (let i = 0; i < 7; i++) useGameStore.getState().nextWord();
    expect(useGameStore.getState().currentWordIndex).toBe(7);
    const hasMore = useGameStore.getState().nextWord();
    expect(hasMore).toBe(false);
  });

  it("resetProgress resets everything", () => {
    useGameStore.getState().completeWord(1, "سلام", 3, 90);
    useGameStore.getState().resetProgress();
    expect(useGameStore.getState().xp).toBe(0);
    expect(useGameStore.getState().getLevelStars(1)).toBe(0);
  });

  it("returns default word progress for unknown word", () => {
    const wp = useGameStore.getState().getWordProgress(1, "nonexistent");
    expect(wp.stars).toBe(0);
    expect(wp.completed).toBe(false);
  });
});

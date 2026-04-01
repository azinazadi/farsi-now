import { GameState } from "@/types";

const STORAGE_KEY = "farsi-learn-progress";

// Abstract save/load — swap to API later
export const saveProgress = (state: GameState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Failed to save progress:", e);
  }
};

export const loadProgress = (): GameState | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn("Failed to load progress:", e);
  }
  return null;
};

export const clearProgress = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

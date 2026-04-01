import { create } from "zustand";
import { GameState, LevelProgress, WordProgress } from "@/types";
import { levels } from "@/data/levels";
import { loadProgress, saveProgress } from "@/services/progress";
import { DEBUG } from "@/config/debug";

const STARS_TO_UNLOCK = 12; // stars needed from prev level to unlock next

const createInitialLevels = (): Record<number, LevelProgress> => {
  const result: Record<number, LevelProgress> = {};
  levels.forEach((level, i) => {
    const words: Record<string, WordProgress> = {};
    level.words.forEach((w) => {
      words[w.word] = { stars: 0, attempts: 0, bestOverlap: 0, completed: false };
    });
    result[level.id] = {
      unlocked: i === 0 || DEBUG.UNLOCK_ALL_LEVELS,
      words,
      totalStars: 0,
    };
  });
  return result;
};

const initialState: GameState = {
  currentLevel: 1,
  currentWordIndex: 0,
  levels: createInitialLevels(),
  xp: 0,
  streak: 0,
  lastPlayedDate: null,
  isMuted: false,
};

interface GameActions {
  setCurrentLevel: (level: number) => void;
  setCurrentWordIndex: (index: number) => void;
  completeWord: (levelId: number, word: string, stars: number, overlap: number) => void;
  nextWord: () => boolean; // returns false if level done
  toggleMute: () => void;
  resetProgress: () => void;
  loadSavedProgress: () => void;
  getWordProgress: (levelId: number, word: string) => WordProgress;
  getLevelProgress: (levelId: number) => LevelProgress;
  isLevelUnlocked: (levelId: number) => boolean;
  getLevelStars: (levelId: number) => number;
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,

  setCurrentLevel: (level) => set({ currentLevel: level, currentWordIndex: 0 }),

  setCurrentWordIndex: (index) => set({ currentWordIndex: index }),

  completeWord: (levelId, word, stars, overlap) => {
    set((state) => {
      const levelProgress = { ...state.levels[levelId] };
      const wordProgress = { ...levelProgress.words[word] };

      wordProgress.attempts += 1;
      wordProgress.completed = true;
      if (stars > wordProgress.stars) wordProgress.stars = stars;
      if (overlap > wordProgress.bestOverlap) wordProgress.bestOverlap = overlap;

      levelProgress.words = { ...levelProgress.words, [word]: wordProgress };
      levelProgress.totalStars = Object.values(levelProgress.words).reduce(
        (sum, w) => sum + w.stars,
        0
      );

      // Unlock next level if enough stars
      const nextLevelId = levelId + 1;
      const newLevels = { ...state.levels, [levelId]: levelProgress };
      if (
        newLevels[nextLevelId] &&
        !newLevels[nextLevelId].unlocked &&
        levelProgress.totalStars >= STARS_TO_UNLOCK
      ) {
        newLevels[nextLevelId] = { ...newLevels[nextLevelId], unlocked: true };
      }

      // XP and streak
      const xpGain = stars * 10;
      const today = new Date().toDateString();
      const isNewDay = state.lastPlayedDate !== today;
      const streak = isNewDay ? state.streak + 1 : state.streak;

      const newState = {
        levels: newLevels,
        xp: state.xp + xpGain,
        streak,
        lastPlayedDate: today,
      };

      // Persist
      saveProgress({ ...state, ...newState });

      return newState;
    });
  },

  nextWord: () => {
    const state = get();
    const level = levels.find((l) => l.id === state.currentLevel);
    if (!level) return false;
    if (state.currentWordIndex < level.words.length - 1) {
      set({ currentWordIndex: state.currentWordIndex + 1 });
      return true;
    }
    return false; // level complete
  },

  toggleMute: () => {
    set((state) => {
      const newMuted = !state.isMuted;
      saveProgress({ ...state, isMuted: newMuted });
      return { isMuted: newMuted };
    });
  },

  resetProgress: () => {
    const fresh = { ...initialState, levels: createInitialLevels() };
    saveProgress(fresh);
    set(fresh);
  },

  loadSavedProgress: () => {
    const saved = loadProgress();
    if (saved) {
      set(saved);
    }
  },

  getWordProgress: (levelId, word) => {
    const state = get();
    return (
      state.levels[levelId]?.words[word] || {
        stars: 0,
        attempts: 0,
        bestOverlap: 0,
        completed: false,
      }
    );
  },

  getLevelProgress: (levelId) => {
    return get().levels[levelId];
  },

  isLevelUnlocked: (levelId) => {
    return get().levels[levelId]?.unlocked || false;
  },

  getLevelStars: (levelId) => {
    return get().levels[levelId]?.totalStars || 0;
  },
}));

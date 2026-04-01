export type LetterPosition = "isolated" | "initial" | "medial" | "final";

export interface WordData {
  word: string;
  english: string;
  transliteration: string;
}

export interface LevelData {
  id: number;
  title: string;
  titleFa: string;
  theme: string;
  color: string;
  words: WordData[];
}

export interface WordProgress {
  stars: number; // 0-3
  attempts: number;
  bestOverlap: number;
  completed: boolean;
}

export interface LevelProgress {
  unlocked: boolean;
  words: Record<string, WordProgress>;
  totalStars: number;
}

export interface GameState {
  currentLevel: number;
  currentWordIndex: number;
  levels: Record<number, LevelProgress>;
  xp: number;
  streak: number;
  lastPlayedDate: string | null;
  isMuted: boolean;
}

export interface Stroke {
  points: { x: number; y: number; pressure: number }[];
}

export type MascotMood = "idle" | "happy" | "sad" | "cheering" | "dancing";

import { useCallback, useRef } from "react";
import { useGameStore } from "@/store/gameStore";
import { getLetterAudioPath, getWordAudioPath, getAudioAssetStem } from "@/utils/audioPaths";

const AUDIO_FILES_STORAGE_KEY = "admin-audio-files";

const getCustomAudio = (assetPath: string): string | null => {
  try {
    const stored = localStorage.getItem(AUDIO_FILES_STORAGE_KEY);
    if (!stored) return null;
    const audioFiles = JSON.parse(stored);
    return audioFiles[assetPath] || null;
  } catch {
    return null;
  }
};

export const useAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMuted = useGameStore((s) => s.isMuted);

  const play = useCallback(
    (src: string, customKey?: string) => {
      if (isMuted) return;
      try {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const customSrc = customKey ? getCustomAudio(customKey) : null;
        audioRef.current = new Audio(customSrc || src);
        audioRef.current.play().catch(() => {});
      } catch {}
    },
    [isMuted]
  );

  const playWordAudio = useCallback(
    (word: string) => {
      play(getWordAudioPath(word), `audio/${getAudioAssetStem(word)}`);
    },
    [play]
  );

  const playLetterAudio = useCallback(
    (letter: string) => {
      play(getLetterAudioPath(letter), `audio/letters/${getAudioAssetStem(letter)}`);
    },
    [play]
  );

  const playSound = useCallback(
    (name: "correct" | "perfect" | "fail" | "complete" | "click") => {
      play(`/assets/sounds/${name}.mp3`);
    },
    [play]
  );

  return { play, playWordAudio, playLetterAudio, playSound };
};

import { useCallback, useRef } from "react";
import { useGameStore } from "@/store/gameStore";
import { getLetterAudioPath, getWordAudioPath, getAudioAssetStem } from "@/utils/audioPaths";

const AUDIO_FILES_STORAGE_KEY = "admin-audio-files";

const getCustomAudioUrl = (path?: string): string | null => {
  if (!path) return null;
  try {
    const raw = localStorage.getItem(AUDIO_FILES_STORAGE_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, string>;
    return map[path] || null;
  } catch {
    return null;
  }
};

export const useAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMuted = useGameStore((s) => s.isMuted);

  const play = useCallback(
    (src: string, localPathKey?: string) => {
      if (isMuted) return;
      try {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        // Local-first: admin overrides in localStorage, else static asset in /public.
        const custom = getCustomAudioUrl(localPathKey);
        const audio = new Audio(custom || src);
        audioRef.current = audio;
        audio.play().catch(() => {});
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

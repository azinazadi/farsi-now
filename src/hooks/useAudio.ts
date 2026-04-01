import { useCallback, useRef } from "react";
import { useGameStore } from "@/store/gameStore";
import { getLetterAudioPath, getWordAudioPath } from "@/utils/audioPaths";

export const useAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMuted = useGameStore((s) => s.isMuted);

  const play = useCallback(
    (src: string) => {
      if (isMuted) return;
      try {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        audioRef.current = new Audio(src);
        audioRef.current.play().catch(() => {
          // Audio play failed, likely user hasn't interacted yet
        });
      } catch {
        // Audio not available
      }
    },
    [isMuted]
  );

  const playWordAudio = useCallback(
    (word: string) => {
      play(getWordAudioPath(word));
    },
    [play]
  );

  const playLetterAudio = useCallback(
    (letter: string) => {
      play(getLetterAudioPath(letter));
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

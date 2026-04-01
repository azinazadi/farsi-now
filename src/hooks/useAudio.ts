import { useCallback, useRef } from "react";
import { useGameStore } from "@/store/gameStore";
import { getLetterAudioPath, getWordAudioPath, getAudioAssetStem } from "@/utils/audioPaths";
import { getAudioUrl } from "@/services/audioStorage";

export const useAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMuted = useGameStore((s) => s.isMuted);

  const play = useCallback(
    (src: string, supabasePath?: string) => {
      if (isMuted) return;
      try {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        // Try Supabase Storage first, fall back to local assets
        const resolvedSrc = supabasePath ? getAudioUrl(supabasePath) : src;
        const audio = new Audio(resolvedSrc);
        audio.onerror = () => {
          // Fallback to local asset if Supabase file doesn't exist
          if (supabasePath && resolvedSrc !== src) {
            audioRef.current = new Audio(src);
            audioRef.current.play().catch(() => {});
          }
        };
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

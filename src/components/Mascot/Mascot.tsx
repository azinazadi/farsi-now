import { motion } from "framer-motion";
import { MascotMood } from "@/types";
import { useAudio } from "@/hooks/useAudio";
import { getPhrase, playPhraseAudio } from "@/data/phrases";
import { useGameStore } from "@/store/gameStore";
import { toast } from "sonner";
import { useCallback } from "react";

interface MascotProps {
  mood: MascotMood;
  size?: number;
}

const moodEmojis: Record<MascotMood, string> = {
  idle: "🦊",
  happy: "🎉",
  sad: "😿",
  cheering: "🥳",
  dancing: "💃",
};

const moodAnimations: Record<MascotMood, any> = {
  idle: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 2 } },
  happy: { rotate: [0, -10, 10, 0], scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.6 } },
  sad: { y: [0, 3, 0], transition: { repeat: Infinity, duration: 1.5 } },
  cheering: { y: [0, -15, 0], scale: [1, 1.2, 1], transition: { repeat: Infinity, duration: 0.5 } },
  dancing: { rotate: [0, -15, 15, -15, 0], transition: { repeat: Infinity, duration: 0.8 } },
};

const Mascot = ({ mood, size = 64 }: MascotProps) => {
  const handleClick = useCallback(() => {
    const phrase = getPhrase("greeting");
    toast(phrase, { duration: 3000 });
    playPhraseAudio(phrase, useGameStore.getState().isMuted);
  }, []);

  return (
    <motion.div
      className="select-none cursor-pointer"
      animate={moodAnimations[mood]}
      style={{ fontSize: size, lineHeight: 1 }}
      onClick={handleClick}
      whileTap={{ scale: 1.3 }}
    >
      {moodEmojis[mood]}
    </motion.div>
  );
};

export default Mascot;

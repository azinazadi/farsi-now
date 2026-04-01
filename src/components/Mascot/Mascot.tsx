import { motion } from "framer-motion";
import { MascotMood } from "@/types";

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

const moodAnimations: Record<MascotMood, object> = {
  idle: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 2 } },
  happy: { rotate: [0, -10, 10, 0], scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.6 } },
  sad: { y: [0, 3, 0], transition: { repeat: Infinity, duration: 1.5 } },
  cheering: { y: [0, -15, 0], scale: [1, 1.2, 1], transition: { repeat: Infinity, duration: 0.5 } },
  dancing: { rotate: [0, -15, 15, -15, 0], transition: { repeat: Infinity, duration: 0.8 } },
};

const Mascot = ({ mood, size = 64 }: MascotProps) => {
  return (
    <motion.div
      className="select-none"
      animate={moodAnimations[mood]}
      style={{ fontSize: size, lineHeight: 1 }}
    >
      {moodEmojis[mood]}
    </motion.div>
  );
};

export default Mascot;

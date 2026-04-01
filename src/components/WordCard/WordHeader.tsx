import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/store/gameStore";
import Mascot from "@/components/Mascot/Mascot";
import { Home, Volume2, VolumeX } from "lucide-react";
import { LevelData, MascotMood } from "@/types";

interface WordHeaderProps {
  level: LevelData;
  currentWordIndex: number;
  mascotMood: MascotMood;
}

const WordHeader = ({ level, currentWordIndex, mascotMood }: WordHeaderProps) => {
  const navigate = useNavigate();
  const { isMuted, toggleMute } = useGameStore();

  return (
    <div className="w-full max-w-lg flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <motion.button
          className="p-2 rounded-xl bg-card shadow-md min-w-[48px] min-h-[48px] flex items-center justify-center"
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/")}
        >
          <Home size={24} />
        </motion.button>
        <motion.button
          className="p-2 rounded-xl bg-card shadow-md min-w-[48px] min-h-[48px] flex items-center justify-center"
          whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </motion.button>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground font-farsi">{level.titleFa}</p>
        <p className="text-xs text-muted-foreground" dir="ltr">
          {currentWordIndex + 1} / {level.words.length}
        </p>
      </div>
      <Mascot mood={mascotMood} size={40} />
    </div>
  );
};

export default WordHeader;

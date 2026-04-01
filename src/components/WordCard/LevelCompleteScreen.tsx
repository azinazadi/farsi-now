import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/store/gameStore";
import StarsDisplay from "@/components/UI/StarsDisplay";
import Mascot from "@/components/Mascot/Mascot";
import Confetti from "@/components/UI/Confetti";
import { Home } from "lucide-react";
import { LevelData } from "@/types";
import { getPhrase, playPhraseAudio } from "@/data/phrases";
import { useState, useEffect } from "react";

interface LevelCompleteScreenProps {
  level: LevelData;
  showConfetti: boolean;
}

const LevelCompleteScreen = ({ level, showConfetti }: LevelCompleteScreenProps) => {
  const navigate = useNavigate();
  const totalStars = useGameStore.getState().getLevelStars(level.id);
  const [phrase] = useState(() => getPhrase("levelComplete"));
  const isMuted = useGameStore((s) => s.isMuted);

  useEffect(() => {
    playPhraseAudio(phrase, isMuted);
  }, [phrase, isMuted]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 gap-6">
      <Confetti show={showConfetti} />
      <Mascot mood="cheering" size={80} />
      <h2 className="text-3xl font-bold font-farsi text-foreground">{phrase}</h2>
      <p className="text-xl font-farsi text-muted-foreground">
        {level.titleFa} تموم شد!
      </p>
      <StarsDisplay stars={Math.min(3, Math.floor(totalStars / 8))} size={48} animated />
      <p className="text-lg font-farsi text-foreground">{totalStars} ⭐ جمع کردی</p>
      <motion.button
        className="game-bubble-btn bg-primary text-primary-foreground mt-4"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
      >
        <Home size={20} className="inline ml-2" />
        برگرد به نقشه
      </motion.button>
    </div>
  );
};

export default LevelCompleteScreen;

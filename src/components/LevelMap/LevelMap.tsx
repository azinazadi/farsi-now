import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { levels } from "@/data/levels";
import { useGameStore } from "@/store/gameStore";
import { getPhrase, playPhraseAudio } from "@/data/phrases";
import StarsDisplay from "@/components/UI/StarsDisplay";
import XPBar from "@/components/UI/XPBar";
import Mascot from "@/components/Mascot/Mascot";
import { Lock, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const LEVEL_COLORS = [
  "bg-game-pink",
  "bg-game-orange",
  "bg-game-green",
  "bg-game-teal",
  "bg-game-yellow",
  "bg-game-blue",
  "bg-game-purple",
  "bg-game-red",
];

const LevelMap = () => {
  const navigate = useNavigate();
  const { xp, streak, isMuted, toggleMute, isLevelUnlocked, getLevelStars } =
    useGameStore();
  const [greeting] = useState(() => getPhrase("greeting"));

  // Show greeting toast + audio on mount
  useEffect(() => {
    toast(greeting, { duration: 3000 });
    playPhraseAudio(greeting, isMuted);
  }, [greeting, isMuted]);

  const handleLockedClick = () => {
    const phrase = getPhrase("lockedLevel");
    toast(phrase, { duration: 2500 });
    playPhraseAudio(phrase, isMuted);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
      {/* Greeting banner */}
      <AnimatePresence>
        <motion.div
          className="w-full max-w-lg mb-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg font-farsi text-foreground font-bold">{greeting}</p>
        </motion.div>
      </AnimatePresence>

      {/* Header */}
      <div className="w-full max-w-lg flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Mascot mood="idle" size={48} />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-farsi text-foreground">
              بنویس بازی کن!
            </h1>
            <p className="text-sm text-muted-foreground font-farsi">
              🔥 {streak} روز پشت سر هم
            </p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
          className="p-3 rounded-xl bg-card shadow-md min-w-[48px] min-h-[48px] flex items-center justify-center"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </motion.button>
      </div>

      {/* XP Bar */}
      <div className="w-full max-w-lg mb-8">
        <XPBar xp={xp} />
      </div>

      {/* Level Grid */}
      <div className="w-full max-w-lg grid grid-cols-2 gap-4">
        {levels.map((level, i) => {
          const unlocked = isLevelUnlocked(level.id);
          const stars = getLevelStars(level.id);
          const maxStars = level.words.length * 3;

          return (
            <motion.button
              key={level.id}
              className={`relative rounded-2xl p-5 shadow-lg flex flex-col items-center gap-2 min-h-[140px] transition-all ${
                unlocked
                  ? `${LEVEL_COLORS[i % LEVEL_COLORS.length]} cursor-pointer`
                  : "bg-muted cursor-not-allowed opacity-60"
              }`}
              whileHover={unlocked ? { scale: 1.05, y: -4 } : {}}
              whileTap={unlocked ? { scale: 0.95 } : {}}
              onClick={() => unlocked ? navigate(`/level/${level.id}`) : handleLockedClick()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock size={32} className="text-muted-foreground" />
                </div>
              )}
              <span className="text-3xl font-bold text-primary-foreground">
                {level.id}
              </span>
              <span className="font-farsi font-bold text-primary-foreground text-lg">
                {level.titleFa}
              </span>
              <span className="text-sm text-primary-foreground/80 ltr">
                {level.title}
              </span>
              {unlocked && (
                <div className="mt-1">
                  <StarsDisplay stars={Math.min(3, Math.floor(stars / 8))} size={20} />
                </div>
              )}
              {unlocked && (
                <span className="text-xs text-primary-foreground/70">
                  {stars}/{maxStars} ⭐
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default LevelMap;

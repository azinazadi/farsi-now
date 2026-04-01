import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getLevelById } from "@/data/levels";
import { useGameStore } from "@/store/gameStore";
import { useAudio } from "@/hooks/useAudio";
import TracingCanvas from "@/components/Canvas/TracingCanvas";
import LetterBreakdown from "@/components/LetterBreakdown/LetterBreakdown";
import StarsDisplay from "@/components/UI/StarsDisplay";
import Mascot from "@/components/Mascot/Mascot";
import Confetti from "@/components/UI/Confetti";
import { MascotMood } from "@/types";
import { ArrowRight, Home, Volume2 } from "lucide-react";

const WordCard = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const level = getLevelById(Number(levelId));

  const {
    currentWordIndex,
    setCurrentWordIndex,
    completeWord,
    setCurrentLevel,
  } = useGameStore();

  const { playWordAudio, playSound } = useAudio();
  const [mascotMood, setMascotMood] = useState<MascotMood>("idle");
  const [showResult, setShowResult] = useState(false);
  const [lastStars, setLastStars] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);

  const word = level?.words[currentWordIndex];

  useEffect(() => {
    if (level) {
      setCurrentLevel(level.id);
      setCurrentWordIndex(0);
    }
  }, [level, setCurrentLevel, setCurrentWordIndex]);

  useEffect(() => {
    if (word) {
      playWordAudio(word.word);
      setMascotMood("idle");
      setShowResult(false);
      setAttempts(0);
    }
  }, [word, playWordAudio]);

  const handleScore = useCallback(
    (overlap: number, stars: number) => {
      if (!word || !level) return;

      setLastStars(stars);
      setShowResult(true);

      if (stars >= 1) {
        completeWord(level.id, word.word, stars, overlap);
        if (stars === 3) {
          setMascotMood("dancing");
          playSound("perfect");
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2500);
        } else {
          setMascotMood("happy");
          playSound("correct");
        }
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 3) {
          // Auto-advance with 0 stars
          completeWord(level.id, word.word, 0, overlap);
          setMascotMood("sad");
          playSound("fail");
        } else {
          setMascotMood("sad");
          playSound("fail");
        }
      }
    },
    [word, level, completeWord, playSound, attempts]
  );

  const handleNext = useCallback(() => {
    if (!level) return;
    if (currentWordIndex < level.words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      setLevelComplete(true);
      setMascotMood("cheering");
      setShowConfetti(true);
      playSound("complete");
    }
  }, [level, currentWordIndex, setCurrentWordIndex, playSound]);

  const canAdvance = showResult && (lastStars >= 1 || attempts >= 3);

  if (!level || !word) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground font-farsi text-xl">مرحله پیدا نشد!</p>
      </div>
    );
  }

  if (levelComplete) {
    const totalStars = useGameStore.getState().getLevelStars(level.id);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 gap-6">
        <Confetti show={showConfetti} />
        <Mascot mood="cheering" size={80} />
        <h2 className="text-3xl font-bold font-farsi text-foreground">آفرین! 🎉</h2>
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
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
      <Confetti show={showConfetti} />

      {/* Header */}
      <div className="w-full max-w-lg flex items-center justify-between mb-4">
        <motion.button
          className="p-2 rounded-xl bg-card shadow-md"
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/")}
        >
          <Home size={24} />
        </motion.button>
        <div className="text-center">
          <p className="text-sm text-muted-foreground font-farsi">{level.titleFa}</p>
          <p className="text-xs text-muted-foreground ltr">
            {currentWordIndex + 1} / {level.words.length}
          </p>
        </div>
        <Mascot mood={mascotMood} size={40} />
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-6 ltr">
        {level.words.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i === currentWordIndex
                ? "bg-primary scale-125"
                : i < currentWordIndex
                ? "bg-game-green"
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Word display */}
      <motion.div
        key={word.word}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-4"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <h2 className="text-4xl md:text-5xl font-bold font-farsi text-foreground">
            {word.word}
          </h2>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => playWordAudio(word.word)}
            className="p-2 rounded-full bg-card shadow-md"
          >
            <Volume2 size={20} />
          </motion.button>
        </div>
        <p className="text-sm text-muted-foreground ltr">{word.english}</p>
      </motion.div>

      {/* Canvas */}
      <div className="w-full max-w-lg mb-4">
        <TracingCanvas word={word.word} onScore={handleScore} />
      </div>

      {/* Result */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 mb-4"
          >
            <StarsDisplay stars={lastStars} animated />
            {lastStars === 0 && attempts < 3 && (
              <p className="font-farsi text-muted-foreground">دوباره امتحان کن!</p>
            )}
            {canAdvance && (
              <motion.button
                className="game-bubble-btn bg-primary text-primary-foreground"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
              >
                بعدی
                <ArrowRight size={20} className="inline mr-2" />
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letter Breakdown */}
      <div className="w-full max-w-lg">
        <LetterBreakdown word={word.word} />
      </div>
    </div>
  );
};

export default WordCard;

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
import WordHeader from "@/components/WordCard/WordHeader";
import WordDisplay from "@/components/WordCard/WordDisplay";
import LevelCompleteScreen from "@/components/WordCard/LevelCompleteScreen";
import { MascotMood } from "@/types";
import { ArrowRight } from "lucide-react";
import { getScorePhrase } from "@/data/phrases";
import { toast } from "sonner";

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
    return (
      <LevelCompleteScreen
        level={level}
        showConfetti={showConfetti}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
      <Confetti show={showConfetti} />

      <WordHeader
        level={level}
        currentWordIndex={currentWordIndex}
        mascotMood={mascotMood}
      />

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-6" dir="ltr">
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

      <WordDisplay word={word} onPlayAudio={() => playWordAudio(word.word)} />

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

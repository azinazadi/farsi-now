import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { WordData } from "@/types";
import { getAudioAssetStem } from "@/utils/audioPaths";

interface WordDisplayProps {
  word: WordData;
  onPlayAudio: () => void;
}

const WordDisplay = ({ word, onPlayAudio }: WordDisplayProps) => {
  return (
    <motion.div
      key={word.word}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center mb-4"
    >
      {/* Word image */}
      <div className="mb-3 flex justify-center">
        <img
          src={`/assets/images/${getAudioAssetStem(word.word)}.png`}
          alt={word.english}
          className="w-40 h-40 md:w-48 md:h-48 object-contain rounded-2xl"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      <div className="flex items-center justify-center gap-3 mb-2">
        <h2 className="text-4xl md:text-5xl font-bold font-farsi text-foreground">
          {word.word}
        </h2>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onPlayAudio}
          className="p-2 rounded-full bg-card shadow-md min-w-[48px] min-h-[48px] flex items-center justify-center"
        >
          <Volume2 size={20} />
        </motion.button>
      </div>
      <p className="text-sm text-muted-foreground" dir="ltr">{word.english}</p>
    </motion.div>
  );
};

export default WordDisplay;

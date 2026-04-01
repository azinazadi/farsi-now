import { motion } from "framer-motion";
import { analyzeWord, getLetterColor } from "@/utils/contextualForms";
import { getTransliteration } from "@/utils/transliteration";
import { useAudio } from "@/hooks/useAudio";

interface LetterBreakdownProps {
  word: string;
}

const LetterBreakdown = ({ word }: LetterBreakdownProps) => {
  const analysis = analyzeWord(word);
  const { playLetterAudio } = useAudio();

  return (
    <div className="flex flex-row-reverse items-center justify-center gap-1 flex-wrap mt-4">
      {analysis.map((item, i) => (
        <div key={i} className="flex items-center flex-row-reverse">
          <motion.button
            className="letter-tile bg-card shadow-md"
            onClick={() => playLetterAudio(item.letter)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95, y: -4 }}
            style={{ borderColor: `hsl(${getLetterColor(i)})`, borderWidth: 2 }}
          >
            <span
              className="font-farsi text-2xl md:text-3xl leading-none"
              style={{ color: `hsl(${getLetterColor(i)})` }}
            >
              {item.contextualForm}
            </span>
            <span className="text-xs text-muted-foreground ltr mt-1">
              {getTransliteration(item.letter)}
            </span>
          </motion.button>
          {/* Connector line */}
          {item.joinsNext && i < analysis.length - 1 && (
            <div
              className="w-4 border-t-2 border-dashed"
              style={{ borderColor: `hsl(${getLetterColor(i)})` }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default LetterBreakdown;

import { LetterPosition } from "@/types";

// Non-joining letters: they don't connect to the next letter
const NON_JOINING_LETTERS = new Set(["ا", "آ", "د", "ذ", "ر", "ز", "ژ", "و"]);

export const isNonJoining = (letter: string): boolean =>
  NON_JOINING_LETTERS.has(letter);

// Unicode Arabic Presentation Forms mappings
// Format: [isolated, initial, medial, final]
const presentationForms: Record<string, [string, string, string, string]> = {
  "ا": ["\uFE8D", "\uFE8D", "\uFE8E", "\uFE8E"],
  "آ": ["\uFE81", "\uFE81", "\uFE82", "\uFE82"],
  "ب": ["\uFE8F", "\uFE91", "\uFE92", "\uFE90"],
  "پ": ["\uFB56", "\uFB58", "\uFB59", "\uFB57"],
  "ت": ["\uFE95", "\uFE97", "\uFE98", "\uFE96"],
  "ث": ["\uFE99", "\uFE9B", "\uFE9C", "\uFE9A"],
  "ج": ["\uFE9D", "\uFE9F", "\uFEA0", "\uFE9E"],
  "چ": ["\uFB7A", "\uFB7C", "\uFB7D", "\uFB7B"],
  "ح": ["\uFEA1", "\uFEA3", "\uFEA4", "\uFEA2"],
  "خ": ["\uFEA5", "\uFEA7", "\uFEA8", "\uFEA6"],
  "د": ["\uFEA9", "\uFEA9", "\uFEAA", "\uFEAA"],
  "ذ": ["\uFEAB", "\uFEAB", "\uFEAC", "\uFEAC"],
  "ر": ["\uFEAD", "\uFEAD", "\uFEAE", "\uFEAE"],
  "ز": ["\uFEAF", "\uFEAF", "\uFEB0", "\uFEB0"],
  "ژ": ["\uFB8A", "\uFB8A", "\uFB8B", "\uFB8B"],
  "س": ["\uFEB1", "\uFEB3", "\uFEB4", "\uFEB2"],
  "ش": ["\uFEB5", "\uFEB7", "\uFEB8", "\uFEB6"],
  "ص": ["\uFEB9", "\uFEBB", "\uFEBC", "\uFEBA"],
  "ض": ["\uFEBD", "\uFEBF", "\uFEC0", "\uFEBE"],
  "ط": ["\uFEC1", "\uFEC3", "\uFEC4", "\uFEC2"],
  "ظ": ["\uFEC5", "\uFEC7", "\uFEC8", "\uFEC6"],
  "ع": ["\uFEC9", "\uFECB", "\uFECC", "\uFECA"],
  "غ": ["\uFECD", "\uFECF", "\uFED0", "\uFECE"],
  "ف": ["\uFED1", "\uFED3", "\uFED4", "\uFED2"],
  "ق": ["\uFED5", "\uFED7", "\uFED8", "\uFED6"],
  "ک": ["\uFB8E", "\uFB90", "\uFB91", "\uFB8F"],
  "گ": ["\uFB92", "\uFB94", "\uFB95", "\uFB93"],
  "ل": ["\uFEDD", "\uFEDF", "\uFEE0", "\uFEDE"],
  "م": ["\uFEE1", "\uFEE3", "\uFEE4", "\uFEE2"],
  "ن": ["\uFEE5", "\uFEE7", "\uFEE8", "\uFEE6"],
  "و": ["\uFEED", "\uFEED", "\uFEEE", "\uFEEE"],
  "ه": ["\uFEE9", "\uFEEB", "\uFEEC", "\uFEEA"],
  "ی": ["\uFBFC", "\uFBFE", "\uFBFF", "\uFBFD"],
};

const positionIndex: Record<LetterPosition, number> = {
  isolated: 0,
  initial: 1,
  medial: 2,
  final: 3,
};

export const getContextualForm = (
  letter: string,
  position: LetterPosition
): string => {
  const forms = presentationForms[letter];
  if (!forms) return letter;
  return forms[positionIndex[position]];
};

// Analyze a word and return letters with their contextual positions
export interface LetterAnalysis {
  letter: string;
  position: LetterPosition;
  contextualForm: string;
  joinsNext: boolean;
}

export const analyzeWord = (word: string): LetterAnalysis[] => {
  // Remove zero-width non-joiner and other invisible chars, but keep letters
  const cleanWord = word.replace(/\u200C/g, ""); // remove ZWNJ
  const letters = Array.from(cleanWord).filter(
    (ch) => presentationForms[ch] !== undefined
  );

  const result: LetterAnalysis[] = [];

  for (let i = 0; i < letters.length; i++) {
    const letter = letters[i];
    const prevLetter = i > 0 ? letters[i - 1] : null;
    const isFirst = i === 0;
    const isLast = i === letters.length - 1;

    // Can the previous letter connect forward (to this letter)?
    const prevConnects = prevLetter ? !isNonJoining(prevLetter) : false;

    // Determine position
    let position: LetterPosition;
    if (isFirst && isLast) {
      position = "isolated";
    } else if (isFirst || !prevConnects) {
      // Start of a new connected group
      if (isLast || isNonJoining(letter)) {
        position = "isolated";
      } else {
        position = "initial";
      }
    } else if (isLast || isNonJoining(letter)) {
      position = "final";
    } else {
      position = "medial";
    }

    const joinsNext = !isLast && !isNonJoining(letter);

    result.push({
      letter,
      position,
      contextualForm: getContextualForm(letter, position),
      joinsNext,
    });
  }

  return result;
};

// Letter color palette (indices cycle)
export const LETTER_COLORS = [
  "var(--letter-1)",
  "var(--letter-2)",
  "var(--letter-3)",
  "var(--letter-4)",
  "var(--letter-5)",
  "var(--letter-6)",
  "var(--letter-7)",
  "var(--letter-8)",
];

export const getLetterColor = (index: number): string =>
  LETTER_COLORS[index % LETTER_COLORS.length];

// Maps each Farsi letter to its latin transliteration name
const transliterationMap: Record<string, string> = {
  "ا": "alef",
  "آ": "alef",
  "ب": "be",
  "پ": "pe",
  "ت": "te",
  "ث": "se",
  "ج": "jim",
  "چ": "che",
  "ح": "he",
  "خ": "khe",
  "د": "daal",
  "ذ": "zaal",
  "ر": "re",
  "ز": "ze",
  "ژ": "zhe",
  "س": "sin",
  "ش": "shin",
  "ص": "saad",
  "ض": "zaad",
  "ط": "taa",
  "ظ": "zaa",
  "ع": "eyn",
  "غ": "gheyn",
  "ف": "fe",
  "ق": "qaaf",
  "ک": "kaaf",
  "گ": "gaaf",
  "ل": "laam",
  "م": "mim",
  "ن": "nun",
  "و": "vaav",
  "ه": "he",
  "ی": "ye",
};

export const getTransliteration = (letter: string): string => {
  return transliterationMap[letter] || letter;
};

export const allFarsiLetters = Object.keys(transliterationMap);

export const getAudioAssetStem = (value: string): string => {
  const trimmed = value.trim();

  if (!trimmed) return "";
  if (/^[A-Za-z0-9_-]+$/.test(trimmed)) return trimmed;

  return Array.from(trimmed)
    .map((char) => {
      const codePoint = char.codePointAt(0);
      return `u${(codePoint ?? 0).toString(16).padStart(4, "0")}`;
    })
    .join("-");
};

export const getWordAudioPath = (word: string): string => `/assets/audio/${getAudioAssetStem(word)}.mp3`;

export const getLetterAudioPath = (letter: string): string => `/assets/audio/letters/${getAudioAssetStem(letter)}.mp3`;

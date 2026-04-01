import { describe, it, expect } from "vitest";
import { levels } from "@/data/levels";
import { allFarsiLetters } from "@/utils/transliteration";
import * as fs from "fs";
import * as path from "path";

const ASSETS_DIR = path.resolve(__dirname, "../../public/assets");

describe("asset checks", () => {
  it("every word has an audio file", () => {
    const missing: string[] = [];
    levels.forEach((level) => {
      level.words.forEach((word) => {
        const audioPath = path.join(ASSETS_DIR, "audio", `${word.word}.mp3`);
        if (!fs.existsSync(audioPath)) missing.push(word.word);
      });
    });
    expect(missing).toEqual([]);
  });

  it("every word has an image file", () => {
    const missing: string[] = [];
    levels.forEach((level) => {
      level.words.forEach((word) => {
        const imgPath = path.join(ASSETS_DIR, "images", `${word.word}.png`);
        if (!fs.existsSync(imgPath)) missing.push(word.word);
      });
    });
    expect(missing).toEqual([]);
  });

  it("every Farsi letter has an audio file", () => {
    const missing: string[] = [];
    allFarsiLetters.forEach((letter) => {
      const audioPath = path.join(ASSETS_DIR, "audio", "letters", `${letter}.mp3`);
      if (!fs.existsSync(audioPath)) missing.push(letter);
    });
    expect(missing).toEqual([]);
  });

  it("sound effect files exist", () => {
    const sounds = ["correct", "perfect", "fail", "complete", "click"];
    const missing: string[] = [];
    sounds.forEach((s) => {
      const p = path.join(ASSETS_DIR, "sounds", `${s}.mp3`);
      if (!fs.existsSync(p)) missing.push(s);
    });
    expect(missing).toEqual([]);
  });
});

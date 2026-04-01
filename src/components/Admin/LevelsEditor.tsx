import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, ChevronDown, ChevronRight, Download, Upload } from "lucide-react";
import AudioRecorderButton from "./AudioRecorderButton";
import { toast } from "sonner";
import { getAudioAssetStem, getWordAudioPath } from "@/utils/audioPaths";

interface WordData {
  word: string;
  english: string;
  transliteration: string;
}

interface LevelData {
  id: number;
  title: string;
  titleFa: string;
  theme: string;
  color: string;
  words: WordData[];
}

interface LevelsEditorProps {
  levels: LevelData[];
  onLevelsChange: (levels: LevelData[]) => void;
  onAudioSave: (blob: Blob, path: string) => void;
}

const COLORS = ["game-pink", "game-orange", "game-green", "game-teal", "game-yellow", "game-blue", "game-purple", "game-red"];

const LevelsEditor = ({ levels, onLevelsChange, onAudioSave }: LevelsEditorProps) => {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);

  const updateLevel = (idx: number, field: keyof LevelData, value: string) => {
    const updated = [...levels];
    (updated[idx] as any)[field] = value;
    onLevelsChange(updated);
  };

  const updateWord = (levelIdx: number, wordIdx: number, field: keyof WordData, value: string) => {
    const updated = [...levels];
    updated[levelIdx].words[wordIdx][field] = value;
    onLevelsChange(updated);
  };

  const addWord = (levelIdx: number) => {
    const updated = [...levels];
    updated[levelIdx].words.push({ word: "", english: "", transliteration: "" });
    onLevelsChange(updated);
  };

  const removeWord = (levelIdx: number, wordIdx: number) => {
    const updated = [...levels];
    updated[levelIdx].words.splice(wordIdx, 1);
    onLevelsChange(updated);
  };

  const addLevel = () => {
    const newId = Math.max(0, ...levels.map((l) => l.id)) + 1;
    onLevelsChange([
      ...levels,
      { id: newId, title: "New Level", titleFa: "", theme: "new", color: COLORS[newId % COLORS.length], words: [] },
    ]);
  };

  const removeLevel = (idx: number) => {
    const updated = [...levels];
    updated.splice(idx, 1);
    onLevelsChange(updated);
  };

  const exportLevels = () => {
    const blob = new Blob([JSON.stringify(levels, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "levels.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Levels exported!");
  };

  const importLevels = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (Array.isArray(data)) {
          onLevelsChange(data);
          toast.success("Levels imported!");
        }
      } catch {
        toast.error("Invalid JSON file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button onClick={addLevel} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Level
        </Button>
        <Button onClick={exportLevels} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-1" /> Export JSON
        </Button>
        <label>
          <Button variant="outline" size="sm" asChild>
            <span>
              <Upload className="h-4 w-4 mr-1" /> Import JSON
            </span>
          </Button>
          <input type="file" accept=".json" className="hidden" onChange={importLevels} />
        </label>
      </div>

      {levels.map((level, levelIdx) => (
        <Card key={level.id} className="p-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setExpandedLevel(expandedLevel === levelIdx ? null : levelIdx)}
          >
            {expandedLevel === levelIdx ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span className="font-bold text-lg">
              Level {level.id}: {level.title}
            </span>
            <span className="text-muted-foreground text-sm">({level.words.length} words)</span>
            <Button
              size="sm"
              variant="ghost"
              className="ml-auto text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                removeLevel(levelIdx);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {expandedLevel === levelIdx && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">Title (English)</label>
                  <Input value={level.title} onChange={(e) => updateLevel(levelIdx, "title", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Title (Farsi)</label>
                  <Input
                    value={level.titleFa}
                    onChange={(e) => updateLevel(levelIdx, "titleFa", e.target.value)}
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Theme</label>
                  <Input value={level.theme} onChange={(e) => updateLevel(levelIdx, "theme", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Color</label>
                  <select
                    className="w-full border rounded px-2 py-1.5 text-sm"
                    value={level.color}
                    onChange={(e) => updateLevel(levelIdx, "color", e.target.value)}
                  >
                    {COLORS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Words</h4>
                {level.words.map((word, wordIdx) => {
                  const wordStem = getAudioAssetStem(word.word);

                  return (
                    <Card key={wordIdx} className="p-3 bg-muted/50">
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <div>
                          <label className="text-xs text-muted-foreground">Farsi</label>
                          <Input
                            value={word.word}
                            onChange={(e) => updateWord(levelIdx, wordIdx, "word", e.target.value)}
                            dir="rtl"
                            className="font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">English</label>
                          <Input
                            value={word.english}
                            onChange={(e) => updateWord(levelIdx, wordIdx, "english", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Transliteration</label>
                          <Input
                            value={word.transliteration}
                            onChange={(e) => updateWord(levelIdx, wordIdx, "transliteration", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <AudioRecorderButton
                          label="Word Audio"
                          currentAudioUrl={word.word ? getWordAudioPath(word.word) : undefined}
                          onSave={(blob) => onAudioSave(blob, `audio/${wordStem}`)}
                          filename={wordStem ? `${wordStem}.mp3` : ""}
                        />
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => removeWord(levelIdx, wordIdx)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
                <Button size="sm" variant="outline" onClick={() => addWord(levelIdx)}>
                  <Plus className="h-3 w-3 mr-1" /> Add Word
                </Button>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default LevelsEditor;

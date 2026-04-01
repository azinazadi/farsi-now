import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, ChevronDown, ChevronRight, Download, Upload } from "lucide-react";
import AudioRecorderButton from "./AudioRecorderButton";
import { toast } from "sonner";

interface PhrasesData {
  [category: string]: string[];
}

interface PhrasesEditorProps {
  phrases: PhrasesData;
  onPhrasesChange: (phrases: PhrasesData) => void;
  audioMap: Record<string, string>;
  onAudioMapChange: (map: Record<string, string>) => void;
  onAudioSave: (blob: Blob, path: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  greeting: "🏠 Opening the app",
  perfect: "⭐⭐⭐ Perfect (3 stars)",
  twoStars: "⭐⭐ Good (2 stars)",
  oneStar: "⭐ Okay (1 star)",
  fail: "❌ Failed (0 stars)",
  levelComplete: "🎉 Level Complete",
  lockedLevel: "🔒 Locked Level",
};

const PhrasesEditor = ({ phrases, onPhrasesChange, audioMap, onAudioMapChange, onAudioSave }: PhrasesEditorProps) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories = Object.keys(phrases);

  const updatePhrase = (category: string, idx: number, value: string) => {
    const updated = { ...phrases };
    updated[category] = [...updated[category]];
    updated[category][idx] = value;
    onPhrasesChange(updated);
  };

  const addPhrase = (category: string) => {
    const updated = { ...phrases };
    updated[category] = [...updated[category], ""];
    onPhrasesChange(updated);
  };

  const removePhrase = (category: string, idx: number) => {
    const updated = { ...phrases };
    updated[category] = updated[category].filter((_, i) => i !== idx);
    onPhrasesChange(updated);
  };

  const stripEmoji = (text: string): string =>
    text.replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FEFF}]|[\u200D\uFE0F]|[😊😍😂😈😜😋🤗⚡🌟🌸🚀🐥🐶💪🎉🔥👏🛡️🌠📱☕🗝️🔑💃🍰🧠🖼️😎🦇]/gu, '').trim();

  const getAudioUrlForPhrase = (phrase: string): string | undefined => {
    const clean = stripEmoji(phrase);
    const hash = audioMap[clean] || audioMap[phrase];
    return hash ? `/assets/audio/phrases/${hash}.mp3` : undefined;
  };

  const exportPhrases = () => {
    const blob = new Blob([JSON.stringify({ phrases, audioMap }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "phrases.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Phrases exported!");
  };

  const importPhrases = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.phrases) onPhrasesChange(data.phrases);
        if (data.audioMap) onAudioMapChange(data.audioMap);
        toast.success("Phrases imported!");
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
        <Button onClick={exportPhrases} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-1" /> Export JSON
        </Button>
        <label>
          <Button variant="outline" size="sm" asChild>
            <span>
              <Upload className="h-4 w-4 mr-1" /> Import JSON
            </span>
          </Button>
          <input type="file" accept=".json" className="hidden" onChange={importPhrases} />
        </label>
      </div>

      {categories.map((category) => (
        <Card key={category} className="p-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
          >
            {expandedCategory === category ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span className="font-bold">{CATEGORY_LABELS[category] || category}</span>
            <span className="text-muted-foreground text-sm">({phrases[category].length} phrases)</span>
          </div>

          {expandedCategory === category && (
            <div className="mt-3 space-y-2">
              {phrases[category].map((phrase, idx) => (
                <Card key={idx} className="p-3 bg-muted/50">
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={phrase}
                      onChange={(e) => updatePhrase(category, idx, e.target.value)}
                      dir="rtl"
                      className="flex-1"
                    />
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => removePhrase(category, idx)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <AudioRecorderButton
                    label="Audio"
                    currentAudioUrl={getAudioUrlForPhrase(phrase)}
                    onSave={(blob) => {
                      const hash = Math.random().toString(36).substring(2, 14);
                      const clean = stripEmoji(phrase);
                      const newMap = { ...audioMap, [clean]: hash };
                      onAudioMapChange(newMap);
                      onAudioSave(blob, `audio/phrases/${hash}`);
                    }}
                    filename={`phrase_${idx}.mp3`}
                  />
                </Card>
              ))}
              <Button size="sm" variant="outline" onClick={() => addPhrase(category)}>
                <Plus className="h-3 w-3 mr-1" /> Add Phrase
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default PhrasesEditor;

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LevelsEditor from "@/components/Admin/LevelsEditor";
import PhrasesEditor from "@/components/Admin/PhrasesEditor";
import LettersEditor from "@/components/Admin/LettersEditor";
import { levels as defaultLevels } from "@/data/levels";
import { phrases as defaultPhrases } from "@/data/phrases";
import { toast } from "sonner";

const LEVELS_STORAGE_KEY = "admin-levels";
const PHRASES_STORAGE_KEY = "admin-phrases";
const AUDIO_MAP_STORAGE_KEY = "admin-audio-map";
const AUDIO_FILES_STORAGE_KEY = "admin-audio-files";
const PHONETICS_STORAGE_KEY = "admin-phonetics";
const AUDIO_MAP_STORAGE_KEY = "admin-audio-map";
const AUDIO_FILES_STORAGE_KEY = "admin-audio-files";

// Default audio map from phrases.ts (extracted)
const defaultAudioMap: Record<string, string> = {
  "سلام! چطوری؟": "a3f5bdccd3bd",
  "سلام عزیزم! خوبی؟": "9dd9329d50db",
  "هی! حالت چطوره؟": "86dc529dc82e",
  "خوش اومدی! دلم برات تنگ شده بود": "4331a30bd5fe",
  "سلام قهرمان! آماده‌ای؟": "00456c4ee1a6",
  "به به! خوشحالم که اومدی!": "fae5a422fac4",
  "سلام خوشگلم! بزن بریم!": "86015abe860d",
  "چه خوب که برگشتی!": "ceaa8abb3687",
  "سلام گل من! امروز چیکار می‌کنی که اینقدر باحالی؟": "3800bae7a2cc",
  "هی رفیق! اومدی که دنیا رو فتح کنیم؟": "ab9a274e7b7f",
  "خوش اومدی ستاره! بدون تو اپ مات و مبهوته": "a2348db958ce",
  "سلام جوجه قهرمان! بریم یه ماجراجویی دیگه؟": "06f24e8a551d",
  "به به به! اومدی که دوباره همه رو گاز بگیری؟": "a2ca43405abe",
  "سلام! آماده‌ای امروز مغزتو شارژ کنی یا فقط اومدی لبخند بزنی؟": "cc80a4557b7f",
};

const AdminPage = () => {
  const navigate = useNavigate();

  const [levels, setLevels] = useState(() => {
    try {
      const saved = localStorage.getItem(LEVELS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [...defaultLevels];
    } catch {
      return [...defaultLevels];
    }
  });

  const [phrases, setPhrases] = useState(() => {
    try {
      const saved = localStorage.getItem(PHRASES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : { ...defaultPhrases };
    } catch {
      return { ...defaultPhrases };
    }
  });

  const [audioMap, setAudioMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(AUDIO_MAP_STORAGE_KEY);
      return saved ? JSON.parse(saved) : { ...defaultAudioMap };
    } catch {
      return { ...defaultAudioMap };
    }
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(LEVELS_STORAGE_KEY, JSON.stringify(levels));
  }, [levels]);

  useEffect(() => {
    localStorage.setItem(PHRASES_STORAGE_KEY, JSON.stringify(phrases));
  }, [phrases]);

  useEffect(() => {
    localStorage.setItem(AUDIO_MAP_STORAGE_KEY, JSON.stringify(audioMap));
  }, [audioMap]);

  const handleAudioSave = (blob: Blob, path: string) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const audioFiles = JSON.parse(localStorage.getItem(AUDIO_FILES_STORAGE_KEY) || "{}");
        audioFiles[path] = reader.result;
        localStorage.setItem(AUDIO_FILES_STORAGE_KEY, JSON.stringify(audioFiles));
        toast.success(`Audio saved for: ${path.split("/").pop()}`);
      } catch {
        toast.error("Failed to save audio - storage may be full");
      }
    };
    reader.readAsDataURL(blob);
  };

  const exportAll = () => {
    const data = {
      levels,
      phrases,
      audioMap,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `farsi-app-config-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Full config exported!");
  };

  return (
    <div className="min-h-screen bg-background p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold flex-1">Admin Panel</h1>
        <Button variant="outline" size="sm" onClick={exportAll}>
          <Download className="h-4 w-4 mr-1" /> Export All
        </Button>
      </div>

      <Tabs defaultValue="levels" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="levels">Levels & Words</TabsTrigger>
          <TabsTrigger value="phrases">Phrases</TabsTrigger>
          <TabsTrigger value="letters">Letters</TabsTrigger>
        </TabsList>

        <TabsContent value="levels" className="mt-4">
          <LevelsEditor levels={levels} onLevelsChange={setLevels} onAudioSave={handleAudioSave} />
        </TabsContent>

        <TabsContent value="phrases" className="mt-4">
          <PhrasesEditor
            phrases={phrases}
            onPhrasesChange={setPhrases}
            audioMap={audioMap}
            onAudioMapChange={setAudioMap}
            onAudioSave={handleAudioSave}
          />
        </TabsContent>

        <TabsContent value="letters" className="mt-4">
          <LettersEditor onAudioSave={handleAudioSave} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;

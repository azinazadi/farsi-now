import { Card } from "@/components/ui/card";
import AudioRecorderButton from "./AudioRecorderButton";
import { allFarsiLetters, getTransliteration } from "@/utils/transliteration";

interface LettersEditorProps {
  onAudioSave: (blob: Blob, path: string) => void;
}

const LettersEditor = ({ onAudioSave }: LettersEditorProps) => {
  // Deduplicate letters (alef/alef with hamza share transliteration)
  const uniqueLetters = [...new Set(allFarsiLetters)];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Record or upload audio pronunciation for each Farsi letter. These are played when users tap on individual letters
        in the letter breakdown view.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {uniqueLetters.map((letter) => (
          <Card key={letter} className="p-3 flex items-center gap-3">
            <span className="text-3xl font-bold w-12 text-center" dir="rtl">
              {letter}
            </span>
            <span className="text-sm text-muted-foreground w-12">{getTransliteration(letter)}</span>
            <div className="flex-1">
              <AudioRecorderButton
                label=""
                currentAudioUrl={`/assets/audio/letters/${letter}.mp3`}
                onSave={(blob) => onAudioSave(blob, `audio/letters/${letter}`)}
                filename={`${letter}.mp3`}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LettersEditor;

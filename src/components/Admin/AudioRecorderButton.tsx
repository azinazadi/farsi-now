import { Mic, Square, Play, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useRef } from "react";

interface AudioRecorderButtonProps {
  label: string;
  currentAudioUrl?: string;
  onSave: (blob: Blob, filename: string) => void;
  filename: string;
}

const AudioRecorderButton = ({ label, currentAudioUrl, onSave, filename }: AudioRecorderButtonProps) => {
  const { isRecording, audioBlob, audioUrl, startRecording, stopRecording, clearRecording } = useAudioRecorder();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePlay = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch(() => {});
  };

  const handleSave = () => {
    if (audioBlob) {
      onSave(audioBlob, filename);
      clearRecording();
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSave(file, filename);
    }
    e.target.value = "";
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium min-w-[80px]">{label}</span>

      {currentAudioUrl && (
        <Button size="sm" variant="outline" onClick={() => handlePlay(currentAudioUrl)} title="Play current">
          <Play className="h-3 w-3" />
        </Button>
      )}

      {!isRecording && !audioUrl && (
        <>
          <Button size="sm" variant="outline" onClick={startRecording} title="Record">
            <Mic className="h-3 w-3 text-red-500" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} title="Upload">
            <Upload className="h-3 w-3" />
          </Button>
          <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={handleUpload} />
        </>
      )}

      {isRecording && (
        <Button size="sm" variant="destructive" onClick={stopRecording} title="Stop">
          <Square className="h-3 w-3" />
          <span className="ml-1 animate-pulse">Recording...</span>
        </Button>
      )}

      {audioUrl && !isRecording && (
        <>
          <Button size="sm" variant="outline" onClick={() => handlePlay(audioUrl)} title="Preview">
            <Play className="h-3 w-3 text-green-500" />
          </Button>
          <Button size="sm" variant="default" onClick={handleSave}>
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={clearRecording}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </>
      )}
    </div>
  );
};

export default AudioRecorderButton;

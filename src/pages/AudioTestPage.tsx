import { useState } from "react";

const voices = [
  { name: "Alice", file: "/assets/audio/test_alice.mp3" },
  { name: "Lily (playful)", file: "/assets/audio/test_lily_young.mp3" },
  { name: "Jessica (playful)", file: "/assets/audio/test_jessica_young.mp3" },
  { name: "Sarah (excited)", file: "/assets/audio/test_farsi_v3.mp3" },
  { name: "Lily (original)", file: "/assets/audio/test_lily.mp3" },
  { name: "Jessica (original)", file: "/assets/audio/test_jessica.mp3" },
  { name: "Matilda", file: "/assets/audio/test_matilda.mp3" },
];

export default function AudioTestPage() {
  const [playing, setPlaying] = useState<string | null>(null);

  const play = (file: string) => {
    const audio = new Audio(file);
    setPlaying(file);
    audio.onended = () => setPlaying(null);
    audio.play();
  };

  return (
    <div className="min-h-screen bg-background p-8 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold">Voice Comparison</h1>
      <p className="text-muted-foreground">Phrase: بنویس بازی کن!</p>
      <div className="grid gap-4 w-full max-w-md">
        {voices.map((v) => (
          <button
            key={v.file}
            onClick={() => play(v.file)}
            className={`p-4 rounded-xl border text-lg font-medium transition-all ${
              playing === v.file
                ? "bg-primary text-primary-foreground scale-105"
                : "bg-card hover:bg-accent"
            }`}
          >
            🔊 {v.name}
          </button>
        ))}
      </div>
    </div>
  );
}

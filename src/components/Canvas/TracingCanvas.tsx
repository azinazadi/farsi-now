import { useRef, useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useDrawing } from "@/hooks/useDrawing";
import { useScoring } from "@/hooks/useScoring";
import { Eraser, Check } from "lucide-react";

interface TracingCanvasProps {
  word: string;
  onScore: (overlap: number, stars: number) => void;
}

const CANVAS_W = 500;
const CANVAS_H = 200;

const TracingCanvas = ({ word, onScore }: TracingCanvasProps) => {
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const ghostCanvasRef = useRef<HTMLCanvasElement>(null);
  const { strokes, startDrawing, draw, stopDrawing, clearCanvas } = useDrawing(drawCanvasRef);
  const { calculateOverlap, getStars } = useScoring();
  const [canvasKey, setCanvasKey] = useState(0);

  // Reset canvas when word changes
  useEffect(() => {
    clearCanvas();
    setCanvasKey((k) => k + 1);
  }, [word, clearCanvas]);

  // Draw ghost word – auto-size to fill canvas
  useEffect(() => {
    const canvas = ghostCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    document.fonts.ready.then(() => {
      // Binary search for the largest font size that fits
      let lo = 40, hi = 300, best = 80;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        ctx.font = `bold ${mid}px Vazirmatn`;
        const m = ctx.measureText(word);
        const textW = m.width;
        const textH = mid; // approximate height
        if (textW < CANVAS_W * 0.9 && textH < CANVAS_H * 0.85) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      ctx.font = `bold ${best}px Vazirmatn`;
      ctx.fillStyle = "rgba(180, 160, 200, 0.35)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.direction = "rtl";
      ctx.fillText(word, CANVAS_W / 2, CANVAS_H / 2);
    });
  }, [word, canvasKey]);

  const handleCheck = useCallback(() => {
    if (!drawCanvasRef.current || !ghostCanvasRef.current) return;
    const overlap = calculateOverlap(drawCanvasRef.current, ghostCanvasRef.current);
    const stars = getStars(overlap);
    onScore(overlap, stars);
  }, [calculateOverlap, getStars, onScore]);

  const handleClear = useCallback(() => {
    clearCanvas();
  }, [clearCanvas]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-border bg-card">
        {/* Ghost layer */}
        <canvas
          ref={ghostCanvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="absolute inset-0 pointer-events-none"
          style={{ width: "100%", height: "auto" }}
        />
        {/* Drawing layer */}
        <canvas
          ref={drawCanvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="relative touch-none cursor-crosshair"
          style={{ width: "100%", height: "auto" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="flex gap-3">
        <motion.button
          className="game-bubble-btn bg-muted text-foreground"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClear}
        >
          <Eraser size={24} />
        </motion.button>
        <motion.button
          className="game-bubble-btn bg-game-green text-primary-foreground"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCheck}
          disabled={strokes.length === 0}
        >
          <Check size={24} />
        </motion.button>
      </div>
    </div>
  );
};

export default TracingCanvas;

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ConfettiProps {
  show: boolean;
}

const COLORS = [
  "hsl(340, 80%, 65%)",
  "hsl(210, 80%, 60%)",
  "hsl(140, 70%, 50%)",
  "hsl(45, 100%, 60%)",
  "hsl(280, 60%, 55%)",
  "hsl(25, 95%, 60%)",
];

interface Piece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  size: number;
}

const Confetti = ({ show }: ConfettiProps) => {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (show) {
      setPieces(
        Array.from({ length: 30 }).map((_, i) => ({
          id: i,
          x: Math.random() * 100,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          delay: Math.random() * 0.5,
          rotation: Math.random() * 720,
          size: 8 + Math.random() * 8,
        }))
      );
    } else {
      setPieces([]);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {pieces.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-sm"
              style={{
                left: `${p.x}%`,
                top: -20,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
              }}
              initial={{ y: -20, rotate: 0, opacity: 1 }}
              animate={{
                y: "100vh",
                rotate: p.rotation,
                opacity: 0,
              }}
              transition={{
                duration: 2 + Math.random(),
                delay: p.delay,
                ease: "easeIn",
              }}
              exit={{ opacity: 0 }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default Confetti;

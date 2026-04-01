import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface StarsDisplayProps {
  stars: number;
  maxStars?: number;
  size?: number;
  animated?: boolean;
}

const StarsDisplay = ({ stars, maxStars = 3, size = 32, animated = false }: StarsDisplayProps) => {
  return (
    <div className="flex gap-1 ltr">
      {Array.from({ length: maxStars }).map((_, i) => {
        const filled = i < stars;
        return (
          <motion.div
            key={i}
            initial={animated && filled ? { scale: 0, rotate: -45 } : undefined}
            animate={animated && filled ? { scale: 1, rotate: 0 } : undefined}
            transition={animated && filled ? { delay: i * 0.15, type: "spring" as const } : undefined}
          >
            <Star
              size={size}
              className={`transition-colors duration-300 ${
                filled
                  ? "fill-star-filled text-star-filled"
                  : "fill-star-empty text-star-empty"
              }`}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default StarsDisplay;

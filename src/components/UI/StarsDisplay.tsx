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
        const StarWrapper = animated ? motion.div : "div";
        const animProps = animated && filled
          ? { initial: { scale: 0, rotate: -45 }, animate: { scale: 1, rotate: 0 }, transition: { delay: i * 0.15, type: "spring" } }
          : {};

        return (
          <StarWrapper key={i} {...animProps}>
            <Star
              size={size}
              className={`transition-colors duration-300 ${
                filled
                  ? "fill-star-filled text-star-filled"
                  : "fill-star-empty text-star-empty"
              }`}
            />
          </StarWrapper>
        );
      })}
    </div>
  );
};

export default StarsDisplay;

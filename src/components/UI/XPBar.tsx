import { motion } from "framer-motion";

interface XPBarProps {
  xp: number;
  maxXp?: number;
}

const XPBar = ({ xp, maxXp = 100 }: XPBarProps) => {
  const level = Math.floor(xp / maxXp) + 1;
  const currentXp = xp % maxXp;
  const percent = (currentXp / maxXp) * 100;

  return (
    <div className="w-full ltr">
      <div className="flex justify-between text-sm font-bold mb-1 text-foreground">
        <span>سطح {level}</span>
        <span>{currentXp}/{maxXp} XP</span>
      </div>
      <div className="h-4 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-l from-game-orange to-game-yellow"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default XPBar;

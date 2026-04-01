import { useEffect } from "react";
import LevelMap from "@/components/LevelMap/LevelMap";
import { useGameStore } from "@/store/gameStore";

const Index = () => {
  const loadSavedProgress = useGameStore((s) => s.loadSavedProgress);

  useEffect(() => {
    loadSavedProgress();
  }, [loadSavedProgress]);

  return <LevelMap />;
};

export default Index;

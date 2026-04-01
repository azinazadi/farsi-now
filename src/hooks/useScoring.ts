import { useCallback } from "react";

export const useScoring = () => {
  const calculateOverlap = useCallback(
    (
      drawingCanvas: HTMLCanvasElement,
      ghostCanvas: HTMLCanvasElement
    ): number => {
      const drawCtx = drawingCanvas.getContext("2d");
      const ghostCtx = ghostCanvas.getContext("2d");
      if (!drawCtx || !ghostCtx) return 0;

      const width = drawingCanvas.width;
      const height = drawingCanvas.height;

      const drawData = drawCtx.getImageData(0, 0, width, height).data;
      const ghostData = ghostCtx.getImageData(0, 0, width, height).data;

      let ghostPixels = 0;
      let overlapPixels = 0;

      for (let i = 3; i < ghostData.length; i += 4) {
        if (ghostData[i] > 50) {
          ghostPixels++;
          if (drawData[i] > 50) {
            overlapPixels++;
          }
        }
      }

      if (ghostPixels === 0) return 0;
      return (overlapPixels / ghostPixels) * 100;
    },
    []
  );

  const getStars = useCallback((overlap: number): number => {
    if (overlap >= 85) return 3;
    if (overlap >= 70) return 2;
    if (overlap >= 50) return 1;
    return 0;
  }, []);

  return { calculateOverlap, getStars };
};

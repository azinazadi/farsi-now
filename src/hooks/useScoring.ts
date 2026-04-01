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

      // Compute bounding boxes for both drawings
      let gMinX = width, gMaxX = 0, gMinY = height, gMaxY = 0;
      let dMinX = width, dMaxX = 0, dMinY = height, dMaxY = 0;
      let ghostPixels = 0;
      let drawPixels = 0;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4 + 3;
          if (ghostData[i] > 50) {
            ghostPixels++;
            gMinX = Math.min(gMinX, x); gMaxX = Math.max(gMaxX, x);
            gMinY = Math.min(gMinY, y); gMaxY = Math.max(gMaxY, y);
          }
          if (drawData[i] > 50) {
            drawPixels++;
            dMinX = Math.min(dMinX, x); dMaxX = Math.max(dMaxX, x);
            dMinY = Math.min(dMinY, y); dMaxY = Math.max(dMaxY, y);
          }
        }
      }

      if (ghostPixels === 0 || drawPixels === 0) return 0;

      // Normalize: scale drawing to match ghost bounding box
      const gW = gMaxX - gMinX || 1;
      const gH = gMaxY - gMinY || 1;
      const dW = dMaxX - dMinX || 1;
      const dH = dMaxY - dMinY || 1;
      const scaleX = gW / dW;
      const scaleY = gH / dH;

      // Create a normalized version of the drawing
      const normCanvas = document.createElement("canvas");
      normCanvas.width = width;
      normCanvas.height = height;
      const normCtx = normCanvas.getContext("2d")!;

      // Draw the user strokes scaled/translated to match ghost bbox
      normCtx.save();
      normCtx.translate(gMinX, gMinY);
      normCtx.scale(scaleX, scaleY);
      normCtx.translate(-dMinX, -dMinY);
      normCtx.drawImage(drawingCanvas, 0, 0);
      normCtx.restore();

      const normData = normCtx.getImageData(0, 0, width, height).data;

      let overlapPixels = 0;
      let drawNormPixels = 0;
      for (let i = 3; i < ghostData.length; i += 4) {
        const isGhost = ghostData[i] > 50;
        const isDraw = normData[i] > 50;
        if (isDraw) drawNormPixels++;
        if (isGhost && isDraw) overlapPixels++;
      }

      if (ghostPixels === 0) return 0;

      // Coverage: how much of the ghost is covered
      const coverage = overlapPixels / ghostPixels;
      // Precision: how much of the drawing is on the ghost (penalize wild strokes)
      const precision = drawNormPixels > 0 ? overlapPixels / drawNormPixels : 0;

      // Combined score weighted towards coverage
      return (coverage * 0.7 + precision * 0.3) * 100;
    },
    []
  );

  const getStars = useCallback((overlap: number): number => {
    if (overlap >= 35) return 3;
    if (overlap >= 20) return 2;
    if (overlap >= 10) return 1;
    return 0;
  }, []);

  return { calculateOverlap, getStars };
};

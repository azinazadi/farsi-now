import { useCallback, useRef, useState } from "react";
import { Stroke } from "@/types";

export const useDrawing = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const currentStroke = useRef<Stroke["points"]>([]);

  const getPoint = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      if ("touches" in e) {
        const touch = e.touches[0];
        if (!touch) return null;
        return {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY,
          pressure: touch.force || 0.5,
        };
      }
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
        pressure: 0.5,
      };
    },
    [canvasRef]
  );

  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const point = getPoint(e);
      if (!point) return;
      setIsDrawing(true);
      currentStroke.current = [point];

      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.strokeStyle = "hsl(280, 60%, 40%)";
        ctx.lineWidth = 6 + point.pressure * 4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    },
    [getPoint, canvasRef]
  );

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;
      const point = getPoint(e);
      if (!point) return;
      currentStroke.current.push(point);

      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 6 + point.pressure * 4;
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }
    },
    [isDrawing, getPoint, canvasRef]
  );

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStroke.current.length > 0) {
      setStrokes((prev) => [...prev, { points: [...currentStroke.current] }]);
    }
    currentStroke.current = [];
  }, [isDrawing]);

  const clearCanvas = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setStrokes([]);
  }, [canvasRef]);

  return {
    strokes,
    isDrawing,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
  };
};

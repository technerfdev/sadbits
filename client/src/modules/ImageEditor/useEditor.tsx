import type Konva from "konva";
import { useState } from "react";
import { type ShapeConfig, type ShapeType } from "./Shape";
import { type TextConfig } from "./Text";
import type { LevelType } from "@/components/Typography/Typography";

export interface CanvasShape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  rotation?: number;
  kind?: "shape";
}

export interface CanvasText {
  id: string;
  type: LevelType;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  kind?: "text";
}

export interface CanvasImage {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  photographer?: string;
  alt?: string;
  kind?: "image";
}

export type CanvasElement = CanvasShape | CanvasText | CanvasImage;

export function useEditor() {
  const [elements, setElements] = useState<CanvasElement[]>([]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const shapeData = e.dataTransfer.getData("shape");
    const textData = e.dataTransfer.getData("text");
    const imageData = e.dataTransfer.getData("image");

    const stageElement = e.currentTarget.querySelector("canvas");
    if (!stageElement) return;

    const stageRect = stageElement.getBoundingClientRect();
    const x = e.clientX - stageRect.left;
    const y = e.clientY - stageRect.top;

    // Handle shape drop
    if (shapeData) {
      const shapeConfig: ShapeConfig = JSON.parse(shapeData);
      const newShape: CanvasShape = {
        id: `${shapeConfig.type}-${Date.now()}`,
        type: shapeConfig.type,
        x,
        y,
      };
      setElements([...elements, { ...newShape, kind: "shape" }]);
    }

    // Handle text drop
    if (textData) {
      const textConfig: TextConfig = JSON.parse(textData);

      // Map text type to font size
      const fontSizeMap: Record<LevelType, number> = {
        h1: 36,
        h2: 30,
        h3: 24,
        h4: 20,
        h5: 18,
        h6: 16,
        p: 16,
        span: 14,
        caption: 12,
      };

      const newText: CanvasText = {
        id: `${textConfig.type}-${Date.now()}`,
        type: textConfig.type,
        text: textConfig.defaultText,
        x,
        y,
        fontSize: fontSizeMap[textConfig.type],
      };
      setElements([...elements, { ...newText, kind: "text" }]);
    }

    // Handle image drop
    if (imageData) {
      const imageConfig: {
        src: string;
        photographer?: string;
        alt?: string;
      } = JSON.parse(imageData);

      const newImage: CanvasImage = {
        id: `image-${Date.now()}`,
        src: imageConfig.src,
        x,
        y,
        width: 200, // TODO: Replace by the image size
        height: 200, // TODO: Replace by the image size
        photographer: imageConfig.photographer,
        alt: imageConfig.alt,
      };
      setElements([...elements, { ...newImage, kind: "image" }]);
    }
  };

  const handleDragStartItem = (e: Konva.KonvaEventObject<DragEvent>) => {
    // TODO: handle while dragging the shape
  };
  const handleDragEndItem = (e: Konva.KonvaEventObject<DragEvent>) => {
    const id = e.target.name();

    const cp = elements.slice();
    const shape = elements.find((shape) => shape.id === id);
    if (shape) {
      const idx = cp.indexOf(shape);
      cp[idx] = {
        ...shape,
        x: e.target.x(),
        y: e.target.y(),
      };
      setElements(cp);
      return;
    }
  };

  return {
    elements,
    handleDragOver, // used for Stage
    handleDrop, // used for Stage
    handleDragStartItem,
    handleDragEndItem,
  };
}

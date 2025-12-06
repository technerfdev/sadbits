import type { JSX } from "react/jsx-runtime";
import { useRef, useEffect } from "react";

export type ShapeType =
  | "rect"
  | "circle"
  | "star"
  | "triangle"
  | "right-triangle"
  | "diamond"
  | "pentagon"
  | "hexagon"
  | "speech-bubble"
  | "plus"
  | "egg"
  | "cloud"
  | "arrow-right"
  | "arrow-left"
  | "arrow-down"
  | "arrow-up"
  | "flower"
  | "asterisk"
  | "ribbon"
  | "pac-man";

export interface ShapeConfig {
  type: ShapeType;
  name: string;
}

const shapes: ShapeConfig[] = [
  { type: "rect", name: "Rectangle" },
  { type: "circle", name: "Circle" },
  { type: "star", name: "Star" },
  { type: "triangle", name: "Triangle" },
  { type: "right-triangle", name: "Right Triangle" },
  { type: "diamond", name: "Diamond" },
  { type: "pentagon", name: "Pentagon" },
  { type: "hexagon", name: "Hexagon" },
  { type: "speech-bubble", name: "Speech Bubble" },
  { type: "plus", name: "Plus" },
  { type: "egg", name: "Egg" },
  { type: "cloud", name: "Cloud" },
  { type: "arrow-right", name: "Arrow Right" },
  { type: "arrow-left", name: "Arrow Left" },
  { type: "arrow-down", name: "Arrow Down" },
  { type: "arrow-up", name: "Arrow Up" },
  { type: "flower", name: "Flower" },
  { type: "asterisk", name: "Asterisk" },
  { type: "ribbon", name: "Ribbon" },
  { type: "pac-man", name: "Pac-Man" },
];

// Function to draw shapes on canvas
export function drawShape(
  ctx: CanvasRenderingContext2D,
  type: ShapeType,
  centerX: number,
  centerY: number,
  scale = 1
) {
  const size = 50 * scale;
  ctx.fillStyle = "#b3b3b3";
  ctx.strokeStyle = "#999";
  ctx.lineWidth = 1;

  ctx.save();
  ctx.translate(centerX, centerY);

  switch (type) {
    case "rect":
      ctx.fillRect(-size, -size, size * 2, size * 2);
      break;

    case "circle":
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "star":
      drawStar(ctx, 0, 0, 5, size, size * 0.5);
      break;

    case "triangle":
      drawRegularPolygon(ctx, 0, 0, 3, size, -90);
      break;

    case "right-triangle":
      ctx.beginPath();
      ctx.moveTo(-size, -size);
      ctx.lineTo(size, size);
      ctx.lineTo(-size, size);
      ctx.closePath();
      ctx.fill();
      break;

    case "diamond":
      drawRegularPolygon(ctx, 0, 0, 4, size, 0);
      break;

    case "pentagon":
      drawRegularPolygon(ctx, 0, 0, 5, size, -18);
      break;

    case "hexagon":
      drawRegularPolygon(ctx, 0, 0, 6, size, 0);
      break;

    case "speech-bubble":
      drawSpeechBubble(ctx, size);
      break;

    case "plus":
      drawPlus(ctx, size);
      break;

    case "egg":
      drawEgg(ctx, size);
      break;

    case "cloud":
      drawCloud(ctx, size);
      break;

    case "arrow-right":
      drawArrow(ctx, size, 0);
      break;

    case "arrow-left":
      drawArrow(ctx, size, 180);
      break;

    case "arrow-down":
      drawArrow(ctx, size, 90);
      break;

    case "arrow-up":
      drawArrow(ctx, size, -90);
      break;

    case "flower":
      drawFlower(ctx, size);
      break;

    case "asterisk":
      drawAsterisk(ctx, size);
      break;

    case "ribbon":
      drawRibbon(ctx, size);
      break;

    case "pac-man":
      drawPacMan(ctx, size);
      break;
  }

  ctx.restore();
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  points: number,
  outerRadius: number,
  innerRadius: number
) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function drawRegularPolygon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  sides: number,
  radius: number,
  rotation: number
) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = ((Math.PI * 2) / sides) * i + (rotation * Math.PI) / 180;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function drawSpeechBubble(ctx: CanvasRenderingContext2D, size: number) {
  const s = size / 50;
  ctx.beginPath();
  ctx.moveTo(-30 * s, -40 * s);
  ctx.lineTo(30 * s, -40 * s);
  ctx.lineTo(30 * s, 0);
  ctx.lineTo(10 * s, 0);
  ctx.lineTo(0, 20 * s);
  ctx.lineTo(-5 * s, 0);
  ctx.lineTo(-30 * s, 0);
  ctx.closePath();
  ctx.fill();
}

function drawPlus(ctx: CanvasRenderingContext2D, size: number) {
  const s = size / 50;
  const w = 20 * s;
  ctx.beginPath();
  ctx.moveTo(-w, -w * 2);
  ctx.lineTo(w, -w * 2);
  ctx.lineTo(w, -w);
  ctx.lineTo(w * 2, -w);
  ctx.lineTo(w * 2, w);
  ctx.lineTo(w, w);
  ctx.lineTo(w, w * 2);
  ctx.lineTo(-w, w * 2);
  ctx.lineTo(-w, w);
  ctx.lineTo(-w * 2, w);
  ctx.lineTo(-w * 2, -w);
  ctx.lineTo(-w, -w);
  ctx.closePath();
  ctx.fill();
}

function drawEgg(ctx: CanvasRenderingContext2D, size: number) {
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.7, size, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawCloud(ctx: CanvasRenderingContext2D, size: number) {
  const s = size / 50;
  ctx.beginPath();
  ctx.arc(-20 * s, 0, 25 * s, 0, Math.PI * 2);
  ctx.arc(20 * s, 0, 25 * s, 0, Math.PI * 2);
  ctx.arc(0, -15 * s, 25 * s, 0, Math.PI * 2);
  ctx.fill();
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  size: number,
  rotation: number
) {
  ctx.rotate((rotation * Math.PI) / 180);
  const s = size / 50;
  ctx.beginPath();
  ctx.moveTo(-45 * s, -20 * s);
  ctx.lineTo(20 * s, -20 * s);
  ctx.lineTo(20 * s, -40 * s);
  ctx.lineTo(50 * s, 0);
  ctx.lineTo(20 * s, 40 * s);
  ctx.lineTo(20 * s, 20 * s);
  ctx.lineTo(-45 * s, 20 * s);
  ctx.closePath();
  ctx.fill();
}

function drawFlower(ctx: CanvasRenderingContext2D, size: number) {
  const petalRadius = size * 0.4;
  const positions = [
    [-petalRadius, -petalRadius],
    [petalRadius, -petalRadius],
    [-petalRadius, petalRadius],
    [petalRadius, petalRadius],
    [0, -petalRadius * 1.3],
  ];
  positions.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, petalRadius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.beginPath();
  ctx.arc(0, 0, petalRadius * 0.6, 0, Math.PI * 2);
  ctx.fill();
}

function drawAsterisk(ctx: CanvasRenderingContext2D, size: number) {
  drawStar(ctx, 0, 0, 8, size, size * 0.3);
}

function drawRibbon(ctx: CanvasRenderingContext2D, size: number) {
  const s = size / 50;
  ctx.beginPath();
  ctx.moveTo(-40 * s, 0);
  ctx.lineTo(-10 * s, 0);
  ctx.lineTo(-10 * s, -40 * s);
  ctx.lineTo(20 * s, 0);
  ctx.lineTo(20 * s, 40 * s);
  ctx.lineTo(-10 * s, 10 * s);
  ctx.lineTo(-10 * s, 40 * s);
  ctx.closePath();
  ctx.fill();
}

function drawPacMan(ctx: CanvasRenderingContext2D, size: number) {
  ctx.beginPath();
  ctx.arc(0, 0, size, 0.15 * Math.PI, 1.85 * Math.PI);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();
}

interface ShapeItemProps {
  shape: ShapeConfig;
}

function ShapeItem({ shape }: ShapeItemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShape(ctx, shape.type, 35, 35, 0.6);
  }, [shape.type]);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("shape", JSON.stringify(shape));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      className="flex flex-col items-center justify-center border rounded-lg p-3 hover:bg-gray-50 cursor-move"
      draggable
      onDragStart={handleDragStart}
    >
      <canvas ref={canvasRef} width={70} height={70} className="mb-1" />
      <p className="text-xs text-gray-600 text-center">{shape.name}</p>
    </div>
  );
}

export default function Shape(): JSX.Element {
  return (
    <div className="flex-col overflow-hide w-full">
      <h2 className="text-xl font-semibold mb-4 px-2">Shapes</h2>
      <div className="grid grid-cols-2 gap-3 p-2">
        {shapes.map((shape) => (
          <ShapeItem key={shape.type} shape={shape} />
        ))}
      </div>
    </div>
  );
}

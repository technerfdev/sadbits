import type { Direction, Position } from "./types";
import { CELL_SIZE, GRID_HEIGHT, GRID_WIDTH, MAZE_LAYOUT } from "./constants";

export function positionToKey(pos: Position): string {
  return `${Math.round(pos.x)},${Math.round(pos.y)}`;
}

export function gridToPixel(gridPos: number): number {
  return gridPos * CELL_SIZE + CELL_SIZE / 2;
}

export function pixelToGrid(pixelPos: number): number {
  return Math.floor(pixelPos / CELL_SIZE);
}

export function getDirectionVector(direction: Direction): Position {
  switch (direction) {
    case "UP":
      return { x: 0, y: -1 };
    case "DOWN":
      return { x: 0, y: 1 };
    case "LEFT":
      return { x: -1, y: 0 };
    case "RIGHT":
      return { x: 1, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
}

export function getOppositeDirection(direction: Direction): Direction {
  switch (direction) {
    case "UP":
      return "DOWN";
    case "DOWN":
      return "UP";
    case "LEFT":
      return "RIGHT";
    case "RIGHT":
      return "LEFT";
    default:
      return "NONE";
  }
}

export function isWall(gridX: number, gridY: number): boolean {
  if (gridX < 0 || gridX >= GRID_WIDTH || gridY < 0 || gridY >= GRID_HEIGHT) {
    return true;
  }
  return MAZE_LAYOUT[gridY][gridX] === 1;
}

export function canMove(position: Position, direction: Direction): boolean {
  const vector = getDirectionVector(direction);
  const newX = position.x + vector.x * CELL_SIZE;
  const newY = position.y + vector.y * CELL_SIZE;

  const gridX = pixelToGrid(newX);
  const gridY = pixelToGrid(newY);

  return !isWall(gridX, gridY);
}

export function wrapPosition(position: Position): Position {
  let { x, y } = position;

  if (x < -CELL_SIZE) {
    x = GRID_WIDTH * CELL_SIZE;
  } else if (x > GRID_WIDTH * CELL_SIZE) {
    x = -CELL_SIZE;
  }

  return { x, y };
}

export function getDistance(pos1: Position, pos2: Position): number {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function isColliding(
  pos1: Position,
  pos2: Position,
  threshold = CELL_SIZE
): boolean {
  return getDistance(pos1, pos2) < threshold;
}

export function getGridPosition(position: Position): Position {
  return {
    x: pixelToGrid(position.x),
    y: pixelToGrid(position.y),
  };
}

export function isAligned(position: Position): boolean {
  const gridX = pixelToGrid(position.x);
  const gridY = pixelToGrid(position.y);
  const centerX = gridToPixel(gridX);
  const centerY = gridToPixel(gridY);

  return (
    Math.abs(position.x - centerX) < 2 && Math.abs(position.y - centerY) < 2
  );
}

export function snapToGrid(position: Position): Position {
  const gridX = pixelToGrid(position.x);
  const gridY = pixelToGrid(position.y);
  return {
    x: gridToPixel(gridX),
    y: gridToPixel(gridY),
  };
}

export function getValidDirections(position: Position): Direction[] {
  const directions: Direction[] = [];
  const validMoves: Direction[] = ["UP", "DOWN", "LEFT", "RIGHT"];

  for (const dir of validMoves) {
    if (canMove(position, dir)) {
      directions.push(dir);
    }
  }

  return directions;
}

export function getBestDirection(
  from: Position,
  to: Position,
  currentDirection: Direction
): Direction {
  const validDirections = getValidDirections(from);
  const opposite = getOppositeDirection(currentDirection);

  const availableDirections = validDirections.filter((dir) => dir !== opposite);

  if (availableDirections.length === 0) {
    return validDirections[0] || "NONE";
  }

  let bestDirection = availableDirections[0];
  let minDistance = Infinity;

  for (const dir of availableDirections) {
    const vector = getDirectionVector(dir);
    const testPos = {
      x: from.x + vector.x * CELL_SIZE,
      y: from.y + vector.y * CELL_SIZE,
    };
    const distance = getDistance(testPos, to);

    if (distance < minDistance) {
      minDistance = distance;
      bestDirection = dir;
    }
  }

  return bestDirection;
}

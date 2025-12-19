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

// Manhattan distance for A* heuristic
function manhattanDistance(pos1: Position, pos2: Position): number {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}

// A* pathfinding algorithm for Asian mode
export function getAStarDirection(
  from: Position,
  to: Position,
  currentDirection: Direction
): Direction {
  const startGrid = getGridPosition(from);
  const endGrid = getGridPosition(to);

  // If we're already at the target, return current direction
  if (startGrid.x === endGrid.x && startGrid.y === endGrid.y) {
    return currentDirection;
  }

  interface Node {
    x: number;
    y: number;
    g: number; // Cost from start
    h: number; // Heuristic to end
    f: number; // Total cost
    parent: Node | null;
  }

  const openSet: Node[] = [];
  const closedSet = new Set<string>();

  const startNode: Node = {
    x: startGrid.x,
    y: startGrid.y,
    g: 0,
    h: manhattanDistance(startGrid, endGrid),
    f: 0,
    parent: null,
  };
  startNode.f = startNode.g + startNode.h;
  openSet.push(startNode);

  const nodeKey = (x: number, y: number) => `${x},${y}`;

  // Limit iterations to prevent infinite loops
  let iterations = 0;
  const maxIterations = 200;

  while (openSet.length > 0 && iterations < maxIterations) {
    iterations++;

    // Find node with lowest f score
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;

    // Found the target
    if (current.x === endGrid.x && current.y === endGrid.y) {
      // Trace back to find first step
      let path = current;
      while (path.parent && path.parent.parent !== null) {
        path = path.parent;
      }

      // Determine direction from start to first step
      const dx = path.x - startGrid.x;
      const dy = path.y - startGrid.y;

      if (dx > 0) return "RIGHT";
      if (dx < 0) return "LEFT";
      if (dy > 0) return "DOWN";
      if (dy < 0) return "UP";

      return currentDirection;
    }

    closedSet.add(nodeKey(current.x, current.y));

    // Check all neighbors
    const directions = [
      { x: 0, y: -1, dir: "UP" as Direction },
      { x: 0, y: 1, dir: "DOWN" as Direction },
      { x: -1, y: 0, dir: "LEFT" as Direction },
      { x: 1, y: 0, dir: "RIGHT" as Direction },
    ];

    for (const { x: dx, y: dy, dir } of directions) {
      const neighborX = current.x + dx;
      const neighborY = current.y + dy;

      // Skip if wall or out of bounds
      if (isWall(neighborX, neighborY)) continue;

      const key = nodeKey(neighborX, neighborY);
      if (closedSet.has(key)) continue;

      // Don't allow turning back on first move (except if forced)
      const opposite = getOppositeDirection(currentDirection);
      if (current.parent === null && dir === opposite) {
        const fromPos = { x: gridToPixel(startGrid.x), y: gridToPixel(startGrid.y) };
        const validDirs = getValidDirections(fromPos);
        if (validDirs.length > 1) continue;
      }

      const g = current.g + 1;
      const h = manhattanDistance({ x: neighborX, y: neighborY }, endGrid);
      const f = g + h;

      // Check if this neighbor is already in openSet
      const existingNode = openSet.find((n) => n.x === neighborX && n.y === neighborY);

      if (existingNode) {
        // Update if we found a better path
        if (g < existingNode.g) {
          existingNode.g = g;
          existingNode.f = f;
          existingNode.parent = current;
        }
      } else {
        openSet.push({
          x: neighborX,
          y: neighborY,
          g,
          h,
          f,
          parent: current,
        });
      }
    }
  }

  // If A* fails, fall back to simple distance-based direction
  return getBestDirection(from, to, currentDirection);
}

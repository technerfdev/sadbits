export interface Position {
  x: number;
  y: number;
}

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT" | "NONE";

export type GameStatus = "menu" | "playing" | "paused" | "gameOver" | "won";

export type Difficulty = "easy" | "normal" | "hard" | "asian";

export type MazeSize = "small" | "normal" | "large";

export type GhostColor = "red" | "pink" | "cyan" | "orange";

export type GhostMode = "chase" | "scatter" | "frightened" | "eaten";

export interface Ghost {
  id: GhostColor;
  position: Position;
  direction: Direction;
  mode: GhostMode;
  targetTile: Position;
  scatterTarget: Position;
  modeTimer: number;
}

export interface PacmanState {
  position: Position;
  direction: Direction;
  nextDirection: Direction;
  mouthAngle: number;
  mouthOpen: boolean;
}

export interface GameState {
  score: number;
  lives: number;
  level: number;
  gameStatus: GameStatus;
  difficulty: Difficulty;
  mazeSize: MazeSize;
  pacman: PacmanState;
  ghosts: Ghost[];
  dots: Set<string>;
  powerPellets: Set<string>;
  powerMode: boolean;
  powerModeTimer: number;
  ghostsEaten: number;
  animationFrame: number;
  globalModeTimer: number;
  globalMode: "chase" | "scatter";
}

export type CellType = 0 | 1 | 2 | 3 | 4;

export const CELL_EMPTY = 0;
export const CELL_WALL = 1;
export const CELL_DOT = 2;
export const CELL_POWER_PELLET = 3;
export const CELL_GHOST_HOUSE = 4;

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  Direction,
  GameState,
  Ghost,
  GhostColor,
  PacmanState,
  Position,
} from "./types";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CELL_SIZE,
  COLORS,
  DOT_POINTS,
  GHOST_EATEN_SPEED,
  GHOST_FRIGHTENED_SPEED,
  GHOST_NORMAL_SPEED,
  GHOST_POINTS,
  GHOST_SCATTER_TARGETS,
  GRID_WIDTH,
  INITIAL_LIVES,
  MAZE_LAYOUT,
  PACMAN_SPEED,
  POWER_MODE_DURATION,
  POWER_PELLET_POINTS,
  GRID_HEIGHT,
} from "./constants";
import {
  canMove,
  getBestDirection,
  getDirectionVector,
  getDistance,
  getGridPosition,
  gridToPixel,
  isAligned,
  isColliding,
  positionToKey,
  snapToGrid,
  wrapPosition,
} from "./utils";

export function usePacmanGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [gameState, setGameState] = useState<GameState>(initializeGame);

  function initializeGame(): GameState {
    const dots = new Set<string>();
    const powerPellets = new Set<string>();

    for (let y = 0; y < MAZE_LAYOUT.length; y++) {
      for (let x = 0; x < MAZE_LAYOUT[y].length; x++) {
        if (MAZE_LAYOUT[y][x] === 2) {
          dots.add(positionToKey({ x, y }));
        } else if (MAZE_LAYOUT[y][x] === 3) {
          powerPellets.add(positionToKey({ x, y }));
        }
      }
    }

    const pacman: PacmanState = {
      position: { x: gridToPixel(22), y: gridToPixel(38) },
      direction: "NONE",
      nextDirection: "NONE",
      mouthAngle: 0,
      mouthOpen: true,
    };

    const ghosts: Ghost[] = [
      {
        id: "red",
        position: { x: gridToPixel(12), y: gridToPixel(16) },
        direction: "LEFT",
        mode: "scatter",
        targetTile: { x: 12, y: 16 },
        scatterTarget: GHOST_SCATTER_TARGETS.red,
      },
      {
        id: "pink",
        position: { x: gridToPixel(12), y: gridToPixel(17) },
        direction: "UP",
        mode: "scatter",
        targetTile: { x: 12, y: 17 },
        scatterTarget: GHOST_SCATTER_TARGETS.pink,
      },
      {
        id: "cyan",
        position: { x: gridToPixel(11), y: gridToPixel(16) },
        direction: "UP",
        mode: "scatter",
        targetTile: { x: 11, y: 16 },
        scatterTarget: GHOST_SCATTER_TARGETS.cyan,
      },
      {
        id: "orange",
        position: { x: gridToPixel(13), y: gridToPixel(16) },
        direction: "UP",
        mode: "scatter",
        targetTile: { x: 13, y: 16 },
        scatterTarget: GHOST_SCATTER_TARGETS.orange,
      },
    ];

    return {
      score: 0,
      lives: INITIAL_LIVES,
      level: 1,
      gameStatus: "menu",
      pacman,
      ghosts,
      dots,
      powerPellets,
      powerMode: false,
      powerModeTimer: 0,
      ghostsEaten: 0,
      animationFrame: 0,
    };
  }

  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      gameStatus: "playing",
    }));
  }, []);

  const pauseGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      gameStatus: prev.gameStatus === "paused" ? "playing" : "paused",
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initializeGame());
  }, []);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const key = event.key;
    let newDirection: Direction = "NONE";

    switch (key) {
      case "ArrowUp":
      case "w":
      case "W":
        newDirection = "UP";
        break;
      case "ArrowDown":
      case "s":
      case "S":
        newDirection = "DOWN";
        break;
      case "ArrowLeft":
      case "a":
      case "A":
        newDirection = "LEFT";
        break;
      case "ArrowRight":
      case "d":
      case "D":
        newDirection = "RIGHT";
        break;
      case " ":
        event.preventDefault();
        return;
    }

    if (newDirection !== "NONE") {
      event.preventDefault();
      setGameState((prev) => ({
        ...prev,
        pacman: {
          ...prev.pacman,
          nextDirection: newDirection,
        },
      }));
    }
  }, []);

  function updatePacman(state: GameState): GameState {
    const { pacman } = state;
    let { position, direction, nextDirection } = pacman;

    // Try to change direction when aligned
    if (isAligned(position) && nextDirection !== "NONE") {
      const snapped = snapToGrid(position);
      if (canMove(snapped, nextDirection)) {
        direction = nextDirection;
        nextDirection = "NONE";
        position = snapped;
      }
    }

    // Move in current direction if possible
    if (direction !== "NONE" && canMove(position, direction)) {
      const vector = getDirectionVector(direction);
      position = {
        x: position.x + vector.x * PACMAN_SPEED,
        y: position.y + vector.y * PACMAN_SPEED,
      };
      position = wrapPosition(position);
    } else if (direction !== "NONE") {
      // If blocked, snap to grid to allow turning
      position = snapToGrid(position);
    }

    const mouthOpen = Math.floor(state.animationFrame / 5) % 2 === 0;

    return {
      ...state,
      pacman: {
        ...pacman,
        position,
        direction,
        nextDirection,
        mouthOpen,
      },
    };
  }

  function updateGhost(ghost: Ghost, state: GameState): Ghost {
    let { position, direction, mode } = ghost;
    const { pacman, powerMode } = state;

    if (mode === "frightened" && !powerMode) {
      mode = "chase";
    }

    if (mode !== "frightened" && powerMode && mode !== "eaten") {
      mode = "frightened";
    }

    let targetTile: Position;

    if (mode === "eaten") {
      targetTile = { x: 12, y: 16 };

      const homePos = { x: gridToPixel(12), y: gridToPixel(16) };
      if (getDistance(position, homePos) < CELL_SIZE) {
        mode = "chase";
      }
    } else if (mode === "frightened") {
      const validDirections = ["UP", "DOWN", "LEFT", "RIGHT"] as Direction[];
      const randomDir =
        validDirections[Math.floor(Math.random() * validDirections.length)];
      targetTile = getGridPosition(position);

      if (isAligned(position) && Math.random() < 0.3) {
        direction = randomDir;
      }
    } else if (mode === "scatter") {
      targetTile = ghost.scatterTarget;
    } else {
      targetTile = getTargetTile(ghost.id, pacman, state);
    }

    // Update direction when aligned OR when current direction is blocked
    const shouldUpdateDirection =
      isAligned(position) || !canMove(position, direction);

    if (shouldUpdateDirection) {
      // If blocked, snap to grid to ensure proper alignment
      if (!canMove(position, direction)) {
        position = snapToGrid(position);
      }

      // Always use snapped pixel position for direction calculation
      const snappedPos = snapToGrid(position);

      const newDir = getBestDirection(
        snappedPos,
        { x: gridToPixel(targetTile.x), y: gridToPixel(targetTile.y) },
        direction
      );

      // Always update direction when we have a valid new direction
      if (canMove(snappedPos, newDir)) {
        direction = newDir;
      } else if (!canMove(snappedPos, direction)) {
        // If current direction is blocked and new direction is also blocked,
        // find ANY valid direction to avoid getting stuck
        const validDirs: Direction[] = ["UP", "DOWN", "LEFT", "RIGHT"];
        for (const dir of validDirs) {
          if (canMove(snappedPos, dir)) {
            direction = dir;
            break;
          }
        }
      }
    }

    const speed =
      mode === "frightened"
        ? GHOST_FRIGHTENED_SPEED
        : mode === "eaten"
          ? GHOST_EATEN_SPEED
          : GHOST_NORMAL_SPEED;

    if (canMove(position, direction)) {
      const vector = getDirectionVector(direction);
      position = {
        x: position.x + vector.x * speed,
        y: position.y + vector.y * speed,
      };
      position = wrapPosition(position);
    } else {
      // If still can't move, snap to grid to ensure alignment
      position = snapToGrid(position);
    }

    return {
      ...ghost,
      position,
      direction,
      mode,
      targetTile,
    };
  }

  function getTargetTile(
    ghostId: GhostColor,
    pacman: PacmanState,
    state: GameState
  ): Position {
    const pacmanGrid = getGridPosition(pacman.position);

    switch (ghostId) {
      case "red":
        return pacmanGrid;

      case "pink": {
        const vector = getDirectionVector(pacman.direction);
        return {
          x: pacmanGrid.x + vector.x * 4,
          y: pacmanGrid.y + vector.y * 4,
        };
      }

      case "cyan": {
        const redGhost = state.ghosts.find((g) => g.id === "red");
        if (!redGhost) return pacmanGrid;

        const vector = getDirectionVector(pacman.direction);
        const target = {
          x: pacmanGrid.x + vector.x * 2,
          y: pacmanGrid.y + vector.y * 2,
        };
        const redGrid = getGridPosition(redGhost.position);

        return {
          x: target.x + (target.x - redGrid.x),
          y: target.y + (target.y - redGrid.y),
        };
      }

      case "orange": {
        const distance = getDistance(
          state.ghosts.find((g) => g.id === "orange")?.position || {
            x: 0,
            y: 0,
          },
          pacman.position
        );
        if (distance > CELL_SIZE * 8) {
          return pacmanGrid;
        }
        return GHOST_SCATTER_TARGETS.orange;
      }

      default:
        return pacmanGrid;
    }
  }

  function drawGhost(
    ctx: CanvasRenderingContext2D,
    ghost: Ghost,
    animationFrame: number
  ) {
    let color: string;
    let glowColor: string;

    switch (ghost.id) {
      case "red":
        color = COLORS.ghostRed;
        glowColor = COLORS.ghostRedGlow;
        break;
      case "pink":
        color = COLORS.ghostPink;
        glowColor = COLORS.ghostPinkGlow;
        break;
      case "cyan":
        color = COLORS.ghostCyan;
        glowColor = COLORS.ghostCyanGlow;
        break;
      case "orange":
        color = COLORS.ghostOrange;
        glowColor = COLORS.ghostOrangeGlow;
        break;
    }

    if (ghost.mode === "frightened") {
      color = COLORS.ghostFrightened;
      glowColor = COLORS.ghostFrightenedGlow;
    }

    if (ghost.mode !== "eaten") {
      const x = ghost.position.x;
      const y = ghost.position.y;
      const size = CELL_SIZE - 2;
      const radius = size / 2;

      // Add shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;

      // Ghost body with gradient
      const gradient = ctx.createRadialGradient(x - radius / 3, y - radius / 2, 0, x, y, radius);
      gradient.addColorStop(0, glowColor);
      gradient.addColorStop(0.6, color);
      gradient.addColorStop(1, color);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y - radius / 4, radius, Math.PI, 0, false);

      // Wavy bottom - smoother animation
      const waveCount = 4;
      const waveWidth = (size) / waveCount;
      const waveAnim = Math.sin(animationFrame * 0.15) * 1.5;

      for (let i = 0; i < waveCount; i++) {
        const waveX = x - radius + (i + 0.5) * waveWidth;
        const waveY = y + radius / 2.5 + (i % 2 === 0 ? waveAnim : -waveAnim);
        ctx.lineTo(x - radius + i * waveWidth, y + radius / 4);
        ctx.quadraticCurveTo(waveX, waveY, x - radius + (i + 1) * waveWidth, y + radius / 4);
      }

      ctx.closePath();
      ctx.fill();

      // Reset shadow for eyes
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Eyes - larger and more expressive
      const eyeSize = radius / 2.5;
      const eyeSpacing = radius / 2.2;
      const eyeY = y - radius / 4;

      // Eye shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.beginPath();
      ctx.ellipse(x - eyeSpacing, eyeY + 1, eyeSize + 1, eyeSize * 1.3 + 1, 0, 0, Math.PI * 2);
      ctx.ellipse(x + eyeSpacing, eyeY + 1, eyeSize + 1, eyeSize * 1.3 + 1, 0, 0, Math.PI * 2);
      ctx.fill();

      // White eye background with subtle gradient
      const eyeGradient = ctx.createRadialGradient(x - eyeSpacing, eyeY - 1, 0, x - eyeSpacing, eyeY, eyeSize);
      eyeGradient.addColorStop(0, "#FFFFFF");
      eyeGradient.addColorStop(1, "#F0F0F0");
      ctx.fillStyle = eyeGradient;
      ctx.beginPath();
      ctx.ellipse(x - eyeSpacing, eyeY, eyeSize, eyeSize * 1.3, 0, 0, Math.PI * 2);
      ctx.ellipse(x + eyeSpacing, eyeY, eyeSize, eyeSize * 1.3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pupils - follow direction with better positioning
      const pupilSize = eyeSize / 1.8;
      let pupilOffsetX = 0;
      let pupilOffsetY = 0;

      if (ghost.mode === "frightened") {
        // Scared eyes - look around frantically
        pupilOffsetX = Math.sin(animationFrame * 0.3) * (eyeSize / 4);
        pupilOffsetY = Math.cos(animationFrame * 0.25) * (eyeSize / 4);
      } else {
        switch (ghost.direction) {
          case "LEFT":
            pupilOffsetX = -eyeSize / 2.5;
            break;
          case "RIGHT":
            pupilOffsetX = eyeSize / 2.5;
            break;
          case "UP":
            pupilOffsetY = -eyeSize / 2.5;
            break;
          case "DOWN":
            pupilOffsetY = eyeSize / 2.5;
            break;
        }
      }

      // Pupils with gradient
      const pupilGradient = ctx.createRadialGradient(
        x - eyeSpacing + pupilOffsetX - pupilSize / 4,
        eyeY + pupilOffsetY - pupilSize / 4,
        0,
        x - eyeSpacing + pupilOffsetX,
        eyeY + pupilOffsetY,
        pupilSize
      );
      pupilGradient.addColorStop(0, "#0000A0");
      pupilGradient.addColorStop(1, "#000060");

      ctx.fillStyle = pupilGradient;
      ctx.beginPath();
      ctx.arc(x - eyeSpacing + pupilOffsetX, eyeY + pupilOffsetY, pupilSize, 0, Math.PI * 2);
      ctx.arc(x + eyeSpacing + pupilOffsetX, eyeY + pupilOffsetY, pupilSize, 0, Math.PI * 2);
      ctx.fill();

      // Eye highlights
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.beginPath();
      ctx.arc(x - eyeSpacing + pupilOffsetX - pupilSize / 3, eyeY + pupilOffsetY - pupilSize / 3, pupilSize / 3, 0, Math.PI * 2);
      ctx.arc(x + eyeSpacing + pupilOffsetX - pupilSize / 3, eyeY + pupilOffsetY - pupilSize / 3, pupilSize / 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Eaten ghost - floating eyes
      const x = ghost.position.x;
      const y = ghost.position.y;
      const eyeSpacing = 5;
      const eyeSize = 4;

      // Eye shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.beginPath();
      ctx.arc(x - eyeSpacing, y + 1, eyeSize, 0, Math.PI * 2);
      ctx.arc(x + eyeSpacing, y + 1, eyeSize, 0, Math.PI * 2);
      ctx.fill();

      // White eyes
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(x - eyeSpacing, y, eyeSize, 0, Math.PI * 2);
      ctx.arc(x + eyeSpacing, y, eyeSize, 0, Math.PI * 2);
      ctx.fill();

      // Pupils
      ctx.fillStyle = "#000080";
      ctx.beginPath();
      ctx.arc(x - eyeSpacing, y, 2, 0, Math.PI * 2);
      ctx.arc(x + eyeSpacing, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function checkCollisions(state: GameState): GameState {
    let { pacman, ghosts, dots, powerPellets, score, lives, powerMode } = state;
    let { ghostsEaten, powerModeTimer } = state;

    const pacmanGrid = getGridPosition(pacman.position);
    const gridKey = positionToKey(pacmanGrid);

    if (dots.has(gridKey)) {
      dots = new Set(dots);
      dots.delete(gridKey);
      score += DOT_POINTS;
    }

    if (powerPellets.has(gridKey)) {
      powerPellets = new Set(powerPellets);
      powerPellets.delete(gridKey);
      score += POWER_PELLET_POINTS;
      powerMode = true;
      powerModeTimer = POWER_MODE_DURATION;
      ghostsEaten = 0;

      ghosts = ghosts.map((ghost) =>
        ghost.mode !== "eaten"
          ? { ...ghost, mode: "frightened" as const }
          : ghost
      );
    }

    for (let i = 0; i < ghosts.length; i++) {
      const ghost = ghosts[i];
      if (isColliding(pacman.position, ghost.position, CELL_SIZE * 0.8)) {
        if (ghost.mode === "frightened") {
          score += GHOST_POINTS[Math.min(ghostsEaten, 3)];
          ghostsEaten++;
          ghosts = [...ghosts];
          ghosts[i] = { ...ghost, mode: "eaten" };
        } else if (ghost.mode !== "eaten") {
          lives--;
          if (lives <= 0) {
            return {
              ...state,
              lives: 0,
              gameStatus: "gameOver",
            };
          }

          pacman = {
            position: { x: gridToPixel(22), y: gridToPixel(38) },
            direction: "NONE",
            nextDirection: "NONE",
            mouthAngle: 0,
            mouthOpen: true,
          };

          ghosts = ghosts.map((g, idx) => {
            const startPositions = [
              { x: 12, y: 16 },
              { x: 12, y: 17 },
              { x: 11, y: 16 },
              { x: 13, y: 16 },
            ];
            return {
              ...g,
              position: {
                x: gridToPixel(startPositions[idx].x),
                y: gridToPixel(startPositions[idx].y),
              },
              mode: "scatter" as const,
            };
          });
        }
      }
    }

    if (dots.size === 0 && powerPellets.size === 0) {
      return {
        ...state,
        gameStatus: "won",
      };
    }

    return {
      ...state,
      pacman,
      ghosts,
      dots,
      powerPellets,
      score,
      lives,
      powerMode,
      powerModeTimer,
      ghostsEaten,
    };
  }

  function updateGame(state: GameState): GameState {
    if (state.gameStatus !== "playing") {
      return state;
    }

    let newState = updatePacman(state);

    newState = {
      ...newState,
      ghosts: newState.ghosts.map((ghost) => updateGhost(ghost, newState)),
    };

    newState = checkCollisions(newState);

    if (newState.powerMode) {
      let { powerModeTimer } = newState;
      powerModeTimer--;
      if (powerModeTimer <= 0) {
        newState = {
          ...newState,
          powerMode: false,
          powerModeTimer: 0,
        };
      } else {
        newState = {
          ...newState,
          powerModeTimer,
        };
      }
    }

    newState = {
      ...newState,
      animationFrame: newState.animationFrame + 1,
    };

    return newState;
  }

  function drawGame(ctx: CanvasRenderingContext2D, state: GameState) {
    // Clear background
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw walls with rounded corners
    ctx.fillStyle = COLORS.wall;
    for (let y = 0; y < MAZE_LAYOUT.length; y++) {
      for (let x = 0; x < MAZE_LAYOUT[y].length; x++) {
        if (MAZE_LAYOUT[y][x] === 1) {
          const cornerRadius = 3;
          const wallX = x * CELL_SIZE;
          const wallY = y * CELL_SIZE;

          // Check adjacent cells for rounded corner logic
          const hasTop = y > 0 && MAZE_LAYOUT[y - 1][x] === 1;
          const hasBottom = y < MAZE_LAYOUT.length - 1 && MAZE_LAYOUT[y + 1][x] === 1;
          const hasLeft = x > 0 && MAZE_LAYOUT[y][x - 1] === 1;
          const hasRight = x < MAZE_LAYOUT[y].length - 1 && MAZE_LAYOUT[y][x + 1] === 1;

          ctx.beginPath();

          if (!hasTop && !hasLeft) {
            ctx.moveTo(wallX + cornerRadius, wallY);
          } else {
            ctx.moveTo(wallX, wallY);
          }

          if (!hasTop && !hasRight) {
            ctx.lineTo(wallX + CELL_SIZE - cornerRadius, wallY);
            ctx.arcTo(wallX + CELL_SIZE, wallY, wallX + CELL_SIZE, wallY + cornerRadius, cornerRadius);
          } else {
            ctx.lineTo(wallX + CELL_SIZE, wallY);
          }

          if (!hasBottom && !hasRight) {
            ctx.lineTo(wallX + CELL_SIZE, wallY + CELL_SIZE - cornerRadius);
            ctx.arcTo(wallX + CELL_SIZE, wallY + CELL_SIZE, wallX + CELL_SIZE - cornerRadius, wallY + CELL_SIZE, cornerRadius);
          } else {
            ctx.lineTo(wallX + CELL_SIZE, wallY + CELL_SIZE);
          }

          if (!hasBottom && !hasLeft) {
            ctx.lineTo(wallX + cornerRadius, wallY + CELL_SIZE);
            ctx.arcTo(wallX, wallY + CELL_SIZE, wallX, wallY + CELL_SIZE - cornerRadius, cornerRadius);
          } else {
            ctx.lineTo(wallX, wallY + CELL_SIZE);
          }

          if (!hasTop && !hasLeft) {
            ctx.lineTo(wallX, wallY + cornerRadius);
            ctx.arcTo(wallX, wallY, wallX + cornerRadius, wallY, cornerRadius);
          } else {
            ctx.lineTo(wallX, wallY);
          }

          ctx.closePath();
          ctx.fill();
        }
      }
    }

    // Draw dots
    state.dots.forEach((key) => {
      const [x, y] = key.split(",").map(Number);
      ctx.fillStyle = COLORS.dot;
      ctx.beginPath();
      ctx.arc(gridToPixel(x), gridToPixel(y), 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw power pellets with pulsing animation
    const pulseScale = 0.85 + Math.sin(state.animationFrame * 0.15) * 0.15;
    state.powerPellets.forEach((key) => {
      const [x, y] = key.split(",").map(Number);
      ctx.fillStyle = COLORS.powerPellet;
      ctx.beginPath();
      ctx.arc(gridToPixel(x), gridToPixel(y), 4 * pulseScale, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Pacman
    const { pacman } = state;
    const mouthSize = pacman.mouthOpen ? 0.3 : 0.08;
    const angle =
      pacman.direction === "RIGHT"
        ? 0
        : pacman.direction === "DOWN"
          ? Math.PI / 2
          : pacman.direction === "LEFT"
            ? Math.PI
            : pacman.direction === "UP"
              ? (Math.PI * 3) / 2
              : 0;

    const pacmanRadius = CELL_SIZE / 2 - 1;

    // Pacman shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;

    // Pacman body with radial gradient for 3D effect
    const pacmanGradient = ctx.createRadialGradient(
      pacman.position.x - pacmanRadius / 3,
      pacman.position.y - pacmanRadius / 3,
      0,
      pacman.position.x,
      pacman.position.y,
      pacmanRadius
    );
    pacmanGradient.addColorStop(0, COLORS.pacmanGlow);
    pacmanGradient.addColorStop(0.7, COLORS.pacman);
    pacmanGradient.addColorStop(1, "#E6C200");

    ctx.fillStyle = pacmanGradient;
    ctx.beginPath();
    ctx.arc(
      pacman.position.x,
      pacman.position.y,
      pacmanRadius,
      angle + Math.PI * mouthSize,
      angle + Math.PI * (2 - mouthSize)
    );
    ctx.lineTo(pacman.position.x, pacman.position.y);
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Add subtle outline for definition
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(
      pacman.position.x,
      pacman.position.y,
      pacmanRadius,
      angle + Math.PI * mouthSize,
      angle + Math.PI * (2 - mouthSize)
    );
    ctx.lineTo(pacman.position.x, pacman.position.y);
    ctx.stroke();

    // Draw ghosts
    state.ghosts.forEach((ghost) => {
      drawGhost(ctx, ghost, state.animationFrame);
    });
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function gameLoop() {
      setGameState((prev) => {
        const newState = updateGame(prev);
        if (ctx) {
          drawGame(ctx, newState);
        }
        return newState;
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    if (gameState.gameStatus === "playing") {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.gameStatus]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawGame(ctx, gameState);
  }, [gameState]);

  return {
    canvasRef,
    gameState,
    startGame,
    pauseGame,
    resetGame,
  };
}

import { Button } from "@/components/ui/button";
import {
  PauseIcon,
  PlayCircleIcon,
  PlayIcon,
  RotateCcwIcon,
} from "lucide-react";
import type { JSX } from "react/jsx-runtime";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { usePacmanGame } from "./usePacmanGame";

export default function Pacman(): JSX.Element {
  const {
    canvasRef,
    gameState,
    startGame,
    pauseGame,
    resetGame,
    setDifficulty,
  } = usePacmanGame();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-1 text-white">
          <div className="px-4 py-2 bg-black ">
            <span className="font-semibold">LEVEL:</span>{" "}
            <span className="text-white font-bold">{gameState.level}</span>
          </div>
          <div className="px-4 py-2 bg-black ">
            <span className="font-semibold">SCORE:</span>{" "}
            <span className="text-white font-bold">{gameState.score}</span>
          </div>
          <div className="px-4 py-2 bg-black ">
            <span className="text-yellow-400 font-bold text-2xl">
              {"♥️".repeat(gameState.lives)}
            </span>
          </div>
          <div
            className={`px-4 py-2 bg-black ${
              gameState.difficulty === "easy"
                ? "border-green-600"
                : gameState.difficulty === "normal"
                  ? "border-blue-600"
                  : gameState.difficulty === "hard"
                    ? "border-orange-600"
                    : "border-red-600"
            }`}
          >
            <span className="font-semibold">DIFFICULTY:</span>{" "}
            <span
              className={`font-bold ${
                gameState.difficulty === "easy"
                  ? "text-green-400"
                  : gameState.difficulty === "normal"
                    ? "text-blue-400"
                    : gameState.difficulty === "hard"
                      ? "text-orange-400"
                      : "text-red-500"
              }`}
            >
              {gameState.difficulty.toUpperCase()}
            </span>
          </div>
        </div>
        {/* Controller */}
        <div className="flex gap-4">
          {gameState.gameStatus === "playing" && (
            <Button variant="secondary" size={"icon-sm"} onClick={pauseGame}>
              <PauseIcon />
            </Button>
          )}
        </div>

        {gameState.powerMode && (
          <div className="text-blue-500 font-bold text-2xl animate-pulse tracking-wider">
            ⚡ POWER MODE! {Math.ceil(gameState.powerModeTimer / 60)}s ⚡
          </div>
        )}

        <div className="relative">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-4 border-blue-600 rounded"
          />

          {gameState.gameStatus === "menu" && (
            <div className="absolute inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center rounded border-2 border-blue-600">
              <p className="text-white mb-6 text-lg font-mono">
                Use Arrow Keys or WASD to move
              </p>

              <div className="mb-8">
                <p className="text-white text-sm mb-3 font-mono text-center">
                  SELECT DIFFICULTY:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDifficulty("easy")}
                    className={`px-6 py-3 font-bold rounded transition-all transform hover:scale-105 ${
                      gameState.difficulty === "easy"
                        ? "bg-green-600 text-white border-2 border-green-400"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    😊 EASY
                  </button>
                  <button
                    onClick={() => setDifficulty("normal")}
                    className={`px-6 py-3 font-bold rounded transition-all transform hover:scale-105 ${
                      gameState.difficulty === "normal"
                        ? "bg-blue-600 text-white border-2 border-blue-400"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    😐 NORMAL
                  </button>
                  <button
                    onClick={() => setDifficulty("hard")}
                    className={`px-6 py-3 font-bold rounded transition-all transform hover:scale-105 ${
                      gameState.difficulty === "hard"
                        ? "bg-orange-600 text-white border-2 border-orange-400"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    😰 HARD
                  </button>
                  <button
                    onClick={() => setDifficulty("asian")}
                    className={`px-6 py-3 font-bold rounded transition-all transform hover:scale-105 ${
                      gameState.difficulty === "asian"
                        ? "bg-red-600 text-white border-2 border-red-400 animate-pulse"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    💀 ASIAN MODE
                  </button>
                </div>
              </div>

              <button
                onClick={startGame}
                className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-all transform hover:scale-105 text-xl tracking-wider"
              >
                ▶ START GAME
              </button>
            </div>
          )}

          {gameState.gameStatus === "paused" && (
            <div className="absolute inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center rounded border-2 border-blue-600 gap-2">
              <Button onClick={pauseGame}>
                <PlayIcon /> RESUME
              </Button>

              {gameState.gameStatus === "paused" && (
                <Button onClick={resetGame} variant="ghost">
                  <RotateCcwIcon />
                  Reset game
                </Button>
              )}
            </div>
          )}

          {gameState.gameStatus === "gameOver" && (
            <div className="absolute inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center rounded border-2 border-red-600">
              <h2 className="text-5xl font-bold text-red-600 mb-6 tracking-widest animate-pulse">
                GAME OVER
              </h2>
              <p className="text-white text-2xl mb-8 font-mono">
                FINAL SCORE:{" "}
                <span className="text-yellow-400 font-bold">
                  {gameState.score}
                </span>
              </p>
              <Button variant={"destructive"} onClick={resetGame}>
                ↻ PLAY AGAIN
              </Button>
            </div>
          )}

          {gameState.gameStatus === "won" && (
            <div className="absolute inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center rounded border-2 border-green-600">
              <h2 className="text-5xl font-bold text-green-500 mb-6 tracking-widest animate-pulse">
                ★ VICTORY! ★
              </h2>
              <p className="text-white text-2xl mb-8 font-mono">
                SCORE:{" "}
                <span className="text-yellow-400 font-bold">
                  {gameState.score}
                </span>
              </p>
              <button
                onClick={resetGame}
                className="px-12 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded transition-all transform hover:scale-105 text-xl tracking-wider"
              >
                ↻ PLAY AGAIN
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import type { JSX } from "react/jsx-runtime";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { usePacmanGame } from "./usePacmanGame";

export default function Pacman(): JSX.Element {
  const { canvasRef, gameState, startGame, pauseGame, resetGame } =
    usePacmanGame();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-8">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-5xl font-bold text-white tracking-widest">
          PAC-MAN
        </h1>

        <div className="flex gap-8 text-white text-lg font-mono">
          <div className="px-4 py-2 bg-black border-2 border-blue-600 rounded">
            <span className="font-semibold">SCORE:</span>{" "}
            <span className="text-white font-bold">{gameState.score}</span>
          </div>
          <div className="px-4 py-2 bg-black border-2 border-blue-600 rounded">
            <span className="font-semibold">LIVES:</span>{" "}
            <span className="text-yellow-400 font-bold text-2xl">
              {"●".repeat(gameState.lives)}
            </span>
          </div>
          <div className="px-4 py-2 bg-black border-2 border-blue-600 rounded">
            <span className="font-semibold">LEVEL:</span>{" "}
            <span className="text-white font-bold">{gameState.level}</span>
          </div>
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
              <h2 className="text-4xl font-bold text-white mb-6">
                READY TO PLAY?
              </h2>
              <p className="text-white mb-8 text-lg font-mono">
                Use Arrow Keys or WASD to move
              </p>
              <button
                onClick={startGame}
                className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-all transform hover:scale-105 text-xl tracking-wider"
              >
                ▶ START GAME
              </button>
            </div>
          )}

          {gameState.gameStatus === "paused" && (
            <div className="absolute inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center rounded border-2 border-blue-600">
              <h2 className="text-4xl font-bold text-white mb-8 tracking-widest">
                ⏸ PAUSED
              </h2>
              <button
                onClick={pauseGame}
                className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-all transform hover:scale-105 text-xl tracking-wider"
              >
                ▶ RESUME
              </button>
            </div>
          )}

          {gameState.gameStatus === "gameOver" && (
            <div className="absolute inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center rounded border-2 border-red-600">
              <h2 className="text-5xl font-bold text-red-600 mb-6 tracking-widest animate-pulse">
                GAME OVER
              </h2>
              <p className="text-white text-2xl mb-8 font-mono">
                FINAL SCORE: <span className="text-yellow-400 font-bold">{gameState.score}</span>
              </p>
              <button
                onClick={resetGame}
                className="px-12 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-all transform hover:scale-105 text-xl tracking-wider"
              >
                ↻ PLAY AGAIN
              </button>
            </div>
          )}

          {gameState.gameStatus === "won" && (
            <div className="absolute inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center rounded border-2 border-green-600">
              <h2 className="text-5xl font-bold text-green-500 mb-6 tracking-widest animate-pulse">
                ★ VICTORY! ★
              </h2>
              <p className="text-white text-2xl mb-8 font-mono">
                SCORE: <span className="text-yellow-400 font-bold">{gameState.score}</span>
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

        <div className="flex gap-4">
          {gameState.gameStatus === "playing" && (
            <button
              onClick={pauseGame}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-all transform hover:scale-105 tracking-wider"
            >
              ⏸ PAUSE
            </button>
          )}
          <button
            onClick={resetGame}
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded transition-all transform hover:scale-105 border-2 border-blue-600 tracking-wider"
          >
            ↻ RESTART
          </button>
        </div>

        <div className="text-white text-sm text-center max-w-2xl font-mono bg-gray-900 p-4 rounded border border-blue-600">
          <p className="mb-2">
            <strong>CONTROLS:</strong> Arrow Keys or WASD to move
          </p>
          <p>
            <strong>OBJECTIVE:</strong> Eat all dots while avoiding ghosts. Power
            pellets let you eat ghosts for bonus points!
          </p>
        </div>
      </div>
    </div>
  );
}

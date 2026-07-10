"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SnakeGameEngine } from "@/components/SnakeGameEngine";

export default function RetroSnakePage() {
  const [gameState, setGameState] = useState({
    score: 0,
    highScore: 0,
    gameOver: false,
    paused: false,
  });

  const [dimensions, setDimensions] = useState({ width: 40, height: 30 });

  useEffect(() => {
    const updateDimensions = () => {
      const maxWidth = Math.min(window.innerWidth - 40, 600);
      const maxHeight = Math.min(window.innerHeight - 100, 500);
      
      const cols = Math.floor(maxWidth / 20);
      const rows = Math.floor(maxHeight / 20);
      
      setDimensions({
        width: Math.min(cols, 50),
        height: Math.min(rows, 40),
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleGameOver = (score: number) => {
    const newHighScore = Math.max(score, gameState.highScore);
    setGameState({
      score: 0,
      highScore: newHighScore,
      gameOver: true,
      paused: false,
    });
  };

  const handleScoreUpdate = (score: number) => {
    setGameState((prev) => ({
      ...prev,
      score,
    }));
  };

  const resetGame = () => {
    setGameState({
      score: 0,
      highScore: gameState.highScore,
      gameOver: false,
      paused: false,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col items-center">
      <header className="w-full max-w-4xl flex justify-between items-center py-4 px-4">
        <h1 className="font-pixel text-xl text-white">Retro Snake</h1>
        <div className="flex items-center gap-4">
          <div className="font-pixel text-xs text-gray-300">
            Score: <span className="text-green-400">{gameState.score}</span>
          </div>
          <div className="font-pixel text-xs text-gray-300">
            High: <span className="text-amber-400">{gameState.highScore}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center p-4">
        <div className="relative">
          <SnakeGameEngine
            width={dimensions.width}
            height={dimensions.height}
            onGameOver={handleGameOver}
            onScoreUpdate={handleScoreUpdate}
          />

          {gameState.gameOver && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
              <div className="text-center p-6">
                <h2 className="font-pixel text-2xl text-white mb-4">
                  Game Over!
                </h2>
                <p className="font-pixel text-xs text-gray-300 mb-4">
                  Final Score: {gameState.score}
                </p>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-pixel text-xs rounded transition-colors"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 w-full max-w-4xl">
          <div className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-4">
            <h3 className="font-pixel text-xs text-gray-400 mb-3">Controls</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-xs">←→↑↓</span>
                <span className="text-gray-300">Arrow Keys</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-xs">P</span>
                <span className="text-gray-300">Pause</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-xs">R</span>
                <span className="text-gray-300">Restart</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-xs">Touch</span>
                <span className="text-gray-300">Swipe (Mobile)</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
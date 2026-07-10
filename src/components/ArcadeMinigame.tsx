"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

interface ArcadeMinigameProps {
  className?: string;
  onGameOver?: (score: number) => void;
  initialScore?: number;
}

interface GameState {
  paddle: { x: number; y: number; width: number; height: number };
  ball: { x: number; y: number; dx: number; dy: number; radius: number };
  bricks: Array<{ x: number; y: number; width: number; height: number; hits: number }>;
  score: number;
  lives: number;
  isStarted: boolean;
  isGameOver: boolean;
}

export default function ArcadeMinigame({ 
  className, 
  onGameOver,
  initialScore = 0 
}: ArcadeMinigameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const gameStateRef = useRef<GameState | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isClient = useRef(false);

  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 300;

  const initGame = useCallback(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    gameStateRef.current = {
      paddle: {
        x: (CANVAS_WIDTH - 100) / 2,
        y: CANVAS_HEIGHT - 20,
        width: 100,
        height: 10
      },
      ball: {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        dx: 2 + Math.random() * 2,
        dy: -2 - Math.random() * 2,
        radius: 5
      },
      bricks: [],
      score: initialScore,
      lives: 3,
      isStarted: false,
      isGameOver: false
    };

    // Create bricks
    const initialBricks = [];
    const rows = 5;
    const cols = 8;
    const brickWidth = 45;
    const brickHeight = 15;
    const brickPadding = 5;
    const offsetTop = 40;
    const offsetLeft = 15;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const brickX = offsetLeft + col * (brickWidth + brickPadding);
        const brickY = offsetTop + row * (brickHeight + brickPadding);
        initialBricks.push({
          x: brickX,
          y: brickY,
          width: brickWidth,
          height: brickHeight,
          hits: 1
        });
      }
    }

    gameStateRef.current.bricks = initialBricks;

    draw();
  }, [initialScore]);

  useEffect(() => {
    isClient.current = true;
    initGame();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initGame]);

  const update = () => {
    if (!gameStateRef.current) return;

    const state = gameStateRef.current;
    if (!state.isStarted || state.isGameOver) return;

    const { ball, paddle, bricks } = state;

    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collisions
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > CANVAS_WIDTH) {
      ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
    }

    // Bottom collision (lose a life)
    if (ball.y + ball.radius > CANVAS_HEIGHT) {
      state.lives--;
      if (state.lives <= 0) {
        state.isGameOver = true;
        onGameOver?.(state.score);
        draw();
        return;
      } else {
        // Reset ball
        ball.x = CANVAS_WIDTH / 2;
        ball.y = CANVAS_HEIGHT / 2;
        ball.dx = 2 + Math.random() * 2;
        ball.dy = -2 - Math.random() * 2;
      }
    }

    // Paddle collision
    if (
      ball.y + ball.radius > paddle.y &&
      ball.y - ball.radius < paddle.y + paddle.height &&
      ball.x > paddle.x &&
      ball.x < paddle.x + paddle.width
    ) {
      ball.dy = -Math.abs(ball.dy) * 1.1;
      const hitPos = (ball.x - paddle.x - paddle.width / 2) / (paddle.width / 2);
      ball.dx = ball.dx + hitPos * 2;
    }

    // Check brick collisions
    state.bricks = state.bricks.map(brick => {
      const collided = (
        ball.x + ball.radius > brick.x &&
        ball.x - ball.radius < brick.x + brick.width &&
        ball.y + ball.radius > brick.y &&
        ball.y - ball.radius < brick.y + brick.height
      );

      if (collided) {
        state.score += 10;
        ball.dy = -ball.dy * 1.1;
        return { ...brick, hits: brick.hits - 1 };
      }
      return brick;
    }).filter(brick => brick.hits > 0);

    // Check win condition
    if (state.bricks.length === 0) {
      state.isGameOver = true;
      onGameOver?.(state.score + 100);
      draw();
    }
  };

  const draw = () => {
    if (!canvasRef.current) return;
    if (!gameStateRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw bricks
    state.bricks.forEach(brick => {
      ctx.fillStyle = brick.hits > 1 ? '#ff6600' : '#00ff00';
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
    });

    // Draw paddle
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(state.paddle.x, state.paddle.y, state.paddle.width, state.paddle.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff00ff';
    ctx.fill();

    // Draw score and lives
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.fillText(`Score: ${state.score}`, 10, 20);
    ctx.fillText(`Lives: ${state.lives}`, 10, 40);
  };

  const gameLoop = () => {
    if (!gameStateRef.current) return;
    
    update();
    draw();
    
    if (!gameStateRef.current.isGameOver) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!gameStateRef.current) return;
    const state = gameStateRef.current;
    if (!state.isStarted || state.isGameOver) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    state.paddle.x = Math.max(0, Math.min(x - state.paddle.width / 2, CANVAS_WIDTH - state.paddle.width));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!gameStateRef.current) return;
    const state = gameStateRef.current;
    if (!state.isStarted || state.isGameOver) return;

    const touch = e.touches[0];
    if (touch) {
      touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gameStateRef.current) return;
    const state = gameStateRef.current;
    if (!state.isStarted || state.isGameOver || !touchStartPos.current) return;

    const touch = e.touches[0];
    if (touch) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const deltaX = touch.clientX - touchStartPos.current.x;
      state.paddle.x = Math.max(0, Math.min(state.paddle.x + deltaX - state.paddle.width / 2, CANVAS_WIDTH - state.paddle.width));
      touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  useEffect(() => {
    if (!isClient.current) return;
    
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove as any);
      canvas.addEventListener('touchstart', handleTouchStart as any, { passive: true });
      canvas.addEventListener('touchmove', handleTouchMove as any, { passive: true });
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove as any);
        canvas.removeEventListener('touchstart', handleTouchStart as any);
        canvas.removeEventListener('touchmove', handleTouchMove as any);
      }
    };
  });

  const startGame = () => {
    if (!gameStateRef.current) return;
    gameStateRef.current.isStarted = true;
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  const restartGame = () => {
    initGame();
    startGame();
  };

  if (!isClient.current) {
    return (
      <div className={`w-full ${className || ''}`}>
        <div className="retro-card">
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  const gameState = gameStateRef.current!;

  return (
    <div className={`arcade-minigame ${className || ''}`}>
      {!gameState.isStarted && !gameState.isGameOver && (
        <div className="retro-card mb-4">
          <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font">
              🕹️ Brick Breaker Classic
            </h3>
          </div>
          <div className="p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 pixel-font mb-4">
              Klik atau ketuk untuk mula. Usahakan untuk pecahkan semua blok!
            </p>
            <button
              onClick={startGame}
              className="retro-btn-primary text-sm px-4 py-2"
            >
              Mula
            </button>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-2 border-gray-400 dark:border-gray-500 rounded-pixel bg-black"
        style={{ display: gameState.isStarted || gameState.isGameOver ? 'block' : 'none' }}
      />

      {gameState.isGameOver && (
        <div className="retro-card mt-4">
          <div className="retro-card-header bg-red-100 dark:bg-red-900 px-4 py-2 border-b border-red-300 dark:border-red-600">
            <h3 className="text-lg font-bold text-red-800 dark:text-red-200 pixel-font">
              Game Over
            </h3>
          </div>
          <div className="p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 pixel-font mb-4">
              Skor akhir: {gameState.score}
            </p>
            <button
              onClick={restartGame}
              className="retro-btn-primary text-sm px-4 py-2"
            >
              Cuba Lagi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

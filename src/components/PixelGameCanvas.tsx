"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

interface PixelGameCanvasProps {
  className?: string;
  width?: number;
  height?: number;
  onScoreUpdate?: (score: number) => void;
  onGameOver?: (score: number) => void;
  initialScore?: number;
  autoStart?: boolean;
}

export default function PixelGameCanvas({
  className,
  width = 400,
  height = 300,
  onScoreUpdate,
  onGameOver,
  initialScore = 0,
  autoStart = false
}: PixelGameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const gameStateRef = useRef<{
    paddle: { x: number; y: number; width: number; height: number };
    ball: { x: number; y: number; dx: number; dy: number; radius: number };
    bricks: Array<{ x: number; y: number; width: number; height: number; hits: number }>;
    score: number;
    lives: number;
    isStarted: boolean;
    isGameOver: boolean;
  } | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const [isClient, setIsClient] = useState(false);

  const initGame = useCallback(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    gameStateRef.current = {
      paddle: {
        x: (width - 100) / 2,
        y: height - 20,
        width: 100,
        height: 10
      },
      ball: {
        x: width / 2,
        y: height / 2,
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
  }, [width, height, initialScore]);

  useEffect(() => {
    setIsClient(true);
    initGame();

    if (autoStart && gameStateRef.current) {
      gameStateRef.current.isStarted = true;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initGame, autoStart]);

  const update = () => {
    if (!gameStateRef.current) return;

    const state = gameStateRef.current;
    if (!state.isStarted || state.isGameOver) return;

    const { ball, paddle, bricks } = state;

    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collisions
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > width) {
      ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
    }

    // Bottom collision (lose a life)
    if (ball.y + ball.radius > height) {
      state.lives--;
      if (state.lives <= 0) {
        state.isGameOver = true;
        onGameOver?.(state.score);
        draw();
        return;
      } else {
        // Reset ball
        ball.x = width / 2;
        ball.y = height / 2;
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
        onScoreUpdate?.(state.score);
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

    // Clear canvas with CRT-style scanlines
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Draw scanlines for CRT effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 2);
    }

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

  const startGame = () => {
    if (!gameStateRef.current) return;
    gameStateRef.current.isStarted = true;
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  const restartGame = () => {
    initGame();
    if (autoStart) {
      startGame();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!gameStateRef.current) return;
    const state = gameStateRef.current;
    if (!state.isStarted || state.isGameOver) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    state.paddle.x = Math.max(0, Math.min(x - state.paddle.width / 2, width - state.paddle.width));
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
      state.paddle.x = Math.max(0, Math.min(state.paddle.x + deltaX - state.paddle.width / 2, width - state.paddle.width));
      touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  useEffect(() => {
    if (!isClient) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousemove', handleMouseMove as any);
    canvas.addEventListener('touchstart', handleTouchStart as any, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove as any, { passive: true });

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove as any);
      canvas.removeEventListener('touchstart', handleTouchStart as any);
      canvas.removeEventListener('touchmove', handleTouchMove as any);
    };
  }, [isClient, width]);

  // Expose methods via ref-like pattern
  const gameAPI = {
    start: startGame,
    restart: restartGame,
    getGameState: () => gameStateRef.current,
    getCanvas: () => canvasRef.current,
    init: initGame
  };

  if (!isClient) {
    return (
      <div className={`pixel-game-canvas ${className || ''}`}>
        <div className="retro-card p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className={`pixel-game-canvas ${className || ''}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border-2 border-gray-400 dark:border-gray-500 rounded-pixel bg-black"
      />
    </div>
  );
}
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';

interface ArcadeGameProps {
  className?: string;
}

interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  isBroken: boolean;
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  speed: number;
}

const COLORS = ['#ff007f', '#00ffff', '#ff0000', '#00ff00', '#ffff00', '#ff00ff'];
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 15;
const PADDLE_SPEED = 8;
const BALL_SPEED = 3;
const BLOCK_WIDTH = 60;
const BLOCK_HEIGHT = 20;
const BLOCK_PADDING = 5;

export default function ArcadeGame({ className }: ArcadeGameProps) {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const paddleRef = useRef<{ x: number; y: number; width: number; height: number }>({
    x: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
    y: CANVAS_HEIGHT - 30,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
  });
  
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [paddleStartX, setPaddleStartX] = useState(0);

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [ball, setBall] = useState<Ball>({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    dx: BALL_SPEED,
    dy: -BALL_SPEED,
    radius: 8,
    speed: BALL_SPEED
  });

  // Initialize blocks
  useEffect(() => {
    const initialBlocks: Block[] = [];
    const rows = 4;
    const cols = 7;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        initialBlocks.push({
          x: col * (BLOCK_WIDTH + BLOCK_PADDING) + 35,
          y: row * (BLOCK_HEIGHT + BLOCK_PADDING) + 50,
          width: BLOCK_WIDTH,
          height: BLOCK_HEIGHT,
          color: COLORS[row % COLORS.length],
          isBroken: false
        });
      }
    }
    setBlocks(initialBlocks);
  }, []);

  const resetBall = useCallback(() => {
    setBall({
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      dx: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED,
      dy: -BALL_SPEED,
      radius: 8,
      speed: BALL_SPEED
    });
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    setIsStarted(false);
    resetBall();
    
    const initialBlocks: Block[] = [];
    const rows = 4;
    const cols = 7;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        initialBlocks.push({
          x: col * (BLOCK_WIDTH + BLOCK_PADDING) + 35,
          y: row * (BLOCK_HEIGHT + BLOCK_PADDING) + 50,
          width: BLOCK_WIDTH,
          height: BLOCK_HEIGHT,
          color: COLORS[row % COLORS.length],
          isBroken: false
        });
      }
    }
    setBlocks(initialBlocks);
  }, [resetBall]);

  const gameLoop = useCallback(() => {
    if (!canvasRef.current || !isStarted || gameOver) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw blocks
    blocks.forEach(block => {
      if (!block.isBroken) {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.width, block.height);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(block.x, block.y, block.width, block.height);
      }
    });

    // Draw paddle
    const paddle = paddleRef.current;
    ctx.fillStyle = '#ff007f';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffff00';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Update ball position
    let newX = ball.x + ball.dx;
    let newY = ball.y + ball.dy;

    // Wall collisions
    if (newX - ball.radius < 0 || newX + ball.radius > CANVAS_WIDTH) {
      setBall(prev => ({ ...prev, dx: -prev.dx }));
      newX = ball.x + ball.dx;
    }

    if (newY - ball.radius < 0) {
      setBall(prev => ({ ...prev, dy: -prev.dy }));
      newY = ball.y + ball.dy;
    }

    // Paddle collision
    if (
      newY + ball.radius > paddle.y &&
      newY - ball.radius < paddle.y + paddle.height &&
      newX > paddle.x &&
      newX < paddle.x + paddle.width
    ) {
      setBall(prev => ({ 
        ...prev, 
        dy: -Math.abs(prev.dy),
        dx: prev.dx + (Math.random() - 0.5) * 2
      }));
      newY = ball.y + ball.dy;
    }

    // Block collisions
    let newBlocks = [...blocks];
    let blockHit = false;
    
    newBlocks.forEach((block, index) => {
      if (!block.isBroken) {
        if (
          newX + ball.radius > block.x &&
          newX - ball.radius < block.x + block.width &&
          newY + ball.radius > block.y &&
          newY - ball.radius < block.y + block.height
        ) {
          newBlocks[index] = { ...block, isBroken: true };
          setBall(prev => ({ ...prev, dy: -prev.dy }));
          setScore(prev => prev + 10);
          blockHit = true;
        }
      }
    });

    if (!blockHit) {
      setBlocks(newBlocks);
    }

    // Check if ball is below paddle (game over)
    if (newY - ball.radius > CANVAS_HEIGHT) {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameOver(true);
        } else {
          resetBall();
        }
        return newLives;
      });
    } else {
      setBall(prev => ({ ...prev, x: newX, y: newY }));
    }

    // Check for win condition
    if (blocks.every(block => block.isBroken)) {
      setScore(prev => prev + 100);
      setGameOver(true);
    }

    // Continue animation
    if (!gameOver) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  }, [isStarted, gameOver, blocks, ball, score, resetBall]);

  useEffect(() => {
    if (isStarted && !gameOver) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isStarted, gameOver, gameLoop]);

  const handleStart = () => {
    if (!isStarted && !gameOver) {
      setIsStarted(true);
    }
  };

  const handleRestart = () => {
    resetGame();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    if (isDragging) {
      const deltaX = x - dragStartX;
      const newX = Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, paddleStartX + deltaX));
      paddleRef.current = {
        ...paddleRef.current,
        x: newX
      };
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    
    setDragStartX(x);
    setPaddleStartX(paddleRef.current.x);
    setIsDragging(true);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    
    const deltaX = x - dragStartX;
    const newX = Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, paddleStartX + deltaX));
    paddleRef.current = {
      ...paddleRef.current,
      x: newX
    };
  };

  if (gameOver) {
    return (
      <div className={`arcade-game ${className || ''}`}>
        <div className="retro-window-client p-4 text-center">
          <h3 className="text-xl font-bold text-yellow-400 pixel-font mb-2">
            🎮 {language === 'ms' ? 'Permainan Selesai!' : 'Game Over!'}
          </h3>
          <p className="text-sm text-gray-300 pixel-font mb-4">
            {language === 'ms' ? 'Skor akhir:' : 'Final Score:'} {score}
          </p>
          <button
            onClick={handleRestart}
            className="retro-btn-primary text-sm px-4 py-2"
          >
            {language === 'ms' ? 'Main Lagi' : 'Play Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`arcade-game ${className || ''}`}>
      <div className="retro-window-client p-4">
        {/* Start: Game Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-4 text-sm pixel-font">
            <span className="text-red-400">
              ❤️ {lives}
            </span>
            <span className="text-green-400">
              📊 {score}
            </span>
          </div>
          <h3 className="text-lg font-bold text-cyan-400 pixel-font">
            Kafe Siber Arcade
          </h3>
        </div>
        {/* End: Game Header */}

        {/* Start: Game Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-2 border-gray-500 rounded-pixel bg-black"
            onMouseDown={handleStart}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onMouseMove={handleMouseMove}
          />
          
          {!isStarted && !gameOver && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 rounded-pixel cursor-pointer"
              onClick={handleStart}
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-cyan-400 pixel-font mb-4">
                  Klik untuk Mula
                </h2>
                <p className="text-sm text-gray-300 pixel-font mb-2">
                  {language === 'ms' 
                    ? 'Gulakan papan untuk kawal paddenya' 
                    : 'Use mouse/touch to control the paddle'}
                </p>
                <p className="text-xs text-gray-500 pixel-font">
                  {language === 'ms' 
                    ? 'Klik atau ketuk untuk memulakan permainan' 
                    : 'Click or tap to start the game'}
                </p>
              </div>
            </div>
          )}
        </div>
        {/* End: Game Canvas */}

        {/* Start: Game Controls */}
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={gameOver ? handleRestart : () => setIsStarted(false)}
            className="retro-btn-secondary text-xs px-3 py-1"
          >
            {gameOver 
              ? (language === 'ms' ? 'Main Lagi' : 'Restart') 
              : (language === 'ms' ? 'Berhenti' : 'Stop')}
          </button>
        </div>
        {/* End: Game Controls */}
      </div>
    </div>
  );
}

/**
 * Hook for controlling the arcade game
 */
export function useArcadeGame() {
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  const startGame = () => setIsRunning(true);
  const stopGame = () => setIsRunning(false);
  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setIsRunning(false);
  };

  return { isRunning, score, level, startGame, stopGame, resetGame, setScore, setLevel };
}
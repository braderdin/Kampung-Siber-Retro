"use client";

import { useRef, useEffect, useCallback } from 'react';

interface PongGameEngineProps {
  width?: number;
  height?: number;
  className?: string;
}

interface Ball {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
}

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function PongGameEngine({ 
  width = 800, 
  height = 400, 
  className 
}: PongGameEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballRef = useRef<Ball>({
    x: 400,
    y: 200,
    width: 12,
    height: 12,
    velocityX: 5,
    velocityY: 3,
  });
  const paddleRef = useRef<Paddle>({
    x: 375,
    y: 370,
    width: 100,
    height: 15,
  });
  const scoreRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const keysPressedRef = useRef<Set<string>>(new Set());
  const touchPositionRef = useRef<number | null>(null);

  const resetBall = useCallback(() => {
    ballRef.current.x = width / 2;
    ballRef.current.y = height / 2;
    ballRef.current.velocityX = Math.random() > 0.5 ? 5 : -5;
    ballRef.current.velocityY = -3;
    scoreRef.current = 0;
  }, [width, height]);

  const updateGame = useCallback(() => {
    const ball = ballRef.current;
    const paddle = paddleRef.current;

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.x <= 0 || ball.x + ball.width >= width) {
      ball.velocityX = -ball.velocityX;
    }
    
    if (ball.y <= 0) {
      ball.velocityY = -ball.velocityY;
    }

    if (ball.y + ball.height >= height) {
      resetBall();
    }

    if (
      ball.y + ball.height >= paddle.y &&
      ball.x + ball.width >= paddle.x &&
      ball.x <= paddle.x + paddle.width
    ) {
      ball.velocityY = -Math.abs(ball.velocityY);
      ball.velocityX = ball.velocityX + (Math.random() * 2 - 1);
      scoreRef.current += 10;

      const maxSpeed = 10;
      if (Math.abs(ball.velocityX) < maxSpeed) {
        ball.velocityX *= 1.1;
      }
      if (Math.abs(ball.velocityY) < maxSpeed) {
        ball.velocityY *= 1.1;
      }
    }

    if (touchPositionRef.current !== null) {
      paddle.x = touchPositionRef.current - paddle.width / 2;
    } else {
      if (keysPressedRef.current.has('ArrowLeft')) {
        paddle.x = Math.max(0, paddle.x - 8);
      }
      if (keysPressedRef.current.has('ArrowRight')) {
        paddle.x = Math.min(width - paddle.width, paddle.x + 8);
      }
    }
  }, [width, height, resetBall]);

  const drawGame = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const gridSpacing = 30;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < width; i += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    const ball = ballRef.current;
    const paddle = paddleRef.current;

    ctx.fillStyle = '#00ff00';
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 10;
    ctx.fillRect(ball.x, ball.y, ball.width, ball.height);

    ctx.fillStyle = '#ffff00';
    ctx.shadowColor = '#ffff00';
    ctx.shadowBlur = 15;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`SCORE: ${scoreRef.current}`, width / 2, 30);
  }, [width, height]);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updateGame();
    drawGame(ctx);

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [updateGame, drawGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current.add(e.key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current.delete(e.key);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left;
      touchPositionRef.current = touchX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left;
      touchPositionRef.current = touchX;
    };

    const handleTouchEnd = () => {
      touchPositionRef.current = null;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [width, height, gameLoop]);

  return (
    <canvas
      ref={canvasRef}
      className={`border-4 border-gray-700 ${className || ''}`}
      style={{ width: '100%', height: 'auto', maxWidth: `${width}px` }}
    />
  );
}

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { playArcadeSound, SoundEffect } from "@/components/ArcadeSoundSynthesizer";

interface SnakeGameEngineProps {
  width: number;
  height: number;
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

type Direction = "up" | "down" | "left" | "right";

interface Position {
  x: number;
  y: number;
}

const CELL_SIZE = 20;
const GAME_SPEED = 150;

export const SnakeGameEngine: React.FC<SnakeGameEngineProps> = ({
  width,
  height,
  onGameOver,
  onScoreUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef<Direction>("right");
  const nextDirectionRef = useRef<Direction>("right");
  const [isRunning, setIsRunning] = useState(true);

  const [snake, setSnake] = useState<Position[]>([]);
  const [food, setFood] = useState<Position>({ x: 0, y: 0 });
  const [score, setScore] = useState(0);

  const initGame = useCallback(() => {
    const startX = Math.floor(width / 2);
    const startY = Math.floor(height / 2);
    
    setSnake([
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
    ]);
    
    setDirection("right");
    setFood(generateFood(width, height, [{ x: startX, y: startY }]));
    setScore(0);
    onScoreUpdate(0);
  }, [width, height, onScoreUpdate]);

  const [direction, setDirection] = useState<Direction>("right");

  const generateFood = useCallback((w: number, h: number, snakeBody: Position[]) => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * w),
        y: Math.floor(Math.random() * h),
      };
    } while (snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      let newHead: Position;

      switch (nextDirectionRef.current) {
        case "up":
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case "down":
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case "left":
          newHead = { x: head.x - 1, y: head.y };
          break;
        case "right":
          newHead = { x: head.x + 1, y: head.y };
          break;
        default:
          newHead = head;
      }

      const hitWall = newHead.x < 0 || newHead.x >= width || newHead.y < 0 || newHead.y >= height;
      const hitSelf = prevSnake.some((segment, index) => 
        index > 0 && segment.x === newHead.x && segment.y === newHead.y
      );

      if (hitWall || hitSelf) {
        setIsRunning(false);
        onGameOver(score);
        playArcadeSound('gameOver');
        return prevSnake;
      }

      setDirection(nextDirectionRef.current);

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setFood(generateFood(width, height, newSnake));
        const newScore = score + 10;
        setScore(newScore);
        onScoreUpdate(newScore);
        playArcadeSound('crash');
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [width, height, food, score, onGameOver, onScoreUpdate, generateFood]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    if (isRunning) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isRunning, moveSnake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isRunning) return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          if (direction !== "down") nextDirectionRef.current = "up";
          break;
        case "ArrowDown":
          e.preventDefault();
          if (direction !== "up") nextDirectionRef.current = "down";
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (direction !== "right") nextDirectionRef.current = "left";
          break;
        case "ArrowRight":
          e.preventDefault();
          if (direction !== "left") nextDirectionRef.current = "right";
          break;
        case "p":
        case "P":
          setIsRunning(prev => !prev);
          break;
        case "r":
        case "R":
          initGame();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunning, direction, initGame]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (!isRunning || snake.length < 2) return;
      
      const touch = e.touches[0];
      const head = snake[0];
      
      const deltaX = touch.clientX - head.x * CELL_SIZE;
      const deltaY = touch.clientY - head.y * CELL_SIZE;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && direction !== "left") nextDirectionRef.current = "right";
        else if (deltaX < 0 && direction !== "right") nextDirectionRef.current = "left";
      } else {
        if (deltaY > 0 && direction !== "up") nextDirectionRef.current = "down";
        else if (deltaY < 0 && direction !== "down") nextDirectionRef.current = "up";
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("touchstart", handleTouchStart as any);
      return () => canvas.removeEventListener("touchstart", handleTouchStart as any);
    }
  }, [snake, direction, isRunning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellWidth = canvas.width / width;
    const cellHeight = canvas.height / height;

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#1a1a1a";
    for (let x = 0; x < width; x++) {
      ctx.fillRect(x * cellWidth, 0, cellWidth, canvas.height);
    }

    ctx.fillStyle = "#00ff00";
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "#00ff44" : "#00ff00";
      ctx.fillRect(
        segment.x * cellWidth,
        segment.y * cellHeight,
        cellWidth,
        cellHeight
      );
    });

    ctx.fillStyle = "#ff0000";
    ctx.fillRect(
      food.x * cellWidth,
      food.y * cellHeight,
      cellWidth,
      cellHeight
    );

    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  }, [snake, food, width, height]);

  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        width={width * CELL_SIZE}
        height={height * CELL_SIZE}
        className="border-2 border-gray-600 rounded"
        style={{ imageRendering: "pixelated" }}
      />
      
      {!isRunning && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded pointer-events-none">
          <span className="font-pixel text-xs text-white">Game Over</span>
        </div>
      )}
    </div>
  );
};

export default SnakeGameEngine;

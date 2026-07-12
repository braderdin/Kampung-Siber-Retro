"use client";

import React from 'react';

interface ReputationLevelBadgeProps {
  reputation: number;
}

interface LevelConfig {
  name: string;
  minReputation: number;
  color: string;
  icon: string;
}

const LEVELS: LevelConfig[] = [
  { name: 'Novice', minReputation: 0, color: 'bg-gray-500', icon: '🌱' },
  { name: 'Resident', minReputation: 100, color: 'bg-blue-500', icon: '🏠' },
  { name: 'Veteran', minReputation: 500, color: 'bg-purple-500', icon: '🏆' },
  { name: 'Cyber-Legend', minReputation: 1000, color: 'bg-pink-500', icon: '👑' },
];

export default function ReputationLevelBadge({ reputation }: ReputationLevelBadgeProps) {
  const getCurrentLevel = (): LevelConfig => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (reputation >= LEVELS[i].minReputation) {
        return LEVELS[i];
      }
    }
    return LEVELS[0];
  };

  const level = getCurrentLevel();

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${level.color}/20 border ${level.color}/50`}>
      <span className="text-lg">{level.icon}</span>
      <span className="font-bold text-sm pixel-font text-gray-800 dark:text-gray-200">
        {level.name}
      </span>
      <span className="text-xs text-gray-600 dark:text-gray-400">
        ({reputation} rep)
      </span>
    </div>
  );
}

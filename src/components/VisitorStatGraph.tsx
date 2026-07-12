"use client";

import { useState, useEffect } from 'react';

interface VisitorStatGraphProps {
  title?: string;
  height?: number;
  className?: string;
}

interface StatData {
  label: string;
  value: number;
  max: number;
}

export default function VisitorStatGraph({ 
  title = 'Visitor Statistics',
  height = 120,
  className
}: VisitorStatGraphProps) {
  const [stats, setStats] = useState<StatData[]>([]);

  useEffect(() => {
    const generateMockData = () => {
      const data: StatData[] = [];
      const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      
      labels.forEach((label, index) => {
        data.push({
          label,
          value: Math.floor(Math.random() * 50) + 10,
          max: 60
        });
      });
      
      return data;
    };

    setStats(generateMockData());
  }, []);

  const maxValue = Math.max(...stats.map(s => s.value), 1);

  const barHeight = (value: number) => {
    return (value / maxValue) * height;
  };

  const getBarColor = (index: number) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
    return colors[index % colors.length];
  };

  return (
    <div className={`retro-window ${className || ''}`}>
      {/* Start: Window Header */}
      <div className="retro-window-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
          <span className="mr-2">📊</span>
          {title}
        </h3>
      </div>
      {/* End: Window Header */}

      {/* Start: Window Content */}
      <div className="p-3">
        <div className="flex items-end justify-around h-32 mb-2">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="w-6 rounded-t transition-all duration-300"
                style={{
                  height: `${barHeight(stat.value)}px`,
                  backgroundColor: getBarColor(index),
                  boxShadow: `0 2px 4px ${getBarColor(index)}44`,
                }}
              >
                {/* Start: Bar Content */}
                <div className="h-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {stat.value}
                  </span>
                </div>
                {/* End: Bar Content */}
              </div>
              <span className="mt-1 text-xs text-gray-600 dark:text-gray-400 pixel-font">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
        {/* End: Bar Chart */}

        {/* Start: Legend / Stats Summary */}
        <div className="retro-controls-grid">
          <div className="retro-control-item">
            <span className="retro-control-label">📈</span>
            <span className="retro-control-name">Peak</span>
          </div>
          <div className="retro-control-item">
            <span className="retro-control-label">📉</span>
            <span className="retro-control-name">Trough</span>
          </div>
          <div className="retro-control-item">
            <span className="retro-control-label">🔥</span>
            <span className="retro-control-name">Spike</span>
          </div>
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400 pixel-font">
          <span>Max: {maxValue}</span>
          <span>Avg: {Math.round(stats.reduce((sum, s) => sum + s.value, 0) / stats.length)}</span>
        </div>
        {/* End: Legend / Stats Summary */}
      </div>
      {/* End: Window Content */}
    </div>
  );
}

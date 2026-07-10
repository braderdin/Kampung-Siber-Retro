"use client";

import React, { useState, useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

interface MaintenanceBannerProps {
  message?: string;
  scheduledTime?: string;
  duration?: number;
  className?: string;
}

export const MaintenanceBanner: React.FC<MaintenanceBannerProps> = ({
  message = "Scheduled maintenance will begin shortly",
  scheduledTime,
  duration = 3600,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const { currentTheme } = useThemeStore();

  useEffect(() => {
    const checkMaintenanceStatus = async () => {
      try {
        const response = await fetch("/api/maintenance/status", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsVisible(data.isActive);
          if (data.duration) {
            setTimeLeft(data.duration);
          }
        }
      } catch (error) {
        console.error("Failed to check maintenance status:", error);
      }
    };

    checkMaintenanceStatus();

    const interval = setInterval(checkMaintenanceStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isVisible || !scheduledTime) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          setIsVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, scheduledTime]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  if (!isVisible) return null;

  const getThemeColors = () => {
    switch (currentTheme) {
      case "matrix":
        return {
          bg: "bg-green-900/80",
          border: "border-green-500/50",
          text: "text-green-200",
          accent: "text-green-400",
        };
      case "gray":
        return {
          bg: "bg-gray-800/80",
          border: "border-gray-600/50",
          text: "text-gray-200",
          accent: "text-amber-400",
        };
      default:
        return {
          bg: "bg-blue-900/80",
          border: "border-blue-500/50",
          text: "text-blue-200",
          accent: "text-blue-400",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${colors.bg} ${colors.border} border-b-2 ${className}`}>
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="animate-pulse">
            <span className="font-pixel text-xs">*</span>
          </div>
          <span className={`font-pixel text-xs ${colors.text}`}>
            {message}
          </span>
          {scheduledTime && (
            <span className={`font-pixel text-xs ${colors.accent}`}>
              (Starting in {formatTime(timeLeft)})
            </span>
          )}
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="font-pixel text-xs hover:opacity-80 transition-opacity"
          aria-label="Close maintenance banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default MaintenanceBanner;
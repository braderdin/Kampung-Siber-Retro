"use client";

import React, { useState, useEffect } from "react";

interface BlinkingHazardMarkerProps {
  fileSize?: number;
  maxFileSize?: number;
  className?: string;
}

export const BlinkingHazardMarker: React.FC<BlinkingHazardMarkerProps> = ({
  fileSize = 0,
  maxFileSize = 5000000,
  className = "",
}) => {
  const [shouldBlink, setShouldBlink] = useState(false);

  useEffect(() => {
    if (fileSize > maxFileSize * 0.9) {
      setShouldBlink(true);
    } else {
      setShouldBlink(false);
    }
  }, [fileSize, maxFileSize]);

  const getPercentage = () => {
    return Math.min((fileSize / maxFileSize) * 100, 100);
  };

  const getWarningLevel = () => {
    const percent = getPercentage();
    if (percent >= 100) return "critical";
    if (percent >= 90) return "warning";
    if (percent >= 75) return "caution";
    return "safe";
  };

  const level = getWarningLevel();

  return (
    <div className={`inline-block ${className}`}>
      <div className="relative inline-block">
        <div
          className={`w-4 h-4 rounded-full ${
            level === "critical"
              ? "bg-red-500"
              : level === "warning"
              ? "bg-amber-500"
              : "bg-yellow-500"
          } ${shouldBlink ? "animate-pulse" : ""}`}
        />
        
        {shouldBlink && (
          <style jsx>{`
            @keyframes hazard-blink {
              0%, 50% { opacity: 1; }
              51%, 100% { opacity: 0; }
            }
            .animate-pulse {
              animation: hazard-blink 1s step-end infinite;
            }
          `}</style>
        )}

        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
          <span className="font-pixel text-xs text-gray-400 whitespace-nowrap">
            {level === "critical" ? "File size exceeded!" : 
             level === "warning" ? "Approaching limit" : 
             "File size"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlinkingHazardMarker;

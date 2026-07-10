"use client";

import React, { useState } from "react";

interface AssetRatingStarsProps {
  initialRating?: number;
  maxStars?: number;
  onRating?: (rating: number) => void;
  className?: string;
}

export const AssetRatingStars: React.FC<AssetRatingStarsProps> = ({
  initialRating = 0,
  maxStars = 5,
  onRating,
  className = "",
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleRating = (value: number) => {
    setRating(value);
    if (onRating) {
      onRating(value);
    }
  };

  const getStarColor = (index: number) => {
    if (index <= (hoveredRating || rating)) {
      return "text-amber-400";
    }
    return "text-gray-600";
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(maxStars)].map((_, index) => {
        const starIndex = index + 1;
        return (
          <button
            key={starIndex}
            onClick={() => handleRating(starIndex)}
            onMouseEnter={() => setHoveredRating(starIndex)}
            onMouseLeave={() => setHoveredRating(0)}
            className={`font-pixel text-sm transition-colors ${getStarColor(index)}`}
            aria-label={`Rate ${starIndex} stars`}
          >
            ★
          </button>
        );
      })}
      
      {rating > 0 && (
        <span className="font-pixel text-xs text-gray-400 ml-2">
          ({rating}/{maxStars})
        </span>
      )}
    </div>
  );
};

export default AssetRatingStars;

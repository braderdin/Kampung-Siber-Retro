// Start: Imports
import React from 'react';
// End: Imports

// Start: Type Definitions
interface PaginationButtonProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}
// End: Type Definitions

// Start: PaginationButton Component
export default function PaginationButton({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationButtonProps) {
  // Start: Handle Previous Page
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  // End: Handle Previous Page

  // Start: Handle Next Page
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  // End: Handle Next Page

  // Start: Render Pagination Button
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="retro-btn-secondary text-xs px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ← Sebelum
      </button>
      <span className="text-xs text-gray-600 dark:text-gray-400 px-2">
        Halaman {currentPage} dari {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="retro-btn-secondary text-xs px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Seterusnya →
      </button>
    </div>
  );
}
// End: PaginationButton Component

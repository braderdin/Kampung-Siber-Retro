// Start: Asset Manager Modal Component
import { useState, useEffect } from 'react';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';

interface AssetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export default function AssetManagerModal({ isOpen, onClose, className }: AssetManagerModalProps) {
  // Start: State Management
  const [isMobile, setIsMobile] = useState(false);
  // End: State Management

  // Start: Mobile Detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  // End: Mobile Detection

  // Start: Close on Escape Key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  // End: Close on Escape Key

  // Start: Prevent Body Scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  // End: Prevent Body Scroll

  // Start: Click Outside to Close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  // End: Click Outside to Close

  // Start: Render Modal Content
  if (!isOpen) return null;

  return (
    // Start: Modal Overlay
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      {/* Start: Modal Container */}
      <div
        className={`
          bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg mx-4
          transform transition-all duration-300 ease-out
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          ${className || ''}
        `}
        style={{
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Start: Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Asset Manager
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Upload and manage your retro assets for the Kampung Siber editor
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        {/* End: Modal Header */}

        {/* Start: Modal Body */}
        <div className="p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Upload Assets
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Maximum file size: 25MB per file
            </p>
          </div>

          {/* Start: Upload Grid Mock */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-200 dark:bg-gray-700 rounded"
              />
            ))}
          </div>
          {/* End: Upload Grid Mock */}

          {/* Start: Limitations Info */}
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
                  Profile Tier Limitations
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Individual file uploads are limited to 25MB. For larger assets, consider compression or splitting files.
                </p>
              </div>
            </div>
          </div>
          {/* End: Limitations Info */}
        </div>
        {/* End: Modal Body */}

        {/* Start: Modal Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
        {/* End: Modal Footer */}
      </div>
      {/* End: Modal Container */}
    </div>
    // End: Modal Overlay
  );
}
// End: Asset Manager Modal Component

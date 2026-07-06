// Start: Imports
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
// End: Imports

// Start: Type Definitions
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface RetroToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);
// End: Type Definitions

// Start: Toast Provider Component
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Start: Show Toast Function
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };
  // End: Show Toast Function

  // Start: Remove Toast Function
  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  // End: Remove Toast Function

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 p-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="retro-toast animate-fade-in"
          >
            <div className={`px-3 py-2 rounded text-xs font-mono ${getToastClass(toast.type)}`}>
              {toast.message}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
// End: Toast Provider Component

// Start: Get Toast Class Function
function getToastClass(type: Toast['type']): string {
  switch (type) {
    case 'success':
      return 'bg-green-500 text-white border-green-600';
    case 'error':
      return 'bg-red-500 text-white border-red-600';
    case 'warning':
      return 'bg-yellow-500 text-gray-800 border-yellow-600';
    case 'info':
    default:
      return 'bg-blue-500 text-white border-blue-600';
  }
}
// End: Get Toast Class Function

// Start: Use Toast Hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
// End: Use Toast Hook

// Start: RetroToast Component
export default function RetroToast({
  message,
  type = 'info',
  duration = 3000,
}: RetroToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Start: Auto Hide Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);
  // End: Auto Hide Effect

  if (!isVisible) return null;

  return (
    <div className="retro-toast animate-fade-in">
      <div className={`px-3 py-2 rounded text-xs font-mono ${getToastClass(type)}`}>
        {message}
      </div>
    </div>
  );
}
// End: RetroToast Component

"use client";

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
  createdAt: number;
}

interface NotificationContextType {
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const id = Math.random().toString(36).substring(2, 15);
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: Date.now(),
      duration: notification.duration || 5000
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    
    notifications.forEach(notification => {
      if (notification.duration && notification.duration > 0) {
        timers.push(
          setTimeout(() => {
            removeNotification(notification.id);
          }, notification.duration)
        );
      }
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [notifications, removeNotification]);

  const getTypeColor = useCallback((type: Notification['type']) => {
    switch (type) {
      case 'success': return 'bg-green-500 border-green-400';
      case 'error': return 'bg-red-500 border-red-400';
      case 'warning': return 'bg-yellow-500 border-yellow-400';
      case 'info': return 'bg-cyan-500 border-cyan-400';
      default: return 'bg-gray-500 border-gray-400';
    }
  }, []);

  const getTypeIcon = useCallback((type: Notification['type']) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  }, []);

  if (!isClient) {
    return <>{children}</>;
  }

  // Set notification instance for convenience functions
  useEffect(() => {
    setNotificationInstance({ addNotification });
  }, [addNotification]);

  return createPortal(
    <NotificationContext.Provider value={{ addNotification, removeNotification, clearAll }}>
      {children}
      
      {/* Notification Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`
              retro-card border-2 ${getTypeColor(notification.type)}
              transform transition-all duration-300 animate-slide-in
            `}
          >
            <div className="flex items-start gap-2 p-3">
              <span className="text-xl">{getTypeIcon(notification.type)}</span>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white pixel-font">
                  {notification.title}
                </h4>
                {notification.message && (
                  <p className="text-xs text-white/90 pixel-font mt-1">
                    {notification.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-white/70 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>,
    document.body
  );
}

// Convenience functions for direct use
let notificationInstance: { addNotification: (n: Omit<Notification, 'id' | 'createdAt'>) => void } | null = null;

export function toast(notification: Omit<Notification, 'id' | 'createdAt'>) {
  if (notificationInstance) {
    notificationInstance.addNotification(notification);
  } else {
    console.warn('NotificationProvider not found. Wrap your app with NotificationProvider.');
  }
}

export function toastSuccess(title: string, message?: string) {
  toast({ type: 'success', title, message });
}

export function toastError(title: string, message?: string) {
  toast({ type: 'error', title, message });
}

export function toastInfo(title: string, message?: string) {
  toast({ type: 'info', title, message });
}

export function toastWarning(title: string, message?: string) {
  toast({ type: 'warning', title, message });
}

// Set instance reference (called by NotificationProvider)
export function setNotificationInstance(instance: { addNotification: (n: Omit<Notification, 'id' | 'createdAt'>) => void }) {
  notificationInstance = instance;
}

// Start: Custom Styles
const styles = `
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  .animate-slide-in {
    animation: slide-in 0.3s ease-out forwards;
  }
`;
// End: Custom Styles
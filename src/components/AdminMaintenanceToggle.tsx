"use client";

import { useState, useEffect } from 'react';

interface AdminMaintenanceToggleProps {
  className?: string;
}

export default function AdminMaintenanceToggle({ className }: AdminMaintenanceToggleProps) {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchMaintenanceStatus();
  }, []);

  const fetchMaintenanceStatus = async () => {
    try {
      const response = await fetch('/api/admin/maintenance/status', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer admin-session',
        },
      });
      
      const data = await response.json();
      if (data.success && data.maintenance !== undefined) {
        setIsMaintenanceMode(data.maintenance);
      }
    } catch (error) {
      console.error('Error fetching maintenance status:', error);
    }
  };

  const toggleMaintenance = async () => {
    setIsUpdating(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/admin/maintenance/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-session',
        },
        body: JSON.stringify({ enabled: !isMaintenanceMode }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setIsMaintenanceMode(!isMaintenanceMode);
        setMessage(`Maintenance mode ${!isMaintenanceMode ? 'enabled' : 'disabled'} successfully`);
      } else {
        setMessage(result.message || 'Failed to toggle maintenance mode');
      }
    } catch (error) {
      console.error('Error toggling maintenance:', error);
      setMessage('Failed to toggle maintenance mode');
    } finally {
      setIsUpdating(false);
      
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  return (
    <div className={`retro-card p-4 ${className || ''}`}>
      {/* Start: Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🔧</span>
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 pixel-font">
          Kawalan Penyelenggaraan
        </h3>
      </div>
      {/* End: Header */}

      {/* Start: Status Indicator */}
      <div className="mb-3 p-2 bg-gray-100 dark:bg-gray-800 rounded border">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600 dark:text-gray-400 pixel-font">
            Status:
          </span>
          <span className={`
            text-xs font-bold px-2 py-1 rounded
            ${isMaintenanceMode 
              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
              : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
            }
          `}>
            {isMaintenanceMode ? '⚠️ Penyelenggaraan' : '✅ Aktif'}
          </span>
        </div>
      </div>
      {/* End: Status Indicator */}

      {/* Start: Toggle Button */}
      <button
        onClick={toggleMaintenance}
        disabled={isUpdating}
        className={`
          w-full retro-btn-secondary text-xs px-3 py-2 flex items-center justify-center gap-2
          ${isMaintenanceMode 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'bg-green-600 hover:bg-green-700 text-white'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
        `}
      >
        {isUpdating ? (
          <>
            <span className="animate-spin">⟳</span>
            <span>Mengemaskini...</span>
          </>
        ) : (
          <>
            <span>{isMaintenanceMode ? '🔓' : '🔒'}</span>
            <span>
              {isMaintenanceMode ? 'Matikan Penyelenggaraan' : 'Dayakan Penyelenggaraan'}
            </span>
          </>
        )}
      </button>
      {/* End: Toggle Button */}

      {/* Start: Message */}
      {message && (
        <div className="mt-2 text-xs text-center pixel-font text-gray-600 dark:text-gray-400">
          {message}
        </div>
      )}
      {/* End: Message */}
    </div>
  );
}

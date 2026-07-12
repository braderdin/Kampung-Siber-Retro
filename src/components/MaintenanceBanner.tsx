"use client";

import { useState, useEffect } from 'react';

interface MaintenanceBannerProps {
  className?: string;
}

export default function MaintenanceBanner({ className }: MaintenanceBannerProps) {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkMaintenanceStatus();
    
    const interval = setInterval(checkMaintenanceStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkMaintenanceStatus = async () => {
    try {
      const response = await fetch('/api/admin/maintenance/status', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer public-check',
        },
      });
      
      const data = await response.json();
      if (data.success && data.maintenance !== undefined) {
        setIsMaintenanceMode(data.maintenance);
      }
    } catch (error) {
      console.error('Error checking maintenance status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null;
  }

  if (!isMaintenanceMode) {
    return null;
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm ${className || ''}`}>
      {/* Start: Construction Barricade Animation */}
      <div className="relative">
        {/* Animated Warning Stripes */}
        <div className="absolute -top-20 -left-20 -right-20 -bottom-20">
          <div className="w-full h-full animate-pulse">
            <div className="absolute inset-0 border-8 border-yellow-400 border-dashed rounded-full animate-spin" style={{ animationDuration: '10s' }} />
            <div className="absolute inset-4 border-4 border-red-500 border-dashed rounded-full animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }} />
            <div className="absolute inset-8 border-2 border-orange-400 border-dashed rounded-full animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="z-10 text-center p-8 bg-gray-900 rounded-lg border-4 border-yellow-400 shadow-2xl" style={{ boxShadow: '0 0 50px #fbbf24' }}>
          <div className="animate-bounce mb-4">
            <span className="text-6xl">🚧</span>
          </div>
          
          <h2 className="text-3xl font-bold text-yellow-400 mb-4 pixel-font tracking-widest">
            PENYELANGGAARAAN
          </h2>
          
          <p className="text-lg text-gray-300 mb-6 pixel-font">
            Laman web ini sedang dalam pemeliharaan.
          </p>
          
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400 pixel-font">
              Sila tunggu sebentar...
            </p>
          </div>
          
          {/* Construction Animation */}
          <div className="flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 bg-yellow-400 animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
      {/* End: Construction Barricade Animation */}
    </div>
  );
}

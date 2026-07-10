"use client";

import { useState } from 'react';

interface MarketplaceDownloadTrackerProps {
  assetId: string;
  assetName: string;
  downloadUrl: string;
  className?: string;
}

export default function MarketplaceDownloadTracker({
  assetId,
  assetName,
  downloadUrl,
  className,
}: MarketplaceDownloadTrackerProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);

  const trackDownload = async () => {
    setIsDownloading(true);
    
    try {
      const response = await fetch('/api/analytics/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assetId,
          assetName,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setDownloadCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error tracking download:', error);
    }
    
    setTimeout(() => {
      setIsDownloading(false);
      window.open(downloadUrl, '_blank');
    }, 100);
  };

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <button
        onClick={trackDownload}
        disabled={isDownloading}
        className="retro-btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
      >
        {isDownloading ? (
          <>
            <span className="animate-spin">⟳</span>
            <span>Memuat turun...</span>
          </>
        ) : (
          <>
            <span>📥</span>
            <span>Muat Turun</span>
          </>
        )}
      </button>
      
      {downloadCount > 0 && (
        <span className="text-xs text-green-500 pixel-font">
          +{downloadCount} muat turun
        </span>
      )}
    </div>
  );
}

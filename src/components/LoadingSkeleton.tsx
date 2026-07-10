"use client";

import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'text' | 'avatar' | 'header';
  count?: number;
}

export default function LoadingSkeleton({ type = 'card', count = 1 }: LoadingSkeletonProps) {
  const skeletonClasses = "animate-pulse bg-gray-200 dark:bg-gray-700 rounded";

  const renderCardSkeleton = () => (
    <div className="retro-card p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
        <div className="flex-1">
          <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-2" />
          <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        <div className="h-3 w-5/6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        <div className="h-3 w-4/6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderTextSkeleton = () => (
    <div className="space-y-3">
      <div className="h-6 w-1/4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
      <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
      <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
      <div className="h-4 w-4/6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
    </div>
  );

  const renderAvatarSkeleton = () => (
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
      <div className="flex-1">
        <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-2" />
        <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
      </div>
    </div>
  );

  const renderHeaderSkeleton = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="h-8 w-1/3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
      <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
    </div>
  );

  const renderWithFlicker = (children: React.ReactNode) => (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]" />
    </div>
  );

  switch (type) {
    case 'list':
      return (
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="retro-card p-3">
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 mb-2" />
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-3 mb-2" style={{ width: `${80 + Math.random() * 20}%` }} />
            </div>
          ))}
        </div>
      );
    case 'text':
      return renderTextSkeleton();
    case 'avatar':
      return renderAvatarSkeleton();
    case 'header':
      return renderHeaderSkeleton();
    case 'card':
    default:
      return (
        <div className="space-y-4">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="retro-card p-4">
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-5 mb-3 w-1/2" />
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 mb-2 w-full" />
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 mb-2 w-5/6" />
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-4/6" />
            </div>
          ))}
        </div>
      );
  }
}

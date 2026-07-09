"use client";

import { useState, useEffect } from 'react';

interface HydrationGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export default function HydrationGuard({ 
  children, 
  fallback = null, 
  className 
}: HydrationGuardProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{fallback}</>;
  }

  return <div className={className}>{children}</div>;
}
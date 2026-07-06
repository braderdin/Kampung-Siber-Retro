"use client";

import { useState, useEffect } from 'react';

interface UseDebounceOptions {
  delay?: number;
  leading?: boolean;
  trailing?: boolean;
}

function useDebounce<T>(
  value: T,
  options: UseDebounceOptions = {}
): T {
  const {
    delay = 300,
    leading = false,
    trailing = true,
  } = options;

  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [leadingCall, setLeadingCall] = useState<boolean>(leading);

  useEffect(() => {
    const cleanup = () => {
      setDebouncedValue(value);
      setLeadingCall(leading);
    };

    const handler = setTimeout(() => {
      if (trailing) {
        setDebouncedValue(value);
        setLeadingCall(false);
      }
    }, delay);

    if (leading && !leadingCall) {
      setDebouncedValue(value);
      setLeadingCall(true);
    }

    return () => {
      clearTimeout(handler);
      cleanup();
    };
  }, [value, delay, leading, trailing]);

  return debouncedValue;
}

export default useDebounce;

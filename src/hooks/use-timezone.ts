"use client";

import { useState, useEffect, useCallback } from 'react';

export function useTimezone() {
  const [timezone, setTimezone] = useState('UTC');

  useEffect(() => {
    // This effect runs only on the client side
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const toLocalTime = useCallback((date: Date, options?: Intl.DateTimeFormatOptions): string => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    };
    try {
      return new Intl.DateTimeFormat('en-US', { ...defaultOptions, timeZone: timezone }).format(date);
    } catch (e) {
      // Fallback for invalid timezone or other errors
      return date.toLocaleDateString();
    }
  }, [timezone]);

  return { timezone, toLocalTime };
}

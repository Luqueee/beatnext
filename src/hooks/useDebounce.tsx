/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const useDebounce = (callback: any, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup the previous timeout on re-render
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const debouncedCallback = (...args: any) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debouncedCallback;
};

import { useState, useEffect } from 'react';

/**
 * Custom hook to track localStorage changes for tab persistence
 * @param key - localStorage key to track
 * @param defaultValue - default value if key doesn't exist
 * @returns current value and setter function
 */
export function useLastTab(key: string, defaultValue: string) {
  const [value, setValue] = useState(() => 
    localStorage.getItem(key) || defaultValue
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const newValue = localStorage.getItem(key) || defaultValue;
      setValue(newValue);
    };

    // Listen for storage events (cross-tab)
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom events (same-tab)
    window.addEventListener('localStorageChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleStorageChange);
    };
  }, [key, defaultValue]);

  const setLastTab = (newValue: string) => {
    localStorage.setItem(key, newValue);
    setValue(newValue);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('localStorageChange'));
  };

  return [value, setLastTab] as const;
}

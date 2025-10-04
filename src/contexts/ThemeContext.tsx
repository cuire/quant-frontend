import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useUser } from '@/lib/api-hooks';
import { bindThemeParamsCssVars } from '@telegram-apps/sdk-react';

export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const user = useUser();
  
  // Get theme from user data, default to 'dark'
  const theme: ThemeType = user?.data?.theme as ThemeType || 'dark';
  
  // Determine if we should use dark mode
  const isDark = (() => {
    if (theme === 'system') {
      // Check system preference
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return theme === 'dark';
  })();

  // Apply theme changes to CSS variables
  useEffect(() => {
    // Apply theme to document root
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Bind Telegram theme params for system theme compatibility
  useEffect(() => {
    if (theme === 'system' && bindThemeParamsCssVars) {
      try {
        bindThemeParamsCssVars();
      } catch (error) {
        // CSS variables might already be bound, ignore the error
        console.warn('CSS variables already bound:', error);
      }
    }
  }, [theme]);

  // Apply dark mode class to body
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [isDark]);

  // Listen for system theme changes when using system theme
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Force re-evaluation of isDark
      window.dispatchEvent(new Event('theme-change'));
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const contextValue: ThemeContextType = {
    theme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

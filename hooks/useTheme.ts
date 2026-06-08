'use client';
import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}

export function useThemeState(): ThemeContextValue {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const stored = localStorage.getItem('staffr-theme') as Theme | null;
    const initial = stored === 'dark' ? 'dark' : 'light';
    setThemeState(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    localStorage.setItem('staffr-theme', next);
    document.documentElement.dataset.theme = next;
  };

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return { theme, setTheme, toggleTheme };
}

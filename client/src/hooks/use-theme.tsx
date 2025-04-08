import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useSettings } from './use-settings';

// Theme types
type Theme = 'light' | 'dark';

// Theme context interface
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

// Create context
const ThemeContext = createContext<ThemeContextType | null>(null);

// Provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { settings, updateSettings } = useSettings();
  const [theme, setTheme] = useState<Theme>('dark'); // Default to dark theme

  // Initialize theme based on user settings when component mounts
  useEffect(() => {
    if (settings) {
      setTheme(settings.darkMode ? 'dark' : 'light');
    }
  }, [settings]);

  // Apply theme to document body
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Update user settings if available
    if (settings) {
      updateSettings({ darkMode: newTheme === 'dark' });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
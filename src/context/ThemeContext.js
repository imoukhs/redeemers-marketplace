import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('isDarkMode');
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newThemeValue = !isDarkMode;
      setIsDarkMode(newThemeValue);
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(newThemeValue));
      return true;
    } catch (error) {
      console.error('Error saving theme preference:', error);
      return false;
    }
  };

  // Define theme colors
  const theme = {
    colors: isDarkMode
      ? {
          primary: '#1E90FF',
          background: '#121212',
          surface: '#1E1E1E',
          text: '#FFFFFF',
          subtext: '#B0B0B0',
          border: '#2C2C2C',
          card: '#1E1E1E',
          error: '#FF6B6B',
          success: '#4CAF50',
          input: '#2C2C2C',
          placeholder: '#808080',
        }
      : {
          primary: '#1E90FF',
          background: '#FFFFFF',
          surface: '#F5F5F5',
          text: '#333333',
          subtext: '#666666',
          border: '#E0E0E0',
          card: '#FFFFFF',
          error: '#FF3B30',
          success: '#4CAF50',
          input: '#FFFFFF',
          placeholder: '#999999',
        },
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}; 
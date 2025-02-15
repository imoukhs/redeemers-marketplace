import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api/auth';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check for stored token when app loads
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const user = await AsyncStorage.getItem('userData');
      if (token && user) {
        setUserToken(token);
        setUserData(JSON.parse(user));
      }
    } catch (error) {
      console.error('Error checking token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      // Call the actual API
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        // Store user data with role
        const userData = {
          ...response.user,
          role: response.user.role || 'user', // Default to 'user' if no role specified
        };

        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));

        setUserToken(response.token);
        setUserData(userData);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (formData) => {
    try {
      setIsLoading(true);
      // Call the actual API
      const response = await authAPI.signup(formData);
      
      if (response.success) {
        // Store user data with default role
        const userData = {
          ...response.user,
          role: 'user', // New users always start as regular users
        };

        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));

        setUserToken(response.token);
        setUserData(userData);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Call the logout API
      await authAPI.logout();

      // Clear all app data
      const keys = [
        'userToken',
        'userData',
        'cartItems',
        'wishlistItems',
        'profileData',
        'addresses',
        'isDarkMode',
        'recentSearches'
      ];
      
      await Promise.all(keys.map(key => AsyncStorage.removeItem(key)));

      // Reset state
      setUserToken(null);
      setUserData(null);

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        userData,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 
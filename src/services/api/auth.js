import api from './config';
import { ENV } from '../../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock admin credentials for testing
const MOCK_ADMIN = {
  email: 'admin@redeemers.com',
  password: 'admin123',
  user: {
    id: 'admin1',
    email: 'admin@redeemers.com',
    name: 'System Admin',
    role: 'admin',
  },
};

export const authAPI = {
  login: async (email, password) => {
    try {
      if (!ENV.USE_REAL_API) {
        // Mock admin login
        if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
          return {
            success: true,
            token: 'mock_admin_token',
            refreshToken: 'mock_refresh_token',
            user: MOCK_ADMIN.user,
          };
        }
        // Mock regular user login
        return {
          success: true,
          token: 'mock_user_token',
          refreshToken: 'mock_refresh_token',
          user: {
            id: 'user1',
            email,
            name: 'Test User',
            role: 'user',
          },
        };
      }

      const response = await api.post('/auth/login', { email, password });
      if (response.token) {
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('refreshToken', response.refreshToken);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      if (!ENV.USE_REAL_API) {
        return {
          success: true,
          token: 'mock_user_token',
          refreshToken: 'mock_refresh_token',
          user: {
            id: 'user2',
            ...userData,
            role: 'user',
          },
        };
      }

      const response = await api.post('/auth/signup', userData);
      if (response.token) {
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('refreshToken', response.refreshToken);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      if (!ENV.USE_REAL_API) {
        return { success: true, message: 'Reset instructions sent to your email' };
      }

      const response = await api.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      if (!ENV.USE_REAL_API) {
        return { success: true, message: 'Password successfully reset' };
      }

      const response = await api.post('/auth/reset-password', {
        token,
        newPassword,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  verifyEmail: async (token) => {
    try {
      if (!ENV.USE_REAL_API) {
        return { success: true, message: 'Email verified successfully' };
      }

      const response = await api.post('/auth/verify-email', { token });
      return response;
    } catch (error) {
      throw error;
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      if (!ENV.USE_REAL_API) {
        return {
          success: true,
          token: 'new_mock_token',
          refreshToken: 'new_mock_refresh_token',
        };
      }

      const response = await api.post('/auth/refresh', { refreshToken });
      if (response.token) {
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('refreshToken', response.refreshToken);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      if (!ENV.USE_REAL_API) {
        await AsyncStorage.multiRemove([
          'userToken',
          'refreshToken',
          'userData',
          'cartItems',
          'wishlistItems',
          'recentSearches',
        ]);
        return { success: true };
      }

      const response = await api.post('/auth/logout');
      await AsyncStorage.multiRemove([
        'userToken',
        'refreshToken',
        'userData',
        'cartItems',
        'wishlistItems',
        'recentSearches',
      ]);
      return response;
    } catch (error) {
      // Still clear local storage even if API call fails
      await AsyncStorage.multiRemove([
        'userToken',
        'refreshToken',
        'userData',
        'cartItems',
        'wishlistItems',
        'recentSearches',
      ]);
      throw error;
    }
  },
}; 
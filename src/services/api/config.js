import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../../config/env';
import { mockData } from './mockData';

const BASE_URL = ENV.API_URL[ENV.ENVIRONMENT];

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const response = await axiosInstance.post('/auth/refresh', { refreshToken });
        
        if (response.token) {
          await AsyncStorage.setItem('userToken', response.token);
          axiosInstance.defaults.headers.Authorization = `Bearer ${response.token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Handle refresh token failure (logout user)
        await AsyncStorage.multiRemove(['userToken', 'refreshToken', 'userData']);
        // You might want to trigger a navigation to login screen here
      }
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        status: 'network_error',
      });
    }

    // Handle other errors
    return Promise.reject({
      message: error.response?.data?.message || 'Something went wrong',
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

const api = {
  get: async (url, config = {}) => {
    if (!ENV.USE_REAL_API) {
      // Use mock data in development
      const pathParts = url.split('/');
      const resource = pathParts[1];
      const subResource = pathParts[2];

      if (resource === 'seller') {
        switch (subResource) {
          case 'profile':
            return mockData.seller.profile;
          case 'metrics':
            return mockData.seller.metrics;
          case 'products':
            return mockData.seller.products;
          case 'orders':
            return mockData.seller.orders;
          default:
            return null;
        }
      }
      return null;
    }
    
    return axiosInstance.get(url, config);
  },

  post: async (url, data, config = {}) => {
    if (!ENV.USE_REAL_API) {
      // Use mock data in development
      const pathParts = url.split('/');
      const resource = pathParts[1];
      const subResource = pathParts[2];

      if (resource === 'seller') {
        switch (subResource) {
          case 'products':
            const newProduct = {
              id: `P${mockData.seller.products.length + 1}`,
              ...data,
              status: 'active',
            };
            mockData.seller.products.push(newProduct);
            return newProduct;
          default:
            return { success: true };
        }
      }
      return { success: true };
    }

    return axiosInstance.post(url, data, config);
  },

  put: async (url, data, config = {}) => {
    if (!ENV.USE_REAL_API) {
      return { success: true, data };
    }
    return axiosInstance.put(url, data, config);
  },

  delete: async (url, config = {}) => {
    if (!ENV.USE_REAL_API) {
      return { success: true };
    }
    return axiosInstance.delete(url, config);
  },

  // Helper method for multipart form data (file uploads)
  upload: async (url, formData, config = {}) => {
    const uploadConfig = {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
    };
    return axiosInstance.post(url, formData, uploadConfig);
  },
};

export default api;
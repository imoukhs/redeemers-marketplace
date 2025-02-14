import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../../config/env';
import { mockData } from './mockData';

const BASE_URL = ENV.API_URL[ENV.ENVIRONMENT];

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock API response handler
const mockApiResponse = (path, method, data = null) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Parse the path to determine what data to return
      const pathParts = path.split('/');
      const resource = pathParts[1]; // e.g., 'seller'
      const subResource = pathParts[2]; // e.g., 'profile'

      if (resource === 'seller') {
        switch (subResource) {
          case 'profile':
            resolve(mockData.seller.profile);
            break;
          case 'metrics':
            resolve(mockData.seller.metrics);
            break;
          case 'products':
            if (method === 'GET') {
              resolve(mockData.seller.products);
            } else if (method === 'POST' && data) {
              const newProduct = {
                id: `P${mockData.seller.products.length + 1}`,
                ...data,
                status: 'active',
              };
              mockData.seller.products.push(newProduct);
              resolve(newProduct);
            }
            break;
          case 'orders':
            resolve(mockData.seller.orders);
            break;
          default:
            resolve(null);
        }
      }
    }, 500); // Simulate network delay
  });
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // If using mock data, intercept the request
    if (!ENV.USE_REAL_API) {
      const mockResponse = await mockApiResponse(
        config.url,
        config.method.toUpperCase(),
        config.data
      );
      return Promise.reject({
        config,
        response: { data: mockResponse },
        isMockData: true,
      });
    }

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

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    // If this is mock data, return it
    if (error.isMockData) {
      return error.response.data;
    }

    const originalRequest = error.config;

    // Handle 401 Unauthorized error
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { token } = response.data;
        await AsyncStorage.setItem('userToken', token);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (error) {
        await AsyncStorage.multiRemove(['userToken', 'refreshToken']);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
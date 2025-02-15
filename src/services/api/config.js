import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../../config/env';
import { mockData } from './mockData';

const BASE_URL = ENV.API_URL[ENV.ENVIRONMENT];

const api = {
  get: async (url) => {
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
  },

  post: async (url, data) => {
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
  },

  put: async (url, data) => {
    return { success: true, data };
  },

  delete: async (url) => {
    return { success: true };
  }
};

export default api;
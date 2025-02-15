import api from './config';

export const sellerAPI = {
  // Profile Management
  getProfile: async () => {
    const response = await api.get('/seller/profile');
    return response;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/seller/profile', profileData);
    return response;
  },

  // Product Management
  getProducts: async (params = {}) => {
    const response = await api.get('/seller/products', { params });
    return response;
  },

  createProduct: async (productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      if (key === 'images') {
        productData.images.forEach(image => {
          formData.append('images', {
            uri: image,
            type: 'image/jpeg',
            name: 'product_image.jpg',
          });
        });
      } else {
        formData.append(key, productData[key]);
      }
    });

    const response = await api.post('/seller/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  updateProduct: async (productId, productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      if (key === 'images') {
        productData.images.forEach(image => {
          if (typeof image === 'string' && image.startsWith('http')) {
            formData.append('existingImages', image);
          } else {
            formData.append('images', {
              uri: image,
              type: 'image/jpeg',
              name: 'product_image.jpg',
            });
          }
        });
      } else {
        formData.append(key, productData[key]);
      }
    });

    const response = await api.put(`/seller/products/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  deleteProduct: async (productId) => {
    const response = await api.delete(`/seller/products/${productId}`);
    return response;
  },

  // Order Management
  getOrders: async (params = {}) => {
    const response = await api.get('/seller/orders', { params });
    return response;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/seller/orders/${orderId}/status`, { status });
    return response;
  },

  // Metrics and Analytics
  getMetrics: async (period = 'all') => {
    const response = await api.get('/seller/metrics', { params: { period } });
    return response;
  },

  getAnalytics: async (params = {}) => {
    const response = await api.get('/seller/analytics', { params });
    return response;
  },

  // Inventory Management
  updateInventory: async (productId, quantity) => {
    const response = await api.put(`/seller/products/${productId}/inventory`, { quantity });
    return response;
  },

  // Bulk Operations
  bulkUpdateProducts: async (updates) => {
    const response = await api.put('/seller/products/bulk', { updates });
    return response;
  },

  bulkDeleteProducts: async (productIds) => {
    const response = await api.delete('/seller/products/bulk', { data: { productIds } });
    return response;
  },

  // Promotion Management
  getPromotions: async () => {
    const response = await api.get('/seller/promotions');
    return response;
  },

  createPromotion: async (promotionData) => {
    const response = await api.post('/seller/promotions', promotionData);
    return response;
  },

  updatePromotion: async (promotionId, promotionData) => {
    const response = await api.put(`/seller/promotions/${promotionId}`, promotionData);
    return response;
  },

  deletePromotion: async (promotionId) => {
    const response = await api.delete(`/seller/promotions/${promotionId}`);
    return response;
  },
}; 
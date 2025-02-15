import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sellerAPI } from '../services/api/seller';
import { useSubscription } from './SubscriptionContext';

const SellerContext = createContext();

export const useSeller = () => {
  const context = useContext(SellerContext);
  if (!context) {
    throw new Error('useSeller must be used within a SellerProvider');
  }
  return context;
};

export const SellerProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sellerData, setSellerData] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
  });

  const { subscription } = useSubscription();

  useEffect(() => {
    loadSellerData();
  }, []);

  const loadSellerData = async () => {
    try {
      setLoading(true);
      setError(null);
      const profile = await sellerAPI.getProfile();
      setSellerData(profile);
      await Promise.all([
        fetchSellerMetrics(),
        fetchPromotions(),
      ]);
    } catch (error) {
      console.error('Error loading seller data:', error);
      setError(error.message || 'Failed to load seller data');
    } finally {
      setLoading(false);
    }
  };

  const checkSubscriptionLimit = (action) => {
    if (!subscription) {
      throw new Error('Active subscription required');
    }

    const isBasicPlan = subscription.planId === 'basic';
    if (isBasicPlan && action === 'addProduct' && products.length >= 50) {
      throw new Error('Basic plan limited to 50 products. Please upgrade to Premium.');
    }
  };

  const fetchSellerMetrics = async () => {
    try {
      setError(null);
      const response = await sellerAPI.getMetrics();
      setMetrics(response);
      return response;
    } catch (error) {
      console.error('Error fetching seller metrics:', error);
      setError(error.message || 'Failed to fetch metrics');
      throw error;
    }
  };

  const fetchProducts = async (params = {}) => {
    try {
      setError(null);
      const response = await sellerAPI.getProducts(params);
      setProducts(response);
      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Failed to fetch products');
      throw error;
    }
  };

  const createProduct = async (productData) => {
    try {
      setError(null);
      checkSubscriptionLimit('addProduct');
      const response = await sellerAPI.createProduct(productData);
      setProducts(prevProducts => [...prevProducts, response]);
      return response;
    } catch (error) {
      console.error('Error creating product:', error);
      setError(error.message || 'Failed to create product');
      throw error;
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      setError(null);
      const response = await sellerAPI.updateProduct(productId, productData);
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === productId ? response : product
        )
      );
      return response;
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error.message || 'Failed to update product');
      throw error;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      setError(null);
      await sellerAPI.deleteProduct(productId);
      setProducts(prevProducts =>
        prevProducts.filter(product => product.id !== productId)
      );
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error.message || 'Failed to delete product');
      throw error;
    }
  };

  const fetchOrders = async (params = {}) => {
    try {
      setError(null);
      const response = await sellerAPI.getOrders(params);
      setOrders(response);
      return response;
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message || 'Failed to fetch orders');
      throw error;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      setError(null);
      const response = await sellerAPI.updateOrderStatus(orderId, status);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      return response;
    } catch (error) {
      console.error('Error updating order status:', error);
      setError(error.message || 'Failed to update order status');
      throw error;
    }
  };

  const updateSellerProfile = async (profileData) => {
    try {
      setError(null);
      const response = await sellerAPI.updateProfile(profileData);
      setSellerData(prevData => ({ ...prevData, ...response }));
      return response;
    } catch (error) {
      console.error('Error updating seller profile:', error);
      setError(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const getSubscriptionFeatures = () => {
    if (!subscription) return null;

    const isBasicPlan = subscription.planId === 'basic';
    return {
      maxProducts: isBasicPlan ? 50 : Infinity,
      hasAnalytics: !isBasicPlan,
      hasPrioritySupport: !isBasicPlan,
      hasPromotionalTools: !isBasicPlan,
      hasReducedFees: !isBasicPlan,
    };
  };

  const updateInventory = async (productId, newQuantity) => {
    try {
      // TODO: Replace with actual API call
      // await api.put(`/products/${productId}/inventory`, { quantity: newQuantity });
      
      // For now, we'll just simulate the API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Error updating inventory:', error);
      throw error;
    }
  };

  const getProducts = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/seller/products');
      // return response.data;
      
      // For now, return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: 1,
          name: 'Premium T-Shirt',
          category: 'Clothing',
          stock: 15,
          price: 2999,
          image: 'https://example.com/tshirt.jpg'
        },
        {
          id: 2,
          name: 'Designer Jeans',
          category: 'Clothing',
          stock: 3,
          price: 7999,
          image: 'https://example.com/jeans.jpg'
        },
        {
          id: 3,
          name: 'Running Shoes',
          category: 'Footwear',
          stock: 0,
          price: 12999,
          image: 'https://example.com/shoes.jpg'
        },
        {
          id: 4,
          name: 'Smart Watch',
          category: 'Electronics',
          stock: 8,
          price: 24999,
          image: 'https://example.com/watch.jpg'
        }
      ];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };

  const fetchPromotions = async () => {
    try {
      setError(null);
      const response = await sellerAPI.getPromotions();
      setPromotions(response);
      return response;
    } catch (error) {
      console.error('Error fetching promotions:', error);
      setError(error.message || 'Failed to fetch promotions');
      throw error;
    }
  };

  const createPromotion = async (promotionData) => {
    try {
      setError(null);
      const response = await sellerAPI.createPromotion(promotionData);
      setPromotions(prevPromotions => [...prevPromotions, response]);
      return response;
    } catch (error) {
      console.error('Error creating promotion:', error);
      setError(error.message || 'Failed to create promotion');
      throw error;
    }
  };

  const updatePromotion = async (promotionId, promotionData) => {
    try {
      setError(null);
      const response = await sellerAPI.updatePromotion(promotionId, promotionData);
      setPromotions(prevPromotions =>
        prevPromotions.map(promotion =>
          promotion.id === promotionId ? response : promotion
        )
      );
      return response;
    } catch (error) {
      console.error('Error updating promotion:', error);
      setError(error.message || 'Failed to update promotion');
      throw error;
    }
  };

  const deletePromotion = async (promotionId) => {
    try {
      setError(null);
      await sellerAPI.deletePromotion(promotionId);
      setPromotions(prevPromotions =>
        prevPromotions.filter(promotion => promotion.id !== promotionId)
      );
      return true;
    } catch (error) {
      console.error('Error deleting promotion:', error);
      setError(error.message || 'Failed to delete promotion');
      throw error;
    }
  };

  const value = {
    loading,
    error,
    sellerData,
    products,
    orders,
    promotions,
    metrics,
    updateSellerProfile,
    fetchSellerMetrics,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchOrders,
    updateOrderStatus,
    getSubscriptionFeatures,
    updateInventory,
    getProducts,
    fetchPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
  };

  return <SellerContext.Provider value={value}>{children}</SellerContext.Provider>;
}; 
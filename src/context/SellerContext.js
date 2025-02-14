import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sellerAPI } from '../services/api/seller';

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
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
  });

  useEffect(() => {
    loadSellerData();
  }, []);

  const loadSellerData = async () => {
    try {
      setLoading(true);
      setError(null);
      const profile = await sellerAPI.getProfile();
      setSellerData(profile);
      await fetchSellerMetrics();
    } catch (error) {
      console.error('Error loading seller data:', error);
      setError(error.message || 'Failed to load seller data');
    } finally {
      setLoading(false);
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

  return (
    <SellerContext.Provider
      value={{
        loading,
        error,
        sellerData,
        products,
        orders,
        metrics,
        updateSellerProfile,
        fetchSellerMetrics,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        fetchOrders,
        updateOrderStatus,
      }}
    >
      {children}
    </SellerContext.Provider>
  );
}; 
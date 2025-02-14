import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const savedData = await AsyncStorage.getItem('sellerData');
      if (savedData) {
        setSellerData(JSON.parse(savedData));
      }
      await fetchSellerMetrics();
    } catch (error) {
      console.error('Error loading seller data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerMetrics = async () => {
    try {
      // TODO: Replace with actual API call
      const mockMetrics = {
        totalSales: 45000,
        totalOrders: 8,
        pendingOrders: 3,
        totalProducts: 12,
      };
      setMetrics(mockMetrics);
      return mockMetrics;
    } catch (error) {
      console.error('Error fetching seller metrics:', error);
      throw error;
    }
  };

  const fetchProducts = async () => {
    try {
      // TODO: Replace with actual API call
      const mockProducts = [
        {
          id: '1',
          name: 'Product 1',
          price: 15000,
          stock: 10,
          category: 'Electronics',
          description: 'Product description',
          images: [],
        },
        // Add more mock products as needed
      ];
      setProducts(mockProducts);
      return mockProducts;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };

  const fetchOrders = async () => {
    try {
      // TODO: Replace with actual API call
      const mockOrders = [
        {
          id: '1',
          customerName: 'John Doe',
          amount: 15000,
          status: 'pending',
          date: new Date().toISOString(),
          items: [],
        },
        // Add more mock orders as needed
      ];
      setOrders(mockOrders);
      return mockOrders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  };

  const updateSellerData = async (data) => {
    try {
      const updatedData = { ...sellerData, ...data };
      await AsyncStorage.setItem('sellerData', JSON.stringify(updatedData));
      setSellerData(updatedData);
      return true;
    } catch (error) {
      console.error('Error updating seller data:', error);
      return false;
    }
  };

  return (
    <SellerContext.Provider
      value={{
        loading,
        sellerData,
        products,
        orders,
        metrics,
        updateSellerData,
        fetchSellerMetrics,
        fetchProducts,
        fetchOrders,
      }}
    >
      {children}
    </SellerContext.Provider>
  );
}; 
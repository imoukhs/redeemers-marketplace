import React, { createContext, useContext, useState } from 'react';
import { adminAPI } from '../services/api/admin';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSystemMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getSystemMetrics();
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTransactionHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getTransactionHistory();
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getAllUsers();
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAllStores = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getAllStores();
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getAllProducts();
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const approveStore = async (storeId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.approveStore(storeId);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const suspendStore = async (storeId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.suspendStore(storeId);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const approveProduct = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.approveProduct(productId);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.removeProduct(productId);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getSystemSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getSystemSettings();
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateSystemSettings = async (settings) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.updateSystemSettings(settings);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        loading,
        error,
        getSystemMetrics,
        getTransactionHistory,
        getAllUsers,
        getAllStores,
        getAllProducts,
        approveStore,
        suspendStore,
        approveProduct,
        removeProduct,
        getSystemSettings,
        updateSystemSettings,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext; 
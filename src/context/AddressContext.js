import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddressContext = createContext();

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
};

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const savedAddresses = await AsyncStorage.getItem('addresses');
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAddresses = async (newAddresses) => {
    try {
      await AsyncStorage.setItem('addresses', JSON.stringify(newAddresses));
      setAddresses(newAddresses);
      return true;
    } catch (error) {
      console.error('Error saving addresses:', error);
      return false;
    }
  };

  const addAddress = async (address) => {
    try {
      const newAddress = {
        id: Date.now().toString(),
        isDefault: addresses.length === 0,
        ...address,
      };
      const newAddresses = [...addresses, newAddress];
      const success = await saveAddresses(newAddresses);
      return { success, address: newAddress };
    } catch (error) {
      console.error('Error adding address:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const newAddresses = addresses.filter((addr) => addr.id !== addressId);
      
      // If we deleted the default address and there are other addresses,
      // make the first one the default
      if (newAddresses.length > 0 && !newAddresses.some(addr => addr.isDefault)) {
        newAddresses[0].isDefault = true;
      }
      
      const success = await saveAddresses(newAddresses);
      return { success };
    } catch (error) {
      console.error('Error deleting address:', error);
      return { success: false, error: error.message };
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const newAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }));
      const success = await saveAddresses(newAddresses);
      return { success };
    } catch (error) {
      console.error('Error setting default address:', error);
      return { success: false, error: error.message };
    }
  };

  const updateAddress = async (addressId, updatedData) => {
    try {
      const newAddresses = addresses.map((addr) =>
        addr.id === addressId ? { ...addr, ...updatedData } : addr
      );
      const success = await saveAddresses(newAddresses);
      return { success };
    } catch (error) {
      console.error('Error updating address:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        loading,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        updateAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export default AddressContext;

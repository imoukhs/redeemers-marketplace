import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlistItems();
  }, []);

  const loadWishlistItems = async () => {
    try {
      const savedItems = await AsyncStorage.getItem('wishlistItems');
      if (savedItems) {
        setWishlistItems(JSON.parse(savedItems));
      }
    } catch (error) {
      console.error('Error loading wishlist items:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWishlistItems = async (items) => {
    try {
      await AsyncStorage.setItem('wishlistItems', JSON.stringify(items));
      setWishlistItems(items);
      return true;
    } catch (error) {
      console.error('Error saving wishlist items:', error);
      return false;
    }
  };

  const addToWishlist = async (product) => {
    try {
      if (wishlistItems.some(item => item.id === product.id)) {
        return { success: false, error: 'Product already in wishlist' };
      }

      const newItems = [...wishlistItems, product];
      const success = await saveWishlistItems(newItems);
      return { success };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, error: error.message };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const newItems = wishlistItems.filter(item => item.id !== productId);
      const success = await saveWishlistItems(newItems);
      return { success };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, error: error.message };
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const clearWishlist = async () => {
    try {
      await AsyncStorage.removeItem('wishlistItems');
      setWishlistItems([]);
      return { success: true };
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}; 
import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart items from storage when app starts
  React.useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      const savedCartItems = await AsyncStorage.getItem('cartItems');
      if (savedCartItems) {
        setCartItems(JSON.parse(savedCartItems));
      }
    } catch (error) {
      console.error('Error loading cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCartItems = async (items) => {
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart items:', error);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      const existingItemIndex = cartItems.findIndex(
        (item) => item.product.id === product.id
      );

      let newCartItems;
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        newCartItems = cartItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item if it doesn't exist
        newCartItems = [...cartItems, { product, quantity }];
      }

      setCartItems(newCartItems);
      await saveCartItems(newCartItems);
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const newCartItems = cartItems.filter(
        (item) => item.product.id !== productId
      );
      setCartItems(newCartItems);
      await saveCartItems(newCartItems);
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity < 1) {
        return removeFromCart(productId);
      }

      const newCartItems = cartItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      setCartItems(newCartItems);
      await saveCartItems(newCartItems);
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      return false;
    }
  };

  const clearCart = async () => {
    try {
      setCartItems([]);
      await AsyncStorage.removeItem('cartItems');
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext; 
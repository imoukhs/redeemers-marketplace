import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { ProfileProvider } from './src/context/ProfileContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { AddressProvider } from './src/context/AddressContext';
import { WishlistProvider } from './src/context/WishlistContext';
import { SearchProvider } from './src/context/SearchContext';
import { SellerProvider } from './src/context/SellerContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ProfileProvider>
              <SellerProvider>
                <AddressProvider>
                  <SearchProvider>
                    <SafeAreaProvider>
                      <AppNavigator />
                    </SafeAreaProvider>
                  </SearchProvider>
                </AddressProvider>
              </SellerProvider>
            </ProfileProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

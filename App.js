import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { ProfileProvider } from './src/context/ProfileContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { AddressProvider } from './src/context/AddressContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <ProfileProvider>
            <AddressProvider>
              <SafeAreaProvider>
                <AppNavigator />
              </SafeAreaProvider>
            </AddressProvider>
          </ProfileProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

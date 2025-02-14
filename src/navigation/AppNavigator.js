import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LoadingWave from '../components/common/LoadingWave';
import MainTabNavigator from './MainTabNavigator';
import AuthNavigator from './AuthNavigator';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import ProductListScreen from '../screens/product/ProductListScreen';
import CartScreen from '../screens/cart/CartScreen';
import CheckoutScreen from '../screens/cart/CheckoutScreen';
import OrderConfirmationScreen from '../screens/cart/OrderConfirmationScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ShippingAddressScreen from '../screens/profile/ShippingAddressScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import SellerDashboardScreen from '../screens/seller/DashboardScreen';
import AddProductScreen from '../screens/seller/AddProductScreen';
import SelectCategoryScreen from '../screens/seller/SelectCategoryScreen';
import MyProductsScreen from '../screens/seller/MyProductsScreen';
import OrdersManagementScreen from '../screens/seller/OrdersManagementScreen';
import OrderDetailsScreen from '../screens/seller/OrderDetailsScreen';
import WishlistScreen from '../screens/wishlist/WishlistScreen';
import SearchScreen from '../screens/main/SearchScreen';
import SplashScreen from '../screens/SplashScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import AboutAppScreen from '../screens/profile/AboutAppScreen';
import TermsScreen from '../screens/profile/TermsScreen';
import PrivacyScreen from '../screens/profile/PrivacyScreen';
import PaymentMethodsScreen from '../screens/profile/PaymentMethodsScreen';
import HelpCenterScreen from '../screens/profile/HelpCenterScreen';
import ContactUsScreen from '../screens/profile/ContactUsScreen';
import SellerOnboardingScreen from '../screens/seller/SellerOnboardingScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoading, userToken } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <LoadingWave color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right'
        }}
        initialRouteName="Splash"
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        {!userToken ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name="MainTab" component={MainTabNavigator} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="ProductList" component={ProductListScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="ShippingAddresses" component={ShippingAddressScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="SellerOnboarding" component={SellerOnboardingScreen} />
            <Stack.Screen name="SellerDashboard" component={SellerDashboardScreen} />
            <Stack.Screen name="AddProduct" component={AddProductScreen} />
            <Stack.Screen name="SelectCategory" component={SelectCategoryScreen} />
            <Stack.Screen name="MyProducts" component={MyProductsScreen} />
            <Stack.Screen name="SellerOrders" component={OrdersManagementScreen} />
            <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
            <Stack.Screen name="Wishlist" component={WishlistScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="AboutApp" component={AboutAppScreen} />
            <Stack.Screen name="Terms" component={TermsScreen} />
            <Stack.Screen name="Privacy" component={PrivacyScreen} />
            <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
            <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
            <Stack.Screen name="ContactUs" component={ContactUsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
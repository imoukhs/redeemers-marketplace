import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import AdminStoresScreen from '../screens/admin/AdminStoresScreen';
import AdminProductsScreen from '../screens/admin/AdminProductsScreen';
import AdminTransactionsScreen from '../screens/admin/AdminTransactionsScreen';
import AdminSettingsScreen from '../screens/admin/AdminSettingsScreen';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';

const Tab = createBottomTabNavigator();

const AdminNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Users':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Stores':
              iconName = focused ? 'storefront' : 'storefront-outline';
              break;
            case 'Products':
              iconName = focused ? 'cube' : 'cube-outline';
              break;
            case 'Transactions':
              iconName = focused ? 'cash' : 'cash-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.subtext,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={AdminDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Users" 
        component={AdminUsersScreen}
        options={{ title: 'Users' }}
      />
      <Tab.Screen 
        name="Stores" 
        component={AdminStoresScreen}
        options={{ title: 'Stores' }}
      />
      <Tab.Screen 
        name="Products" 
        component={AdminProductsScreen}
        options={{ title: 'Products' }}
      />
      <Tab.Screen 
        name="Transactions" 
        component={AdminTransactionsScreen}
        options={{ title: 'Finance' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={AdminProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default AdminNavigator; 
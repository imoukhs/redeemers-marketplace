import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/main/HomeScreen';
import SearchScreen from '../screens/main/SearchScreen';
import CategoryScreen from '../screens/main/CategoryScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import CustomTabBar from '../components/navigation/CustomTabBar';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Home'
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{
          title: 'Search'
        }}
      />
      <Tab.Screen 
        name="Categories" 
        component={CategoryScreen}
        options={{
          title: 'Browse'
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile'
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator; 
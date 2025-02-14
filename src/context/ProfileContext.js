import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    profileImage: null,
    preferences: {
      notifications: true,
      newsletter: false,
      darkMode: false,
      sellerMode: false,
    },
    seller: {
      storeName: '',
      storeDescription: '',
      bankDetails: {
        accountName: '',
        accountNumber: '',
        bankName: '',
      },
      metrics: {
        totalSales: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalProducts: 0,
      },
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('profileData');
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading profile data:', error);
      setLoading(false);
    }
  };

  const saveProfileData = async (newData) => {
    try {
      await AsyncStorage.setItem('profileData', JSON.stringify(newData));
      setProfileData(newData);
    } catch (error) {
      console.error('Error saving profile data:', error);
    }
  };

  const updateSellerProfile = async (sellerData) => {
    try {
      const newData = {
        ...profileData,
        seller: {
          ...profileData.seller,
          ...sellerData,
        },
      };
      await saveProfileData(newData);
      return true;
    } catch (error) {
      console.error('Error updating seller profile:', error);
      return false;
    }
  };

  const toggleSellerMode = async () => {
    try {
      const newData = {
        ...profileData,
        preferences: {
          ...profileData.preferences,
          sellerMode: !profileData.preferences.sellerMode,
        },
      };
      await saveProfileData(newData);
      return true;
    } catch (error) {
      console.error('Error toggling seller mode:', error);
      return false;
    }
  };

  const updatePreferences = async (preferences) => {
    try {
      const newData = {
        ...profileData,
        preferences: {
          ...profileData.preferences,
          ...preferences,
        },
      };
      await saveProfileData(newData);
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  };

  const updateProfile = async (newData) => {
    try {
      setLoading(true);
      const updatedData = { ...profileData, ...newData };
      await AsyncStorage.setItem('profileData', JSON.stringify(updatedData));
      setProfileData(updatedData);
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfileImage = async (imageUri) => {
    try {
      const updatedData = { ...profileData, profileImage: imageUri };
      await AsyncStorage.setItem('profileData', JSON.stringify(updatedData));
      setProfileData(updatedData);
      return true;
    } catch (error) {
      console.error('Error updating profile image:', error);
      return false;
    }
  };

  const updatePreference = async (key, value) => {
    try {
      const updatedPreferences = {
        ...profileData.preferences,
        [key]: value,
      };
      const updatedData = {
        ...profileData,
        preferences: updatedPreferences,
      };
      await AsyncStorage.setItem('profileData', JSON.stringify(updatedData));
      setProfileData(updatedData);
      return true;
    } catch (error) {
      console.error('Error updating preference:', error);
      return false;
    }
  };

  const clearProfile = async () => {
    try {
      await AsyncStorage.removeItem('profileData');
      setProfileData({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        profileImage: null,
        preferences: {
          notifications: true,
          newsletter: false,
          darkMode: false,
          sellerMode: false,
        },
        seller: {
          storeName: '',
          storeDescription: '',
          bankDetails: {
            accountName: '',
            accountNumber: '',
            bankName: '',
          },
          metrics: {
            totalSales: 0,
            totalOrders: 0,
            pendingOrders: 0,
            totalProducts: 0,
          },
        },
      });
      return true;
    } catch (error) {
      console.error('Error clearing profile:', error);
      return false;
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profileData,
        loading,
        updateProfile,
        updatePreferences,
        updateSellerProfile,
        toggleSellerMode,
        updateProfileImage,
        updatePreference,
        clearProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext; 
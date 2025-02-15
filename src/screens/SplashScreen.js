import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import CustomLoader from '../components/common/CustomLoader';

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { userToken, userData } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (userToken) {
        navigation.replace(userData?.role === 'admin' ? 'AdminRoot' : 'MainRoot');
      } else {
        navigation.replace('Auth');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, userToken, userData]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.loaderContainer}>
          <CustomLoader />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.appName, { color: theme.colors.primary }]}>
            Redeemer's Marketplace
          </Text>
          <Text style={[styles.tagline, { color: theme.colors.subtext }]}>
            Your One-Stop Shopping Destination
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loaderContainer: {
    width: width * 0.7,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default SplashScreen; 
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const AboutAppScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const handleLinkPress = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>About App</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.appName, { color: theme.colors.text }]}>
            Redeemer's Marketplace
          </Text>
          <Text style={[styles.version, { color: theme.colors.subtext }]}>
            Version 1.0.0
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            About Us
          </Text>
          <Text style={[styles.description, { color: theme.colors.text }]}>
            Redeemer's Marketplace is a modern, cross-platform e-commerce application designed to provide a seamless shopping experience for both buyers and sellers. Our platform connects users within the Redeemer's community, making it easy to buy and sell products securely.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Key Features
          </Text>
          <View style={styles.featureList}>
            {[
              'Cross-platform compatibility',
              'Secure authentication',
              'Real-time chat',
              'Advanced search',
              'Seller dashboard',
              'Multiple payment options',
              'Order tracking',
              'Dark mode support',
            ].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={[styles.featureText, { color: theme.colors.text }]}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Contact & Support
          </Text>
          <TouchableOpacity
            style={styles.link}
            onPress={() => handleLinkPress('mailto:support@redeemersmarketplace.com')}
          >
            <Text style={[styles.linkText, { color: theme.colors.primary }]}>
              support@redeemersmarketplace.com
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link}
            onPress={() => handleLinkPress('https://redeemersmarketplace.com')}
          >
            <Text style={[styles.linkText, { color: theme.colors.primary }]}>
              Visit our website
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.copyright, { color: theme.colors.subtext }]}>
          © 2024 Redeemer's Marketplace. All rights reserved.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    padding: 32,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  featureList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 12,
  },
  link: {
    marginVertical: 8,
  },
  linkText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  copyright: {
    textAlign: 'center',
    fontSize: 12,
    marginVertical: 24,
  },
});

export default AboutAppScreen; 
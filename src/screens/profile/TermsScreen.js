import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const TermsScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Terms & Conditions</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            1. Acceptance of Terms
          </Text>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            By accessing and using Redeemer's Marketplace, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            2. User Accounts
          </Text>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            Users must create an account to access certain features. You are responsible for maintaining the confidentiality of your account information and for all activities under your account.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            3. Product Listings
          </Text>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            Sellers must provide accurate information about their products. We reserve the right to remove any listing that violates our policies or contains inappropriate content.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            4. Payments and Transactions
          </Text>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            All transactions must be conducted through our platform. We use secure payment processors to handle payments. Sellers will receive payment after successful delivery and buyer confirmation.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            5. Shipping and Delivery
          </Text>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            Sellers are responsible for shipping products within the specified timeframe. Buyers must provide accurate shipping information. We are not responsible for lost or damaged items during transit.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            6. Returns and Refunds
          </Text>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            Our return policy allows returns within 30 days of delivery. Items must be unused and in original packaging. Refunds will be processed after inspection of returned items.
          </Text>
        </View>

        <Text style={[styles.lastUpdated, { color: theme.colors.subtext }]}>
          Last updated: January 2024
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
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
  },
  lastUpdated: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 24,
  },
});

export default TermsScreen; 
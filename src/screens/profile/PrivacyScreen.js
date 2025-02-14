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

const PrivacyScreen = ({ navigation }) => {
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Privacy Policy</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            1. Information We Collect
          </Text>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            We collect information that you provide directly to us, including name, email address, phone number, and payment information. We also automatically collect certain information about your device and how you interact with our platform.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            2. How We Use Your Information
          </Text>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            We use the information we collect to provide, maintain, and improve our services, process your transactions, communicate with you, and send you marketing communications (with your consent).
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            3. Information Sharing
          </Text>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            We do not sell your personal information. We may share your information with third-party service providers who assist us in operating our platform, processing payments, and delivering products.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            4. Data Security
          </Text>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            5. Your Rights
          </Text>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            You have the right to access, correct, or delete your personal information. You can also object to processing and request data portability. Contact us to exercise these rights.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            6. Cookies and Tracking
          </Text>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            We use cookies and similar tracking technologies to collect information about how you interact with our services and to improve your experience.
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

export default PrivacyScreen; 
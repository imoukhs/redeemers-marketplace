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

const faqData = [
  {
    id: '1',
    question: 'How do I place an order?',
    answer: 'To place an order, browse products, add items to your cart, and proceed to checkout. Follow the steps to enter shipping and payment information.',
  },
  {
    id: '2',
    question: 'What payment methods are accepted?',
    answer: 'We accept various payment methods including credit/debit cards and bank transfers.',
  },
  {
    id: '3',
    question: 'How can I track my order?',
    answer: 'Once your order is shipped, you will receive a tracking number via email. You can also track your order in the Orders section of your account.',
  },
  {
    id: '4',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for most items. Items must be unused and in original packaging.',
  },
];

const HelpCenterScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const handleContactSupport = () => {
    navigation.navigate('ContactUs');
  };

  const renderFAQItem = ({ question, answer }) => (
    <View style={[styles.faqItem, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.question, { color: theme.colors.text }]}>{question}</Text>
      <Text style={[styles.answer, { color: theme.colors.subtext }]}>{answer}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Help Center</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.supportSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Need Help?
          </Text>
          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleContactSupport}
          >
            <Ionicons name="mail-outline" size={24} color="#fff" />
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.faqSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Frequently Asked Questions
          </Text>
          {faqData.map((faq) => (
            <View key={faq.id}>{renderFAQItem(faq)}</View>
          ))}
        </View>
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
  supportSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  faqSection: {
    padding: 16,
  },
  faqItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default HelpCenterScreen; 
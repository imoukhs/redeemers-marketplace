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

const OrderConfirmationScreen = ({ route, navigation }) => {
  const { orderData } = route.params;

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
        </View>
        
        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.message}>
          Thank you for your order. We'll notify you once it's on its way!
        </Text>

        <View style={styles.orderInfo}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Order Date:</Text>
            <Text style={styles.value}>{formatDate(orderData.orderDate)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Payment Method:</Text>
            <Text style={styles.value}>
              {orderData.paymentMethod === 'card' ? 'Card Payment' : 'Cash on Delivery'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Total Amount:</Text>
            <Text style={styles.value}>₦{(orderData.total + 2000).toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.shippingInfo}>
          <Text style={styles.sectionTitle}>Shipping Details</Text>
          <Text style={styles.shippingText}>{orderData.shipping.fullName}</Text>
          <Text style={styles.shippingText}>{orderData.shipping.phoneNumber}</Text>
          <Text style={styles.shippingText}>{orderData.shipping.address}</Text>
          <Text style={styles.shippingText}>
            {orderData.shipping.city}, {orderData.shipping.state} {orderData.shipping.zipCode}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    marginVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  orderInfo: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  shippingInfo: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  shippingText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  continueButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderConfirmationScreen; 
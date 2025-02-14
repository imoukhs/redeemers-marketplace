import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const CheckoutScreen = ({ navigation }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: userData?.fullName || '',
    phoneNumber: userData?.phoneNumber || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'cash'

  const handleInputChange = (field, value) => {
    setShippingDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = ['fullName', 'phoneNumber', 'address', 'city', 'state', 'zipCode'];
    const emptyFields = requiredFields.filter(field => !shippingDetails[field]);

    if (emptyFields.length > 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API call to process order
      const orderData = {
        items: cartItems,
        total: getCartTotal(),
        shipping: shippingDetails,
        paymentMethod,
        userId: userData?.id,
        orderDate: new Date().toISOString(),
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Clear cart after successful order
      await clearCart();

      // Show success message and navigate to order confirmation
      Alert.alert(
        'Success',
        'Your order has been placed successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('OrderConfirmation', { orderData }),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Shipping Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Details</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={shippingDetails.fullName}
              onChangeText={(text) => handleInputChange('fullName', text)}
              placeholder="Enter your full name"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={shippingDetails.phoneNumber}
              onChangeText={(text) => handleInputChange('phoneNumber', text)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={shippingDetails.address}
              onChangeText={(text) => handleInputChange('address', text)}
              placeholder="Enter your address"
            />
          </View>
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                value={shippingDetails.city}
                onChangeText={(text) => handleInputChange('city', text)}
                placeholder="City"
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={styles.input}
                value={shippingDetails.state}
                onChangeText={(text) => handleInputChange('state', text)}
                placeholder="State"
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>ZIP Code</Text>
            <TextInput
              style={styles.input}
              value={shippingDetails.zipCode}
              onChangeText={(text) => handleInputChange('zipCode', text)}
              placeholder="ZIP Code"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'card' && styles.selectedPayment,
              ]}
              onPress={() => setPaymentMethod('card')}
            >
              <Ionicons
                name="card-outline"
                size={24}
                color={paymentMethod === 'card' ? '#1E90FF' : '#666'}
              />
              <Text
                style={[
                  styles.paymentText,
                  paymentMethod === 'card' && styles.selectedPaymentText,
                ]}
              >
                Card Payment
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'cash' && styles.selectedPayment,
              ]}
              onPress={() => setPaymentMethod('cash')}
            >
              <Ionicons
                name="cash-outline"
                size={24}
                color={paymentMethod === 'cash' ? '#1E90FF' : '#666'}
              />
              <Text
                style={[
                  styles.paymentText,
                  paymentMethod === 'cash' && styles.selectedPaymentText,
                ]}
              >
                Cash on Delivery
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              ₦{getCartTotal().toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping Fee</Text>
            <Text style={styles.summaryValue}>₦2,000</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ₦{(getCartTotal() + 2000).toLocaleString()}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.placeOrderButton, loading && styles.disabledButton]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          <Text style={styles.placeOrderButtonText}>
            {loading ? 'Processing...' : 'Place Order'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 8,
  },
  selectedPayment: {
    borderColor: '#1E90FF',
    backgroundColor: '#F0F8FF',
  },
  paymentText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  selectedPaymentText: {
    color: '#1E90FF',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E90FF',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  placeOrderButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default CheckoutScreen; 
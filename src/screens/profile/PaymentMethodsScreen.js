import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const PaymentMethodsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [paymentMethods, setPaymentMethods] = useState([
    { id: '1', type: 'card', last4: '4242', brand: 'visa' },
    { id: '2', type: 'card', last4: '5555', brand: 'mastercard' },
  ]);

  const handleAddPaymentMethod = () => {
    // TODO: Implement add payment method functionality
    Alert.alert('Coming Soon', 'Add payment method functionality will be available soon.');
  };

  const handleDeletePaymentMethod = (id) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(methods => methods.filter(method => method.id !== id));
          },
        },
      ]
    );
  };

  const renderPaymentMethod = ({ item }) => (
    <View style={[styles.paymentMethodItem, { backgroundColor: theme.colors.card }]}>
      <View style={styles.paymentMethodInfo}>
        <Ionicons
          name={item.brand === 'visa' ? 'card' : 'card-outline'}
          size={24}
          color={theme.colors.primary}
        />
        <View style={styles.paymentMethodDetails}>
          <Text style={[styles.paymentMethodType, { color: theme.colors.text }]}>
            {item.brand.toUpperCase()} ending in {item.last4}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeletePaymentMethod(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color={theme.colors.error} />
      </TouchableOpacity>
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Payment Methods</Text>
        <View style={styles.backButton} />
      </View>

      <FlatList
        data={paymentMethods}
        renderItem={renderPaymentMethod}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="card-outline" size={64} color={theme.colors.subtext} />
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              No payment methods added
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddPaymentMethod}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add Payment Method</Text>
      </TouchableOpacity>
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
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodDetails: {
    marginLeft: 12,
  },
  paymentMethodType: {
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 64,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PaymentMethodsScreen; 
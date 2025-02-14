import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const OrderDetailsScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { order } = route.params;

  const handleUpdateStatus = (newStatus) => {
    Alert.alert(
      'Update Order Status',
      `Are you sure you want to update this order to ${newStatus}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Update',
          onPress: () => {
            // TODO: Implement API call to update order status
            navigation.goBack();
          },
        },
      ]
    );
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: 'processing',
      processing: 'shipped',
      shipped: 'delivered',
    };
    return statusFlow[currentStatus];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'processing':
        return '#2196F3';
      case 'shipped':
        return '#9C27B0';
      case 'delivered':
        return '#4CAF50';
      default:
        return theme.colors.text;
    }
  };

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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Order Details</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Header */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={[styles.orderNumber, { color: theme.colors.text }]}>
                {order.orderNumber}
              </Text>
              <Text style={[styles.orderDate, { color: theme.colors.subtext }]}>
                {formatDate(order.date)}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
              <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Customer Information */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Customer Information</Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.subtext }]}>Name:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{order.customerName}</Text>
          </View>
          {/* Add more customer details when available */}
        </View>

        {/* Order Items */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Order Items</Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: theme.colors.text }]}>{item.name}</Text>
                <Text style={[styles.itemQuantity, { color: theme.colors.subtext }]}>
                  Quantity: {item.quantity}
                </Text>
              </View>
              <Text style={[styles.itemPrice, { color: theme.colors.primary }]}>
                ₦{item.price.toLocaleString()}
              </Text>
            </View>
          ))}
          <View style={styles.totalContainer}>
            <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total Amount:</Text>
            <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
              ₦{order.total.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Status Update */}
        {order.status !== 'delivered' && (
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.updateButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => handleUpdateStatus(getNextStatus(order.status))}
            >
              <Text style={styles.updateButtonText}>
                Mark as {getNextStatus(order.status)?.charAt(0).toUpperCase() + getNextStatus(order.status)?.slice(1)}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
    padding: 8,
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  actionContainer: {
    padding: 16,
  },
  updateButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderDetailsScreen; 
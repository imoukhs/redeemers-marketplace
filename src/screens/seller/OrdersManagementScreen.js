import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

// Mock data - Replace with API call later
const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    customerName: 'John Doe',
    date: '2024-03-15T10:30:00',
    total: 699000,
    status: 'pending',
    items: [
      {
        id: '1',
        name: 'iPhone 12 Pro Max',
        quantity: 1,
        price: 699000,
      },
    ],
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    customerName: 'Jane Smith',
    date: '2024-03-14T15:45:00',
    total: 258000,
    status: 'processing',
    items: [
      {
        id: '2',
        name: 'Nike Air Max 270',
        quantity: 2,
        price: 129000,
      },
    ],
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    customerName: 'Mike Johnson',
    date: '2024-03-13T09:15:00',
    total: 199000,
    status: 'shipped',
    items: [
      {
        id: '3',
        name: 'Sony WH-1000XM4',
        quantity: 1,
        price: 199000,
      },
    ],
  },
  {
    id: '4',
    orderNumber: 'ORD-004',
    customerName: 'Sarah Wilson',
    date: '2024-03-12T14:20:00',
    total: 79000,
    status: 'delivered',
    items: [
      {
        id: '4',
        name: "Levi's 501 Original",
        quantity: 1,
        price: 79000,
      },
    ],
  },
];

const OrdersManagementScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState(mockOrders);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
  ];

  const handleUpdateStatus = (orderId, newStatus) => {
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
            setOrders(orders.map(order => 
              order.id === orderId 
                ? { ...order, status: newStatus }
                : order
            ));
          },
        },
      ]
    );
  };

  const handleViewOrderDetails = (order) => {
    navigation.navigate('OrderDetails', { order });
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderOrder = ({ item }) => (
    <TouchableOpacity
      style={[styles.orderCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => handleViewOrderDetails(item)}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={[styles.orderNumber, { color: theme.colors.text }]}>
            {item.orderNumber}
          </Text>
          <Text style={[styles.customerName, { color: theme.colors.subtext }]}>
            {item.customerName}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.orderInfo}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.colors.subtext }]}>Date:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {formatDate(item.date)}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.colors.subtext }]}>Items:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {item.items.reduce((acc, curr) => acc + curr.quantity, 0)}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.colors.subtext }]}>Total:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.primary }]}>
            ₦{item.total.toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.orderActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => handleViewOrderDetails(item)}
        >
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderFilter = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        {
          backgroundColor:
            selectedFilter === item.id ? theme.colors.primary : theme.colors.surface,
        },
      ]}
      onPress={() => setSelectedFilter(item.id)}
    >
      <Text
        style={[
          styles.filterText,
          {
            color:
              selectedFilter === item.id ? '#fff' : theme.colors.text,
          },
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const filteredOrders = selectedFilter === 'all'
    ? orders
    : orders.filter(order => order.status === selectedFilter);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Orders</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.filtersContainer}>
        <FlatList
          data={filters}
          renderItem={renderFilter}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color={theme.colors.subtext} />
            <Text style={[styles.emptyText, { color: theme.colors.subtext }]}>
              No orders found
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  filtersContainer: {
    paddingVertical: 12,
  },
  filtersList: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  ordersList: {
    padding: 16,
  },
  orderCard: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
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
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  customerName: {
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
  orderInfo: {
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
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
});

export default OrdersManagementScreen; 
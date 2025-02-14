import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { LineChart } from 'react-native-chart-kit';
import { useProfile } from '../../context/ProfileContext';

const { width } = Dimensions.get('window');

// Mock data - Replace with API calls
const metrics = {
  totalSales: 2456789,
  totalOrders: 189,
  pendingOrders: 12,
  totalProducts: 45,
  revenue: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [20000, 45000, 28000, 80000, 99000, 43000],
    }],
  },
};

const recentOrders = [
  {
    id: '1',
    customer: 'John Doe',
    amount: 45000,
    status: 'pending',
    date: '2024-02-20',
    items: 3,
  },
  {
    id: '2',
    customer: 'Jane Smith',
    amount: 78000,
    status: 'processing',
    date: '2024-02-19',
    items: 5,
  },
  {
    id: '3',
    customer: 'Mike Johnson',
    amount: 23000,
    status: 'delivered',
    date: '2024-02-18',
    items: 2,
  },
];

const lowStockProducts = [
  {
    id: '1',
    name: 'iPhone 12 Pro Max',
    stock: 3,
    price: 699000,
  },
  {
    id: '2',
    name: 'Samsung Galaxy S21',
    stock: 5,
    price: 599000,
  },
];

// Mock data for the chart
const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [50000, 75000, 45000, 90000, 60000, 85000, 70000],
    },
  ],
};

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(30, 144, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#1E90FF',
  },
};

const MetricCard = ({ title, value, icon, color }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.metricCard, { backgroundColor: theme.colors.card }]}>
      <View style={[styles.metricIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.metricValue, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.metricTitle, { color: theme.colors.subtext }]}>{title}</Text>
    </View>
  );
};

const SellerDashboardScreen = ({ navigation }) => {
  const { profileData } = useProfile();
  const { theme } = useTheme();
  const { metrics } = profileData.seller;
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.orderItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <Text style={[styles.orderCustomer, { color: theme.colors.text }]}>
          {item.customer}
        </Text>
        <View style={[
          styles.orderStatus,
          { backgroundColor: getStatusColor(item.status) + '20' }
        ]}>
          <Text style={[styles.orderStatusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      <View style={styles.orderDetails}>
        <Text style={[styles.orderAmount, { color: theme.colors.primary }]}>
          ₦{item.amount.toLocaleString()}
        </Text>
        <Text style={[styles.orderInfo, { color: theme.colors.subtext }]}>
          {item.items} items • {formatDate(item.date)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderLowStockItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.lowStockItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('EditProduct', { productId: item.id })}
    >
      <View style={styles.lowStockInfo}>
        <Text style={[styles.lowStockName, { color: theme.colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.lowStockPrice, { color: theme.colors.primary }]}>
          ₦{item.price.toLocaleString()}
        </Text>
      </View>
      <View style={[styles.stockBadge, { backgroundColor: '#FF6B6B20' }]}>
        <Text style={[styles.stockText, { color: '#FF6B6B' }]}>
          {item.stock} left in stock
        </Text>
      </View>
    </TouchableOpacity>
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Seller Dashboard</Text>
        <TouchableOpacity onPress={handleAddProduct}>
          <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Store Info */}
        <View style={styles.storeSection}>
          <Text style={[styles.storeName, { color: theme.colors.text }]}>
            {profileData.seller.storeName || 'My Store'}
          </Text>
          <Text style={[styles.storeDescription, { color: theme.colors.subtext }]}>
            {profileData.seller.storeDescription || 'Add a description for your store'}
          </Text>
        </View>

        {/* Metrics */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Total Sales"
            value={`₦${metrics.totalSales.toLocaleString()}`}
            icon="cash-outline"
            color="#4CAF50"
          />
          <MetricCard
            title="Total Orders"
            value={metrics.totalOrders}
            icon="cart-outline"
            color="#2196F3"
          />
          <MetricCard
            title="Pending Orders"
            value={metrics.pendingOrders}
            icon="time-outline"
            color="#FFC107"
          />
          <MetricCard
            title="Products"
            value={metrics.totalProducts}
            icon="cube-outline"
            color="#9C27B0"
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('AddProduct')}
            >
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Add Product</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('SellerOrders')}
            >
              <Ionicons name="list-outline" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>View Orders</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Revenue Chart */}
        <View style={[styles.chartCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>Weekly Revenue</Text>
          <LineChart
            data={chartData}
            width={width - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Orders</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ordersList}
          />
        </View>

        {/* Low Stock Alert */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Low Stock Alert</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Inventory')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>Manage</Text>
            </TouchableOpacity>
          </View>
          {lowStockProducts.map((item) => (
            <View key={item.id} style={{ marginBottom: 8 }}>
              {renderLowStockItem({ item })}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return '#FF9800';
    case 'processing':
      return '#2196F3';
    case 'delivered':
      return '#4CAF50';
    default:
      return '#666666';
  }
};

const formatDate = (dateString) => {
  const options = { month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  storeSection: {
    padding: 16,
  },
  storeName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  storeDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  metricCard: {
    width: (width - 48) / 2,
    margin: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 12,
  },
  actionsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  chartCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  ordersList: {
    paddingRight: 16,
  },
  orderItem: {
    width: 280,
    marginRight: 16,
    padding: 16,
    borderRadius: 16,
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
    alignItems: 'center',
    marginBottom: 12,
  },
  orderCustomer: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  orderAmount: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  orderInfo: {
    fontSize: 12,
  },
  lowStockItem: {
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lowStockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lowStockName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  lowStockPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  stockBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default SellerDashboardScreen; 
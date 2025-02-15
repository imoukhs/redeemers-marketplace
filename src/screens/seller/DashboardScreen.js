import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { LineChart } from 'react-native-chart-kit';
import { useSeller } from '../../context/SellerContext';
import { useSubscription } from '../../context/SubscriptionContext';
import LoadingWave from '../../components/common/LoadingWave';

const { width } = Dimensions.get('window');

// Mock data for orders and products
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

const MetricCard = ({ title, value, icon, color, theme, subtitle }) => (
  <View style={[styles.metricCard, { backgroundColor: theme.colors.surface }]}>
    <View style={styles.metricIconContainer}>
      <View style={[styles.metricIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
    </View>
    <View style={styles.metricContent}>
      <Text style={[styles.metricTitle, { color: theme.colors.subtext }]}>{title}</Text>
      <Text style={[styles.metricValue, { color: theme.colors.text }]}>{value}</Text>
      {subtitle && (
        <Text style={[styles.metricSubtitle, { color: theme.colors.subtext }]}>{subtitle}</Text>
      )}
    </View>
  </View>
);

const QuickAction = ({ title, icon, onPress, theme, disabled }) => (
  <TouchableOpacity
    style={[styles.quickAction, { backgroundColor: theme.colors.surface }]}
    onPress={onPress}
    disabled={disabled}
  >
    <Ionicons name={icon} size={24} color={theme.colors.primary} />
    <Text style={[styles.quickActionText, { color: theme.colors.text }]}>{title}</Text>
  </TouchableOpacity>
);

const SellerDashboardScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { sellerData, metrics, fetchSellerMetrics } = useSeller();
  const { subscription } = useSubscription();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      await fetchSellerMetrics();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <LoadingWave color={theme.colors.primary} />
      </View>
    );
  }

  if (!sellerData || !sellerData.verified) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Seller Dashboard
          </Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.verificationContainer}>
          <Ionicons name="alert-circle" size={48} color={theme.colors.warning} />
          <Text style={[styles.verificationTitle, { color: theme.colors.text }]}>
            Account Under Review
          </Text>
          <Text style={[styles.verificationText, { color: theme.colors.subtext }]}>
            Your seller account is currently under review. We'll notify you once your account is verified.
          </Text>
          <TouchableOpacity
            style={[styles.profileButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.profileButtonText}>View/Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isBasicPlan = subscription?.planId === 'basic';

  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
  };

  const handleInventoryPress = () => {
    navigation.navigate('Inventory');
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('SellerSettings')}
        >
          <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Store Info */}
        <View style={styles.storeSection}>
          <View style={styles.storeHeader}>
            <View>
              <Text style={[styles.storeName, { color: theme.colors.text }]}>
                {sellerData.storeName || 'My Store'}
              </Text>
              <Text style={[styles.storeDescription, { color: theme.colors.subtext }]}>
                {sellerData.storeDescription || 'Add a description for your store'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: theme.colors.primary + '20' }]}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Today's Sales"
            value={`₦${metrics?.totalSales?.toLocaleString() || '0'}`}
            subtitle="12% increase"
            icon="cash"
            color="#4CAF50"
            theme={theme}
          />
          <MetricCard
            title="Orders"
            value={metrics?.totalOrders || '0'}
            subtitle={`${metrics?.pendingOrders || 0} pending`}
            icon="cart"
            color="#2196F3"
            theme={theme}
          />
          <MetricCard
            title="Products"
            value={metrics?.totalProducts || '0'}
            subtitle={`${isBasicPlan ? '50' : '100'} limit`}
            icon="cube"
            color="#9C27B0"
            theme={theme}
          />
          <MetricCard
            title="Views"
            value="2,458"
            subtitle="Last 7 days"
            icon="eye"
            color="#FF9800"
            theme={theme}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            <QuickAction
              title="Add Product"
              icon="add-circle-outline"
              onPress={handleAddProduct}
              theme={theme}
            />
            <QuickAction
              title="Inventory"
              icon="cube-outline"
              onPress={handleInventoryPress}
              theme={theme}
            />
            <QuickAction
              title="Orders"
              icon="receipt-outline"
              onPress={() => navigation.navigate('SellerOrders')}
              theme={theme}
            />
            <QuickAction
              title="Analytics"
              icon="bar-chart-outline"
              onPress={() => navigation.navigate('Analytics')}
              theme={theme}
            />
            <QuickAction
              title="Customers"
              icon="people-outline"
              onPress={() => navigation.navigate('Customers')}
              theme={theme}
            />
          </View>
        </View>

        {/* Revenue Chart */}
        <View style={[styles.section, styles.chartSection, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Revenue</Text>
            <View style={styles.periodSelector}>
              <TouchableOpacity
                style={[
                  styles.periodButton,
                  selectedPeriod === 'week' && { backgroundColor: theme.colors.primary + '20' }
                ]}
                onPress={() => setSelectedPeriod('week')}
              >
                <Text style={[
                  styles.periodButtonText,
                  { color: selectedPeriod === 'week' ? theme.colors.primary : theme.colors.subtext }
                ]}>Week</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.periodButton,
                  selectedPeriod === 'month' && { backgroundColor: theme.colors.primary + '20' }
                ]}
                onPress={() => setSelectedPeriod('month')}
              >
                <Text style={[
                  styles.periodButtonText,
                  { color: selectedPeriod === 'month' ? theme.colors.primary : theme.colors.subtext }
                ]}>Month</Text>
              </TouchableOpacity>
            </View>
          </View>
          <LineChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [{
                data: [50000, 75000, 45000, 90000, 60000, 85000, 70000]
              }]
            }}
            width={width - 48}
            height={220}
            chartConfig={{
              backgroundColor: theme.colors.surface,
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(30, 144, 255, ${opacity})`,
              labelColor: (opacity = 1) => theme.colors.subtext,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: theme.colors.primary
              }
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityList}>
            {[1, 2, 3].map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.activityItem,
                  { backgroundColor: theme.colors.surface }
                ]}
              >
                <View style={[styles.activityIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Ionicons name="cart" size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityTitle, { color: theme.colors.text }]}>
                    New order received
                  </Text>
                  <Text style={[styles.activityTime, { color: theme.colors.subtext }]}>
                    2 hours ago
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
              </View>
            ))}
          </View>
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
  storeSection: {
    padding: 16,
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  storeName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  storeDescription: {
    fontSize: 14,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 8,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  metricIconContainer: {
    marginRight: 12,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricContent: {
    flex: 1,
  },
  metricTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  metricSubtitle: {
    fontSize: 12,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActionsContainer: {
    padding: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 12,
  },
  quickAction: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  chartSection: {
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#00000010',
    borderRadius: 20,
    padding: 4,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
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
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
  },
  verificationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  verificationTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  verificationText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  profileButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  profileButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
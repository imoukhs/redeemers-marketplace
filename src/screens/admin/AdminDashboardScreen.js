import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAdmin } from '../../context/AdminContext';
import { LineChart } from 'react-native-chart-kit';
import LoadingWave from '../../components/common/LoadingWave';

const { width } = Dimensions.get('window');

const AdminDashboardScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { getSystemMetrics, getTransactionHistory } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setError(null);
      const [metricsResponse, transactionsResponse] = await Promise.all([
        getSystemMetrics(),
        getTransactionHistory()
      ]);

      if (metricsResponse?.data) {
        setMetrics(metricsResponse.data);
      }

      if (transactionsResponse?.data) {
        setTransactions(transactionsResponse.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      Alert.alert('Error', 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderMetricCard = (title, value, icon, color, trend) => (
    <View style={[styles.metricCard, { backgroundColor: theme.colors.card }]}>
      <View style={styles.metricHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        {trend && (
          <View style={[styles.trendContainer, { 
            backgroundColor: trend > 0 ? '#4CAF5015' : '#FF525215'
          }]}>
            <Ionicons 
              name={trend > 0 ? 'trending-up' : 'trending-down'} 
              size={14} 
              color={trend > 0 ? '#4CAF50' : '#FF5252'} 
            />
            <Text style={[styles.trendText, { 
              color: trend > 0 ? '#4CAF50' : '#FF5252'
            }]}>
              {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>
      <Text style={[styles.metricValue, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.metricTitle, { color: theme.colors.subtext }]}>{title}</Text>
    </View>
  );

  const renderNavigationCard = (title, subtitle, icon, onPress) => (
    <TouchableOpacity
      style={[styles.navigationCard, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
    >
      <View style={[styles.navigationIcon, { backgroundColor: `${theme.colors.primary}15` }]}>
        <Ionicons name={icon} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.navigationContent}>
        <Text style={[styles.navigationTitle, { color: theme.colors.text }]}>{title}</Text>
        <Text style={[styles.navigationSubtitle, { color: theme.colors.subtext }]}>
          {subtitle}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingWave color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <View>
          <Text style={[styles.headerSubtitle, { color: theme.colors.subtext }]}>
            Welcome back
          </Text>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Admin Dashboard
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.notificationButton, { backgroundColor: `${theme.colors.primary}15` }]}
        >
          <Ionicons name="notifications-outline" size={22} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.metricsGrid}>
          {renderMetricCard(
            'Total Revenue',
            `₦${metrics?.totalRevenue?.toLocaleString() || '0'}`,
            'cash-outline',
            theme.colors.primary,
            12
          )}
          {renderMetricCard(
            'Active Users',
            metrics?.totalUsers?.toString() || '0',
            'people-outline',
            '#4CAF50',
            8
          )}
          {renderMetricCard(
            'Total Stores',
            metrics?.totalStores?.toString() || '0',
            'storefront-outline',
            '#FF9800',
            5
          )}
          {renderMetricCard(
            'Total Products',
            metrics?.totalProducts?.toString() || '0',
            'cube-outline',
            '#E91E63',
            15
          )}
        </View>

        <View style={styles.chartSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Revenue Overview
          </Text>
          <View style={[styles.chartCard, { backgroundColor: theme.colors.card }]}>
            <LineChart
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100
                  ]
                }]
              }}
              width={width - 48}
              height={220}
              chartConfig={{
                backgroundColor: theme.colors.card,
                backgroundGradientFrom: theme.colors.card,
                backgroundGradientTo: theme.colors.card,
                decimalPlaces: 0,
                color: (opacity = 1) => theme.colors.primary,
                style: {
                  borderRadius: 16
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </View>
        </View>

        <View style={styles.navigationSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Access
          </Text>
          {renderNavigationCard(
            'User Management',
            'Manage user accounts and roles',
            'people',
            () => navigation.navigate('Users')
          )}
          {renderNavigationCard(
            'Store Management',
            'Review and manage store applications',
            'storefront',
            () => navigation.navigate('Stores')
          )}
          {renderNavigationCard(
            'Product Approvals',
            'Review and approve product listings',
            'cube',
            () => navigation.navigate('Products')
          )}
          {renderNavigationCard(
            'Transaction History',
            'View and manage transactions',
            'receipt',
            () => navigation.navigate('Transactions')
          )}
          {renderNavigationCard(
            'System Settings',
            'Configure system preferences and settings',
            'settings',
            () => navigation.navigate('Settings')
          )}
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
    paddingTop: Platform.OS === 'android' ? 24 : 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  notificationButton: {
    padding: 10,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricCard: {
    width: (width - 48) / 2 - 8,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 14,
  },
  chartSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chartCard: {
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  navigationSection: {
    marginBottom: 24,
  },
  navigationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  navigationIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  navigationContent: {
    flex: 1,
  },
  navigationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  navigationSubtitle: {
    fontSize: 14,
  },
});

export default AdminDashboardScreen; 
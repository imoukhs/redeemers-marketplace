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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import LoadingWave from '../../components/common/LoadingWave';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - 48 - CARD_MARGIN * 2) / 2;

const MetricCard = ({ title, value, icon, color, subtitle, trend }) => {
  const { theme } = useTheme();
  
  return (
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
      <View style={styles.metricInfo}>
        <Text style={[styles.metricValue, { color: theme.colors.text }]}>{value}</Text>
        <Text style={[styles.metricTitle, { color: theme.colors.subtext }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.metricSubtitle, { color: theme.colors.subtext }]}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
};

const QuickActionButton = ({ title, icon, onPress, color, theme }) => (
  <TouchableOpacity
    style={[styles.actionButton, { backgroundColor: theme.colors.card }]}
    onPress={onPress}
  >
    <View style={[styles.actionIconContainer, { backgroundColor: `${color}15` }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>{title}</Text>
    <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
  </TouchableOpacity>
);

const AdminProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { logout } = useAuth();
  const { getSystemMetrics, getTransactionHistory } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const loadData = async () => {
    try {
      const [metricsData, transactionsData] = await Promise.all([
        getSystemMetrics(),
        getTransactionHistory(),
      ]);
      
      if (metricsData?.data) {
        setMetrics(metricsData.data);
      }
      
      if (transactionsData?.data) {
        setTransactions(transactionsData.data);
      }
    } catch (error) {
      console.error('Error loading admin profile data:', error);
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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const formatCurrency = (amount) => {
    return `₱${amount?.toLocaleString() || '0'}`;
  };

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
            Admin Dashboard
          </Text>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Overview
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: `${theme.colors.error}15` }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color={theme.colors.error} />
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
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(metrics?.totalRevenue)}
            icon="cash-outline"
            color={theme.colors.primary}
            trend={12}
          />
          <MetricCard
            title="Active Users"
            value={metrics?.totalUsers?.toString() || '0'}
            icon="people-outline"
            color="#4CAF50"
            trend={8}
          />
          <MetricCard
            title="Total Stores"
            value={metrics?.totalStores?.toString() || '0'}
            icon="storefront-outline"
            color="#FF9800"
            trend={5}
          />
          <MetricCard
            title="Total Products"
            value={metrics?.totalProducts?.toString() || '0'}
            icon="cube-outline"
            color="#E91E63"
            trend={15}
          />
          <MetricCard
            title="Recent Transactions"
            value={metrics?.recentTransactions?.toString() || '0'}
            icon="receipt-outline"
            color="#2196F3"
            subtitle="Last 24 hours"
          />
          <MetricCard
            title="Pending Approvals"
            value={metrics?.pendingApprovals?.toString() || '0'}
            icon="time-outline"
            color="#FF5722"
            subtitle="Requires attention"
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActions}>
            <QuickActionButton
              title="Manage Users"
              icon="people"
              color="#4CAF50"
              onPress={() => navigation.navigate('Users')}
              theme={theme}
            />
            <QuickActionButton
              title="Manage Stores"
              icon="storefront"
              color="#FF9800"
              onPress={() => navigation.navigate('Stores')}
              theme={theme}
            />
            <QuickActionButton
              title="System Settings"
              icon="settings"
              color="#2196F3"
              onPress={() => navigation.navigate('Settings')}
              theme={theme}
            />
          </View>
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
  logoutButton: {
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
    width: CARD_WIDTH,
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
  metricInfo: {
    flex: 1,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  metricSubtitle: {
    fontSize: 12,
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActions: {
    gap: 12,
  },
  actionButton: {
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
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdminProfileScreen; 
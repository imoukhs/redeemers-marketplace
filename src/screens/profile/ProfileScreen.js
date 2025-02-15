import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../../context/ProfileContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSeller } from '../../context/SellerContext';
import LoadingWave from '../../components/common/LoadingWave';
import { useSubscription } from '../../context/SubscriptionContext';

const { width } = Dimensions.get('window');

const MenuItem = ({ icon, title, value, onPress, showArrow = true }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name={icon} size={20} color={theme.colors.primary} />
        </View>
        <Text style={[styles.menuItemText, { color: theme.colors.text }]}>{title}</Text>
      </View>
      {value}
    </TouchableOpacity>
  );
};

const DashboardCard = ({ title, value, icon, color, onPress }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity 
      style={[styles.dashboardCard, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
    >
      <View style={[styles.dashboardIconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.dashboardValue, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.dashboardTitle, { color: theme.colors.subtext }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const QuickAction = ({ title, icon, onPress, theme }) => (
  <TouchableOpacity
    style={[styles.quickAction, { backgroundColor: theme.colors.surface }]}
    onPress={onPress}
  >
    <Ionicons name={icon} size={24} color={theme.colors.primary} />
    <Text style={[styles.quickActionText, { color: theme.colors.text }]}>{title}</Text>
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  const { profileData, loading: profileLoading, updatePreference } = useProfile();
  const { signOut } = useAuth();
  const { theme } = useTheme();
  const { 
    loading: sellerLoading, 
    metrics, 
    fetchSellerMetrics,
    error 
  } = useSeller();
  const { subscription, plans } = useSubscription();

  useEffect(() => {
    if (profileData.preferences?.sellerMode) {
      loadDashboardData();
    }
  }, [profileData.preferences?.sellerMode]);

  const loadDashboardData = async () => {
    try {
      await fetchSellerMetrics();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleToggleSellerMode = async () => {
    const success = await updatePreference('sellerMode', !profileData.preferences.sellerMode);
    if (success && !profileData.preferences.sellerMode) {
      loadDashboardData();
    }
  };

  // Update subscription section
  const renderSubscriptionCard = () => {
    const currentPlan = subscription ? plans.find(p => p.id === subscription.planId) : plans[0];
    const isBasicPlan = currentPlan?.id === 'basic';
    
    return (
      <View style={[styles.subscriptionCard, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.subscriptionHeader}>
          <View style={styles.subscriptionInfo}>
            <Text style={[styles.subscriptionTitle, { color: theme.colors.text }]}>
              {currentPlan?.name || 'Basic Plan'}
            </Text>
            <Text style={[styles.subscriptionPrice, { color: theme.colors.primary }]}>
              ₦{currentPlan?.price?.toLocaleString() || '1,000'}/month
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.upgradeButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('SubscriptionScreen')}
          >
            <Text style={styles.upgradeButtonText}>
              {isBasicPlan ? 'Upgrade' : 'Manage'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresContainer}>
          {[
            { 
              icon: 'cube-outline', 
              text: `${isBasicPlan ? '50' : '100'} Product Limit (${metrics?.totalProducts || 0} used)`
            },
            { 
              icon: 'analytics-outline', 
              text: isBasicPlan ? 'Basic Analytics' : 'Advanced Analytics'
            },
            { 
              icon: 'headset-outline', 
              text: isBasicPlan ? 'Standard Support' : 'Priority Support'
            },
            { 
              icon: 'megaphone-outline', 
              text: isBasicPlan ? 'Basic Promotions' : 'Premium Promotions'
            },
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name={feature.icon} size={16} color={theme.colors.primary} />
              <Text style={[styles.featureText, { color: theme.colors.text }]}>
                {feature.text}
              </Text>
            </View>
          ))}
        </View>

        {metrics?.totalProducts >= (isBasicPlan ? 50 : 100) && (
          <View style={[styles.limitWarning, { backgroundColor: theme.colors.error + '20' }]}>
            <Ionicons name="warning-outline" size={20} color={theme.colors.error} />
            <Text style={[styles.limitWarningText, { color: theme.colors.error }]}>
              Product limit reached. Upgrade your plan to add more products.
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (profileLoading || (profileData.preferences?.sellerMode && sellerLoading)) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <LoadingWave color={theme.colors.primary} />
      </View>
    );
  }

  // Seller Mode Layout
  if (profileData.preferences?.sellerMode) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Store Header */}
          <View style={[styles.storeHeader, { backgroundColor: theme.colors.primary }]}>
            <View style={styles.storeHeaderContent}>
              <View style={styles.storeInfo}>
                <TouchableOpacity
                  style={styles.storeImageContainer}
                  onPress={() => navigation.navigate('EditProfile')}
                >
                  {profileData.storeImage ? (
                    <Image
                      source={{ uri: profileData.storeImage }}
                      style={styles.storeImage}
                    />
                  ) : (
                    <View style={[styles.storeImagePlaceholder, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                      <Ionicons name="storefront" size={40} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
                <View style={styles.storeDetails}>
                  <Text style={styles.storeName}>{profileData.storeName || 'Your Store'}</Text>
                  <Text style={styles.storeStatus}>
                    <Ionicons name="checkmark-circle" size={14} color="#4CAF50" /> Verified Seller
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.logoutIconButton} 
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Subscription Card */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Subscription</Text>
            {renderSubscriptionCard()}
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <QuickAction
              title="Add Product"
              icon="add-circle-outline"
              onPress={() => {
                const isBasicPlan = subscription?.planId === 'basic';
                const limit = isBasicPlan ? 50 : 100;
                if (metrics?.totalProducts >= limit) {
                  Alert.alert(
                    'Product Limit Reached',
                    'Upgrade your subscription to add more products.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Upgrade',
                        onPress: () => navigation.navigate('SubscriptionScreen')
                      }
                    ]
                  );
                  return;
                }
                navigation.navigate('AddProduct');
              }}
              theme={theme}
            />
            <QuickAction
              title="Orders"
              icon="receipt-outline"
              onPress={() => navigation.navigate('SellerOrders')}
              theme={theme}
            />
            <QuickAction
              title="Products"
              icon="cube-outline"
              onPress={() => navigation.navigate('MyProducts')}
              theme={theme}
            />
            <QuickAction
              title="Promotions"
              icon="megaphone-outline"
              onPress={() => navigation.navigate('Promotions')}
              theme={theme}
            />
          </View>

          {/* Performance Overview */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Performance Overview</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SellerDashboard')}>
                <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dashboardGrid}>
              <DashboardCard
                title="Today's Sales"
                value={`₦${metrics?.totalSales?.toLocaleString() || '0'}`}
                icon="cash-outline"
                color="#4CAF50"
                onPress={() => navigation.navigate('SellerDashboard', { tab: 'sales' })}
              />
              <DashboardCard
                title="Active Products"
                value={metrics?.totalProducts?.toString() || '0'}
                icon="cube-outline"
                color="#2196F3"
                onPress={() => navigation.navigate('MyProducts')}
              />
              <DashboardCard
                title="Pending Orders"
                value={metrics?.pendingOrders?.toString() || '0'}
                icon="receipt-outline"
                color="#FF9800"
                onPress={() => navigation.navigate('SellerOrders', { filter: 'pending' })}
              />
              <DashboardCard
                title="Total Orders"
                value={metrics?.totalOrders?.toString() || '0'}
                icon="bar-chart-outline"
                color="#F44336"
                onPress={() => navigation.navigate('SellerDashboard')}
              />
            </View>
          </View>

          {/* Store Settings */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Store Settings</Text>
            <View style={[styles.menuGroup, { backgroundColor: theme.colors.card }]}>
              <MenuItem
                icon="storefront-outline"
                title="Store Profile"
                onPress={() => navigation.navigate('EditProfile')}
              />
              <MenuItem
                icon="card-outline"
                title="Payment Settings"
                onPress={() => navigation.navigate('PaymentMethods')}
              />
              <MenuItem
                icon="cash-outline"
                title="Subscription"
                onPress={() => navigation.navigate('SubscriptionScreen')}
              />
              <MenuItem
                icon="settings-outline"
                title="Store Settings"
                onPress={() => navigation.navigate('Settings')}
              />
            </View>
          </View>

          {/* Support */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Support</Text>
            <View style={[styles.menuGroup, { backgroundColor: theme.colors.card }]}>
              <MenuItem
                icon="help-circle-outline"
                title="Seller Help Center"
                onPress={() => navigation.navigate('HelpCenter')}
              />
              <MenuItem
                icon="chatbubble-outline"
                title="Contact Support"
                onPress={() => navigation.navigate('ContactUs')}
              />
              <MenuItem
                icon="person-outline"
                title="Switch to Buyer Mode"
                onPress={handleToggleSellerMode}
              />
            </View>
          </View>

          <Text style={[styles.version, { color: theme.colors.subtext }]}>Version 1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Regular User Layout (existing layout)
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.profileImageContainer}
              onPress={() => navigation.navigate('EditProfile')}
            >
              {profileData.profileImage ? (
                <Image
                  source={{ uri: profileData.profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={[styles.profileImagePlaceholder, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Ionicons name="person-outline" size={40} color="#fff" />
                </View>
              )}
              <View style={[styles.editIconContainer, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name="camera" size={14} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.name}>{profileData.fullName || 'Set up your profile'}</Text>
            <Text style={styles.email}>{profileData?.email || 'Add your email'}</Text>
            <TouchableOpacity 
              style={styles.logoutIconButton} 
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Account Settings</Text>
          <View style={[styles.menuGroup, { backgroundColor: theme.colors.card }]}>
            <MenuItem
              icon="person-outline"
              title="Edit Profile"
              onPress={() => navigation.navigate('EditProfile')}
            />
            <MenuItem
              icon="location-outline"
              title="Shipping Addresses"
              onPress={() => navigation.navigate('ShippingAddresses')}
            />
            <MenuItem
              icon="card-outline"
              title="Payment Methods"
              onPress={() => navigation.navigate('PaymentMethods')}
            />
            <MenuItem
              icon="storefront-outline"
              title="Seller Mode"
              value={
                <Switch
                  value={profileData.preferences?.sellerMode}
                  onValueChange={handleToggleSellerMode}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={theme.colors.surface}
                />
              }
              showArrow={false}
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Support</Text>
          <View style={[styles.menuGroup, { backgroundColor: theme.colors.card }]}>
            <MenuItem
              icon="help-circle-outline"
              title="Help Center"
              onPress={() => navigation.navigate('HelpCenter')}
            />
            <MenuItem
              icon="chatbubble-outline"
              title="Contact Us"
              onPress={() => navigation.navigate('ContactUs')}
            />
            <MenuItem
              icon="settings-outline"
              title="Settings"
              onPress={() => navigation.navigate('Settings')}
            />
          </View>
        </View>

        <Text style={[styles.version, { color: theme.colors.subtext }]}>Version 1.0.0</Text>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  storeHeader: {
    paddingTop: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  storeHeaderContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: 12,
  },
  storeImage: {
    width: '100%',
    height: '100%',
  },
  storeImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  storeStatus: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    marginTop: -30,
    zIndex: 1,
  },
  quickAction: {
    width: (width - 48) / 4,
    aspectRatio: 1,
    margin: 4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  quickActionText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  headerContent: {
    alignItems: 'center',
    position: 'relative',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  logoutIconButton: {
    position: 'absolute',
    top: 0,
    right: 16,
    padding: 8,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  menuGroup: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  dashboardCard: {
    width: (width - 64) / 2,
    margin: 8,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  dashboardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  dashboardValue: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  dashboardTitle: {
    fontSize: 14,
  },
  version: {
    textAlign: 'center',
    marginVertical: 24,
    fontSize: 12,
  },
  subscriptionCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subscriptionPrice: {
    fontSize: 16,
    fontWeight: '500',
  },
  upgradeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  featuresContainer: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 14,
  },
  limitWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  limitWarningText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
});

export default ProfileScreen; 
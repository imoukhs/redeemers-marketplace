import React from 'react';
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
import LoadingWave from '../../components/common/LoadingWave';

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
      {value ? value : showArrow && (
        <Ionicons name="chevron-forward" size={24} color={theme.colors.subtext} />
      )}
    </TouchableOpacity>
  );
};

const DashboardCard = ({ title, value, icon, color }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.dashboardCard, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.dashboardIconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.dashboardValue, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.dashboardTitle, { color: theme.colors.subtext }]}>{title}</Text>
    </View>
  );
};

const ProfileScreen = ({ navigation }) => {
  const { profileData, loading, updatePreference } = useProfile();
  const { signOut } = useAuth();
  const { theme } = useTheme();

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

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <LoadingWave color={theme.colors.primary} />
      </View>
    );
  }

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

        {/* Seller Dashboard */}
        {profileData.preferences?.sellerMode && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Seller Dashboard</Text>
            <View style={styles.dashboardGrid}>
              <DashboardCard
                title="Total Sales"
                value="₦45,000"
                icon="cash-outline"
                color="#4CAF50"
              />
              <DashboardCard
                title="Products"
                value="12"
                icon="cube-outline"
                color="#2196F3"
              />
              <DashboardCard
                title="Orders"
                value="8"
                icon="receipt-outline"
                color="#FF9800"
              />
              <DashboardCard
                title="Pending"
                value="3"
                icon="time-outline"
                color="#F44336"
              />
            </View>
            <TouchableOpacity
              style={[styles.dashboardButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('SellerDashboard')}
            >
              <Text style={styles.dashboardButtonText}>View Full Dashboard</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

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
              onPress={() => navigation.navigate('SellerOnboarding')}
            />
            {profileData.preferences?.sellerMode && (
              <>
                <MenuItem
                  icon="cube-outline"
                  title="My Products"
                  onPress={() => navigation.navigate('MyProducts')}
                />
                <MenuItem
                  icon="receipt-outline"
                  title="Orders"
                  onPress={() => navigation.navigate('SellerOrders')}
                />
              </>
            )}
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
  headerContent: {
    alignItems: 'center',
    position: 'relative',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
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
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    marginBottom: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 16,
  },
  menuGroup: {
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
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
  version: {
    textAlign: 'center',
    fontSize: 12,
    marginVertical: 24,
  },
  logoutIconButton: {
    position: 'absolute',
    top: 0,
    right: 16,
    padding: 8,
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 12,
    marginBottom: 16,
  },
  dashboardCard: {
    width: (width - 48) / 2,
    margin: 4,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  dashboardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  dashboardValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  dashboardTitle: {
    fontSize: 12,
  },
  dashboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 8,
  },
  dashboardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default ProfileScreen; 
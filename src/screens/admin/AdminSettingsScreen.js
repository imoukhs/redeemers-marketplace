import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAdmin } from '../../context/AdminContext';
import LoadingWave from '../../components/common/LoadingWave';

const SettingItem = ({ label, description, icon, value, onValueChange, type = 'switch', theme, options = [] }) => {
  const renderInput = () => {
    switch (type) {
      case 'switch':
        return (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#767577', true: theme.colors.primary }}
            thumbColor={value ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
        );
      case 'text':
        return (
          <TextInput
            style={[styles.textInput, { 
              color: theme.colors.text,
              backgroundColor: theme.colors.surface,
            }]}
            value={value}
            onChangeText={onValueChange}
            placeholderTextColor={theme.colors.subtext}
          />
        );
      case 'number':
        return (
          <TextInput
            style={[styles.textInput, { 
              color: theme.colors.text,
              backgroundColor: theme.colors.surface,
            }]}
            value={value.toString()}
            onChangeText={(text) => onValueChange(Number(text))}
            keyboardType="numeric"
            placeholderTextColor={theme.colors.subtext}
          />
        );
      case 'select':
        return (
          <View style={styles.selectContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.selectOption,
                  { 
                    backgroundColor: value === option.value ? theme.colors.primary : theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => onValueChange(option.value)}
              >
                <Text style={[
                  styles.selectOptionText,
                  { color: value === option.value ? '#fff' : theme.colors.text },
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
      <View style={styles.settingHeader}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingLabel, { color: theme.colors.text }]}>{label}</Text>
          {description && (
            <Text style={[styles.settingDescription, { color: theme.colors.subtext }]}>
              {description}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.settingControl}>
        {renderInput()}
      </View>
    </View>
  );
};

const AdminSettingsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { settings, loading, updateSettings } = useAdmin();
  const [localSettings, setLocalSettings] = useState({
    allowNewRegistrations: true,
    requireEmailVerification: true,
    maintenanceMode: false,
    maxProductsPerStore: 100,
    commissionRate: 5,
    currency: 'NGN',
    minWithdrawalAmount: 50,
    autoApproveProducts: false,
    autoApproveStores: false,
    notificationSettings: {
      emailNotifications: true,
      pushNotifications: true,
    },
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings(localSettings);
      Alert.alert('Success', 'Settings updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update settings');
    }
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>System Settings</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>General Settings</Text>
          <SettingItem
            label="Allow New Registrations"
            description="Enable or disable new user registrations"
            icon="person-add"
            value={localSettings.allowNewRegistrations}
            onValueChange={(value) => setLocalSettings(prev => ({ ...prev, allowNewRegistrations: value }))}
            theme={theme}
          />
          <SettingItem
            label="Require Email Verification"
            description="Users must verify their email before accessing the platform"
            icon="mail-unread"
            value={localSettings.requireEmailVerification}
            onValueChange={(value) => setLocalSettings(prev => ({ ...prev, requireEmailVerification: value }))}
            theme={theme}
          />
          <SettingItem
            label="Maintenance Mode"
            description="Put the platform in maintenance mode"
            icon="construct"
            value={localSettings.maintenanceMode}
            onValueChange={(value) => setLocalSettings(prev => ({ ...prev, maintenanceMode: value }))}
            theme={theme}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Store Settings</Text>
          <SettingItem
            label="Max Products Per Store"
            description="Maximum number of products a store can list"
            icon="cube"
            value={localSettings.maxProductsPerStore}
            onValueChange={(value) => setLocalSettings(prev => ({ ...prev, maxProductsPerStore: value }))}
            type="number"
            theme={theme}
          />
          <SettingItem
            label="Commission Rate (%)"
            description="Platform commission percentage on sales"
            icon="cash"
            value={localSettings.commissionRate}
            onValueChange={(value) => setLocalSettings(prev => ({ ...prev, commissionRate: value }))}
            type="number"
            theme={theme}
          />
          <SettingItem
            label="Auto-approve Products"
            description="Automatically approve new product listings"
            icon="checkmark-circle"
            value={localSettings.autoApproveProducts}
            onValueChange={(value) => setLocalSettings(prev => ({ ...prev, autoApproveProducts: value }))}
            theme={theme}
          />
          <SettingItem
            label="Auto-approve Stores"
            description="Automatically approve new store registrations"
            icon="storefront"
            value={localSettings.autoApproveStores}
            onValueChange={(value) => setLocalSettings(prev => ({ ...prev, autoApproveStores: value }))}
            theme={theme}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Payment Settings</Text>
          <SettingItem
            label="Currency"
            description="Default currency for the platform"
            icon="card"
            value={localSettings.currency}
            onValueChange={(value) => setLocalSettings(prev => ({ ...prev, currency: value }))}
            type="select"
            options={[
              { label: 'NGN (₦)', value: 'NGN' },
              { label: 'USD ($)', value: 'USD' },
              { label: 'EUR (€)', value: 'EUR' },
              { label: 'GBP (£)', value: 'GBP' }
            ]}
            theme={theme}
          />
          <SettingItem
            label="Minimum Withdrawal Amount"
            description="Minimum amount required for withdrawal"
            icon="wallet"
            value={localSettings.minWithdrawalAmount}
            onValueChange={(value) => setLocalSettings(prev => ({ ...prev, minWithdrawalAmount: value }))}
            type="number"
            theme={theme}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Notifications</Text>
          <SettingItem
            label="Email Notifications"
            description="Send notifications via email"
            icon="mail"
            value={localSettings.notificationSettings.emailNotifications}
            onValueChange={(value) => setLocalSettings(prev => ({
              ...prev,
              notificationSettings: {
                ...prev.notificationSettings,
                emailNotifications: value,
              },
            }))}
            theme={theme}
          />
          <SettingItem
            label="Push Notifications"
            description="Send push notifications to devices"
            icon="notifications"
            value={localSettings.notificationSettings.pushNotifications}
            onValueChange={(value) => setLocalSettings(prev => ({
              ...prev,
              notificationSettings: {
                ...prev.notificationSettings,
                pushNotifications: value,
              },
            }))}
            theme={theme}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSave}
        >
          <Ionicons name="save-outline" size={24} color="#fff" style={styles.saveButtonIcon} />
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
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
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(30,144,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  settingControl: {
    marginLeft: 52,
  },
  textInput: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 24,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdminSettingsScreen; 
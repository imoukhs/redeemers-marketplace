import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useProfile } from '../../context/ProfileContext';

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

const SettingsScreen = ({ navigation }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { profileData, updatePreference } = useProfile();

  const handleTogglePreference = async (key) => {
    if (key === 'darkMode') {
      await toggleTheme();
      return;
    }
    
    const success = await updatePreference(key, !profileData.preferences[key]);
    if (!success) {
      Alert.alert('Error', 'Failed to update preference');
    }
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Settings</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content}>
        {/* Appearance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Appearance</Text>
          <View style={[styles.menuGroup, { backgroundColor: theme.colors.card }]}>
            <MenuItem
              icon={isDarkMode ? "moon" : "sunny"}
              title="Dark Mode"
              value={
                <Switch
                  value={isDarkMode}
                  onValueChange={() => handleTogglePreference('darkMode')}
                  trackColor={{ false: '#767577', true: theme.colors.primary + '50' }}
                  thumbColor={isDarkMode ? theme.colors.primary : '#f4f3f4'}
                />
              }
              showArrow={false}
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Notifications</Text>
          <View style={[styles.menuGroup, { backgroundColor: theme.colors.card }]}>
            <MenuItem
              icon="notifications-outline"
              title="Push Notifications"
              value={
                <Switch
                  value={profileData.preferences.notifications}
                  onValueChange={() => handleTogglePreference('notifications')}
                  trackColor={{ false: '#767577', true: theme.colors.primary + '50' }}
                  thumbColor={profileData.preferences.notifications ? theme.colors.primary : '#f4f3f4'}
                />
              }
              showArrow={false}
            />
            <MenuItem
              icon="mail-outline"
              title="Email Notifications"
              value={
                <Switch
                  value={profileData.preferences.newsletter}
                  onValueChange={() => handleTogglePreference('newsletter')}
                  trackColor={{ false: '#767577', true: theme.colors.primary + '50' }}
                  thumbColor={profileData.preferences.newsletter ? theme.colors.primary : '#f4f3f4'}
                />
              }
              showArrow={false}
            />
          </View>
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Privacy & Security</Text>
          <View style={[styles.menuGroup, { backgroundColor: theme.colors.card }]}>
            <MenuItem
              icon="lock-closed-outline"
              title="Change Password"
              onPress={() => navigation.navigate('ChangePassword')}
            />
            <MenuItem
              icon="finger-print-outline"
              title="Biometric Authentication"
              value={
                <Switch
                  value={profileData.preferences.biometric}
                  onValueChange={() => handleTogglePreference('biometric')}
                  trackColor={{ false: '#767577', true: theme.colors.primary + '50' }}
                  thumbColor={profileData.preferences.biometric ? theme.colors.primary : '#f4f3f4'}
                />
              }
              showArrow={false}
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About</Text>
          <View style={[styles.menuGroup, { backgroundColor: theme.colors.card }]}>
            <MenuItem
              icon="information-circle-outline"
              title="About App"
              onPress={() => navigation.navigate('AboutApp')}
            />
            <MenuItem
              icon="document-text-outline"
              title="Terms & Conditions"
              onPress={() => navigation.navigate('Terms')}
            />
            <MenuItem
              icon="shield-checkmark-outline"
              title="Privacy Policy"
              onPress={() => navigation.navigate('Privacy')}
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 16,
    marginTop: 16,
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
});

export default SettingsScreen; 
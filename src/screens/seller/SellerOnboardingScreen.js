import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useProfile } from '../../context/ProfileContext';

const FormSection = ({ title, children }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{title}</Text>
      {children}
    </View>
  );
};

const FormInput = ({ label, icon, ...props }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      <View style={[styles.inputWrapper, { 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border 
      }]}>
        {icon && <Ionicons name={icon} size={20} color={theme.colors.primary} style={styles.inputIcon} />}
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          placeholderTextColor={theme.colors.subtext}
          {...props}
        />
      </View>
    </View>
  );
};

const SellerOnboardingScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { updateSellerProfile, updatePreference } = useProfile();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    phoneNumber: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    address: '',
    city: '',
    state: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const requiredFields = [
      'storeName',
      'storeDescription',
      'phoneNumber',
      'bankName',
      'accountName',
      'accountNumber',
      'address',
      'city',
      'state',
    ];

    const emptyFields = requiredFields.filter(field => !formData[field].trim());
    if (emptyFields.length > 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (formData.accountNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid account number');
      return false;
    }

    if (formData.phoneNumber.length < 11) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const success = await updateSellerProfile({
        ...formData,
        isVerified: false,
        dateJoined: new Date().toISOString(),
        metrics: {
          totalSales: 0,
          totalOrders: 0,
          pendingOrders: 0,
          totalProducts: 0,
        },
      });

      if (success) {
        await updatePreference('sellerMode', true);
        Alert.alert(
          'Success',
          'Your seller profile has been created. We will review your information and verify your account.',
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('SellerDashboard'),
            },
          ]
        );
      } else {
        throw new Error('Failed to create seller profile');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create seller profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Become a Seller</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.subtitle, { color: theme.colors.subtext }]}>
            Complete your seller profile to start selling on our platform
          </Text>

          <FormSection title="Store Information">
            <FormInput
              label="Store Name"
              icon="storefront-outline"
              placeholder="Enter your store name"
              value={formData.storeName}
              onChangeText={(text) => handleInputChange('storeName', text)}
              editable={!loading}
            />
            <FormInput
              label="Store Description"
              icon="document-text-outline"
              placeholder="Describe your store"
              value={formData.storeDescription}
              onChangeText={(text) => handleInputChange('storeDescription', text)}
              multiline
              numberOfLines={3}
              editable={!loading}
            />
            <FormInput
              label="Phone Number"
              icon="call-outline"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChangeText={(text) => handleInputChange('phoneNumber', text)}
              keyboardType="phone-pad"
              editable={!loading}
            />
          </FormSection>

          <FormSection title="Bank Details">
            <FormInput
              label="Bank Name"
              icon="business-outline"
              placeholder="Enter your bank name"
              value={formData.bankName}
              onChangeText={(text) => handleInputChange('bankName', text)}
              editable={!loading}
            />
            <FormInput
              label="Account Name"
              icon="person-outline"
              placeholder="Enter account name"
              value={formData.accountName}
              onChangeText={(text) => handleInputChange('accountName', text)}
              editable={!loading}
            />
            <FormInput
              label="Account Number"
              icon="card-outline"
              placeholder="Enter account number"
              value={formData.accountNumber}
              onChangeText={(text) => handleInputChange('accountNumber', text)}
              keyboardType="numeric"
              editable={!loading}
            />
          </FormSection>

          <FormSection title="Store Address">
            <FormInput
              label="Address"
              icon="location-outline"
              placeholder="Enter store address"
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
              editable={!loading}
            />
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <FormInput
                  label="City"
                  icon="business-outline"
                  placeholder="Enter city"
                  value={formData.city}
                  onChangeText={(text) => handleInputChange('city', text)}
                  editable={!loading}
                />
              </View>
              <View style={styles.halfInput}>
                <FormInput
                  label="State"
                  icon="map-outline"
                  placeholder="Enter state"
                  value={formData.state}
                  onChangeText={(text) => handleInputChange('state', text)}
                  editable={!loading}
                />
              </View>
            </View>
          </FormSection>

          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: theme.colors.primary },
              loading && { opacity: 0.7 }
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Creating Profile...' : 'Create Seller Profile'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
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
    padding: 20,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 8,
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SellerOnboardingScreen; 
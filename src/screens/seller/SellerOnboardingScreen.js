import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useSeller } from '../../context/SellerContext';
import { useSubscription } from '../../context/SubscriptionContext';
import LoadingWave from '../../components/common/LoadingWave';

const { width } = Dimensions.get('window');

const ProgressBar = ({ step, theme }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const stepScale = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progress, {
      toValue: (step - 1) / 1,
      duration: 500,
      useNativeDriver: false,
    }).start();

    // Animate step indicators
    stepScale.forEach((scale, index) => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: index + 1 === step ? 1.2 : 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [step]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const renderStep = (stepNumber) => {
    const isCompleted = step > stepNumber;
    const isCurrent = step === stepNumber;
    const scale = stepScale[stepNumber - 1];

    return (
      <Animated.View
        style={[
          styles.stepIndicator,
          {
            backgroundColor: isCompleted || isCurrent ? theme.colors.primary : theme.colors.border,
            transform: [{ scale }],
          },
        ]}
      >
        {isCompleted ? (
          <Ionicons name="checkmark" size={16} color="#fff" />
        ) : (
          <Text style={[styles.stepNumber, { color: isCurrent ? '#fff' : theme.colors.text }]}>
            {stepNumber}
          </Text>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              backgroundColor: theme.colors.primary,
              width: progressWidth,
            },
          ]}
        />
      </View>
      <View style={styles.stepsContainer}>
        {renderStep(1)}
        {renderStep(2)}
      </View>
    </View>
  );
};

const FormSection = ({ title, subtitle, children }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.sectionSubtitle, { color: theme.colors.subtext }]}>
          {subtitle}
        </Text>
      )}
      {children}
    </View>
  );
};

const FormInput = ({ label, icon, error, ...props }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          { backgroundColor: theme.colors.surface },
          error && { borderColor: theme.colors.error, borderWidth: 1 },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? theme.colors.error : theme.colors.primary}
            style={styles.inputIcon}
          />
        )}
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          placeholderTextColor={theme.colors.subtext}
          {...props}
        />
      </View>
      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
      )}
    </View>
  );
};

const SellerOnboardingScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { updateSellerProfile } = useSeller();
  const { plans, subscribeToPlan } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    phoneNumber: '',
    address: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Define required fields for each step
    const step1Fields = ['storeName', 'storeDescription', 'phoneNumber', 'address'];
    const step2Fields = ['bankName', 'accountNumber', 'accountName'];
    
    // Get the fields to validate based on current step
    const fieldsToValidate = step === 1 ? step1Fields : step2Fields;

    fieldsToValidate.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    // Specific validations
    if (step === 1) {
      if (formData.phoneNumber && formData.phoneNumber.length < 11) {
        newErrors.phoneNumber = 'Please enter a valid phone number (11 digits)';
      }
    } else {
      if (formData.accountNumber && formData.accountNumber.length < 10) {
        newErrors.accountNumber = 'Account number must be at least 10 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        await updateSellerProfile(formData);
        navigation.navigate('SubscriptionScreen');
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to save seller profile');
      } finally {
        setLoading(false);
      }
    }
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
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => step === 1 ? navigation.goBack() : setStep(1)}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Become a Seller
        </Text>
        <View style={styles.backButton} />
      </View>

      <ProgressBar step={step} theme={theme} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {step === 1 ? (
            <>
              <FormSection
                title="Store Information"
                subtitle="Tell us about your business"
              >
                <FormInput
                  label="Store Name"
                  icon="storefront-outline"
                  placeholder="Enter your store name"
                  value={formData.storeName}
                  onChangeText={(text) => handleInputChange('storeName', text)}
                  error={errors.storeName}
                />
                <FormInput
                  label="Store Description"
                  icon="document-text-outline"
                  placeholder="Describe your store"
                  multiline
                  numberOfLines={3}
                  value={formData.storeDescription}
                  onChangeText={(text) => handleInputChange('storeDescription', text)}
                  error={errors.storeDescription}
                />
                <FormInput
                  label="Phone Number"
                  icon="call-outline"
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  value={formData.phoneNumber}
                  onChangeText={(text) => handleInputChange('phoneNumber', text)}
                  error={errors.phoneNumber}
                />
                <FormInput
                  label="Address"
                  icon="location-outline"
                  placeholder="Enter your store address"
                  multiline
                  value={formData.address}
                  onChangeText={(text) => handleInputChange('address', text)}
                  error={errors.address}
                />
              </FormSection>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.colors.primary }]}
                onPress={handleNext}
              >
                <Text style={styles.buttonText}>Next</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <FormSection
                title="Bank Information"
                subtitle="Your payment details"
              >
                <FormInput
                  label="Bank Name"
                  icon="business-outline"
                  placeholder="Enter your bank name"
                  value={formData.bankName}
                  onChangeText={(text) => handleInputChange('bankName', text)}
                  error={errors.bankName}
                />
                <FormInput
                  label="Account Number"
                  icon="card-outline"
                  placeholder="Enter your account number"
                  keyboardType="numeric"
                  value={formData.accountNumber}
                  onChangeText={(text) => handleInputChange('accountNumber', text)}
                  error={errors.accountNumber}
                />
                <FormInput
                  label="Account Name"
                  icon="person-outline"
                  placeholder="Enter account name"
                  value={formData.accountName}
                  onChangeText={(text) => handleInputChange('accountName', text)}
                  error={errors.accountName}
                />
              </FormSection>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.colors.primary }]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Continue to Subscription</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  progressContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 20,
    top: -14,
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
});

export default SellerOnboardingScreen; 
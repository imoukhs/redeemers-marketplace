import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useSeller } from '../../context/SellerContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import LoadingWave from '../../components/common/LoadingWave';

const EditPromotionScreen = ({ navigation, route }) => {
  const { promotionId } = route.params;
  const { theme } = useTheme();
  const { promotions, updatePromotion, deletePromotion } = useSeller();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    startDate: new Date(),
    endDate: new Date(),
    active: true,
  });

  useEffect(() => {
    loadPromotionData();
  }, []);

  const loadPromotionData = async () => {
    const promotion = promotions.find(p => p.id === promotionId);
    if (!promotion) {
      Alert.alert('Error', 'Promotion not found');
      navigation.goBack();
      return;
    }

    setFormData({
      ...promotion,
      startDate: new Date(promotion.startDate),
      endDate: new Date(promotion.endDate),
      discount: promotion.discount.toString(),
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.title || !formData.description || !formData.discount) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }
    if (isNaN(formData.discount) || formData.discount < 1 || formData.discount > 99) {
      Alert.alert('Error', 'Discount must be between 1 and 99');
      return false;
    }
    if (formData.startDate >= formData.endDate) {
      Alert.alert('Error', 'End date must be after start date');
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await updatePromotion(promotionId, {
        ...formData,
        discount: parseInt(formData.discount),
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
      });
      Alert.alert('Success', 'Promotion updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update promotion');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Promotion',
      'Are you sure you want to delete this promotion?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await deletePromotion(promotionId);
              Alert.alert('Success', 'Promotion deleted successfully');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete promotion');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
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
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Edit Promotion
        </Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={24} color={theme.colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Title</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              }]}
              placeholder="Enter promotion title"
              placeholderTextColor={theme.colors.subtext}
              value={formData.title}
              onChangeText={(text) => handleInputChange('title', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Description</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
                height: 100,
              }]}
              placeholder="Enter promotion description"
              placeholderTextColor={theme.colors.subtext}
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Discount (%)</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              }]}
              placeholder="Enter discount percentage"
              placeholderTextColor={theme.colors.subtext}
              value={formData.discount}
              onChangeText={(text) => handleInputChange('discount', text)}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>

          <View style={styles.dateContainer}>
            <View style={styles.dateInput}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Start Date</Text>
              <DateTimePicker
                value={formData.startDate}
                mode="date"
                display="default"
                onChange={(event, date) => date && handleInputChange('startDate', date)}
                minimumDate={new Date()}
              />
            </View>

            <View style={styles.dateInput}>
              <Text style={[styles.label, { color: theme.colors.text }]}>End Date</Text>
              <DateTimePicker
                value={formData.endDate}
                mode="date"
                display="default"
                onChange={(event, date) => date && handleInputChange('endDate', date)}
                minimumDate={formData.startDate}
              />
            </View>
          </View>

          <View style={styles.switchContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Status</Text>
            <TouchableOpacity
              style={[
                styles.statusButton,
                { backgroundColor: formData.active ? '#4CAF5020' : '#FF595E20' }
              ]}
              onPress={() => handleInputChange('active', !formData.active)}
            >
              <Text style={[
                styles.statusText,
                { color: formData.active ? '#4CAF50' : '#FF595E' }
              ]}>
                {formData.active ? 'Active' : 'Inactive'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.updateButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleUpdate}
        >
          <Text style={styles.updateButtonText}>Update Promotion</Text>
        </TouchableOpacity>
      </View>
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
  deleteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateInput: {
    flex: 1,
    marginHorizontal: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  updateButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchContainer: {
    marginBottom: 20,
  },
  statusButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
  },
});

export default EditPromotionScreen; 
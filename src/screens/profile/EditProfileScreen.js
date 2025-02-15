import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../../context/ProfileContext';
import { useTheme } from '../../context/ThemeContext';
import LoadingWave from '../../components/common/LoadingWave';
import * as ImagePicker from 'expo-image-picker';

const EditProfileScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const { profileData, loading, updateProfile, updateProfileImage } = useProfile();
  const [formData, setFormData] = useState({
    fullName: profileData.fullName || '',
    phoneNumber: profileData.phoneNumber || '',
    address: profileData.address || '',
    city: profileData.city || '',
    state: profileData.state || '',
    zipCode: profileData.zipCode || '',
  });
  const [localLoading, setLocalLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        presentationStyle: isDarkMode ? 'overFullScreen' : 'pageSheet',
        backgroundColor: theme.colors.background,
      });

      if (!result.canceled) {
        setLocalLoading(true);
        const success = await updateProfileImage(result.assets[0].uri);
        if (!success) {
          Alert.alert('Error', 'Failed to update profile image');
        }
        setLocalLoading(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSave = async () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Full name is required');
      return;
    }

    setLocalLoading(true);
    const result = await updateProfile(formData);
    setLocalLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  if (loading || localLoading) {
    return (
      <View style={styles.loadingContainer}>
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text style={[styles.saveButton, { color: theme.colors.primary }]}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={handleImagePick}>
            <View style={[styles.profileImage, { backgroundColor: theme.colors.card }]}>
              {profileData.profileImage ? (
                <Image
                  source={{ uri: profileData.profileImage }}
                  style={styles.image}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Ionicons name="person-outline" size={40} color={theme.colors.subtext} />
                </View>
              )}
              {localLoading && (
                <View style={styles.loadingOverlay}>
                  <LoadingWave color={theme.colors.primary} />
                </View>
              )}
            </View>
            <View style={[styles.editBadge, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Full Name</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              }]}
              value={formData.fullName}
              onChangeText={(text) => handleInputChange('fullName', text)}
              placeholder="Enter your full name"
              placeholderTextColor={theme.colors.subtext}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Phone Number</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              }]}
              value={formData.phoneNumber}
              onChangeText={(text) => handleInputChange('phoneNumber', text)}
              placeholder="Enter your phone number"
              placeholderTextColor={theme.colors.subtext}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Address</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              }]}
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
              placeholder="Enter your address"
              placeholderTextColor={theme.colors.subtext}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={[styles.label, { color: theme.colors.text }]}>City</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }]}
                value={formData.city}
                onChangeText={(text) => handleInputChange('city', text)}
                placeholder="City"
                placeholderTextColor={theme.colors.subtext}
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={[styles.label, { color: theme.colors.text }]}>State</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }]}
                value={formData.state}
                onChangeText={(text) => handleInputChange('state', text)}
                placeholder="State"
                placeholderTextColor={theme.colors.subtext}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>ZIP Code</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              }]}
              value={formData.zipCode}
              onChangeText={(text) => handleInputChange('zipCode', text)}
              placeholder="Enter ZIP code"
              placeholderTextColor={theme.colors.subtext}
              keyboardType="numeric"
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
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    color: '#1E90FF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  profileImageContainer: {
    alignSelf: 'center',
    marginVertical: 24,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1E90FF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 60,
  },
  form: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
  },
});

export default EditProfileScreen; 
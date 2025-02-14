import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAddress } from '../../context/AddressContext';

// Mock data for addresses - Replace with API integration later
const initialAddresses = [
  {
    id: '1',
    hostel: 'Daniel Hall',
    block: 'B',
    room: '234',
    isDefault: true,
  },
  {
    id: '2',
    hostel: 'Peter Hall',
    block: 'A',
    room: '112',
    isDefault: false,
  },
];

const ShippingAddressScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { 
    addresses, 
    loading, 
    addAddress, 
    deleteAddress, 
    setDefaultAddress 
  } = useAddress();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newAddress, setNewAddress] = useState({
    hostel: '',
    block: '',
    room: '',
    additionalInfo: '',
  });

  const handleAddAddress = async () => {
    if (!newAddress.hostel || !newAddress.block || !newAddress.room) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const result = await addAddress(newAddress);
    if (result.success) {
      setModalVisible(false);
      setNewAddress({ hostel: '', block: '', room: '', additionalInfo: '' });
    } else {
      Alert.alert('Error', 'Failed to add address');
    }
  };

  const handleDeleteAddress = (id) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteAddress(id);
            if (!result.success) {
              Alert.alert('Error', 'Failed to delete address');
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (id) => {
    const result = await setDefaultAddress(id);
    if (!result.success) {
      Alert.alert('Error', 'Failed to set default address');
    }
  };

  const renderAddress = (address) => (
    <View 
      key={address.id}
      style={[
        styles.addressCard,
        { 
          backgroundColor: theme.colors.surface,
          borderColor: address.isDefault ? theme.colors.primary : theme.colors.border 
        }
      ]}
    >
      <View style={styles.addressInfo}>
        <View style={styles.addressHeader}>
          <Text style={[styles.addressTitle, { color: theme.colors.text }]}>
            {address.hostel}
          </Text>
          {address.isDefault && (
            <View style={[styles.defaultBadge, { backgroundColor: theme.colors.primary + '20' }]}>
              <Text style={[styles.defaultText, { color: theme.colors.primary }]}>Default</Text>
            </View>
          )}
        </View>
        <Text style={[styles.addressDetails, { color: theme.colors.text }]}>
          Block {address.block}, Room {address.room}
        </Text>
        {address.additionalInfo && (
          <Text style={[styles.additionalInfo, { color: theme.colors.subtext }]}>
            {address.additionalInfo}
          </Text>
        )}
      </View>
      <View style={styles.addressActions}>
        {!address.isDefault && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary + '20' }]}
            onPress={() => handleSetDefault(address.id)}
          >
            <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
              Set as Default
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: theme.colors.error + '20' }]}
          onPress={() => handleDeleteAddress(address.id)}
        >
          <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Shipping Addresses</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={64} color={theme.colors.subtext} />
            <Text style={[styles.emptyText, { color: theme.colors.subtext }]}>
              No addresses added yet
            </Text>
            <TouchableOpacity
              style={[styles.addFirstButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addFirstButtonText}>Add Your First Address</Text>
            </TouchableOpacity>
          </View>
        ) : (
          addresses.map(renderAddress)
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Add New Address</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Hostel Name *</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text,
                      borderColor: theme.colors.border
                    }
                  ]}
                  value={newAddress.hostel}
                  onChangeText={(text) => setNewAddress({ ...newAddress, hostel: text })}
                  placeholder="Enter hostel name"
                  placeholderTextColor={theme.colors.subtext}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                  <Text style={[styles.label, { color: theme.colors.text }]}>Block *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      { 
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        borderColor: theme.colors.border
                      }
                    ]}
                    value={newAddress.block}
                    onChangeText={(text) => setNewAddress({ ...newAddress, block: text })}
                    placeholder="Block"
                    placeholderTextColor={theme.colors.subtext}
                  />
                </View>

                <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                  <Text style={[styles.label, { color: theme.colors.text }]}>Room Number *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      { 
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        borderColor: theme.colors.border
                      }
                    ]}
                    value={newAddress.room}
                    onChangeText={(text) => setNewAddress({ ...newAddress, room: text })}
                    placeholder="Room"
                    placeholderTextColor={theme.colors.subtext}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Additional Info</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    { 
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text,
                      borderColor: theme.colors.border
                    }
                  ]}
                  value={newAddress.additionalInfo}
                  onChangeText={(text) => setNewAddress({ ...newAddress, additionalInfo: text })}
                  placeholder="Additional delivery instructions (optional)"
                  placeholderTextColor={theme.colors.subtext}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: theme.colors.border }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: theme.colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleAddAddress}
              >
                <Text style={styles.saveButtonText}>Save Address</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    padding: 16,
  },
  addressCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addressInfo: {
    marginBottom: 12,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addressDetails: {
    fontSize: 16,
    marginBottom: 4,
  },
  additionalInfo: {
    fontSize: 14,
    marginTop: 4,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 12,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 64,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  addFirstButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  modalForm: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 16,
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
  row: {
    flexDirection: 'row',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ShippingAddressScreen; 
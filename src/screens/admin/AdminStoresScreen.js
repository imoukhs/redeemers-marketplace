import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAdmin } from '../../context/AdminContext';
import LoadingWave from '../../components/common/LoadingWave';

const StoreCard = ({ store, onApprove, onSuspend, theme }) => (
  <View style={[styles.storeCard, { backgroundColor: theme.colors.card }]}>
    <View style={styles.storeInfo}>
      <View style={styles.storeHeader}>
        <Text style={[styles.storeName, { color: theme.colors.text }]}>{store.name}</Text>
        <View style={[styles.statusBadge, { 
          backgroundColor: store.status === 'approved' ? '#4CAF50' : 
                         store.status === 'suspended' ? '#FF4B4B' : '#FFA000'
        }]}>
          <Text style={styles.statusText}>{store.status}</Text>
        </View>
      </View>
      <Text style={[styles.storeOwner, { color: theme.colors.subtext }]}>
        Owner: {store.ownerName}
      </Text>
    </View>
    
    <View style={styles.actions}>
      {store.status !== 'approved' && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => onApprove(store)}
        >
          <Ionicons name="checkmark-outline" size={20} color="#fff" />
        </TouchableOpacity>
      )}
      {store.status !== 'suspended' && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FF4B4B' }]}
          onPress={() => onSuspend(store)}
        >
          <Ionicons name="ban-outline" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const AdminStoresScreen = () => {
  const { theme } = useTheme();
  const { stores, loading, fetchStores, approveStore, suspendStore } = useAdmin();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      await fetchStores();
    } catch (error) {
      Alert.alert('Error', 'Failed to load stores');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStores();
    setRefreshing(false);
  };

  const handleApprove = (store) => {
    Alert.alert(
      'Approve Store',
      `Are you sure you want to approve ${store.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            try {
              await approveStore(store.id);
              Alert.alert('Success', 'Store approved successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to approve store');
            }
          },
        },
      ]
    );
  };

  const handleSuspend = (store) => {
    Alert.alert(
      'Suspend Store',
      `Are you sure you want to suspend ${store.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Suspend',
          style: 'destructive',
          onPress: async () => {
            try {
              await suspendStore(store.id);
              Alert.alert('Success', 'Store suspended successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to suspend store');
            }
          },
        },
      ]
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingWave color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={stores}
        renderItem={({ item }) => (
          <StoreCard
            store={item}
            onApprove={handleApprove}
            onSuspend={handleSuspend}
            theme={theme}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.subtext }]}>
              No stores found
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  storeCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  storeInfo: {
    flex: 1,
    marginRight: 16,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  storeOwner: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
  },
});

export default AdminStoresScreen; 
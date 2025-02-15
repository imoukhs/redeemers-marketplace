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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAdmin } from '../../context/AdminContext';
import LoadingWave from '../../components/common/LoadingWave';

const ProductCard = ({ product, onApprove, onRemove, theme }) => (
  <View style={[styles.productCard, { backgroundColor: theme.colors.card }]}>
    <Image
      source={{ uri: product.imageUrl }}
      style={styles.productImage}
      defaultSource={require('../../../assets/defaultAvatar.png')}
    />
    <View style={styles.productInfo}>
      <View style={styles.productHeader}>
        <Text style={[styles.productName, { color: theme.colors.text }]} numberOfLines={1}>
          {product.name}
        </Text>
        <View style={[styles.statusBadge, { 
          backgroundColor: product.status === 'approved' ? '#4CAF50' : 
                         product.status === 'pending' ? '#FFA000' : '#FF4B4B'
        }]}>
          <Text style={styles.statusText}>{product.status}</Text>
        </View>
      </View>
      <Text style={[styles.storeName, { color: theme.colors.subtext }]} numberOfLines={1}>
        Store: {product.storeName}
      </Text>
      <Text style={[styles.price, { color: theme.colors.primary }]}>
        ₦{product.price.toLocaleString()}
      </Text>
    </View>
    
    <View style={styles.actions}>
      {product.status !== 'approved' && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => onApprove(product)}
        >
          <Ionicons name="checkmark-outline" size={20} color="#fff" />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#FF4B4B' }]}
        onPress={() => onRemove(product)}
      >
        <Ionicons name="trash-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  </View>
);

const AdminProductsScreen = () => {
  const { theme } = useTheme();
  const { products, loading, fetchProducts, approveProduct, removeProduct } = useAdmin();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      await fetchProducts();
    } catch (error) {
      Alert.alert('Error', 'Failed to load products');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const handleApprove = (product) => {
    Alert.alert(
      'Approve Product',
      `Are you sure you want to approve ${product.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            try {
              await approveProduct(product.id);
              Alert.alert('Success', 'Product approved successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to approve product');
            }
          },
        },
      ]
    );
  };

  const handleRemove = (product) => {
    Alert.alert(
      'Remove Product',
      `Are you sure you want to remove ${product.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeProduct(product.id);
              Alert.alert('Success', 'Product removed successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove product');
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
        data={products}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onApprove={handleApprove}
            onRemove={handleRemove}
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
              No products found
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
  productCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    flex: 1,
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
  storeName: {
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
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

export default AdminProductsScreen; 
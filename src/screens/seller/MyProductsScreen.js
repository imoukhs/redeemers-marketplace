import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useSeller } from '../../context/SellerContext';
import LoadingWave from '../../components/common/LoadingWave';

const ProductItem = ({ item, onEdit, onDelete, theme }) => (
  <View
    style={[
      styles.productItem,
      {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
      },
    ]}
  >
    <Image source={{ uri: item.images[0] }} style={styles.productImage} />
    <View style={styles.productInfo}>
      <Text
        style={[styles.productName, { color: theme.colors.text }]}
        numberOfLines={2}
      >
        {item.name}
      </Text>
      <Text style={[styles.productPrice, { color: theme.colors.primary }]}>
        ₦{item.price.toLocaleString()}
      </Text>
      <Text style={[styles.productStock, { color: theme.colors.subtext }]}>
        In Stock: {item.quantity}
      </Text>
    </View>
    <View style={styles.productActions}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: theme.colors.primary + '20' }]}
        onPress={() => onEdit(item)}
      >
        <Ionicons name="create" size={20} color={theme.colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: theme.colors.error + '20' }]}
        onPress={() => onDelete(item)}
      >
        <Ionicons name="trash" size={20} color={theme.colors.error} />
      </TouchableOpacity>
    </View>
  </View>
);

const MyProductsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { products, loading, fetchProducts } = useSeller();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      await fetchProducts();
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadProducts();
    } finally {
      setRefreshing(false);
    }
  };

  const handleEdit = (product) => {
    navigation.navigate('EditProduct', { product });
  };

  const handleDelete = (product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await deleteProduct(product.id);
              if (success) {
                setProducts(prev => prev.filter(p => p.id !== product.id));
              }
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete product');
            }
          },
        },
      ]
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
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          My Products
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Ionicons name="add" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
            theme={theme}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="cube-outline"
              size={64}
              color={theme.colors.subtext}
            />
            <Text style={[styles.emptyText, { color: theme.colors.subtext }]}>
              No products yet
            </Text>
            <TouchableOpacity
              style={[
                styles.addFirstButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => navigation.navigate('AddProduct')}
            >
              <Text style={styles.addFirstButtonText}>Add Your First Product</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
    fontWeight: '600',
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  productItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productStock: {
    fontSize: 14,
  },
  productActions: {
    justifyContent: 'space-between',
    paddingLeft: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
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
});

export default MyProductsScreen; 
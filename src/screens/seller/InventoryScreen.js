import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useSeller } from '../../context/SellerContext';
import LoadingWave from '../../components/common/LoadingWave';

const InventoryScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { getProducts, updateInventory } = useSeller();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStock, setFilterStock] = useState('all'); // all, low, out

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      Alert.alert('Error', 'Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (productId, newQuantity) => {
    try {
      await updateInventory(productId, newQuantity);
      setProducts(products.map(product =>
        product.id === productId ? { ...product, stock: newQuantity } : product
      ));
      Alert.alert('Success', 'Stock updated successfully');
    } catch (error) {
      console.error('Error updating stock:', error);
      Alert.alert('Error', 'Failed to update stock. Please try again.');
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: '#FF5252' };
    if (stock <= 5) return { label: 'Low Stock', color: '#FFA500' };
    return { label: 'In Stock', color: '#4CAF50' };
  };

  const StockBadge = ({ stock }) => {
    const status = getStockStatus(stock);
    return (
      <View style={[styles.stockBadge, { backgroundColor: status.color + '20' }]}>
        <Text style={[styles.stockText, { color: status.color }]}>
          {status.label}
        </Text>
      </View>
    );
  };

  const ProductCard = ({ product }) => {
    const [editingStock, setEditingStock] = useState(false);
    const [newStock, setNewStock] = useState(product.stock.toString());

    const handleStockUpdate = () => {
      const quantity = parseInt(newStock);
      if (isNaN(quantity) || quantity < 0) {
        Alert.alert('Error', 'Please enter a valid quantity');
        return;
      }
      handleUpdateStock(product.id, quantity);
      setEditingStock(false);
    };

    return (
      <View style={[styles.productCard, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.productHeader}>
          <View>
            <Text style={[styles.productName, { color: theme.colors.text }]}>
              {product.name}
            </Text>
            <Text style={[styles.productCategory, { color: theme.colors.subtext }]}>
              {product.category}
            </Text>
          </View>
          <StockBadge stock={product.stock} />
        </View>

        <View style={styles.stockContainer}>
          <View style={styles.stockInfo}>
            <Text style={[styles.label, { color: theme.colors.subtext }]}>Current Stock:</Text>
            {editingStock ? (
              <View style={styles.stockEditContainer}>
                <TextInput
                  style={[styles.stockInput, { 
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                  }]}
                  value={newStock}
                  onChangeText={setNewStock}
                  keyboardType="numeric"
                  autoFocus
                  selectTextOnFocus
                  onBlur={() => setEditingStock(false)}
                  onSubmitEditing={handleStockUpdate}
                />
                <TouchableOpacity
                  style={[styles.updateButton, { backgroundColor: theme.colors.primary }]}
                  onPress={handleStockUpdate}
                >
                  <Text style={styles.updateButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setEditingStock(true)}>
                <Text style={[styles.stockValue, { color: theme.colors.text }]}>
                  {product.stock} units
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('EditProduct', { productId: product.id })}
          >
            <Ionicons name="create-outline" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>Edit Product</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
            onPress={() => setEditingStock(true)}
          >
            <Ionicons name="refresh-outline" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>Update Stock</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const FilterButton = ({ label, value }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filterStock === value && styles.filterButtonActive,
        { backgroundColor: theme.colors.surface }
      ]}
      onPress={() => setFilterStock(value)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filterStock === value && styles.filterButtonTextActive,
          { color: theme.colors.text }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStock === 'all' ||
      (filterStock === 'low' && product.stock <= 5 && product.stock > 0) ||
      (filterStock === 'out' && product.stock === 0);
    return matchesSearch && matchesFilter;
  });

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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Inventory</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={loadProducts}
        >
          <Ionicons name="refresh" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="search" size={20} color={theme.colors.subtext} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search products..."
            placeholderTextColor={theme.colors.subtext}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <FilterButton label="All Products" value="all" />
        <FilterButton label="Low Stock" value="low" />
        <FilterButton label="Out of Stock" value="out" />
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={64} color={theme.colors.subtext} />
            <Text style={[styles.emptyText, { color: theme.colors.subtext }]}>
              No products found
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>
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
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#1E90FF',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  productList: {
    padding: 16,
  },
  productCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
  },
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '500',
  },
  stockContainer: {
    marginBottom: 16,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
  },
  stockValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  stockEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockInput: {
    width: 80,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    fontSize: 16,
  },
  updateButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});

export default InventoryScreen; 
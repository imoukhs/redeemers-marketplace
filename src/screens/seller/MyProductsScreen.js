import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import ProductCard from '../../components/products/ProductCard';

// Mock data - Replace with API call later
const mockSellerProducts = [
  {
    id: '1',
    name: 'iPhone 12 Pro Max',
    price: 699000,
    category: 'Electronics',
    rating: 4.8,
    reviews: 245,
    stock: 10,
    status: 'active',
  },
  {
    id: '2',
    name: 'Nike Air Max 270',
    price: 129000,
    category: 'Fashion',
    rating: 4.5,
    reviews: 189,
    stock: 5,
    status: 'active',
  },
  {
    id: '3',
    name: 'Sony WH-1000XM4',
    price: 199000,
    category: 'Electronics',
    rating: 4.9,
    reviews: 320,
    stock: 0,
    status: 'out_of_stock',
  },
];

const MyProductsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState(mockSellerProducts);

  const handleEditProduct = (product) => {
    navigation.navigate('AddProduct', { product, isEditing: true });
  };

  const handleDeleteProduct = (productId) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement API call to delete product
            setProducts(products.filter(p => p.id !== productId));
          },
        },
      ]
    );
  };

  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productContainer}>
      <ProductCard
        product={item}
        onPress={() => handleEditProduct(item)}
        style={styles.productCard}
      />
      <View style={[styles.productActions, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.stockContainer}>
          <Text style={[styles.stockLabel, { color: theme.colors.subtext }]}>Stock:</Text>
          <Text 
            style={[
              styles.stockValue, 
              { color: item.stock > 0 ? theme.colors.success : theme.colors.error }
            ]}
          >
            {item.stock}
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleEditProduct(item)}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
            onPress={() => handleDeleteProduct(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Products</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleAddProduct}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons 
              name="cube-outline" 
              size={64} 
              color={theme.colors.subtext} 
            />
            <Text style={[styles.emptyText, { color: theme.colors.subtext }]}>
              No products found
            </Text>
            <TouchableOpacity
              style={[styles.addFirstButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleAddProduct}
            >
              <Text style={styles.addFirstButtonText}>Add Your First Product</Text>
            </TouchableOpacity>
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
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productList: {
    padding: 16,
  },
  productContainer: {
    marginBottom: 16,
  },
  productCard: {
    marginBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockLabel: {
    fontSize: 14,
    marginRight: 4,
  },
  stockValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
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
});

export default MyProductsScreen; 
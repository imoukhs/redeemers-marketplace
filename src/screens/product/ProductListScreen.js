import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../../components/products/ProductCard';
import { useTheme } from '../../context/ThemeContext';
import LoadingWave from '../../components/common/LoadingWave';

// Mock data - Replace with API call later
const mockProducts = [
  {
    id: '1',
    name: 'iPhone 12 Pro Max',
    price: 699000,
    category: 'Electronics',
    rating: 4.8,
    reviews: 245,
  },
  {
    id: '2',
    name: 'Nike Air Max 270',
    price: 129000,
    category: 'Fashion',
    rating: 4.5,
    reviews: 189,
  },
  {
    id: '3',
    name: 'Sony WH-1000XM4',
    price: 199000,
    category: 'Electronics',
    rating: 4.9,
    reviews: 320,
  },
  {
    id: '4',
    name: "Levi's 501 Original",
    price: 79000,
    category: 'Fashion',
    rating: 4.3,
    reviews: 156,
  },
];

const ProductListScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState(mockProducts);
  
  // Get category from route.params or use default values
  const category = route.params?.category || { name: 'All Products' };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const renderProduct = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item)}
      style={styles.productCard}
    />
  );

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
          {typeof category === 'string' ? category : category.name}
        </Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => navigation.navigate('Search', { category: category.id })}
        >
          <Ionicons name="options-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
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
  filterButton: {
    padding: 8,
  },
  productList: {
    padding: 8,
  },
  productCard: {
    flex: 1,
    margin: 8,
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
  },
});

export default ProductListScreen; 
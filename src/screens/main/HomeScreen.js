import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import ProductCard from '../../components/products/ProductCard';
import LoadingWave from '../../components/common/LoadingWave';

// Mock data for development
const mockCategories = [
  { id: '1', name: 'Electronics', icon: 'phone-portrait-outline' },
  { id: '2', name: 'Fashion', icon: 'shirt-outline' },
  { id: '3', name: 'Home', icon: 'home-outline' },
  { id: '4', name: 'Sports', icon: 'football-outline' },
];

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
];

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState(mockCategories);
  const [featuredProducts, setFeaturedProducts] = useState(mockProducts);
  const [newArrivals, setNewArrivals] = useState(mockProducts);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // In a real app, you would fetch data from an API here
      setCategories(mockCategories);
      setFeaturedProducts(mockProducts);
      setNewArrivals(mockProducts);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('ProductList', { category });
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: theme.colors.card }]}
      onPress={() => handleCategoryPress(item)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: `${theme.colors.primary}20` }]}>
        <Ionicons name={item.icon} size={24} color={theme.colors.primary} />
      </View>
      <Text style={[styles.categoryName, { color: theme.colors.text }]} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item)}
      style={styles.productCard}
    />
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingWave color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity
          style={[styles.searchBar, { backgroundColor: theme.colors.background }]}
          onPress={handleSearchPress}
        >
          <Ionicons name="search-outline" size={20} color={theme.colors.subtext} />
          <Text style={[styles.searchText, { color: theme.colors.subtext }]}>
            Search products...
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.categoriesSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Featured</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProductList')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>New Arrivals</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProductList')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={newArrivals}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  searchText: {
    marginLeft: 8,
    fontSize: 14,
  },
  categoriesSection: {
    paddingVertical: 16,
  },
  section: {
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 14,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryCard: {
    width: 80,
    height: 80,
    marginRight: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
  },
  productsList: {
    paddingHorizontal: 16,
  },
  productCard: {
    width: 180,
    marginRight: 16,
  },
});

export default HomeScreen; 
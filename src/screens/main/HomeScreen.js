import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../../components/products/ProductCard';
import { useTheme } from '../../context/ThemeContext';

const featuredProducts = [
  {
    id: '1',
    name: 'iPhone 12 Pro Max',
    price: 699000,
    originalPrice: 750000,
    category: 'Electronics',
    rating: 4.8,
    reviews: 245,
    discount: 15,
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
    originalPrice: 250000,
    category: 'Electronics',
    rating: 4.9,
    reviews: 320,
    discount: 20,
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

const categories = [
  { id: '1', name: 'Electronics', icon: 'phone-portrait-outline' },
  { id: '2', name: 'Fashion', icon: 'shirt-outline' },
  { id: '3', name: 'Home', icon: 'home-outline' },
  { id: '4', name: 'Beauty', icon: 'sparkles-outline' },
  { id: '5', name: 'Sports', icon: 'football-outline' },
];

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={[styles.categoryCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('ProductList', { category: item })}
    >
      <View style={[styles.categoryIcon, { backgroundColor: theme.colors.primary + '10' }]}>
        <Ionicons name={item.icon} size={24} color={theme.colors.primary} />
      </View>
      <Text style={[styles.categoryName, { color: theme.colors.text }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderFeaturedProduct = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item)}
      style={[styles.featuredProduct, { backgroundColor: theme.colors.surface }]}
      theme={theme}
    />
  );

  const renderNewArrivalProduct = (item) => (
    <ProductCard
      key={`new-${item.id}`}
      product={item}
      onPress={() => handleProductPress(item)}
      style={[styles.gridProduct, { backgroundColor: theme.colors.surface }]}
      theme={theme}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.subtext }]}>Welcome back!</Text>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Redeemer's Marketplace</Text>
          </View>
          <TouchableOpacity 
            style={[styles.cartButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="cart-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="search-outline" size={20} color={theme.colors.subtext} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search products..."
            placeholderTextColor={theme.colors.subtext}
          />
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.categoriesList, { backgroundColor: theme.colors.background }]}
          />
        </View>

        {/* Featured Products */}
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Featured Products</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllButton, { color: theme.colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredProducts.slice(0, 2)}
            renderItem={renderFeaturedProduct}
            keyExtractor={(item) => `featured-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.featuredList, { backgroundColor: theme.colors.background }]}
          />
        </View>

        {/* New Arrivals */}
        <View style={styles.newArrivalsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>New Arrivals</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllButton, { color: theme.colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.productsGrid, { backgroundColor: theme.colors.background }]}>
            {featuredProducts.map(renderNewArrivalProduct)}
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 12,
  },
  categoriesList: {
    paddingHorizontal: 8,
  },
  categoryCard: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 80,
    padding: 8,
    borderRadius: 12,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 12,
  },
  seeAllButton: {
    fontSize: 14,
    fontWeight: '500',
  },
  featuredSection: {
    marginBottom: 24,
  },
  featuredList: {
    paddingHorizontal: 16,
  },
  featuredProduct: {
    marginRight: 16,
    width: 220,
  },
  newArrivalsSection: {
    marginBottom: 24,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  gridProduct: {
    marginHorizontal: 8,
    marginBottom: 16,
    width: '45%',
  },
});

export default HomeScreen; 
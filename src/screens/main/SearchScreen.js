import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import ProductCard from '../../components/products/ProductCard';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

// Mock data - Replace with API calls later
const categories = [
  { id: '1', name: 'All Categories' },
  { id: '2', name: 'Electronics' },
  { id: '3', name: 'Fashion' },
  { id: '4', name: 'Home' },
  { id: '5', name: 'Beauty' },
  { id: '6', name: 'Sports' },
];

const sortOptions = [
  { id: '1', name: 'Relevance', value: 'relevance' },
  { id: '2', name: 'Price: Low to High', value: 'price_asc' },
  { id: '3', name: 'Price: High to Low', value: 'price_desc' },
  { id: '4', name: 'Rating', value: 'rating' },
  { id: '5', name: 'Newest', value: 'newest' },
];

const SearchScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [minRating, setMinRating] = useState(0);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock search results - Replace with API call
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
    // Add more mock products...
  ];

  useEffect(() => {
    // Simulate API call when search parameters change
    const performSearch = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter products based on search criteria
      const filteredProducts = mockProducts.filter(product => {
        const matchesSearch = searchQuery === '' || 
          product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory.name === 'All Categories' || 
          product.category === selectedCategory.name;
        const matchesPrice = product.price >= priceRange[0] && 
          product.price <= priceRange[1];
        const matchesRating = product.rating >= minRating;
        
        return matchesSearch && matchesCategory && matchesPrice && matchesRating;
      });

      // Sort products
      const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (selectedSort.value) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
            return b.id - a.id;
          default:
            return 0;
        }
      });

      setSearchResults(sortedProducts);
      setIsLoading(false);
    };

    performSearch();
  }, [searchQuery, selectedCategory, priceRange, minRating, selectedSort]);

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        { backgroundColor: theme.colors.surface },
        selectedCategory.id === item.id && { borderColor: theme.colors.primary }
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: theme.colors.primary + '10' }]}>
        <Ionicons name={item.icon} size={24} color={theme.colors.primary} />
      </View>
      <Text style={[styles.categoryName, { color: theme.colors.text }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item)}
      style={[styles.productCard, { backgroundColor: theme.colors.surface }]}
      theme={theme}
    />
  );

  const FilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: theme.colors.text }]}>Price Range</Text>
              <View style={styles.priceRangeContainer}>
                <Text style={[styles.priceText, { color: theme.colors.text }]}>
                  ₦{priceRange[0].toLocaleString()}
                </Text>
                <Text style={[styles.priceText, { color: theme.colors.text }]}>
                  ₦{priceRange[1].toLocaleString()}
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1000000}
                value={priceRange[1]}
                onValueChange={value => setPriceRange([priceRange[0], value])}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.border}
              />
            </View>

            {/* Rating Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: theme.colors.text }]}>Minimum Rating</Text>
              <View style={styles.ratingContainer}>
                {[0, 1, 2, 3, 4, 5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingButton,
                      minRating === rating && styles.selectedRating,
                      { backgroundColor: theme.colors.surface }
                    ]}
                    onPress={() => setMinRating(rating)}
                  >
                    <Text
                      style={[
                        styles.ratingButtonText,
                        minRating === rating && styles.selectedRatingText,
                        { color: minRating === rating ? theme.colors.primary : theme.colors.text }
                      ]}
                    >
                      {rating === 0 ? 'All' : `${rating}+`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort Options */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: theme.colors.text }]}>Sort By</Text>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.sortOption,
                    selectedSort.id === option.id && styles.selectedSortOption,
                    { backgroundColor: theme.colors.surface }
                  ]}
                  onPress={() => setSelectedSort(option)}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      selectedSort.id === option.id && styles.selectedSortOptionText,
                      { color: selectedSort.id === option.id ? theme.colors.primary : theme.colors.text }
                    ]}
                  >
                    {option.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setShowFilters(false)}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.searchHeader, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color={theme.colors.subtext} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search products..."
            placeholderTextColor={theme.colors.subtext}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: theme.colors.primary + '10' }]}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="options-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesSection}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.categoriesList, { backgroundColor: theme.colors.background }]}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={[styles.productList, { backgroundColor: theme.colors.background }]}
          columnWrapperStyle={styles.productRow}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color={theme.colors.subtext} />
          <Text style={[styles.emptyText, { color: theme.colors.subtext }]}>
            No products found
          </Text>
        </View>
      )}

      <FilterModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesSection: {
    marginVertical: 12,
  },
  categoriesList: {
    paddingHorizontal: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
  },
  productList: {
    padding: 8,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  filterSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 14,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  ratingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  ratingButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    margin: 4,
  },
  selectedRating: {
    backgroundColor: '#E3F2FD',
  },
  ratingButtonText: {
    fontSize: 14,
  },
  selectedRatingText: {
    fontWeight: '600',
  },
  sortOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedSortOption: {
    backgroundColor: '#E3F2FD',
  },
  sortOptionText: {
    fontSize: 14,
  },
  selectedSortOptionText: {
    fontWeight: '600',
  },
  applyButton: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SearchScreen; 
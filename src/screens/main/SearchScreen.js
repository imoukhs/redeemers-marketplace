import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useTheme } from '../../context/ThemeContext';
import { useSearch } from '../../context/SearchContext';
import ProductCard from '../../components/products/ProductCard';
import LoadingWave from '../../components/common/LoadingWave';

// Mock categories - Replace with API data later
const mockCategories = [
  { id: '1', name: 'Electronics', icon: 'phone-portrait-outline' },
  { id: '2', name: 'Fashion', icon: 'shirt-outline' },
  { id: '3', name: 'Home', icon: 'home-outline' },
  { id: '4', name: 'Sports', icon: 'football-outline' },
];

const sortOptions = [
  { id: '1', name: 'Relevance', value: 'relevance' },
  { id: '2', name: 'Price: Low to High', value: 'price_low' },
  { id: '3', name: 'Price: High to Low', value: 'price_high' },
  { id: '4', name: 'Rating', value: 'rating' },
];

// Mock suggestions data - Replace with API data later
const mockSuggestions = [
  'iPhone 12 Pro',
  'iPhone 13',
  'iPhone case',
  'Samsung Galaxy',
  'Wireless earbuds',
  'Smart watch',
  'Laptop',
  'Gaming console',
];

const SearchScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const {
    recentSearches,
    searchResults,
    suggestions,
    categories,
    trendingSearches,
    loading,
    error,
    performSearch,
    clearRecentSearches,
    getSuggestions,
  } = useSearch();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'relevance',
  });
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Handle search suggestions
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        getSuggestions(searchQuery);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, 300); // Debounce delay

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = () => {
    setShowSuggestions(false);
    performSearch(searchQuery, filters);
  };

  const clearSearch = () => {
    setSearchQuery('');
    performSearch('');
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const handleSuggestionPress = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    performSearch(suggestion, filters);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => {
        setFilters({ ...filters, category: item.name });
        handleSearch();
      }}
    >
      <View style={[styles.categoryIcon, { backgroundColor: theme.colors.primary + '20' }]}>
        <Ionicons name={item.icon} size={24} color={theme.colors.primary} />
      </View>
      <Text style={[styles.categoryName, { color: theme.colors.text }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item)}
      style={styles.productCard}
      theme={theme}
    />
  );

  const renderSuggestions = () => {
    if (!showSuggestions || searchQuery.length === 0) return null;

    const filteredSuggestions = suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredSuggestions.length === 0) return null;

    return (
      <View style={[styles.suggestionsContainer, { backgroundColor: theme.colors.card }]}>
        <ScrollView style={styles.suggestionsScroll} keyboardShouldPersistTaps="handled">
          {filteredSuggestions.map((suggestion, index) => {
            const matchStart = suggestion.toLowerCase().indexOf(searchQuery.toLowerCase());
            const matchEnd = matchStart + searchQuery.length;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.suggestionItem,
                  index === filteredSuggestions.length - 1 && styles.lastSuggestionItem,
                  { borderBottomColor: theme.colors.border }
                ]}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <View style={styles.suggestionContent}>
                  <View style={styles.suggestionTextContainer}>
                    <Text style={[styles.suggestionText, { color: theme.colors.text }]}>
                      {suggestion.slice(0, matchStart)}
                      <Text style={[styles.highlightedText, { color: theme.colors.primary }]}>
                        {suggestion.slice(matchStart, matchEnd)}
                      </Text>
                      {suggestion.slice(matchEnd)}
                    </Text>
                    <Text style={[styles.suggestionCategory, { color: theme.colors.subtext }]}>
                      in Electronics
                    </Text>
                  </View>
                  <View style={styles.suggestionIconContainer}>
                    <Ionicons 
                      name="arrow-forward" 
                      size={18} 
                      color={theme.colors.primary} 
                      style={styles.suggestionIcon}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

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
                  ₦{filters.minPrice}
                </Text>
                <Text style={[styles.priceText, { color: theme.colors.text }]}>
                  ₦{filters.maxPrice}
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1000000}
                value={filters.maxPrice}
                onValueChange={value => setFilters({ ...filters, maxPrice: value })}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.border}
              />
            </View>

            {/* Sort Options */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: theme.colors.text }]}>Sort By</Text>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.sortOption,
                    filters.sortBy === option.value && styles.selectedSortOption,
                    { backgroundColor: theme.colors.surface }
                  ]}
                  onPress={() => setFilters({ ...filters, sortBy: option.value })}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      filters.sortBy === option.value && styles.selectedSortOptionText,
                      { color: filters.sortBy === option.value ? theme.colors.primary : theme.colors.text }
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
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="search-outline" size={20} color={theme.colors.subtext} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search products..."
              placeholderTextColor={theme.colors.subtext}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={clearSearch}>
                <Ionicons name="close-circle" size={20} color={theme.colors.subtext} />
              </TouchableOpacity>
            ) : null}
          </View>
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="options-outline" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + '20' }]}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
        </View>
      )}

      {renderSuggestions()}

      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <LoadingWave color={theme.colors.primary} />
          </View>
        ) : searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.resultsContainer}
            onRefresh={handleSearch}
            refreshing={loading}
          />
        ) : (
          <ScrollView style={styles.content}>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Recent Searches
                  </Text>
                  <TouchableOpacity onPress={clearRecentSearches}>
                    <Text style={[styles.clearText, { color: theme.colors.primary }]}>Clear</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.recentSearches}>
                  {recentSearches.map((search, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.recentSearch, { backgroundColor: theme.colors.surface }]}
                      onPress={() => {
                        setSearchQuery(search);
                        performSearch(search, filters);
                      }}
                    >
                      <Ionicons name="time-outline" size={16} color={theme.colors.subtext} />
                      <Text style={[styles.recentSearchText, { color: theme.colors.text }]}>
                        {search}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Trending Searches */}
            {trendingSearches.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Trending Searches
                </Text>
                <View style={styles.trendingSearches}>
                  {trendingSearches.map((search, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.trendingSearch, { backgroundColor: theme.colors.surface }]}
                      onPress={() => {
                        setSearchQuery(search);
                        performSearch(search, filters);
                      }}
                    >
                      <Ionicons name="trending-up" size={16} color={theme.colors.primary} />
                      <Text style={[styles.trendingSearchText, { color: theme.colors.text }]}>
                        {search}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Categories */}
            {categories.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Browse Categories
                </Text>
                <FlatList
                  data={categories}
                  renderItem={renderCategoryItem}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesList}
                />
              </View>
            )}
          </ScrollView>
        )}
      </View>

      <FilterModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    zIndex: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    height: 48,
    paddingVertical: 8,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    zIndex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  clearText: {
    fontSize: 14,
  },
  recentSearches: {
    marginBottom: 16,
  },
  recentSearch: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  recentSearchText: {
    fontSize: 14,
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
  productCard: {
    width: '48%',
    marginBottom: 16,
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
  suggestionsContainer: {
    position: 'absolute',
    top: 70,
    left: 16,
    right: 16,
    maxHeight: 300,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  suggestionsScroll: {
    borderRadius: 12,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  lastSuggestionItem: {
    borderBottomWidth: 0,
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  suggestionTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  suggestionText: {
    fontSize: 16,
    marginBottom: 4,
  },
  highlightedText: {
    fontWeight: '600',
  },
  suggestionCategory: {
    fontSize: 12,
  },
  suggestionIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(30, 144, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionIcon: {
    marginLeft: 2,
  },
  errorContainer: {
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  trendingSearches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 8,
  },
  trendingSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  trendingSearchText: {
    fontSize: 14,
  },
});

export default SearchScreen; 
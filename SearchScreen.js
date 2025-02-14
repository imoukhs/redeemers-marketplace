import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchAPI } from '../services/api';
import debounce from 'lodash/debounce';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);

  // Debounced function to fetch suggestions
  const debouncedGetSuggestions = useCallback(
    debounce(async (query) => {
      if (query.length > 0) {
        try {
          const suggestionsData = await searchAPI.getSearchSuggestions(query);
          setSuggestions(suggestionsData);
          setShowSuggestions(true);
          setError(null);
        } catch (err) {
          console.error('Error fetching suggestions:', err);
          setError('Failed to fetch suggestions');
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300),
    []
  );

  // Load initial data
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [categoriesData, trendingData] = await Promise.all([
        searchAPI.getSearchCategories(),
        searchAPI.getTrendingSearches()
      ]);
      setCategories(categoriesData);
      setTrendingSearches(trendingData);
      setError(null);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    debouncedGetSuggestions(searchQuery);
    return () => debouncedGetSuggestions.cancel();
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      setShowSuggestions(false);
      const results = await searchAPI.searchProducts(searchQuery);
      // Handle search results here
      setError(null);
    } catch (err) {
      console.error('Error performing search:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionPress = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    handleSearch();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.searchContainer}>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={24} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setSuggestions([]);
                setShowSuggestions(false);
              }}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.suggestionItem,
                  index === suggestions.length - 1 && styles.lastSuggestion
                ]}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <View style={styles.suggestionContent}>
                  <Ionicons name="search-outline" size={20} color="#666" />
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
                <Ionicons name="arrow-forward" size={20} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {!showSuggestions && !loading && (
          <>
            {trendingSearches.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Trending Searches</Text>
                <View style={styles.trendingContainer}>
                  {trendingSearches.map((trend, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.trendingItem}
                      onPress={() => handleSuggestionPress(trend)}
                    >
                      <Text style={styles.trendingText}>{trend}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {categories.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <View style={styles.categoriesContainer}>
                  {categories.map((category, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.categoryItem}
                      onPress={() => handleSuggestionPress(category)}
                    >
                      <Text style={styles.categoryText}>{category}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066cc" />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    padding: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: 48,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 300,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lastSuggestion: {
    borderBottomWidth: 0,
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  errorContainer: {
    backgroundColor: '#fee',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  errorText: {
    color: '#d00',
    fontSize: 14,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  trendingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trendingItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  trendingText: {
    color: '#0066cc',
    fontSize: 14,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default SearchScreen; 
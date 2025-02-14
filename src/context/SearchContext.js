import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { searchAPI } from '../services/api';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecentSearches();
    loadCategories();
    loadTrendingSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const savedSearches = await AsyncStorage.getItem('recentSearches');
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await searchAPI.getSearchCategories();
      setCategories(response.categories);
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Failed to load categories');
    }
  };

  const loadTrendingSearches = async () => {
    try {
      const response = await searchAPI.getTrendingSearches();
      setTrendingSearches(response.trending);
    } catch (error) {
      console.error('Error loading trending searches:', error);
    }
  };

  const saveRecentSearches = async (searches) => {
    try {
      await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  };

  const addRecentSearch = async (query) => {
    if (!query.trim() || recentSearches.includes(query)) return;

    try {
      const updatedSearches = [query, ...recentSearches].slice(0, 10);
      setRecentSearches(updatedSearches);
      await saveRecentSearches(updatedSearches);
    } catch (error) {
      console.error('Error adding recent search:', error);
    }
  };

  const clearRecentSearches = async () => {
    try {
      await AsyncStorage.removeItem('recentSearches');
      setRecentSearches([]);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  };

  const getSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await searchAPI.getSearchSuggestions(query);
      setSuggestions(response.suggestions);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      setSuggestions([]);
    }
  };

  const performSearch = async (query, filters = {}) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchAPI.searchProducts(query, filters);
      setSearchResults(response.products);
      
      if (query.trim()) {
        await addRecentSearch(query);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to perform search. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchContext.Provider
      value={{
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
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext; 
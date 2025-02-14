import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecentSearches();
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
      const updatedSearches = [query, ...recentSearches].slice(0, 5);
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

  const performSearch = async (query, filters = {}) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      // Mock search results - Replace with actual API call later
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
      ];

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Filter products based on search query and filters
      let results = mockProducts.filter(product => {
        const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = !filters.category || product.category === filters.category;
        const matchesMinPrice = !filters.minPrice || product.price >= parseFloat(filters.minPrice);
        const matchesMaxPrice = !filters.maxPrice || product.price <= parseFloat(filters.maxPrice);
        
        return matchesQuery && matchesCategory && matchesMinPrice && matchesMaxPrice;
      });

      // Apply sorting
      if (filters.sortBy) {
        results = results.sort((a, b) => {
          switch (filters.sortBy) {
            case 'price_low':
              return a.price - b.price;
            case 'price_high':
              return b.price - a.price;
            case 'rating':
              return b.rating - a.rating;
            default:
              return 0;
          }
        });
      }

      setSearchResults(results);
      if (query.trim()) {
        await addRecentSearch(query);
      }
    } catch (error) {
      console.error('Search error:', error);
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
        loading,
        performSearch,
        clearRecentSearches,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext; 
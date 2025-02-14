import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

// Mock categories - replace with API data later
const categories = [
  { id: '1', name: 'Electronics', icon: 'phone-portrait-outline' },
  { id: '2', name: 'Fashion', icon: 'shirt-outline' },
  { id: '3', name: 'Home & Garden', icon: 'home-outline' },
  { id: '4', name: 'Sports', icon: 'football-outline' },
  { id: '5', name: 'Books', icon: 'book-outline' },
  { id: '6', name: 'Health & Beauty', icon: 'fitness-outline' },
  { id: '7', name: 'Toys & Games', icon: 'game-controller-outline' },
  { id: '8', name: 'Automotive', icon: 'car-outline' },
  { id: '9', name: 'Food & Beverages', icon: 'restaurant-outline' },
  { id: '10', name: 'Others', icon: 'grid-outline' },
];

const SelectCategoryScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSelect = (category) => {
    setSelectedCategory(category);
    // Pass back the selected category to AddProduct screen
    navigation.navigate('AddProduct', { category: category.name });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        {
          backgroundColor: theme.colors.surface,
          borderColor: selectedCategory?.id === item.id ? theme.colors.primary : theme.colors.border,
        },
      ]}
      onPress={() => handleSelect(item)}
    >
      <Ionicons
        name={item.icon}
        size={24}
        color={selectedCategory?.id === item.id ? theme.colors.primary : theme.colors.text}
      />
      <Text
        style={[
          styles.categoryName,
          {
            color: selectedCategory?.id === item.id ? theme.colors.primary : theme.colors.text,
          },
        ]}
      >
        {item.name}
      </Text>
      {selectedCategory?.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Select Category</Text>
        <View style={styles.backButton} />
      </View>

      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
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
    padding: 8,
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  categoryName: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
});

export default SelectCategoryScreen; 
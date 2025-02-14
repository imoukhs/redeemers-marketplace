import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

const categories = [
  {
    id: '1',
    name: 'Electronics',
    icon: 'phone-portrait-outline',
    color: '#FF6B6B',
    subCategories: ['Phones', 'Laptops', 'Accessories', 'Audio'],
    itemCount: 2453,
  },
  {
    id: '2',
    name: 'Fashion',
    icon: 'shirt-outline',
    color: '#4ECDC4',
    subCategories: ['Men', 'Women', 'Kids', 'Accessories'],
    itemCount: 3876,
  },
  {
    id: '3',
    name: 'Home & Garden',
    icon: 'home-outline',
    color: '#45B7D1',
    subCategories: ['Furniture', 'Decor', 'Kitchen', 'Garden'],
    itemCount: 1234,
  },
  {
    id: '4',
    name: 'Sports',
    icon: 'football-outline',
    color: '#96CEB4',
    subCategories: ['Equipment', 'Clothing', 'Shoes', 'Accessories'],
    itemCount: 987,
  },
  {
    id: '5',
    name: 'Books',
    icon: 'book-outline',
    color: '#D4A5A5',
    subCategories: ['Fiction', 'Non-Fiction', 'Academic', 'Children'],
    itemCount: 5432,
  },
  {
    id: '6',
    name: 'Beauty',
    icon: 'sparkles-outline',
    color: '#FFB6B9',
    subCategories: ['Skincare', 'Makeup', 'Haircare', 'Fragrance'],
    itemCount: 2789,
  },
  {
    id: '7',
    name: 'Automotive',
    icon: 'car-outline',
    color: '#6C5CE7',
    subCategories: ['Parts', 'Accessories', 'Tools', 'Care'],
    itemCount: 1543,
  },
  {
    id: '8',
    name: 'Health',
    icon: 'fitness-outline',
    color: '#A8E6CF',
    subCategories: ['Supplements', 'Equipment', 'Personal Care', 'Wellness'],
    itemCount: 3210,
  },
];

const CategoryScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCategory = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        { backgroundColor: theme.colors.surface },
        index % 2 === 0 ? { marginRight: 8 } : { marginLeft: 8 }
      ]}
      onPress={() => navigation.navigate('ProductList', { category: item })}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon} size={32} color={item.color} />
      </View>
      <Text style={[styles.categoryName, { color: theme.colors.text }]} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={[styles.itemCount, { color: theme.colors.subtext }]}>
        {item.itemCount.toLocaleString()} items
      </Text>
      <View style={styles.subCategoriesContainer}>
        {item.subCategories.slice(0, 2).map((subCat, idx) => (
          <View
            key={idx}
            style={[styles.subCategoryChip, { backgroundColor: item.color + '15' }]}
          >
            <Text style={[styles.subCategoryText, { color: item.color }]} numberOfLines={1}>
              {subCat}
            </Text>
          </View>
        ))}
        {item.subCategories.length > 2 && (
          <Text style={[styles.moreText, { color: theme.colors.primary }]}>
            +{item.subCategories.length - 2} more
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Categories</Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.subtext }]}>
          Find products by category
        </Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <Ionicons name="search-outline" size={20} color={theme.colors.subtext} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search categories..."
          placeholderTextColor={theme.colors.subtext}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredCategories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 22,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  list: {
    padding: 16,
  },
  categoryItem: {
    width: ITEM_WIDTH,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 12,
    marginBottom: 12,
  },
  subCategoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subCategoryChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
    marginBottom: 4,
  },
  subCategoryText: {
    fontSize: 10,
    fontWeight: '500',
  },
  moreText: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
  },
});

export default CategoryScreen; 
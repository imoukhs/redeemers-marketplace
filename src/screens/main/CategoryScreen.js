import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import LoadingWave from '../../components/common/LoadingWave';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const categories = [
  {
    id: '1',
    name: 'Electronics',
    icon: 'phone-portrait-outline',
    subcategories: ['Phones', 'Laptops', 'Accessories', 'Audio', 'Gaming'],
  },
  {
    id: '2',
    name: 'Fashion',
    icon: 'shirt-outline',
    subcategories: ['Men', 'Women', 'Kids', 'Shoes', 'Accessories'],
  },
  {
    id: '3',
    name: 'Home',
    icon: 'home-outline',
    subcategories: ['Furniture', 'Decor', 'Kitchen', 'Garden', 'Lighting'],
  },
  {
    id: '4',
    name: 'Beauty',
    icon: 'sparkles-outline',
    subcategories: ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Tools'],
  },
  {
    id: '5',
    name: 'Sports',
    icon: 'football-outline',
    subcategories: ['Equipment', 'Clothing', 'Shoes', 'Accessories', 'Nutrition'],
  },
];

const CategoryScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const categoryScaleAnims = useRef(categories.map(() => new Animated.Value(1))).current;
  const categoryOpacityAnims = useRef(categories.map(() => new Animated.Value(1))).current;
  const categoryRotateAnims = useRef(categories.map(() => new Animated.Value(0))).current;

  const configureLayoutAnimation = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        200,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity
      )
    );
  };

  const handleCategoryPress = (category, index) => {
    configureLayoutAnimation();
    setSelectedCategory(selectedCategory === category ? null : category);

    // Reset all animations
    categories.forEach((_, i) => {
      if (i !== index) {
        Animated.parallel([
          Animated.spring(categoryScaleAnims[i], {
            toValue: 1,
            useNativeDriver: true,
            friction: 8,
            tension: 50,
          }),
          Animated.spring(categoryOpacityAnims[i], {
            toValue: 1,
            useNativeDriver: true,
            friction: 8,
            tension: 50,
          }),
          Animated.spring(categoryRotateAnims[i], {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
            tension: 50,
          }),
        ]).start();
      }
    });

    // Animate selected category
    Animated.parallel([
      Animated.spring(categoryScaleAnims[index], {
        toValue: selectedCategory === category ? 1 : 0.95,
        useNativeDriver: true,
        friction: 8,
        tension: 50,
      }),
      Animated.spring(categoryOpacityAnims[index], {
        toValue: selectedCategory === category ? 1 : 0.7,
        useNativeDriver: true,
        friction: 8,
        tension: 50,
      }),
      Animated.spring(categoryRotateAnims[index], {
        toValue: selectedCategory === category ? 0 : 1,
        useNativeDriver: true,
        friction: 8,
        tension: 50,
      }),
    ]).start();
  };

  const navigateToProducts = (category, subcategory = null) => {
    navigation.navigate('ProductList', {
      category: subcategory || category.name,
      categoryId: category.id,
    });
  };

  const renderSubcategory = ({ item, category }) => (
    <TouchableOpacity
      style={[styles.subcategoryItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigateToProducts(category, item)}
    >
      <Text style={[styles.subcategoryText, { color: theme.colors.text }]}>{item}</Text>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
    </TouchableOpacity>
  );

  const renderCategory = ({ item, index }) => {
    const isSelected = selectedCategory === item;
    const rotateInterpolate = categoryRotateAnims[index].interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    return (
      <View>
        <TouchableOpacity
          style={[
            styles.categoryItem,
            { 
              backgroundColor: theme.colors.surface,
              borderColor: isSelected ? theme.colors.primary : 'transparent',
              borderWidth: 2,
            }
          ]}
          onPress={() => handleCategoryPress(item, index)}
          activeOpacity={0.7}
        >
          <Animated.View
            style={[
              styles.categoryContent,
              {
                transform: [
                  { scale: categoryScaleAnims[index] },
                ],
                opacity: categoryOpacityAnims[index],
              },
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '10' }]}>
              <Ionicons name={item.icon} size={24} color={theme.colors.primary} />
            </View>
            <Text style={[styles.categoryName, { color: theme.colors.text }]}>{item.name}</Text>
          </Animated.View>
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <Ionicons
              name="chevron-down"
              size={20}
              color={theme.colors.subtext}
            />
          </Animated.View>
        </TouchableOpacity>
        {isSelected && (
          <Animated.View 
            style={[
              styles.subcategoriesContainer,
              {
                opacity: categoryOpacityAnims[index],
                transform: [{ scale: categoryScaleAnims[index] }],
              }
            ]}
          >
            {item.subcategories.map((subcategory) => (
              <TouchableOpacity
                key={subcategory}
                style={[
                  styles.subcategoryItem,
                  { 
                    backgroundColor: theme.colors.surface,
                    borderLeftWidth: 2,
                    borderLeftColor: theme.colors.primary + '50',
                  }
                ]}
                onPress={() => navigateToProducts(item, subcategory)}
                activeOpacity={0.7}
              >
                <Text style={[styles.subcategoryText, { color: theme.colors.text }]}>
                  {subcategory}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
      </View>
    );
  };

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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Categories</Text>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {categories.map((category, index) => (
          <View key={category.id}>
            {renderCategory({ item: category, index })}
          </View>
        ))}
      </ScrollView>
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
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
  },
  subcategoriesContainer: {
    marginLeft: 24,
    marginBottom: 12,
  },
  subcategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  subcategoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CategoryScreen;
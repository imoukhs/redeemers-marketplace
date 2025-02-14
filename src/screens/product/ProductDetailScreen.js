import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // TODO: Replace with actual product data from route.params
  const product = {
    id: '1',
    name: 'iPhone 12 Pro Max',
    price: 699000,
    originalPrice: 750000,
    description: 'A14 Bionic chip, Pro camera system, LiDAR Scanner, and the largest Super Retina XDR display ever on an iPhone.',
    images: [
      require('../../../assets/dummy_600x400_000000_9abc32.png'),
      require('../../../assets/dummy_600x400_000000_d4f9a9.png'),
      require('../../../assets/dummy_600x400_000000_f4a264.png'),
    ],
    rating: 4.8,
    reviews: 245,
    category: 'Electronics',
    specifications: [
      { label: 'Brand', value: 'Apple' },
      { label: 'Model', value: 'iPhone 12 Pro Max' },
      { label: 'Storage', value: '256GB' },
      { label: 'Color', value: 'Pacific Blue' },
    ],
  };

  const handleAddToCart = async () => {
    const success = await addToCart(product, quantity);
    if (success) {
      Alert.alert(
        'Success',
        'Product added to cart',
        [
          {
            text: 'Continue Shopping',
            style: 'cancel',
          },
          {
            text: 'View Cart',
            onPress: () => navigation.navigate('Cart'),
          },
        ]
      );
    } else {
      Alert.alert('Error', 'Failed to add product to cart');
    }
  };

  const renderImageIndicator = () => (
    <View style={styles.indicatorContainer}>
      {product.images.map((_, index) => (
        <View
          key={index}
          style={[
            styles.indicator,
            index === currentImageIndex && styles.activeIndicator,
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="cart-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Image Carousel */}
        <FlatList
          data={product.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / width
            );
            setCurrentImageIndex(newIndex);
          }}
          renderItem={({ item }) => (
            <Image source={item} style={styles.image} resizeMode="cover" />
          )}
          keyExtractor={(_, index) => index.toString()}
        />
        {renderImageIndicator()}

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.name}>{product.name}</Text>
          
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{product.rating}</Text>
            <Text style={styles.reviews}>({product.reviews} reviews)</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>₦{product.price.toLocaleString()}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>
                ₦{product.originalPrice.toLocaleString()}
              </Text>
            )}
          </View>

          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          <Text style={styles.specificationsTitle}>Specifications</Text>
          {product.specifications.map((spec, index) => (
            <View key={index} style={styles.specificationRow}>
              <Text style={styles.specificationLabel}>{spec.label}</Text>
              <Text style={styles.specificationValue}>{spec.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => quantity > 1 && setQuantity(quantity - 1)}
          >
            <Ionicons name="remove" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Ionicons name="add" size={20} color="#333" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    zIndex: 1,
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cartButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width,
    height: width,
    backgroundColor: '#f5f5f5',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#1E90FF',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  infoContainer: {
    padding: 16,
  },
  category: {
    fontSize: 14,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
    marginRight: 4,
  },
  reviews: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E90FF',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 24,
  },
  specificationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  specificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  specificationLabel: {
    fontSize: 14,
    color: '#666',
  },
  specificationValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  quantityButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetailScreen; 
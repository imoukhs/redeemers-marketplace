import React, { useState, useRef } from 'react';
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
  Modal,
  Animated,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useWishlist } from '../../context/WishlistContext';

const { width, height } = Dimensions.get('window');
const ZOOM_TENSION = 0.8;

const ProductDetailScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomModalVisible, setIsZoomModalVisible] = useState(false);
  const flatListRef = useRef(null);

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

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

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dx, dy, numberActiveTouches }) => {
        if (numberActiveTouches === 2) {
          // Handle pinch zoom
          scale.setValue(Math.max(1, Math.min(3, scale._value + dy * 0.01)));
        } else {
          // Handle pan
          translateX.setValue(dx);
          translateY.setValue(dy);
        }
      },
      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.spring(translateX, {
            toValue: 0,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            tension: 40,
            useNativeDriver: true,
          }),
        ]).start();
      },
    })
  ).current;

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

  const handleWishlistPress = async () => {
    const isProductInWishlist = isInWishlist(product.id);
    if (isProductInWishlist) {
      const { success } = await removeFromWishlist(product.id);
      if (success) {
        Alert.alert('Success', 'Product removed from wishlist');
      } else {
        Alert.alert('Error', 'Failed to remove product from wishlist');
      }
    } else {
      const { success, error } = await addToWishlist(product);
      if (success) {
        Alert.alert('Success', 'Product added to wishlist');
      } else {
        Alert.alert('Error', error || 'Failed to add product to wishlist');
      }
    }
  };

  const renderImageIndicator = () => (
    <View style={styles.indicatorContainer}>
      {product.images.map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            setCurrentImageIndex(index);
            flatListRef.current?.scrollToIndex({ index, animated: true });
          }}
        >
          <View
            style={[
              styles.indicator,
              {
                backgroundColor: index === currentImageIndex 
                  ? theme.colors.primary 
                  : theme.colors.border,
                width: index === currentImageIndex ? 24 : 8,
              },
            ]}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderZoomableImage = () => (
    <Modal
      visible={isZoomModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setIsZoomModalVisible(false)}
    >
      <View style={[styles.zoomModal, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setIsZoomModalVisible(false)}
        >
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Animated.Image
          source={product.images[currentImageIndex]}
          style={[
            styles.zoomableImage,
            {
              transform: [
                { scale },
                { translateX },
                { translateY },
              ],
            },
          ]}
          resizeMode="contain"
          {...panResponder.panHandlers}
        />
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.colors.card }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[styles.wishlistButton, { backgroundColor: theme.colors.card }]}
              onPress={handleWishlistPress}
            >
              <Ionicons
                name={isInWishlist(product.id) ? "heart" : "heart-outline"}
                size={24}
                color={isInWishlist(product.id) ? theme.colors.error : theme.colors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.cartButton, { backgroundColor: theme.colors.card }]}
              onPress={() => navigation.navigate('Cart')}
            >
              <Ionicons name="cart-outline" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Image Carousel */}
        <View style={styles.imageContainer}>
          <FlatList
            ref={flatListRef}
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
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setIsZoomModalVisible(true)}
              >
                <Image source={item} style={styles.image} resizeMode="cover" />
                <View style={[styles.zoomHint, { backgroundColor: theme.colors.card }]}>
                  <Ionicons name="scan-outline" size={16} color={theme.colors.text} />
                  <Text style={[styles.zoomHintText, { color: theme.colors.text }]}>
                    Tap to zoom
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(_, index) => index.toString()}
          />
          {renderImageIndicator()}
        </View>

        {/* Product Info */}
        <View style={[styles.infoContainer, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.category, { color: theme.colors.subtext }]}>{product.category}</Text>
          <Text style={[styles.name, { color: theme.colors.text }]}>{product.name}</Text>
          
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={[styles.rating, { color: theme.colors.text }]}>{product.rating}</Text>
            <Text style={[styles.reviews, { color: theme.colors.subtext }]}>({product.reviews} reviews)</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: theme.colors.primary }]}>₦{product.price.toLocaleString()}</Text>
            {product.originalPrice && (
              <Text style={[styles.originalPrice, { color: theme.colors.subtext }]}>
                ₦{product.originalPrice.toLocaleString()}
              </Text>
            )}
          </View>

          <Text style={[styles.descriptionTitle, { color: theme.colors.text }]}>Description</Text>
          <Text style={[styles.description, { color: theme.colors.subtext }]}>{product.description}</Text>

          <Text style={[styles.specificationsTitle, { color: theme.colors.text }]}>Specifications</Text>
          {product.specifications.map((spec, index) => (
            <View key={index} style={[styles.specificationRow, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.specificationLabel, { color: theme.colors.subtext }]}>{spec.label}</Text>
              <Text style={[styles.specificationValue, { color: theme.colors.text }]}>{spec.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: theme.colors.background }]}
            onPress={() => quantity > 1 && setQuantity(quantity - 1)}
          >
            <Ionicons name="remove" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.quantity, { color: theme.colors.text }]}>{quantity}</Text>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: theme.colors.background }]}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Ionicons name="add" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={[styles.addToCartButton, { backgroundColor: theme.colors.primary }]} 
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>

      {renderZoomableImage()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  imageContainer: {
    position: 'relative',
  },
  image: {
    width,
    height: width,
    backgroundColor: '#f5f5f5',
  },
  zoomHint: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    opacity: 0.8,
  },
  zoomHintText: {
    fontSize: 12,
    marginLeft: 4,
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
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    transition: 'all 0.2s ease',
  },
  zoomModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 8,
  },
  zoomableImage: {
    width: width,
    height: height * 0.8,
  },
  infoContainer: {
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  category: {
    fontSize: 14,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
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
    marginLeft: 4,
    marginRight: 4,
  },
  reviews: {
    fontSize: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 18,
    textDecorationLine: 'line-through',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  specificationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  specificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  specificationLabel: {
    fontSize: 14,
  },
  specificationValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  quantityButton: {
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
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  wishlistButton: {
    borderRadius: 20,
    padding: 8,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default ProductDetailScreen; 
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import LoadingWave from '../../components/common/LoadingWave';

const CartItem = ({ item, onUpdateQuantity, onRemove, theme }) => {
  const { product, quantity } = item;

  return (
    <View style={[styles.cartItem, { backgroundColor: theme.colors.card }]}>
      <Image
        source={require('../../../assets/dummy_600x400_000000_9abc32.png')}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: theme.colors.text }]} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={[styles.itemPrice, { color: theme.colors.primary }]}>
          ₦{product.price.toLocaleString()}
        </Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: theme.colors.background }]}
            onPress={() => onUpdateQuantity(product.id, quantity - 1)}
          >
            <Ionicons name="remove" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.quantity, { color: theme.colors.text }]}>{quantity}</Text>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: theme.colors.background }]}
            onPress={() => onUpdateQuantity(product.id, quantity + 1)}
          >
            <Ionicons name="add" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.removeButton, { backgroundColor: theme.colors.error }]}
        onPress={() => onRemove(product.id)}
      >
        <Ionicons name="trash-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const CartScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const {
    cartItems,
    loading,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    clearCart,
  } = useCart();

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <LoadingWave color={theme.colors.primary} />
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="cart-outline" size={64} color={theme.colors.subtext} />
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>Your cart is empty</Text>
        <TouchableOpacity
          style={[styles.shopButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Shopping Cart</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={[styles.clearCart, { color: theme.colors.error }]}>Clear Cart</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            theme={theme}
          />
        )}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.cartList}
      />

      <View style={[styles.footer, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
        <View style={styles.totalContainer}>
          <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total:</Text>
          <Text style={[styles.totalAmount, { color: theme.colors.primary }]}>
            ₦{getCartTotal().toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.checkoutButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  clearCart: {
    fontSize: 14,
    fontWeight: '500',
  },
  cartList: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  removeButton: {
    padding: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
  },
  checkoutButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
  },
  shopButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CartScreen; 
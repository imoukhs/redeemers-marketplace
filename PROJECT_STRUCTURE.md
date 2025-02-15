# Project Structure and Data Schema

## 📁 Directory Structure

```
redeemers-marketplace/
├── assets/
│   ├── fonts/
│   ├── images/
│   └── icons/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.js
│   │   │   ├── SignupForm.js
│   │   │   └── BiometricAuth.js
│   │   ├── common/
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   ├── Card.js
│   │   │   └── Loading.js
│   │   ├── products/
│   │   │   ├── ProductCard.js
│   │   │   ├── ProductGrid.js
│   │   │   └── ProductCarousel.js
│   │   ├── cart/
│   │   │   ├── CartItem.js
│   │   │   └── CartSummary.js
│   │   └── products/
│   │       ├── ProductCard.js
│   │       ├── ProductGrid.js
│   │       └── ProductCarousel.js
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   ├── SignupScreen.js
│   │   │   └── ForgotPasswordScreen.js
│   │   ├── main/
│   │   │   ├── HomeScreen.js
│   │   │   ├── SearchScreen.js
│   │   │   ├── CategoryScreen.js
│   │   │   └── ProfileScreen.js
│   │   ├── product/
│   │   │   ├── ProductListScreen.js
│   │   │   └── ProductDetailScreen.js
│   │   ├── cart/
│   │   │   ├── CartScreen.js
│   │   │   └── CheckoutScreen.js
│   │   └── seller/
│   │       ├── DashboardScreen.js
│   │       └── ProductManagementScreen.js
│   ├── navigation/
│   │   ├── AppNavigator.js
│   │   ├── AuthNavigator.js
│   │   └── SellerNavigator.js
│   ├── services/
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   └── products.js
│   │   ├── storage/
│   │   │   └── asyncStorage.js
│   │   └── utils/
│   │       ├── validation.js
│   │       └── formatting.js
│   ├── context/
│   │   ├── AuthContext.js
│   │   ├── ThemeContext.js
│   │   └── CartContext.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTheme.js
│   │   └── useCart.js
│   └── theme/
│       ├── colors.js
│       ├── typography.js
│       └── spacing.js
├── App.js
└── babel.config.js
```

## 💾 Data Schema

### User Collection
```typescript
interface User {
  id: string;
  email: string;
  password: string; // Hashed
  fullName: string;
  phoneNumber: string;
  profileImage?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  role: 'buyer' | 'seller';
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### Seller Collection
```typescript
interface Seller extends User {
  storeName: string;
  storeDescription: string;
  subscriptionStatus: 'trial' | 'active' | 'expired';
  subscriptionEndDate: timestamp;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
  rating: number;
  totalReviews: number;
}
```

### Product Collection
```typescript
interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: string;
  subCategory: string;
  images: string[];
  specifications: {
    [key: string]: string;
  };
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  rating: number;
  totalReviews: number;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### Order Collection
```typescript
interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### Review Collection
```typescript
interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### Category Collection
```typescript
interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  subCategories: {
    id: string;
    name: string;
    description: string;
    image: string;
  }[];
  status: 'active' | 'inactive';
}
```

### Cart Collection
```typescript
interface Cart {
  id: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
    selectedOptions?: {
      [key: string]: string;
    };
  }[];
  totalAmount: number;
  updatedAt: timestamp;
}
```

### Subscription Collection
```typescript
interface Subscription {
  id: string;
  sellerId: string;
  plan: 'monthly' | 'yearly';
  status: 'trial' | 'active' | 'cancelled' | 'expired';
  startDate: timestamp;
  endDate: timestamp;
  paymentHistory: {
    id: string;
    amount: number;
    status: 'success' | 'failed';
    date: timestamp;
  }[];
  autoRenew: boolean;
}
```

## 🔐 Authentication Flow

1. User Registration
   - Email verification
   - Phone verification (optional)
   - Basic profile setup

2. User Login
   - Email/Password
   - Biometric authentication
   - Social login (future implementation)

3. Password Recovery
   - Email-based recovery
   - Security questions
   - Reset token expiration

## 🔄 State Management

- Context API for global state
- AsyncStorage for local persistence
- Real-time updates using WebSocket/Firebase

## 🎨 Theme Configuration

```typescript
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    error: string;
    text: string;
    subtext: string;
    border: string;
  };
  typography: {
    h1: TextStyle;
    h2: TextStyle;
    h3: TextStyle;
    body: TextStyle;
    caption: TextStyle;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}
``` 
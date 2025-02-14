import axios from 'axios';

// Mock data for development
const mockData = {
  categories: [
    { id: '1', name: 'Electronics', icon: 'phone-portrait-outline' },
    { id: '2', name: 'Fashion', icon: 'shirt-outline' },
    { id: '3', name: 'Home & Garden', icon: 'home-outline' },
    { id: '4', name: 'Sports', icon: 'football-outline' },
    { id: '5', name: 'Books', icon: 'book-outline' },
    { id: '6', name: 'Beauty', icon: 'sparkles-outline' }
  ],
  trending: [
    'iPhone 13',
    'Nike Air Max',
    'Samsung TV',
    'PlayStation 5',
    'AirPods Pro'
  ],
  suggestions: [
    'iPhone',
    'Samsung Galaxy',
    'Nike Shoes',
    'Smart Watch',
    'Laptop',
    'Headphones',
    'Gaming Console',
    'Smart TV',
    'Wireless Earbuds',
    'Fitness Tracker'
  ],
  products: [
    {
      id: '1',
      name: 'iPhone 12 Pro Max',
      price: 699000,
      originalPrice: 750000,
      category: 'Electronics',
      subcategory: 'Smartphones',
      rating: 4.8,
      reviews: 245,
      stock: 15,
      description: 'A14 Bionic chip, Pro camera system, 6.7-inch Super Retina XDR display, Ceramic Shield',
      features: [
        '6.7-inch Super Retina XDR display',
        'A14 Bionic chip',
        'Pro camera system',
        '5G capable',
        'Face ID'
      ],
      images: [],
      seller: {
        id: 'S1',
        name: 'TechHub Nigeria',
        rating: 4.9,
        verified: true
      }
    },
    {
      id: '2',
      name: 'Nike Air Max 270',
      price: 129000,
      originalPrice: 150000,
      category: 'Fashion',
      subcategory: 'Footwear',
      rating: 4.5,
      reviews: 189,
      stock: 8,
      description: "Nike's first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270.",
      features: [
        'Lightweight mesh material',
        'Nike Air unit',
        'Foam midsole',
        'Rubber outsole',
        'Heel pull tab'
      ],
      images: [],
      seller: {
        id: 'S2',
        name: 'SportsZone',
        rating: 4.7,
        verified: true
      }
    },
    {
      id: '3',
      name: 'Sony WH-1000XM4',
      price: 199000,
      originalPrice: 250000,
      category: 'Electronics',
      subcategory: 'Audio',
      rating: 4.9,
      reviews: 320,
      stock: 5,
      description: 'Industry-leading noise canceling with Dual Noise Sensor technology',
      features: [
        'Digital noise cancellation',
        'Up to 30-hour battery life',
        'Touch controls',
        'Multipoint pairing',
        'Adaptive sound control'
      ],
      images: [],
      seller: {
        id: 'S1',
        name: 'TechHub Nigeria',
        rating: 4.9,
        verified: true
      }
    },
    {
      id: '4',
      name: 'Samsung 55" QLED 4K TV',
      price: 899000,
      originalPrice: 999000,
      category: 'Electronics',
      subcategory: 'TVs',
      rating: 4.7,
      reviews: 156,
      stock: 3,
      description: 'Quantum Processor 4K with AI upscaling, HDR, Smart TV features',
      features: [
        'QLED 4K Display',
        'Quantum Processor 4K',
        'Ambient Mode+',
        'Smart TV features',
        'Multiple voice assistants'
      ],
      images: [],
      seller: {
        id: 'S3',
        name: 'Electronics Plus',
        rating: 4.6,
        verified: true
      }
    },
    {
      id: '5',
      name: 'MacBook Air M1',
      price: 899000,
      originalPrice: 950000,
      category: 'Electronics',
      subcategory: 'Laptops',
      rating: 4.9,
      reviews: 278,
      stock: 10,
      description: 'Apple M1 chip with 8-core CPU, 7-core GPU, and 16-core Neural Engine',
      features: [
        'Apple M1 chip',
        '13.3-inch Retina display',
        'Up to 18 hours battery life',
        '8GB unified memory',
        '256GB SSD storage'
      ],
      images: [],
      seller: {
        id: 'S1',
        name: 'TechHub Nigeria',
        rating: 4.9,
        verified: true
      }
    }
  ]
};

// Comment out the actual API configuration for now
// const BASE_URL = 'https://api.redeemersmarketplace.com/api';
// const api = axios.create({...});

export const searchAPI = {
  // Search products with filters
  searchProducts: async (query, filters = {}) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter products based on query
    const filteredProducts = mockData.products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return { products: filteredProducts };
  },

  // Get search suggestions
  getSearchSuggestions: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const filteredSuggestions = mockData.suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(query.toLowerCase())
    );
    
    return { suggestions: filteredSuggestions };
  },

  // Get trending searches
  getTrendingSearches: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { trending: mockData.trending };
  },

  // Get search categories
  getSearchCategories: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { categories: mockData.categories };
  },
};

export default searchAPI; 
import api from './config';

// Mock data for development
const mockData = {
  users: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      status: 'active',
      joinDate: '2024-01-01',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'seller',
      status: 'active',
      joinDate: '2024-01-15',
    },
  ],
  stores: [
    {
      id: '1',
      name: 'Tech Store',
      owner: 'Jane Smith',
      status: 'pending',
      products: 15,
      rating: 4.5,
    },
    {
      id: '2',
      name: 'Fashion Hub',
      owner: 'Mike Johnson',
      status: 'approved',
      products: 30,
      rating: 4.8,
    },
  ],
  products: [
    {
      id: '1',
      name: 'iPhone 12 Pro',
      storeName: 'Tech Store',
      price: 999.99,
      status: 'pending',
      imageUrl: 'https://example.com/iphone.jpg',
    },
    {
      id: '2',
      name: 'Samsung Galaxy S21',
      storeName: 'Tech Store',
      price: 899.99,
      status: 'approved',
      imageUrl: 'https://example.com/samsung.jpg',
    },
  ],
  metrics: {
    totalUsers: 150,
    totalStores: 25,
    totalProducts: 450,
    totalRevenue: 25000,
    recentTransactions: 45,
    pendingApprovals: 8,
  },
  transactions: [
    {
      id: '1',
      user: 'John Doe',
      amount: 999.99,
      type: 'purchase',
      status: 'completed',
      date: '2024-02-20T10:30:00Z',
    },
    {
      id: '2',
      user: 'Jane Smith',
      amount: 499.99,
      type: 'refund',
      status: 'pending',
      date: '2024-02-19T15:45:00Z',
    },
  ],
  settings: {
    registrationEnabled: true,
    emailVerificationRequired: true,
    maintenanceMode: false,
    maxProductsPerStore: 100,
    commissionRate: 5,
    autoApproveProducts: false,
    minimumWithdrawalAmount: 50,
  },
};

export const adminAPI = {
  // User Management
  getAllUsers: async () => {
    return { data: mockData.users };
  },

  updateUserRole: async (userId, role) => {
    return { success: true };
  },

  deleteUser: async (userId) => {
    return { success: true };
  },

  // Store Management
  getAllStores: async () => {
    return { data: mockData.stores };
  },

  approveStore: async (storeId) => {
    return { success: true };
  },

  suspendStore: async (storeId) => {
    return { success: true };
  },

  // Product Management
  getAllProducts: async () => {
    return { data: mockData.products };
  },

  approveProduct: async (productId) => {
    return { success: true };
  },

  removeProduct: async (productId) => {
    return { success: true };
  },

  // Analytics and Reports
  getSystemMetrics: async () => {
    return { data: mockData.metrics };
  },

  getTransactionHistory: async () => {
    return { data: mockData.transactions };
  },

  // Settings Management
  getSystemSettings: async () => {
    return { data: mockData.settings };
  },

  updateSystemSettings: async (settings) => {
    return { success: true, data: settings };
  },
}; 
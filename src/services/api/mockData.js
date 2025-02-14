export const mockData = {
  seller: {
    profile: {
      id: 'S1',
      storeName: 'TechHub Nigeria',
      storeDescription: 'Your one-stop shop for all things tech',
      rating: 4.9,
      verified: true,
      joinDate: '2024-01-01',
      bankDetails: {
        accountName: 'TechHub Nigeria',
        accountNumber: '0123456789',
        bankName: 'Access Bank',
      },
    },
    metrics: {
      totalSales: 450000,
      totalOrders: 28,
      pendingOrders: 5,
      totalProducts: 45,
      recentSales: [
        { date: '2024-02-01', amount: 75000 },
        { date: '2024-02-02', amount: 125000 },
        { date: '2024-02-03', amount: 250000 },
      ],
    },
    products: [
      {
        id: 'P1',
        name: 'iPhone 12 Pro Max',
        price: 699000,
        stock: 10,
        category: 'Electronics',
        description: 'Latest iPhone with amazing features',
        images: [],
        status: 'active',
      },
      {
        id: 'P2',
        name: 'Samsung Galaxy S21',
        price: 599000,
        stock: 15,
        category: 'Electronics',
        description: 'Flagship Android phone',
        images: [],
        status: 'active',
      },
    ],
    orders: [
      {
        id: 'O1',
        customerName: 'John Doe',
        amount: 699000,
        status: 'pending',
        date: '2024-02-03T10:00:00Z',
        items: [
          {
            productId: 'P1',
            quantity: 1,
            price: 699000,
          },
        ],
      },
      {
        id: 'O2',
        customerName: 'Jane Smith',
        amount: 1198000,
        status: 'processing',
        date: '2024-02-02T15:30:00Z',
        items: [
          {
            productId: 'P2',
            quantity: 2,
            price: 599000,
          },
        ],
      },
    ],
  },
}; 
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useSeller } from '../../context/SellerContext';
import LoadingWave from '../../components/common/LoadingWave';

const CustomerManagementScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, regular, new, inactive

  // Mock customer data - Replace with API call later
  const mockCustomers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+234 801 234 5678',
      totalOrders: 15,
      totalSpent: 250000,
      lastOrder: '2024-02-15',
      status: 'regular',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+234 802 345 6789',
      totalOrders: 3,
      totalSpent: 45000,
      lastOrder: '2024-02-01',
      status: 'new',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+234 803 456 7890',
      totalOrders: 8,
      totalSpent: 120000,
      lastOrder: '2024-01-15',
      status: 'inactive',
    },
  ];

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCustomers(mockCustomers);
    } catch (error) {
      console.error('Error loading customers:', error);
      Alert.alert('Error', 'Failed to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCustomerStatus = (status) => {
    switch (status) {
      case 'regular':
        return { label: 'Regular', color: '#4CAF50' };
      case 'new':
        return { label: 'New', color: '#2196F3' };
      case 'inactive':
        return { label: 'Inactive', color: '#FF9800' };
      default:
        return { label: status, color: '#666666' };
    }
  };

  const handleCustomerPress = (customer) => {
    navigation.navigate('CustomerDetails', { customerId: customer.id });
  };

  const handleContactCustomer = (customer) => {
    // TODO: Implement contact functionality
    Alert.alert(
      'Contact Customer',
      'Choose contact method:',
      [
        {
          text: 'Send Email',
          onPress: () => console.log('Send email to:', customer.email),
        },
        {
          text: 'Send SMS',
          onPress: () => console.log('Send SMS to:', customer.phone),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  };

  const CustomerCard = ({ customer }) => {
    const status = getCustomerStatus(customer.status);
    
    return (
      <TouchableOpacity
        style={[styles.customerCard, { backgroundColor: theme.colors.surface }]}
        onPress={() => handleCustomerPress(customer)}
      >
        <View style={styles.customerHeader}>
          <View>
            <Text style={[styles.customerName, { color: theme.colors.text }]}>
              {customer.name}
            </Text>
            <Text style={[styles.customerEmail, { color: theme.colors.subtext }]}>
              {customer.email}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>

        <View style={styles.customerStats}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>
              Orders
            </Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {customer.totalOrders}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>
              Total Spent
            </Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              ₦{customer.totalSpent.toLocaleString()}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>
              Last Order
            </Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {new Date(customer.lastOrder).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.contactButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => handleContactCustomer(customer)}
        >
          <Ionicons name="mail-outline" size={20} color="#FFF" />
          <Text style={styles.contactButtonText}>Contact Customer</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const FilterButton = ({ label, value, icon }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filterType === value && styles.filterButtonActive,
        { backgroundColor: filterType === value ? theme.colors.primary : theme.colors.surface }
      ]}
      onPress={() => setFilterType(value)}
    >
      <Ionicons 
        name={icon} 
        size={18} 
        color={filterType === value ? '#FFFFFF' : theme.colors.subtext} 
      />
      <Text
        style={[
          styles.filterButtonText,
          { color: filterType === value ? '#FFFFFF' : theme.colors.text }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || customer.status === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingWave color={theme.colors.primary} />
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Customers</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={loadCustomers}
        >
          <Ionicons name="refresh" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="search" size={20} color={theme.colors.subtext} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search customers..."
            placeholderTextColor={theme.colors.subtext}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <FilterButton 
          label="All" 
          value="all" 
          icon="people-outline"
        />
        <FilterButton 
          label="Regular" 
          value="regular" 
          icon="star-outline"
        />
        <FilterButton 
          label="New" 
          value="new" 
          icon="person-add-outline"
        />
        <FilterButton 
          label="Inactive" 
          value="inactive" 
          icon="time-outline"
        />
      </View>

      <FlatList
        data={filteredCustomers}
        renderItem={({ item }) => <CustomerCard customer={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.customerList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={theme.colors.subtext} />
            <Text style={[styles.emptyText, { color: theme.colors.subtext }]}>
              No customers found
            </Text>
          </View>
        }
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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 25,
    gap: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterButtonActive: {
    backgroundColor: '#1E90FF',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  customerList: {
    padding: 16,
  },
  customerCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  customerEmail: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  customerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});

export default CustomerManagementScreen; 
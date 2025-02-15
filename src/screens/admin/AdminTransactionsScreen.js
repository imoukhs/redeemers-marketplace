import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAdmin } from '../../context/AdminContext';
import LoadingWave from '../../components/common/LoadingWave';

const TransactionCard = ({ transaction, theme }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return '#FFA000';
      case 'failed':
        return '#FF4B4B';
      default:
        return '#757575';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={[styles.transactionCard, { backgroundColor: theme.colors.card }]}>
      <View style={styles.transactionHeader}>
        <View>
          <Text style={[styles.transactionId, { color: theme.colors.subtext }]}>
            ID: {transaction.id}
          </Text>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {transaction.userName}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transaction.status) }]}>
          <Text style={styles.statusText}>{transaction.status}</Text>
        </View>
      </View>

      <View style={styles.transactionDetails}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.colors.subtext }]}>Amount:</Text>
          <Text style={[styles.amount, { color: theme.colors.primary }]}>
            ₦{transaction.amount.toLocaleString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.colors.subtext }]}>Type:</Text>
          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
            {transaction.type}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.colors.subtext }]}>Date:</Text>
          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
            {formatDate(transaction.date)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const AdminTransactionsScreen = () => {
  const { theme } = useTheme();
  const { transactions, loading, fetchTransactions } = useAdmin();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      await fetchTransactions();
    } catch (error) {
      Alert.alert('Error', 'Failed to load transactions');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingWave color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <TransactionCard
            transaction={item}
            theme={theme}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.subtext }]}>
              No transactions found
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
  list: {
    padding: 16,
  },
  transactionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  transactionId: {
    fontSize: 12,
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  transactionDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
  },
});

export default AdminTransactionsScreen; 
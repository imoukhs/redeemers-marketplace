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

const UserCard = ({ user, onRoleChange, onDelete, theme }) => (
  <View style={[styles.userCard, { backgroundColor: theme.colors.card }]}>
    <View style={styles.userInfo}>
      <View style={styles.userHeader}>
        <Text style={[styles.userName, { color: theme.colors.text }]}>{user.name}</Text>
        <View style={[styles.roleBadge, { backgroundColor: user.role === 'admin' ? '#FF4B4B' : '#4CAF50' }]}>
          <Text style={styles.roleText}>{user.role}</Text>
        </View>
      </View>
      <Text style={[styles.userEmail, { color: theme.colors.subtext }]}>{user.email}</Text>
    </View>
    
    <View style={styles.actions}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => onRoleChange(user)}
      >
        <Ionicons name="swap-horizontal" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#FF4B4B' }]}
        onPress={() => onDelete(user)}
      >
        <Ionicons name="trash-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  </View>
);

const AdminUsersScreen = () => {
  const { theme } = useTheme();
  const { users, loading, fetchUsers, updateUserRole, deleteUser } = useAdmin();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      await fetchUsers();
    } catch (error) {
      Alert.alert('Error', 'Failed to load users');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleRoleChange = (user) => {
    Alert.alert(
      'Change User Role',
      `Change ${user.name}'s role from ${user.role} to ${user.role === 'admin' ? 'user' : 'admin'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change',
          onPress: async () => {
            try {
              const newRole = user.role === 'admin' ? 'user' : 'admin';
              await updateUserRole(user.id, newRole);
              Alert.alert('Success', 'User role updated successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to update user role');
            }
          },
        },
      ]
    );
  };

  const handleDelete = (user) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(user.id);
              Alert.alert('Success', 'User deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete user');
            }
          },
        },
      ]
    );
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
        data={users}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onRoleChange={handleRoleChange}
            onDelete={handleDelete}
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
              No users found
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
  userCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  userInfo: {
    flex: 1,
    marginRight: 16,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
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

export default AdminUsersScreen; 
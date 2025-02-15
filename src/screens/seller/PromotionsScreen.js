import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { useSeller } from '../../context/SellerContext';
import LoadingWave from '../../components/common/LoadingWave';

const PromotionCard = ({ promotion, onPress, theme }) => (
  <TouchableOpacity 
    style={[styles.promotionCard, { backgroundColor: theme.colors.surface }]}
    onPress={onPress}
  >
    <View style={styles.promotionHeader}>
      <View style={[
        styles.promotionStatus,
        { backgroundColor: promotion.active ? '#4CAF5020' : '#FF595E20' }
      ]}>
        <Text style={[
          styles.promotionStatusText,
          { color: promotion.active ? '#4CAF50' : '#FF595E' }
        ]}>
          {promotion.active ? 'Active' : 'Inactive'}
        </Text>
      </View>
      <Text style={[styles.promotionDate, { color: theme.colors.subtext }]}>
        Ends {new Date(promotion.endDate).toLocaleDateString()}
      </Text>
    </View>
    
    <Text style={[styles.promotionTitle, { color: theme.colors.text }]}>
      {promotion.title}
    </Text>
    
    <Text style={[styles.promotionDescription, { color: theme.colors.subtext }]}>
      {promotion.description}
    </Text>
    
    <View style={styles.promotionStats}>
      <View style={styles.stat}>
        <Text style={[styles.statValue, { color: theme.colors.text }]}>
          {promotion.discount}%
        </Text>
        <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>
          Discount
        </Text>
      </View>
      <View style={styles.stat}>
        <Text style={[styles.statValue, { color: theme.colors.text }]}>
          {promotion.usageCount}
        </Text>
        <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>
          Uses
        </Text>
      </View>
      <View style={styles.stat}>
        <Text style={[styles.statValue, { color: theme.colors.text }]}>
          ₦{promotion.revenue.toLocaleString()}
        </Text>
        <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>
          Revenue
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const PromotionsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { subscription } = useSubscription();
  const { promotions = [], fetchPromotions, loading, error } = useSeller();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      await fetchPromotions();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load promotions');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadPromotions();
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreatePromotion = () => {
    if (subscription?.planId !== 'premium') {
      Alert.alert(
        'Premium Feature',
        'Upgrade to Premium plan to create promotional campaigns.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Upgrade',
            onPress: () => navigation.navigate('SubscriptionScreen')
          }
        ]
      );
      return;
    }
    navigation.navigate('CreatePromotion');
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingWave color={theme.colors.primary} />
      </View>
    );
  }

  const activePromotions = promotions?.filter(promo => promo.active) || [];
  const pastPromotions = promotions?.filter(promo => !promo.active) || [];

  const totalUsages = promotions?.reduce((sum, promo) => sum + (promo.usageCount || 0), 0) || 0;
  const totalRevenue = promotions?.reduce((sum, promo) => sum + (promo.revenue || 0), 0) || 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Promotions
        </Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreatePromotion}
        >
          <Ionicons name="add" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={[styles.statsCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {activePromotions.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>
                Active Campaigns
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {totalUsages}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>
                Total Uses
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                ₦{totalRevenue.toLocaleString()}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>
                Total Revenue
              </Text>
            </View>
          </View>
        </View>

        {/* Active Promotions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Active Promotions
          </Text>
          {activePromotions.map(promotion => (
            <PromotionCard
              key={promotion.id}
              promotion={promotion}
              onPress={() => navigation.navigate('EditPromotion', { promotionId: promotion.id })}
              theme={theme}
            />
          ))}
          {activePromotions.length === 0 && (
            <Text style={[styles.emptyText, { color: theme.colors.subtext }]}>
              No active promotions
            </Text>
          )}
        </View>

        {/* Past Promotions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Past Promotions
          </Text>
          {pastPromotions.map(promotion => (
            <PromotionCard
              key={promotion.id}
              promotion={promotion}
              onPress={() => navigation.navigate('EditPromotion', { promotionId: promotion.id })}
              theme={theme}
            />
          ))}
          {pastPromotions.length === 0 && (
            <Text style={[styles.emptyText, { color: theme.colors.subtext }]}>
              No past promotions
            </Text>
          )}
        </View>
      </ScrollView>
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
  createButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    padding: 16,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  promotionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  promotionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  promotionStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  promotionStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  promotionDate: {
    fontSize: 12,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  promotionDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  promotionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#00000010',
    paddingTop: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 16,
  },
});

export default PromotionsScreen; 
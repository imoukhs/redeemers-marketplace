import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useSeller } from '../../context/SellerContext';
import { LineChart, BarChart } from 'react-native-chart-kit';
import LoadingWave from '../../components/common/LoadingWave';

const { width } = Dimensions.get('window');

const AnalyticsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { getAnalytics } = useSeller();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getAnalytics(timeRange);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, percentage, isIncrease }) => (
    <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.statTitle, { color: theme.colors.subtext }]}>{title}</Text>
      <Text style={[styles.statValue, { color: theme.colors.text }]}>{value}</Text>
      <View style={styles.percentageContainer}>
        <Ionicons
          name={isIncrease ? 'arrow-up' : 'arrow-down'}
          size={16}
          color={isIncrease ? '#4CAF50' : '#FF5252'}
        />
        <Text
          style={[
            styles.percentageText,
            { color: isIncrease ? '#4CAF50' : '#FF5252' },
          ]}
        >
          {percentage}%
        </Text>
      </View>
    </View>
  );

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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Analytics</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          {['week', 'month', 'year'].map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                timeRange === range && styles.timeRangeButtonActive,
                { backgroundColor: theme.colors.surface },
              ]}
              onPress={() => setTimeRange(range)}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  timeRange === range && styles.timeRangeTextActive,
                  { color: theme.colors.text },
                ]}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Overview */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Sales"
            value="₦450,000"
            percentage="12.5"
            isIncrease={true}
          />
          <StatCard
            title="Orders"
            value="28"
            percentage="8.3"
            isIncrease={true}
          />
          <StatCard
            title="Average Order"
            value="₦16,071"
            percentage="4.2"
            isIncrease={false}
          />
          <StatCard
            title="Customers"
            value="15"
            percentage="15.8"
            isIncrease={true}
          />
        </View>

        {/* Revenue Chart */}
        <View style={[styles.chartContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>Revenue Trend</Text>
          <LineChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [{
                data: [50000, 75000, 45000, 90000, 60000, 85000, 70000]
              }]
            }}
            width={width - 40}
            height={220}
            chartConfig={{
              backgroundColor: theme.colors.surface,
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(30, 144, 255, ${opacity})`,
              labelColor: (opacity = 1) => theme.colors.text,
              style: { borderRadius: 16 },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: theme.colors.primary,
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Product Performance */}
        <View style={[styles.chartContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>Top Products</Text>
          <BarChart
            data={{
              labels: ['P1', 'P2', 'P3', 'P4', 'P5'],
              datasets: [{
                data: [120000, 95000, 85000, 75000, 65000]
              }]
            }}
            width={width - 40}
            height={220}
            chartConfig={{
              backgroundColor: theme.colors.surface,
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(30, 144, 255, ${opacity})`,
              labelColor: (opacity = 1) => theme.colors.text,
            }}
            style={styles.chart}
          />
        </View>

        {/* Customer Insights */}
        <View style={[styles.insightsContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>Customer Insights</Text>
          <View style={styles.insightRow}>
            <View style={styles.insightItem}>
              <Text style={[styles.insightLabel, { color: theme.colors.subtext }]}>
                Repeat Customers
              </Text>
              <Text style={[styles.insightValue, { color: theme.colors.text }]}>65%</Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={[styles.insightLabel, { color: theme.colors.subtext }]}>
                Avg. Customer Value
              </Text>
              <Text style={[styles.insightValue, { color: theme.colors.text }]}>₦30,000</Text>
            </View>
          </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeRangeButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  timeRangeButtonActive: {
    backgroundColor: '#1E90FF',
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeRangeTextActive: {
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    margin: '1%',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  chartContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  insightsContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  insightItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  insightLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  insightValue: {
    fontSize: 24,
    fontWeight: '700',
  },
});

export default AnalyticsScreen; 
import api from './config';
import { ENV } from '../../config/env';

const mockSubscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 1000,
    features: [
      'List up to 50 products',
      'Basic analytics',
      'Standard support',
      'Promotional tools',
      'Regular payment processing'
    ],
    duration: 30, // days
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 2000,
    features: [
      'List up to 100 products',
      'Advanced analytics',
      'Priority support',
      'Branding',
      'Reduced payment processing fees',
      'Featured products placement',
      'Promotional tools with added features'
    ],
    duration: 30, // days
  }
];

export const subscriptionAPI = {
  // Get available subscription plans
  getPlans: async () => {
    try {
      if (!ENV.USE_REAL_API) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockSubscriptionPlans;
      }
      const response = await api.get('/subscription/plans');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Subscribe to a plan
  subscribe: async (planId) => {
    try {
      if (!ENV.USE_REAL_API) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const plan = mockSubscriptionPlans.find(p => p.id === planId);
        if (!plan) throw new Error('Invalid plan selected');
        
        // Automatically create a subscription without payment
        return {
          subscriptionId: `sub_${Date.now()}`,
          planId,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active'
        };
      }
      // In real API mode, still bypass payment
      return {
        subscriptionId: `sub_${Date.now()}`,
        planId,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      };
    } catch (error) {
      throw error;
    }
  },

  // Get current subscription
  getCurrentSubscription: async () => {
    try {
      if (!ENV.USE_REAL_API) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return null; // Return null if no active subscription
      }
      const response = await api.get('/subscription/current');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cancel subscription
  cancelSubscription: async () => {
    try {
      if (!ENV.USE_REAL_API) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
      }
      const response = await api.post('/subscription/cancel');
      return response;
    } catch (error) {
      throw error;
    }
  }
}; 
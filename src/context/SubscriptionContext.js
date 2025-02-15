import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscriptionAPI } from '../services/api/subscription';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const { userToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);

  // Load subscription plans
  const loadPlans = async () => {
    try {
      const plansData = await subscriptionAPI.getPlans();
      setPlans(plansData);
    } catch (err) {
      setError(err.message);
    }
  };

  // Load current subscription
  const loadCurrentSubscription = async () => {
    if (!userToken) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const subscriptionData = await subscriptionAPI.getCurrentSubscription();
      setSubscription(subscriptionData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to a plan
  const subscribeToPlan = async (planId, paymentMethod) => {
    try {
      setLoading(true);
      const newSubscription = await subscriptionAPI.subscribe(planId, paymentMethod);
      setSubscription(newSubscription);
      return newSubscription;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    try {
      setLoading(true);
      await subscriptionAPI.cancelSubscription();
      setSubscription(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadPlans();
    loadCurrentSubscription();
  }, [userToken]);

  const value = {
    loading,
    subscription,
    plans,
    error,
    subscribeToPlan,
    cancelSubscription,
    refreshSubscription: loadCurrentSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}; 
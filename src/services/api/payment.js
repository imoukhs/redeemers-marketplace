import api from './config';
import { ENV } from '../../config/env';

// Replace with your actual Paystack public key
const PAYSTACK_PUBLIC_KEY = 'pk_test_c0fb15b29184a93e7f17ed8bc4aac74ecf66621bx';

// Mock data for development
const mockCards = [
  {
    id: '1',
    brand: 'Visa',
    last4: '4242',
    expMonth: '12',
    expYear: '2024',
  },
  {
    id: '2',
    brand: 'Mastercard',
    last4: '5555',
    expMonth: '08',
    expYear: '2025',
  }
];

export const paymentAPI = {
  // Initialize payment transaction
  initializeTransaction: async (data) => {
    try {
      if (!ENV.USE_REAL_API) {
        // Return mock response
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        return { authorization_url: 'https://checkout.paystack.com/mock-url' };
      }
      const response = await api.post('/payment/initialize', {
        email: data.email,
        amount: data.amount * 100, // Convert to kobo
        reference: data.reference,
        metadata: {
          orderId: data.orderId,
          customerId: data.customerId,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Verify payment transaction
  verifyTransaction: async (reference) => {
    try {
      if (!ENV.USE_REAL_API) {
        // Return mock response
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { status: 'success', reference };
      }
      const response = await api.get(`/payment/verify/${reference}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get payment configuration
  getPaymentConfig: () => {
    return {
      publicKey: PAYSTACK_PUBLIC_KEY,
    };
  },

  // Save card for future use
  saveCard: async (cardData) => {
    try {
      if (!ENV.USE_REAL_API) {
        // Return mock response
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newCard = {
          id: String(mockCards.length + 1),
          brand: cardData.brand || 'Visa',
          last4: cardData.cardNumber.slice(-4),
          expMonth: cardData.expiryMonth,
          expYear: cardData.expiryYear,
        };
        mockCards.push(newCard);
        return newCard;
      }
      const response = await api.post('/payment/cards', cardData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get saved cards
  getSavedCards: async () => {
    try {
      if (!ENV.USE_REAL_API) {
        // Return mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockCards;
      }
      const response = await api.get('/payment/cards');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete saved card
  deleteCard: async (cardId) => {
    try {
      if (!ENV.USE_REAL_API) {
        // Return mock response
        await new Promise(resolve => setTimeout(resolve, 1000));
        const index = mockCards.findIndex(card => card.id === cardId);
        if (index !== -1) {
          mockCards.splice(index, 1);
        }
        return { success: true };
      }
      const response = await api.delete(`/payment/cards/${cardId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
}; 
export const ENV = {
  // Set this to false to use mock data, true to use real API
  USE_REAL_API: false,
  
  // API URLs
  API_URL: {
    DEVELOPMENT: 'http://localhost:3000/api/v1',
    STAGING: 'https://staging-api.redeemersmarketplace.com/api/v1',
    PRODUCTION: 'https://api.redeemersmarketplace.com/api/v1',
  },

  // Current environment
  ENVIRONMENT: 'DEVELOPMENT', // 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION'
}; 
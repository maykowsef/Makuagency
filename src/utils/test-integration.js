import { api } from '../config/api';

export const testBackendConnection = async () => {
  console.log('🧪 Testing backend connection...');
  console.log('API Base URL:', process.env.REACT_APP_API_URL || 'https://makuagencybackendproject.vercel.app/api');
  
  try {
    // Test basic API call
    const response = await fetch('https://makuagencybackendproject.vercel.app/api/test');
    const result = await response.json();
    
    console.log('✅ Backend test result:', result);
    
    // Test companies endpoint
    const companies = await api.getCompanies();
    console.log('✅ Companies loaded:', companies.length, 'items');
    
    // Test selling points endpoint
    const sellingPoints = await api.getSellingPoints();
    console.log('✅ Selling points loaded:', sellingPoints.length, 'items');
    
    return { success: true, companies: companies.length, sellingPoints: sellingPoints.length };
  } catch (error) {
    console.error('❌ Integration test failed:', error);
    return { success: false, error: error.message };
  }
};

// Run this function in browser console to test
// testBackendConnection();

// Test script to verify backend endpoints
const testEndpoints = async () => {
  const baseUrl = 'https://makuagencybackendproject.vercel.app';
  
  const endpoints = [
    '/api/test',
    '/api/companies',
    '/api/contacts',
    '/api/selling-points',
    '/api/activities'
  ];
  
  console.log('🧪 Testing backend endpoints...\n');
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`);
      const contentType = response.headers.get('content-type');
      
      console.log(`📡 ${endpoint}`);
      console.log(`Status: ${response.status}`);
      console.log(`Content-Type: ${contentType}`);
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('✅ JSON Response:', data);
      } else {
        const text = await response.text();
        console.log('❌ Non-JSON Response:', text.substring(0, 100) + '...');
      }
      console.log('---');
    } catch (error) {
      console.log(`❌ Error testing ${endpoint}:`, error.message);
    }
  }
};

// Run this in browser console:
// testEndpoints();

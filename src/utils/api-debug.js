// Debug API endpoints
export const debugAPI = async () => {
  const baseUrl = 'https://makuagencybackendproject.vercel.app/api';
  
  console.log('🔍 Debugging API endpoints...');
  console.log('Base URL:', baseUrl);
  
  const endpoints = [
    'test',
    'companies',
    'contacts',
    'selling-points'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Testing /api/${endpoint}...`);
      const response = await fetch(`${baseUrl}/${endpoint}`);
      
      console.log(`Status: ${response.status}`);
      console.log(`Content-Type: ${response.headers.get('content-type')}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint}:`, data);
      } else {
        const text = await response.text();
        console.log(`❌ ${endpoint}:`, text.substring(0, 100));
      }
    } catch (error) {
      console.log(`❌ Error testing ${endpoint}:`, error.message);
    }
  }
};

// Run this in browser console: debugAPI();

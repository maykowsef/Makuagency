const https = require('https');

// Test if we can reach the Supabase project
function testSupabaseReachability() {
  const options = {
    hostname: 'snswadioooqitikqmxjl.supabase.com',
    port: 443,
    path: '/rest/v1/',
    method: 'GET',
    headers: {
      'apikey': 'sb_publishable_jBwIe7SlVBjnnb0RoKrs3w_YcwjzFWD',
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, (res) => {
    console.log(`✅ Supabase reachable! Status: ${res.statusCode}`);
    console.log('Response headers:', res.headers);
  });

  req.on('error', (e) => {
    console.error('❌ Supabase not reachable:', e.message);
  });

  req.end();
}

// Test database connection with different formats
const { Pool } = require('pg');

async function testDatabaseFormats() {
  const formats = [
    "postgresql://postgres:M123akrem456*@db.snswadioooqitikqmxjl.supabase.co:5432/postgres",
    "postgresql://postgres:M123akrem456*@snswadioooqitikqmxjl.supabase.co:5432/postgres",
    "postgres://postgres:M123akrem456*@db.snswadioooqitikqmxjl.supabase.co:5432/postgres"
  ];

  for (const connectionString of formats) {
    console.log(`\nTesting: ${connectionString}`);
    const pool = new Pool({ connectionString });
    
    try {
      const client = await pool.connect();
      console.log('✅ Connected successfully!');
      await client.release();
      await pool.end();
      return connectionString;
    } catch (error) {
      console.log('❌ Failed:', error.message);
    }
  }
}

console.log('=== Testing Supabase Reachability ===');
testSupabaseReachability();

console.log('\n=== Testing Database Connection Formats ===');
testDatabaseFormats();

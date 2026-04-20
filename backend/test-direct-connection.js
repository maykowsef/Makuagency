const { Pool } = require('pg');

// Test using the project URL directly as database host
const directConnection = "postgresql://postgres:M123akrem456*@snswadioooqitikqmxjl.supabase.co:5432/postgres";

async function testDirectConnection() {
  console.log('Testing direct connection to Supabase project...');
  console.log(`Connection: ${directConnection}`);
  
  const pool = new Pool({ 
    connectionString: directConnection,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    // Test a simple query
    const result = await client.query('SELECT version() as version, NOW() as current_time');
    console.log('✅ Query successful!');
    console.log('PostgreSQL version:', result.rows[0].version.substring(0, 30) + '...');
    console.log('Current time:', result.rows[0].current_time);
    
    await client.release();
    await pool.end();
    
    return { success: true };
  } catch (error) {
    console.log('❌ Failed:', error.message);
    console.log('Error code:', error.code);
    console.log('Error details:', error);
    
    await pool.end().catch(() => {});
    return { success: false, error: error.message };
  }
}

// Also test using the REST API as backup
const https = require('https');

function testSupabaseAPI() {
  console.log('\nTesting Supabase REST API...');
  
  const options = {
    hostname: 'snswadioooqitikqmxjl.supabase.co',
    port: 443,
    path: '/rest/v1/',
    method: 'GET',
    headers: {
      'apikey': 'sb_publishable_jBwIe7SlVBjnnb0RoKrs3w_YcwjzFWD',
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('✅ Supabase API accessible!');
      console.log('Status:', res.statusCode);
      console.log('Response:', data.substring(0, 100) + '...');
    });
  });

  req.on('error', (e) => {
    console.log('❌ API test failed:', e.message);
  });

  req.end();
}

async function runTests() {
  const dbResult = await testDirectConnection();
  testSupabaseAPI();
  
  if (dbResult.success) {
    console.log('\n🎉 Database connection working!');
    console.log('Use this connection string in your environment:');
    console.log(`DATABASE_URL=${directConnection}`);
  } else {
    console.log('\n❌ Database connection failed, but API might work');
    console.log('Consider using Supabase REST API instead');
  }
}

runTests();

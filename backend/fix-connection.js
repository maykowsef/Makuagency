const { Pool } = require('pg');

// Test different connection string formats
const connectionFormats = [
  // Standard format
  "postgresql://postgres:M123akrem456*@db.snswadioooqitikqmxjl.supabase.co:5432/postgres",
  
  // With SSL
  "postgresql://postgres:M123akrem456*@db.snswadioooqitikqmxjl.supabase.co:5432/postgres?sslmode=require",
  
  // Alternative format
  "postgres://postgres:M123akrem456*@db.snswadioooqitikqmxjl.supabase.co:5432/postgres",
  
  // With connection parameters
  "postgresql://postgres:M123akrem456*@db.snswadioooqitikqmxjl.supabase.co:5432/postgres?connect_timeout=10",
  
  // With SSL and parameters
  "postgresql://postgres:M123akrem456*@db.snswadioooqitikqmxjl.supabase.co:5432/postgres?sslmode=require&connect_timeout=10"
];

async function testConnection(connectionString, format) {
  console.log(`\n=== Testing ${format} ===`);
  console.log(`Connection: ${connectionString}`);
  
  const pool = new Pool({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    // Test a simple query
    const result = await client.query('SELECT version() as version');
    console.log('✅ Query successful:', result.rows[0].version.substring(0, 50) + '...');
    
    await client.release();
    await pool.end();
    
    return { success: true, format };
  } catch (error) {
    console.log('❌ Failed:', error.message);
    console.log('Error code:', error.code);
    
    await pool.end().catch(() => {});
    return { success: false, format, error: error.message };
  }
}

async function testAllConnections() {
  console.log('Testing Supabase database connections...\n');
  
  for (let i = 0; i < connectionFormats.length; i++) {
    const result = await testConnection(connectionFormats[i], `Format ${i + 1}`);
    
    if (result.success) {
      console.log(`\n🎉 SUCCESS! Use this connection string:`);
      console.log(result.format);
      console.log(`\nUpdate your .env file with:`);
      console.log(`DATABASE_URL=${connectionFormats[i]}`);
      return;
    }
  }
  
  console.log('\n❌ All connection formats failed. Check:');
  console.log('1. Supabase project is active');
  console.log('2. Password is correct');
  console.log('3. Database exists');
  console.log('4. Network allows connection');
}

testAllConnections();
